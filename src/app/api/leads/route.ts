// Lead submission endpoint (CLAUDE.md §7 / §13).
// Supabase is the source of truth: the write must succeed before any
// notification fires. Notifications are best-effort and never fail the request.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { LeadSubmissionPayload } from "@/types";
import { getLeadCategory } from "@/lib/utils";
import { sendLeadNotifications } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  let payload: LeadSubmissionPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { fullName, phoneNumber, location, quizResponses, images, userComments } = payload;

  // Validate the fields the brief treats as required (phone required, email N/A).
  if (!fullName?.trim() || !phoneNumber?.trim() || !location?.trim() || !quizResponses) {
    return NextResponse.json(
      { error: "Missing required fields: name, phone, location, and quiz answers." },
      { status: 400 }
    );
  }

  // Generate the id up front so we can use it for the lead-detail link without
  // a SELECT (anon RLS allows INSERT but not SELECT).
  const id = crypto.randomUUID();
  const imageUrls = images ?? [];

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { error: insertError } = await supabase.from("leads").insert({
    id,
    full_name: fullName.trim(),
    phone_number: phoneNumber.trim(),
    location: location.trim(),
    quiz_responses: quizResponses,
    images: imageUrls,
    status: "new",
    user_comments: userComments?.trim() || null,
  });

  // The write is the source of truth — if it fails, fail the request.
  if (insertError) {
    console.error("[api/leads] insert failed:", insertError);
    return NextResponse.json({ error: "Failed to save submission." }, { status: 500 });
  }

  // Notifications are awaited (so serverless doesn't kill them) but never block success.
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;
  const notifications = await sendLeadNotifications({
    id,
    fullName: fullName.trim(),
    phoneNumber: phoneNumber.trim(),
    location: location.trim(),
    category: getLeadCategory(quizResponses),
    quizResponses,
    images: imageUrls,
    userComments,
    leadUrl: `${baseUrl}/admin?lead=${id}`,
  });

  return NextResponse.json({ success: true, id, notifications });
}
