"use client";

import { useState } from "react";
import { DollarSign, CheckCircle, ArrowRight, MapPin } from "lucide-react";
import Button from "@/components/ui/Button";
import ImageUpload from "./ImageUpload";
import { QuizResponses, Location, LeadFormData } from "@/types";
import { getValueEstimate } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface QuizResultProps {
  quizResponses: QuizResponses;
  onReset: () => void;
}

export default function QuizResult({ quizResponses, onReset }: QuizResultProps) {
  const [step, setStep] = useState<"result" | "details" | "success">("result");
  const [images, setImages] = useState<string[]>([]);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userComments, setUserComments] = useState("");
  const [location, setLocation] = useState<Location>("indianapolis");
  const [customLocation, setCustomLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const estimatedValue = getValueEstimate(quizResponses);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Basic validation
    if (!fullName.trim() || !phoneNumber.trim()) {
      setError("Please fill in all required fields");
      setSubmitting(false);
      return;
    }

    try {
      const supabase = createClient();
      const finalLocation = location === "other" ? customLocation.trim() : location;

      if (location === "other" && !customLocation.trim()) {
        setError("Please enter your location");
        setSubmitting(false);
        return;
      }

      const { error: insertError } = await supabase.from("leads").insert({
        full_name: fullName.trim(),
        phone_number: phoneNumber.trim(),
        location: finalLocation,
        quiz_responses: quizResponses,
        images,
        status: "new",
        user_comments: userComments.trim() || null,
      });

      if (insertError) {
        console.error("Insert error:", insertError);
        throw new Error("Failed to submit. Please try again.");
      }

      setStep("success");
    } catch (err) {
      console.error("Submission error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (step === "success") {
    return (
      <div className="text-center py-8 animate-fade-in-up">
        <div className="w-20 h-20 mx-auto bg-money/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={48} className="text-money" />
        </div>
        <h3 className="text-3xl font-serif font-bold text-navy mb-4">
          You&apos;re All Set!
        </h3>
        <p className="text-xl text-navy/70 mb-8 max-w-md mx-auto">
          We&apos;ve received your submission. Expect a call or text within 24
          hours with your personalized cash offer.
        </p>
        <Button variant="secondary" onClick={onReset}>
          Submit Another Collection
        </Button>
      </div>
    );
  }

  if (step === "details") {
    return (
      <div className="animate-fade-in-up">
        <h3 className="text-2xl md:text-3xl font-serif font-bold text-navy mb-6 text-center">
          Almost There! Tell Us How to Reach You
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-lg font-semibold text-navy mb-2">
              Upload Photos of Your Shirts (Optional)
            </label>
            <ImageUpload images={images} onImagesChange={setImages} />
          </div>

          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-lg font-semibold text-navy mb-2"
            >
              Your Name *
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Smith"
              className="w-full px-4 py-3 text-xl border-2 border-gray-200 rounded-lg focus:border-money focus:ring-2 focus:ring-money/20 outline-none transition-colors"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-lg font-semibold text-navy mb-2"
            >
              Phone Number *
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Your Phone Number"
              className="w-full px-4 py-3 text-xl border-2 border-gray-200 rounded-lg focus:border-money focus:ring-2 focus:ring-money/20 outline-none transition-colors"
              required
            />
          </div>

          {/* Additional Details */}
          <div>
            <label
              htmlFor="userComments"
              className="block text-lg font-semibold text-navy mb-2"
            >
              Any extra details? (Optional)
            </label>
            <textarea
              id="userComments"
              value={userComments}
              onChange={(e) => setUserComments(e.target.value)}
              placeholder="Tell us more about your collection, specific brands, or anything else we should know..."
              className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:border-money focus:ring-2 focus:ring-money/20 outline-none transition-colors min-h-[100px] resize-none"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-lg font-semibold text-navy mb-2">
              Your Location *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setLocation("indianapolis")}
                className={`p-4 rounded-lg border-2 flex items-center justify-center gap-2 transition-all ${location === "indianapolis"
                  ? "border-money bg-money/5"
                  : "border-gray-200 hover:border-money/50"
                  }`}
              >
                <MapPin size={20} className="text-money" />
                <span className="text-lg font-medium">Indiana</span>
              </button>
              <button
                type="button"
                onClick={() => setLocation("florida")}
                className={`p-4 rounded-lg border-2 flex items-center justify-center gap-2 transition-all ${location === "florida"
                  ? "border-money bg-money/5"
                  : "border-gray-200 hover:border-money/50"
                  }`}
              >
                <MapPin size={20} className="text-money" />
                <span className="text-lg font-medium">Florida</span>
              </button>
              <button
                type="button"
                onClick={() => setLocation("other")}
                className={`p-4 rounded-lg border-2 flex items-center justify-center gap-2 transition-all ${location === "other"
                  ? "border-money bg-money/5"
                  : "border-gray-200 hover:border-money/50"
                  }`}
              >
                <MapPin size={20} className="text-money" />
                <span className="text-lg font-medium">Other</span>
              </button>
            </div>

            {location === "other" && (
              <div className="mt-4 animate-fade-in">
                <input
                  type="text"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  placeholder="Enter your city/state"
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:border-money focus:ring-2 focus:ring-money/20 outline-none transition-colors"
                  required
                />
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-lg">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full"
            isLoading={submitting}
          >
            Get My Cash Offer
            <ArrowRight className="ml-2" size={24} />
          </Button>

          <p className="text-base text-navy/60 text-center">
            We&apos;ll contact you within 24 hours. No obligation.
          </p>
        </form>
      </div>
    );
  }

  // Result Step
  return (
    <div className="text-center animate-fade-in-up">
      {/* Value Badge */}
      <div className="inline-flex items-center gap-2 bg-money text-white px-5 py-3 rounded-full text-lg md:text-xl font-bold mb-6">
        <DollarSign size={24} />
        Estimated: {estimatedValue.min} - {estimatedValue.max}
      </div>

      <h3 className="text-2xl md:text-3xl font-serif font-bold text-navy mb-4">
        Great News! Your Shirts Could Be Worth Cash
      </h3>

      <p className="text-lg md:text-xl text-navy/70 mb-4 max-w-lg mx-auto">
        Based on your answers, we pay <strong>{estimatedValue.perShirt} per shirt</strong> for
        collections like yours.
      </p>

      <p className="text-base text-navy/60 mb-8 max-w-lg mx-auto">
        Your collection could be worth <strong>{estimatedValue.min} - {estimatedValue.max}</strong>.
        Upload photos to get your exact cash offer.
      </p>

      <Button size="lg" onClick={() => setStep("details")}>
        Upload Photos & Get Exact Offer
        <ArrowRight className="ml-2" size={24} />
      </Button>
    </div>
  );
}
