// Server-side Conversions API posting (CLAUDE.md §5). Shares `eventId` with the
// browser pixel (src/lib/tracking.ts) so Meta/OpenAI deduplicate the double-fire.
// PII is hashed per the Meta CAPI spec before leaving the server. Best-effort:
// failures are logged, never thrown — a tracking outage must not fail a lead.

import { createHash } from "crypto";
import { LeadCategory } from "@/types";
import { Attribution } from "@/lib/attribution";

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const META_CAPI_ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const OPENAI_PIXEL_ID = process.env.NEXT_PUBLIC_OPENAI_PIXEL_ID;
const OPENAI_ADS_API_KEY = process.env.OPENAI_ADS_API_KEY;

const META_API_VERSION = "v21.0";

export interface ConversionInput {
  eventId: string;
  category: LeadCategory;
  value: number;
  isLocal: boolean;
  phone: string;
  fullName?: string;
  eventSourceUrl?: string;
  clientIp?: string;
  clientUserAgent?: string;
  // From request cookies / attribution
  fbc?: string;
  fbp?: string;
  oppref?: string;
  attribution?: Attribution;
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

// Meta wants phone as digits only, lowercase email, etc. before hashing.
function hashPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.length === 10 ? `1${digits}` : digits;
  return sha256(normalized);
}

function hashName(name: string): string {
  return sha256(name.trim().toLowerCase());
}

async function postMetaCAPI(input: ConversionInput): Promise<void> {
  if (!META_PIXEL_ID || !META_CAPI_ACCESS_TOKEN) {
    console.warn("[conversions] Meta CAPI env vars missing — skipping");
    return;
  }

  const [firstName, ...rest] = (input.fullName ?? "").trim().split(/\s+/);
  const lastName = rest.join(" ");

  const userData: Record<string, unknown> = {
    ph: [hashPhone(input.phone)],
  };
  if (firstName) userData.fn = [hashName(firstName)];
  if (lastName) userData.ln = [hashName(lastName)];
  if (input.fbc) userData.fbc = input.fbc;
  if (input.fbp) userData.fbp = input.fbp;
  if (input.clientIp) userData.client_ip_address = input.clientIp;
  if (input.clientUserAgent) userData.client_user_agent = input.clientUserAgent;

  const body = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        action_source: "website",
        event_source_url: input.eventSourceUrl,
        user_data: userData,
        custom_data: {
          value: input.value,
          currency: "USD",
          content_category: input.category,
          lead_type: input.isLocal ? "local" : "ship",
        },
      },
    ],
  };

  const res = await fetch(
    `https://graph.facebook.com/${META_API_VERSION}/${META_PIXEL_ID}/events?access_token=${META_CAPI_ACCESS_TOKEN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    throw new Error(`Meta CAPI ${res.status}: ${await res.text()}`);
  }
}

async function postOpenAICAPI(input: ConversionInput): Promise<void> {
  if (!OPENAI_PIXEL_ID || !OPENAI_ADS_API_KEY) {
    // Expected until OpenAI provisions the pixel ID + API key (CLAUDE.md §5).
    console.warn("[conversions] OpenAI Ads env vars missing — skipping");
    return;
  }

  // ⚠️ SCAFFOLD: OpenAI's Conversions API request shape is not yet finalized in
  // the brief. This sends a reasonable hashed-PII payload with the shared event_id;
  // confirm the endpoint + field names against OpenAI's docs when the pixel lands.
  const body = {
    pixel_id: OPENAI_PIXEL_ID,
    event: "lead",
    event_id: input.eventId,
    value: input.value,
    currency: "USD",
    category: input.category,
    oppref: input.oppref ?? input.attribution?.oppref ?? input.attribution?.__oppref,
    user_data: { ph: hashPhone(input.phone) },
  };

  const res = await fetch("https://api.openai.com/v1/ads/conversions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_ADS_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`OpenAI CAPI ${res.status}: ${await res.text()}`);
  }
}

// Posts the Lead conversion to Meta + OpenAI in parallel. Never throws.
export async function postServerConversions(input: ConversionInput): Promise<void> {
  const settled = await Promise.allSettled([postMetaCAPI(input), postOpenAICAPI(input)]);
  settled.forEach((outcome, i) => {
    if (outcome.status === "rejected") {
      console.error(`[conversions] ${i === 0 ? "Meta" : "OpenAI"} failed:`, outcome.reason);
    }
  });
}
