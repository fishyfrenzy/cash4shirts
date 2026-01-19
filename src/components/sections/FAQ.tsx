"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What types of t-shirts do you buy?",
    answer:
      "We specialize in vintage Harley Davidson t-shirts from the 70s-90s, concert and band tees from that era (Led Zeppelin, Rolling Stones, Metallica, etc.), and other vintage graphic tees. We're especially interested in single-stitch shirts, which were common before 1993.",
  },
  {
    question: "How do I know if my shirt is valuable?",
    answer:
      "Look for: single-stitch hems (no double row of stitching), soft/thin fabric, 'Made in USA' tags, copyright dates from the 70s-90s, and bold vintage graphics. Concert shirts with tour dates, vintage Harley dealer locations, and rare band artwork are typically the most valuable.",
  },
  {
    question: "How much will you pay for my shirts?",
    answer:
      "Prices vary based on brand, condition, rarity, and design. Single shirts typically range from $20-$150, while rare pieces can fetch $200-$500 or more. We've paid over $500 for exceptional vintage concert tees. Take our quick quiz to get an estimate!",
  },
  {
    question: "Do you buy shirts with holes or stains?",
    answer:
      "Yes! Vintage shirts with minor flaws are still valuable. Heavy distressing, fading, and small holes can actually be desirable for the 'vintage look.' We evaluate each shirt individually. Only shirts that are completely destroyed or heavily damaged would be declined.",
  },
  {
    question: "How does the selling process work?",
    answer:
      "1) Take our 2-minute quiz and optional photo upload. 2) We'll send you a cash offer within 24 hours. 3) If you accept, we'll arrange pickup (free in Indiana) or send you a prepaid shipping label. 4) You get paid immediately upon receiving the shirts.",
  },
  {
    question: "Do I have to accept your offer?",
    answer:
      "Absolutely not. Our quotes are no-obligation. If you decide not to sell, that's completely fine. We never pressure anyone. Your shirts, your choice.",
  },
  {
    question: "How do I get paid?",
    answer:
      "We pay cash for local pickups in Indiana. For shipped items and Florida transactions, we offer PayPal, Venmo, Zelle, or check - whichever you prefer. Payment is sent the same day we receive and verify your shirts.",
  },
  {
    question: "Why should I sell to you instead of eBay or a thrift store?",
    answer:
      "Thrift stores pay pennies. eBay takes 13% plus fees, shipping hassle, and scam risks. We offer fair wholesale prices with zero hassle - no listings, no shipping headaches, no waiting for buyers. Just fast cash.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section bg-cream">
      <div className="container-narrow">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-navy/70">
            Everything you need to know about selling your vintage tees.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
              >
                <span className="text-xl font-semibold text-navy">
                  {faq.question}
                </span>
                <ChevronDown
                  size={24}
                  className={`text-money flex-shrink-0 transition-transform duration-200 ${openIndex === index ? "rotate-180" : ""
                    }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-200 ${openIndex === index ? "max-h-96" : "max-h-0"
                  }`}
              >
                <p className="px-6 pb-5 text-lg text-navy/70 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
