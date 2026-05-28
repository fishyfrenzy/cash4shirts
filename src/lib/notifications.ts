// Server-only lead notification integrations (Twilio SMS + Resend email).
// Called from the /api/leads route AFTER the Supabase write succeeds.
// Every send is best-effort: failures are logged but never thrown, so a
// notification outage can't lose a lead that already wrote to the source of truth.

import { LeadCategory, QuizResponses } from "@/types";
import { getValueEstimate, isLocalLocation } from "@/lib/utils";

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_FROM_NUMBER = process.env.TWILIO_FROM_NUMBER;
const JAKE_NOTIFICATION_PHONE = process.env.JAKE_NOTIFICATION_PHONE;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const JAKE_NOTIFICATION_EMAIL = process.env.JAKE_NOTIFICATION_EMAIL;
// Defaults to Resend's test sender, which delivers to your own Resend account
// email with no domain setup. Set RESEND_FROM to a verified-domain address later.
const RESEND_FROM = process.env.RESEND_FROM ?? "Cash4Shirts Leads <onboarding@resend.dev>";

const CATEGORY_LABEL: Record<LeadCategory, string> = {
  harley: "Harley-Davidson",
  concert: "Concert / Band tees",
  both: "Harley + Concert (gold lead)",
  other: "Other vintage",
};

export interface LeadNotificationInput {
  id: string;
  fullName: string;
  phoneNumber: string;
  location: string;
  category: LeadCategory;
  quizResponses: QuizResponses;
  images: string[];
  userComments?: string | null;
  leadUrl: string;
}

// Normalize a US phone number to E.164 (+1XXXXXXXXXX) for Twilio.
function toE164(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (phone.trim().startsWith("+")) return phone.trim();
  return null; // Unrecognized shape — caller skips the send.
}

async function sendTwilioSMS(to: string, body: string): Promise<void> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER) {
    console.warn("[notifications] Twilio env vars missing — skipping SMS");
    return;
  }
  const e164 = toE164(to);
  if (!e164) {
    console.warn(`[notifications] Could not normalize phone "${to}" — skipping SMS`);
    return;
  }

  const credentials = Buffer.from(
    `${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`
  ).toString("base64");

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ To: e164, From: TWILIO_FROM_NUMBER, Body: body }),
    }
  );

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Twilio ${res.status}: ${detail}`);
  }
}

async function sendResendEmail(subject: string, html: string): Promise<void> {
  if (!RESEND_API_KEY || !JAKE_NOTIFICATION_EMAIL) {
    console.warn("[notifications] Resend env vars missing — skipping email");
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: [JAKE_NOTIFICATION_EMAIL],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Resend ${res.status}: ${detail}`);
  }
}

function jakeSmsBody(lead: LeadNotificationInput, estimate: string, local: boolean): string {
  return [
    "🔔 New Cash4Shirts lead",
    `Name: ${lead.fullName}`,
    `Phone: ${lead.phoneNumber}`,
    `Type: ${CATEGORY_LABEL[lead.category]}`,
    `Location: ${lead.location}${local ? " (LOCAL)" : " (ship)"}`,
    `Est: ${estimate}`,
    lead.leadUrl,
  ].join("\n");
}

function sellerSmsBody(local: boolean): string {
  const tail = local
    ? "Jake will text you within the hour to set up a time to come look at them."
    : "Jake will text you within the hour with prepaid shipping instructions.";
  return `Got your submission! ${tail} Reply here anytime. — Cash4Shirts`;
}

function jakeEmailHtml(lead: LeadNotificationInput, estimate: string, local: boolean): string {
  const q = lead.quizResponses;
  const photos =
    lead.images.length > 0
      ? lead.images
          .map(
            (url) =>
              `<a href="${url}"><img src="${url}" alt="shirt photo" style="max-width:220px;margin:4px;border-radius:8px" /></a>`
          )
          .join("")
      : "<em>No photos uploaded.</em>";

  return `
    <div style="font-family:system-ui,sans-serif;font-size:16px;color:#1a2238">
      <h2>New lead: ${lead.fullName}</h2>
      <table cellpadding="6" style="border-collapse:collapse">
        <tr><td><strong>Phone</strong></td><td>${lead.phoneNumber}</td></tr>
        <tr><td><strong>Location</strong></td><td>${lead.location} ${local ? "(LOCAL)" : "(ship)"}</td></tr>
        <tr><td><strong>Category</strong></td><td>${CATEGORY_LABEL[lead.category]}</td></tr>
        <tr><td><strong>Estimate</strong></td><td>${estimate}</td></tr>
        <tr><td><strong>Shirt type</strong></td><td>${(q.shirtType ?? []).join(", ") || "—"}</td></tr>
        <tr><td><strong>Decades</strong></td><td>${(q.decades ?? []).join(", ") || "—"}</td></tr>
        <tr><td><strong>Volume</strong></td><td>${q.volume}</td></tr>
        <tr><td><strong>Condition</strong></td><td>${q.condition ?? "—"}</td></tr>
        <tr><td><strong>Notes</strong></td><td>${lead.userComments || "—"}</td></tr>
      </table>
      <h3>Photos</h3>
      <div>${photos}</div>
      <p><a href="${lead.leadUrl}">Open in admin dashboard →</a></p>
    </div>
  `;
}

export interface NotificationResult {
  jakeSms: boolean;
  sellerSms: boolean;
  email: boolean;
}

// Fires all three notifications in parallel. Returns which succeeded; never throws.
export async function sendLeadNotifications(
  lead: LeadNotificationInput
): Promise<NotificationResult> {
  const local = isLocalLocation(lead.location);
  const estimate = (() => {
    const e = getValueEstimate(lead.quizResponses);
    return `${e.perShirt}/shirt · est. total ${e.total}`;
  })();

  const tasks: { name: keyof NotificationResult; run: () => Promise<void> }[] = [
    { name: "jakeSms", run: () => sendTwilioSMS(JAKE_NOTIFICATION_PHONE ?? "", jakeSmsBody(lead, estimate, local)) },
    { name: "sellerSms", run: () => sendTwilioSMS(lead.phoneNumber, sellerSmsBody(local)) },
    { name: "email", run: () => sendResendEmail(`New lead: ${lead.fullName} (${CATEGORY_LABEL[lead.category]})`, jakeEmailHtml(lead, estimate, local)) },
  ];

  const settled = await Promise.allSettled(tasks.map((t) => t.run()));
  const result: NotificationResult = { jakeSms: false, sellerSms: false, email: false };
  settled.forEach((outcome, i) => {
    const name = tasks[i].name;
    if (outcome.status === "fulfilled") {
      result[name] = true;
    } else {
      console.error(`[notifications] ${name} failed:`, outcome.reason);
    }
  });
  return result;
}
