"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import TrustIndicators from "@/components/sections/TrustIndicators";
import LocalFace from "@/components/sections/LocalFace";
import FAQ from "@/components/sections/FAQ";
import ValuationQuiz from "@/components/quiz/ValuationQuiz";
import Button from "@/components/ui/Button";
import { ArrowRight, Phone } from "lucide-react";

export default function Home() {
  const [quizOpen, setQuizOpen] = useState(false);

  return (
    <>
      <Header />

      <main>
        {/* Hero Section */}
        <Hero onStartQuiz={() => setQuizOpen(true)} />

        {/* How It Works */}
        <HowItWorks />

        {/* Trust Indicators & Testimonials */}
        <TrustIndicators />

        {/* Local Face / About Section */}
        <LocalFace />

        {/* Mid-Page CTA */}
        <section className="section bg-navy text-white">
          <div className="container-narrow text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Ready to Cash In Your Vintage Tees?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-xl mx-auto">
              It takes just 2 minutes to get started. No obligation, no pressure
              &mdash; just a fair cash offer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => setQuizOpen(true)}
                className="bg-money hover:bg-money-light"
              >
                Start Free Quote
                <ArrowRight className="ml-2" size={24} />
              </Button>
              <a
                href="tel:+1-555-SHIRTS"
                className="btn-secondary flex items-center justify-center gap-2 px-8 py-4 text-xl font-bold bg-transparent border-2 border-white text-white hover:bg-white hover:text-navy rounded-lg transition-all"
              >
                <Phone size={24} />
                Call (555) SHIRTS
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FAQ />

        {/* Final CTA */}
        <section className="section bg-cream">
          <div className="container-narrow text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-4">
              Don&apos;t Let Your Vintage Tees Collect Dust
            </h2>
            <p className="text-xl text-navy/70 mb-8 max-w-xl mx-auto">
              Every day you wait, the market changes. Get your free quote today
              and see what your collection is worth.
            </p>
            <Button size="lg" onClick={() => setQuizOpen(true)}>
              Get My Free Cash Offer
              <ArrowRight className="ml-2" size={24} />
            </Button>
          </div>
        </section>
      </main>

      <Footer />

      {/* Quiz Modal */}
      <ValuationQuiz isOpen={quizOpen} onClose={() => setQuizOpen(false)} />
    </>
  );
}
