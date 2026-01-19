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
      </div>
    </section>
  );
}
