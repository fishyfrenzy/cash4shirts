"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Phone, MessageSquare, Truck, MapPin } from "lucide-react";
import { LeadCategory } from "@/types";
import { trackLead } from "@/lib/tracking";
import { BUYER_PHONE_DISPLAY, BUYER_PHONE_TEL } from "@/lib/config";

interface ThankYouProps {
  category: LeadCategory;
}

// Shared thank-you content for the /confirmed-* routes (CLAUDE.md §6).
// Fires the segmented browser Lead pixel (deduped against server CAPI via the
// shared event_id) and shows the local-vs-ship "what happens next" timeline.
export default function ThankYou({ category }: ThankYouProps) {
  const params = useSearchParams();
  const isLocal = params.get("local") === "true";
  const value = Number(params.get("value")) || 0;
  const eventId = params.get("eid") ?? "";
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current || !eventId) return;
    firedRef.current = true;
    trackLead({ category, isLocal, estimatedValue: value, eventId });
  }, [category, isLocal, value, eventId]);

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full text-center">
        <div className="w-20 h-20 mx-auto bg-money/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={48} className="text-money" />
        </div>

        <h1 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-4">
          You&apos;re all set!
        </h1>
        <p className="text-xl text-navy/70 mb-10">
          {isLocal
            ? "We'll text you within the hour to set up a time to come look at your shirts."
            : "We'll text you within the hour with prepaid shipping instructions."}
        </p>

        {/* What happens next timeline */}
        <div className="bg-white rounded-2xl border border-navy/5 p-6 md:p-8 text-left mb-8 shadow-sm">
          <h2 className="text-xl font-serif font-bold text-navy mb-6 text-center">
            What happens next
          </h2>
          <ol className="space-y-6">
            <li className="flex gap-4">
              <MessageSquare size={28} className="text-money flex-shrink-0" />
              <div>
                <p className="text-lg font-semibold text-navy">
                  We text you (within the hour)
                </p>
                <p className="text-base text-navy/60">
                  A real person — not a bot. Reply right from your phone.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              {isLocal ? (
                <MapPin size={28} className="text-money flex-shrink-0" />
              ) : (
                <Truck size={28} className="text-money flex-shrink-0" />
              )}
              <div>
                <p className="text-lg font-semibold text-navy">
                  {isLocal ? "We come to you" : "Free prepaid shipping"}
                </p>
                <p className="text-base text-navy/60">
                  {isLocal
                    ? "We drive out at a time that works for you and pay cash on the spot."
                    : "We send a prepaid label — you never pay a cent to ship."}
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <CheckCircle size={28} className="text-money flex-shrink-0" />
              <div>
                <p className="text-lg font-semibold text-navy">You get paid</p>
                <p className="text-base text-navy/60">
                  Fair cash offer, no obligation, no pressure.
                </p>
              </div>
            </li>
          </ol>
        </div>

        <p className="text-lg text-navy/70 mb-4">
          Can&apos;t wait? Text us directly:
        </p>
        <a
          href={`tel:${BUYER_PHONE_TEL}`}
          className="inline-flex items-center justify-center gap-2 bg-money text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-money-dark transition-colors"
        >
          <Phone size={24} />
          {BUYER_PHONE_DISPLAY}
        </a>

        <div className="mt-10">
          <Link href="/" className="text-navy/60 underline text-lg">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
