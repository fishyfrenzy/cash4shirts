"use client";

import { MapPin, Heart, Shirt } from "lucide-react";

export default function LocalFace() {
  return (
    <section id="about" className="section bg-white">
      <div className="container-wide">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image Placeholder */}
          <div className="bg-gradient-to-br from-navy/5 to-money/5 rounded-2xl aspect-square flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-32 h-32 mx-auto bg-navy/10 rounded-full flex items-center justify-center mb-4">
                <Shirt size={64} className="text-navy/40" />
              </div>
              <p className="text-navy/50 text-lg">[Founder Photo]</p>
            </div>
          </div>

          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-6">
              Real People. Fair Prices.
              <br />
              <span className="text-money">Local Service.</span>
            </h2>

            <p className="text-xl text-navy/80 mb-6 leading-relaxed">
              Hi, we&apos;re Matt & Avery, two brothers who started Cash 4
              Shirts because we saw too many people donating their shirts or
              selling them to didn&apos;t care about the history behind each shirt
              for pennies on the dollar.
            </p>

            <p className="text-xl text-navy/80 mb-8 leading-relaxed">
              Every tee tells a story. We pay fair prices because we understand
              the value of what you&apos;re selling &mdash; and we make sure it
              goes to collectors who will treasure it.
            </p>

            {/* Location Badges */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-navy/5 px-4 py-2 rounded-full">
                <MapPin size={20} className="text-money" />
                <span className="text-lg font-medium text-navy">
                  Indiana
                </span>
              </div>
              <div className="flex items-center gap-2 bg-navy/5 px-4 py-2 rounded-full">
                <MapPin size={20} className="text-money" />
                <span className="text-lg font-medium text-navy">
                  Florida
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
