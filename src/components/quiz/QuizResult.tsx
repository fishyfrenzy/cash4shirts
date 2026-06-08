"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import ImageUpload from "./ImageUpload";
import { QuizResponses } from "@/types";
import { formatPhoneNumber, getEstimatedValue, getLeadCategory, getValueEstimate } from "@/lib/utils";
import { getAttribution } from "@/lib/attribution";
import { US_STATES, LOCAL_STATES } from "@/lib/us-states";

interface QuizResultProps {
  quizResponses: QuizResponses;
  onReset: () => void;
}

export default function QuizResult({ quizResponses, onReset }: QuizResultProps) {
  const router = useRouter();
  const [step, setStep] = useState<"result" | "details">("result");
  const [images, setImages] = useState<string[]>([]);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userComments, setUserComments] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep onReset referenced (used by callers to restart the quiz).
  void onReset;

  // Per-shirt estimate from type + decade (quantity doesn't affect per-shirt price).
  const estimate = getValueEstimate(quizResponses);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!fullName.trim() || !phoneNumber.trim()) {
      setError("Please enter your name and phone number so we can reach you.");
      setSubmitting(false);
      return;
    }
    if (!stateCode) {
      setError("Please choose your state.");
      setSubmitting(false);
      return;
    }

    try {
      // 1. Write the lead (source of truth) + fire Jake/seller notifications.
      const leadRes = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phoneNumber: phoneNumber.trim(),
          location: stateCode,
          quizResponses,
          images,
          userComments: userComments.trim() || null,
        }),
      });

      if (!leadRes.ok) {
        console.error("Lead submit failed:", leadRes.status);
        throw new Error("Failed to submit. Please try again.");
      }

      // 2. Derive segmentation. Local leads close better, so they carry a higher value.
      const category = getLeadCategory(quizResponses);
      const isLocal = LOCAL_STATES.includes(stateCode as (typeof LOCAL_STATES)[number]);
      const baseValue = getEstimatedValue(quizResponses);
      const value = isLocal ? Math.round(baseValue * 1.5) : baseValue;

      // 3. Fire server-side CAPI and get the shared event_id back for the pixel.
      let eventId = "";
      try {
        const convRes = await fetch("/api/conversions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category,
            value,
            isLocal,
            phone: phoneNumber.trim(),
            fullName: fullName.trim(),
            eventSourceUrl: window.location.href,
            attribution: getAttribution(),
          }),
        });
        if (convRes.ok) {
          eventId = (await convRes.json()).eventId ?? "";
        }
      } catch (convErr) {
        // Tracking must never block a successful lead.
        console.error("Conversion tracking failed:", convErr);
      }

      // 4. Route to the segmented thank-you page; it fires the matching browser pixel.
      const query = new URLSearchParams({
        local: String(isLocal),
        value: String(value),
        eid: eventId,
      });
      router.push(`/confirmed-${category}?${query.toString()}`);
    } catch (err) {
      console.error("Submission error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  if (step === "details") {
    return (
      <div className="animate-fade-in-up">
        <h3 className="text-2xl md:text-3xl font-serif font-bold text-navy mb-2 text-center">
          Last step — how do we reach you?
        </h3>

        {/* Compact trust strip (one line, doesn't push the form below the fold) */}
        <p className="flex items-center justify-center gap-2 text-base text-navy/70 mb-6 text-center">
          <ShieldCheck size={18} className="text-money flex-shrink-0" />
          A real person will text you within the hour — no spam.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Required fields first so they're immediately visible on mobile */}
          <div>
            <label htmlFor="fullName" className="block text-lg font-semibold text-navy mb-1">
              Your Name *
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. John Smith"
              autoComplete="name"
              className="w-full px-4 py-3 text-xl border-2 border-gray-200 rounded-lg focus:border-money focus:ring-2 focus:ring-money/20 outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-lg font-semibold text-navy mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
              placeholder="(555) 555-5555"
              autoComplete="tel"
              inputMode="tel"
              className="w-full px-4 py-3 text-xl border-2 border-gray-200 rounded-lg focus:border-money focus:ring-2 focus:ring-money/20 outline-none transition-colors"
              required
            />
            <p className="text-sm text-navy/50 mt-1">No email needed — we&apos;ll just text you.</p>
          </div>

          <div>
            <label htmlFor="state" className="block text-lg font-semibold text-navy mb-1">
              Your State *
            </label>
            <select
              id="state"
              value={stateCode}
              onChange={(e) => setStateCode(e.target.value)}
              className="w-full px-4 py-3 text-xl border-2 border-gray-200 rounded-lg focus:border-money focus:ring-2 focus:ring-money/20 outline-none transition-colors bg-white min-h-[60px]"
              required
            >
              <option value="" disabled>
                Select your state…
              </option>
              {US_STATES.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Optional fields — compact so they don't dominate the screen */}
          <div>
            <label className="block text-base font-semibold text-navy/80 mb-1">
              Photos of your shirts <span className="text-navy/50 font-normal">(optional — helps us quote faster)</span>
            </label>
            <ImageUpload images={images} onImagesChange={setImages} compact />
          </div>

          <div>
            <label htmlFor="userComments" className="block text-base font-semibold text-navy/80 mb-1">
              Anything else we should know? <span className="text-navy/50 font-normal">(optional)</span>
            </label>
            <textarea
              id="userComments"
              value={userComments}
              onChange={(e) => setUserComments(e.target.value)}
              placeholder="Specific brands, condition notes, etc."
              className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-lg focus:border-money focus:ring-2 focus:ring-money/20 outline-none transition-colors min-h-[60px] resize-none"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-lg">
              {error}
            </div>
          )}

          {/* Sticky submit — pinned to the bottom of the modal so the CTA is
              always on screen and the trailing copy never gets cut off. */}
          <div className="sticky bottom-0 -mx-4 md:-mx-8 -mb-4 md:-mb-8 bg-cream/95 backdrop-blur-sm border-t border-navy/10 px-4 md:px-8 pt-4 pb-4">
            <Button type="submit" size="lg" className="w-full" isLoading={submitting}>
              Get My Cash Offer
              <ArrowRight className="ml-2" size={24} />
            </Button>
            <p className="text-sm text-navy/60 text-center mt-2">
              We&apos;ll text you within the hour. No obligation.
            </p>
          </div>
        </form>
      </div>
    );
  }

  // Result Step
  return (
    <div className="animate-fade-in-up">
      <div className="text-center">
        <h3 className="text-2xl md:text-3xl font-serif font-bold text-navy mb-4">
          Good News! We Are Interested In Your Shirts.
        </h3>

        <div className="bg-white rounded-2xl p-6 md:p-8 mb-6 border-2 border-money/20 shadow-sm max-w-lg mx-auto">
          <p className="text-xl text-navy/90 mb-4">
            Based on your answers, we typically pay:
          </p>
          {/* Computed per-shirt range (type + decade). */}
          <p className="text-5xl md:text-6xl font-extrabold text-money leading-none mb-1">
            {estimate.perShirt}
          </p>
          <p className="text-xl font-semibold text-navy mb-5">per shirt</p>

          {/* Estimated collection total (blended avg × their quantity). */}
          <div className="bg-money/5 rounded-xl py-4 px-4">
            <p className="text-base text-navy/70 mb-1">Estimated total for your collection</p>
            <p className="text-3xl md:text-4xl font-bold text-navy">{estimate.total}</p>
          </div>
        </div>

        <p className="text-lg text-navy/70 mb-6 max-w-lg mx-auto">
          We can come to you and pay cash on the spot, or send prepaid shipping. No hassle.
        </p>
      </div>

      {/* Sticky CTA — stays pinned to the bottom of the modal so it's always
          on screen, regardless of how tall the content above it is. Negative
          margins cancel the modal's content padding for an edge-to-edge bar. */}
      <div className="sticky bottom-0 -mx-4 md:-mx-8 -mb-4 md:-mb-8 bg-cream/95 backdrop-blur-sm border-t border-navy/10 px-4 md:px-8 py-4">
        <Button size="lg" onClick={() => setStep("details")} className="w-full">
          See My Offer & Next Steps
          <ArrowRight className="ml-2" size={24} />
        </Button>
      </div>
    </div>
  );
}
