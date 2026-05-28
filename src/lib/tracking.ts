// Client-side tracking module (CLAUDE.md §5). Fires the Meta and OpenAI browser
// pixels. Server-side Conversions API posting lives in src/lib/conversions.ts and
// shares the same `eventId` for deduplication.

import { LeadCategory } from "@/types";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    oaiq?: (...args: unknown[]) => void;
  }
}

export interface LeadEvent {
  category: LeadCategory;
  isLocal: boolean; // IN/FL vs ship
  estimatedValue: number; // midpoint of quoted range (already local-adjusted)
  eventId: string; // UUID, shared with the server CAPI call
}

// Fires the Meta `Lead` pixel event and OpenAI `oaiq` measure event in parallel,
// both stamped with the shared eventId for server-side dedup. No-ops if a pixel
// hasn't loaded (e.g. env var not yet set).
export function trackLead(event: LeadEvent): void {
  if (typeof window === "undefined") return;

  const { category, isLocal, estimatedValue, eventId } = event;

  try {
    window.fbq?.(
      "track",
      "Lead",
      {
        value: estimatedValue,
        currency: "USD",
        content_category: category,
        lead_type: isLocal ? "local" : "ship",
      },
      { eventID: eventId }
    );
  } catch (err) {
    console.error("[tracking] Meta Lead failed:", err);
  }

  try {
    // OpenAI/ChatGPT Ads conversion event (matches the "registration_completed"
    // data source). `amount` carries the estimated lead value for optimization.
    window.oaiq?.("measure", "registration_completed", {
      type: "customer_action",
      amount: estimatedValue,
      currency: "USD",
    });
  } catch (err) {
    console.error("[tracking] OpenAI measure failed:", err);
  }
}

// Fires a Meta custom event per quiz step for funnel drop-off analytics.
export function trackQuizStep(
  stepNumber: number,
  answers: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;
  try {
    window.fbq?.("trackCustom", `QuizStep${stepNumber}`, answers);
  } catch (err) {
    console.error("[tracking] QuizStep failed:", err);
  }
}
