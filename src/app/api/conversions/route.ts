// Conversions API endpoint (CLAUDE.md §5). Called by the form handler after the
// Supabase write succeeds. Generates the shared event_id, captures _fbc/_fbp
// (Meta) and __oppref (OpenAI) cookies for click attribution, posts server-side
// CAPI, and returns event_id so the client can fire the matching browser pixel.

import { NextRequest, NextResponse } from "next/server";
import { postServerConversions } from "@/lib/conversions";
import { LeadCategory } from "@/types";
import { Attribution } from "@/lib/attribution";

interface ConversionRequest {
  category: LeadCategory;
  value: number;
  isLocal: boolean;
  phone: string;
  fullName?: string;
  eventSourceUrl?: string;
  attribution?: Attribution;
}

export async function POST(req: NextRequest) {
  let body: ConversionRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const eventId = crypto.randomUUID();

  // Click attribution from cookies set by the browser pixels.
  const fbc = req.cookies.get("_fbc")?.value;
  const fbp = req.cookies.get("_fbp")?.value;
  const oppref = req.cookies.get("__oppref")?.value ?? body.attribution?.oppref ?? body.attribution?.__oppref;

  await postServerConversions({
    eventId,
    category: body.category,
    value: body.value,
    isLocal: body.isLocal,
    phone: body.phone,
    fullName: body.fullName,
    eventSourceUrl: body.eventSourceUrl ?? req.headers.get("referer") ?? undefined,
    clientIp: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
    clientUserAgent: req.headers.get("user-agent") ?? undefined,
    fbc,
    fbp,
    oppref,
    attribution: body.attribution,
  });

  return NextResponse.json({ eventId });
}
