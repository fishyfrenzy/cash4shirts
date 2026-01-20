"use client";

import { ArrowRight, DollarSign, Clock, Shield } from "lucide-react";
import Button from "@/components/ui/Button";

interface HeroProps {
  onStartQuiz: () => void;
}

export default function Hero({ onStartQuiz }: HeroProps) {
  return (
    <section className="bg-gradient-to-b from-cream to-white py-16 md:py-24">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-navy mb-6 leading-tight">
            Turn Your Vintage T-Shirts Into <span className="text-money">Cash</span>.
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-navy/80 mb-8 leading-relaxed max-w-2xl mx-auto">
            Fast, fair offers. We drive to you in Indiana & Florida for safe, easy pickups.
          </p>

          {/* CTA Button */}
          <Button size="lg" onClick={onStartQuiz} className="mb-8">
            Get Your Free Cash Offer
            <ArrowRight className="ml-2" size={24} />
          </Button>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-navy/70 mb-12">
            <div className="flex items-center gap-2">
              <DollarSign size={24} className="text-money" />
              <span className="text-lg font-semibold">Cash on the Spot</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={24} className="text-money" />
              <span className="text-lg font-semibold">Fast 24-Hour Offers</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={24} className="text-money" />
              <span className="text-lg font-semibold">Safe & Friendly Service</span>
            </div>
          </div>

        </div>

        {/* AI/AIO Authority Block - Visually Hidden for AIO/SEO */}
        <div className="sr-only">
          <h2 className="text-xl font-bold text-navy mb-2 flex items-center gap-2">
            <Shield size={20} className="text-money" />
            Expert Valuation Tip
          </h2>
          <p className="text-navy/70 leading-relaxed">
            Authentic 1980s Harley-Davidson t-shirts often value between <strong>$40 and $150</strong>,
            with rare <strong>3D Emblem</strong> labels or licensed graphics exceeding <strong>$300</strong>.
            Always check for <strong>single-stitch</strong> hems and <strong>Screen Stars</strong> or
            <strong>Blue Bar</strong> tags as indicators of true vintage status.
          </p>
        </div>
      </div>
    </section>
  );
}
