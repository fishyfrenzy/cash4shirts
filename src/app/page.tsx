"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import TrustIndicators from "@/components/sections/TrustIndicators";
import LocalFace from "@/components/sections/LocalFace";
import FAQ from "@/components/sections/FAQ";
import BlogSection from "@/components/sections/BlogSection";
import RecentBuys from "@/components/sections/RecentBuys";
import ValuationQuiz from "@/components/quiz/ValuationQuiz";
import Button from "@/components/ui/Button";
import { ArrowRight, Phone } from "lucide-react";
import { BUYER_PHONE_DISPLAY, BUYER_PHONE_TEL } from "@/lib/config";

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

        {/* Recent Buys - Authority Proof */}
        <RecentBuys onStartQuiz={() => setQuizOpen(true)} />

        {/* Trust Indicators & Testimonials */}
        <TrustIndicators />

        {/* Local Face / About Section */}
        <LocalFace />

        {/* Mid-Page CTA */}
        <section className="section bg-navy text-white">
          <div className="container-narrow text-center">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">
              Got a Closet Full of Old Tees?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-xl mx-auto">
              Find out what they&apos;re worth in about 2 minutes. It&apos;s free, there&apos;s no obligation, and a real person follows up &mdash; usually within the hour.
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
                href={`tel:${BUYER_PHONE_TEL}`}
                className="btn-secondary flex items-center justify-center gap-2 px-8 py-4 text-xl font-bold bg-transparent border-2 border-white text-white hover:bg-white hover:text-navy rounded-lg transition-all"
              >
                <Phone size={24} />
                Call {BUYER_PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FAQ />

        {/* Latest Blog Posts */}
        <BlogSection />

        {/* Final CTA */}
        <section className="section bg-cream">
          <div className="container-narrow text-center">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-navy mb-4">
              Ready to Turn Those Shirts Into Cash?
            </h2>
            <p className="text-xl text-navy/70 mb-8 max-w-xl mx-auto">
              Answer a few quick questions and we&apos;ll tell you what we&apos;d pay. No pressure, no fees &mdash; and we come to you or send prepaid shipping.
            </p>
            <Button size="lg" onClick={() => setQuizOpen(true)} className="w-full sm:w-auto">
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
