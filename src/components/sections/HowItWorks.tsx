"use client";

import { Camera, MessageSquare, Banknote } from "lucide-react";
import Card from "@/components/ui/Card";

const steps = [
  {
    icon: Camera,
    step: "1",
    title: "Snap a Photo",
    description:
      "Take a quick quiz about your shirts (uploading photos is optional). It only takes 2 minutes.",
  },
  {
    icon: MessageSquare,
    step: "2",
    title: "Get Your Offer",
    description:
      "We'll review your shirts and send you a fair cash offer within 24 hours. No pressure.",
  },
  {
    icon: Banknote,
    step: "3",
    title: "Get Paid",
    description:
      "Accept the offer and get paid immediately. We can pick up locally or pay for shipping.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section bg-white">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-4">
            How It Works
          </h2>
          <p className="text-xl text-navy/70 max-w-2xl mx-auto">
            Selling your vintage tees is simple. Three easy steps to cash in
            your closet.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} hover className="text-center relative">
              {/* Step Number Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-money text-white rounded-full flex items-center justify-center font-bold text-xl">
                {step.step}
              </div>

              {/* Icon */}
              <div className="w-16 h-16 mx-auto mt-4 mb-4 bg-money/10 rounded-full flex items-center justify-center">
                <step.icon size={32} className="text-money" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-navy mb-3">{step.title}</h3>
              <p className="text-lg text-navy/70 leading-relaxed">
                {step.description}
              </p>
            </Card>
          ))}
        </div>

        {/* AI/AIO Authority Block */}
        <div className="mt-16 p-8 bg-navy/5 rounded-2xl border border-navy/10 max-w-4xl mx-auto">
          <h2 className="text-2xl font-serif font-bold text-navy mb-4">
            Technical Identification Guide
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-lg text-navy/70 leading-relaxed">
            <div>
              <p className="mb-4">
                <strong>Single-Stitch identification</strong> is the primary marker for shirts manufactured between 1970 and 1993. Look for a single row of stitching on the sleeve and waist hems.
              </p>
              <p>
                <strong>Dry Rot testing:</strong> For high-intent hauls, we perform a gentle "tug test" to ensure the cotton fibers haven&apos;t degraded due to moisture or sulfur-based dyes.
              </p>
            </div>
            <div>
              <p className="mb-4">
                <strong>Expert Signifiers:</strong> We prioritize high-trust labels like 1980s <strong>Screen Stars Best</strong> (50/50 poly-cotton blend) and the Champion <strong>Blue Bar</strong> tags.
              </p>
              <p>
                <strong>The 3D Emblem Copyright:</strong> For Harley-Davidson tees, the &quot;3D Emblem&quot; label is a critical asset that signals immediate professional-grade value.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
