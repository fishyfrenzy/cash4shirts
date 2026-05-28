"use client";

import { Star, Quote } from "lucide-react";
import Card from "@/components/ui/Card";

const stats = [
  { value: "500+", label: "Happy Sellers" },
  { value: "< 1 Hour", label: "Avg. Response" },
  { value: "4.9", label: "Star Rating" },
];

// Real Facebook reviews from facebook.com/cash4shirts. Last names shortened to
// an initial; buyer first names (Spencer/Matt/Avery) kept for authenticity.
const testimonials = [
  {
    name: "Mary D.",
    text: "This company is AWESOME! Not only do they give fair and good offers, they are VERY honest and trustworthy! I highly recommend them to unload older Harley tshirts, Vintage Bike Week shirts, etc. And the best thing..... they don't have to be in great shape! I'll definitely be doing business with them again!",
    rating: 5,
    platform: "Facebook Review"
  },
  {
    name: "Dale N.",
    text: "Matt drove 3 hours just to look at what I had. Because of the distance I totally expected a “NO SHOW,” but Matt set the appointment and kept awesome communication. He showed up right on time and was very personable and honest. One of my best interactions on marketplace! He left with 2 piles of shirts and 3 crates of record albums and made my bank account very happy 😊.",
    rating: 5,
    platform: "Facebook Review"
  },
  {
    name: "Linda R.",
    text: "Was a pleasure doing business with Spencer, a very nice polite young man who made me a deal I couldn't refuse. He was right on time for our appointment, picked out the shirts he was interested in and made me a cash offer which I thought was very generous. If you're considering selling some shirts, he's the guy to deal with. It was a pleasure.",
    rating: 5,
    platform: "Facebook Review"
  },
  {
    name: "Patrick S.",
    text: "Spencer was great. Called just before arriving and prompt. Easy to talk to and overall great guy. Looked through all my shirts. Picked out the ones he was looking for and paid me on the spot. Didn't take them all, but I have more for him to check out on his next visit.",
    rating: 5,
    platform: "Facebook Review"
  },
  {
    name: "Angela Q.",
    text: "I recently had the pleasure of selling some vintage t-shirts to these guys and the experience was fantastic. They were very responsive and professional throughout the entire process. I couldn't be happier with how smooth and seamless the transaction went. I highly recommend this page to anyone looking to sell their old shirts. They truly know their stuff!",
    rating: 5,
    platform: "Facebook Review"
  },
  {
    name: "Dale P.",
    text: "A great experience. We went through some of my T's.... Talked a lot and had some laughs. I'm very happy with our transaction and will be in contact again when I find the rest of mine. Highly recommend!",
    rating: 5,
    platform: "Facebook Review"
  },
  {
    name: "Paul B.",
    text: "This was a great experience. Matt was a great person to deal with. Will refer to all my friends. I would highly recommend him for selling your old grown-out-of t-shirt needs.",
    rating: 5,
    platform: "Facebook Review"
  },
  {
    name: "Bo B.",
    text: "Great place to unload your used older Harley, Biker, or Bar shirts that no longer fit. Great experience, fair cash paid for what they need. Beats throwing them in the garbage — you won't be disappointed!",
    rating: 5,
    platform: "Facebook Review"
  },
  {
    name: "Rod C.",
    text: "Very good experience, offered fair prices, and I would recommend them to anyone that has vintage Harley or concert shirts they don't wear anymore! Thanks bro!",
    rating: 5,
    platform: "Facebook Review"
  },
];

export default function TrustIndicators() {
  return (
    <section className="section bg-cream">
      <div className="container-wide">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-serif font-bold text-money mb-2">
                {stat.value}
              </div>
              <div className="text-lg text-navy/70">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-4">
            What Our Sellers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative flex flex-col h-full">
              {/* Quote Icon */}
              <Quote
                size={24}
                className="text-money/20 absolute top-4 right-4"
              />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className="fill-gold text-gold"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-base text-navy/80 mb-6 leading-relaxed italic flex-grow">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author */}
              <div className="border-t border-gray-100 pt-4 mt-auto">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-navy">{testimonial.name}</p>
                    <p className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-1">
                      {testimonial.platform}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
