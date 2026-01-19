"use client";

import { Star, Quote } from "lucide-react";
import Card from "@/components/ui/Card";

const stats = [
  { value: "500+", label: "Happy Sellers" },
  { value: "$150K+", label: "Paid Out" },
  { value: "24hrs", label: "Average Response" },
  { value: "4.9", label: "Star Rating" },
];

const testimonials = [
  {
    name: "Angela Quintano",
    text: "I recently had the pleasure of selling some vintage t-shirts to these guys and the experience was fantastic. They were very responsive and professional throughout the entire process. I couldn’t be happier with how smooth and seamless the transaction went.",
    rating: 5,
    platform: "Facebook Review"
  },
  {
    name: "Dale Nehring",
    text: "Matt, drove 3 hours just to look at what I had. Because of the distance totally expected a 'NO SHOW' but Matt set the appointment and kept awesome communication. He showed up right on time and was very personable and honest.",
    rating: 5,
    platform: "Facebook Review"
  },
  {
    name: "Steve Callas",
    text: "I just met with Avery and sold 25 shirts, he made a great offer and also told me he would help me post others things. I was hesitant due to all the scams FB but this is for real. I'm heading to Outback for a nice steak dinner... Thanks Avery...",
    rating: 5,
    platform: "Facebook Review"
  },
  {
    name: "Jon Hite",
    text: "Matts Vintage Shirts is 100% legit. He bought 3 of my Iron Maiden shirts for a good price. Thanks again Matt.",
    rating: 5,
    platform: "Facebook Review"
  },
  {
    name: "Bo Boden",
    text: "Great place to unload your used older Harley, Biker, or Bar shirts that no longer fit. Great experience, fair cash paid for what they need. Beats throwing them in the garbage, you won’t be disappointed...!",
    rating: 5,
    platform: "Facebook Review"
  },
  {
    name: "Rod Corriveau",
    text: "Very good experience, offered fair prices and I would recommend them to anyone that has vintage Harley or concert shirts they dont wear anymore! Thanks Bro!",
    rating: 5,
    platform: "Facebook Review"
  },
  {
    name: "Scott White",
    text: "I sold various Harley items. Communication was fast and a meet up was set. It was an easy negotiation and professional transaction. I would definitely do business with them again.",
    rating: 5,
    platform: "Facebook Review"
  },
  {
    name: "Paul Breyer",
    text: "This was a great experience. Matt was a great person to deal with. Will refer to all my friends. I would highly recommend him for selling your old grown out of t shirt needs.",
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
