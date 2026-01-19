"use client";

import { useState, useEffect, useRef } from "react";
import { X, ArrowLeft } from "lucide-react";
import QuizStep from "./QuizStep";
import QuizResult from "./QuizResult";
import Button from "@/components/ui/Button";
import { QuizResponses, QuizStepConfig } from "@/types";

const quizSteps: QuizStepConfig[] = [
  {
    id: 1,
    question: "What type of shirts do you have?",
    field: "shirtType",
    options: [
      {
        value: "harley",
        label: "Harley Davidson",
        description: "Vintage Harley dealer or biker tees",
      },
      {
        value: "classic_rock",
        label: "Classic Rock Shirts",
        description: "Led Zeppelin, Rolling Stones, etc.",
      },
      {
        value: "90s_band",
        label: "90s Band Tees",
        description: "Grunge, metal, rock from the 90s",
      },
      {
        value: "other",
        label: "Other Vintage",
        description: "Sports, movies, ads, or other graphics",
      },
    ],
  },
  {
    id: 2,
    question: "What decade(s) are they from?",
    field: "decades",
    multiSelect: true,
    options: [
      {
        value: "70s",
        label: "1970s",
        description: "Rare and highly collectible",
      },
      {
        value: "80s",
        label: "1980s",
        description: "Classic vintage era",
      },
      {
        value: "90s",
        label: "1990s",
        description: "Sought-after modern vintage",
      },
    ],
  },
  {
    id: 3,
    question: "How many shirts do you have?",
    field: "volume",
    options: [
      {
        value: "10_or_less",
        label: "10 or Less",
        description: "A small collection",
      },
      {
        value: "20_to_50",
        label: "20-50 Shirts",
        description: "A medium collection",
      },
      {
        value: "50_plus",
        label: "50+ Shirts",
        description: "A large collection",
      },
    ],
  },
  {
    id: 4,
    question: "What condition are they in?",
    field: "condition",
    options: [
      {
        value: "great",
        label: "Great Condition",
        description: "Minimal wear, colors intact",
      },
      {
        value: "faded",
        label: "Faded / Thrashed",
        description: "Worn look, soft fabric",
      },
      {
        value: "holes",
        label: "Has Holes / Damage",
        description: "Visible wear and tear",
      },
    ],
  },
];

interface ValuationQuizProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ValuationQuiz({ isOpen, onClose }: ValuationQuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Partial<QuizResponses>>({});
  const [showResult, setShowResult] = useState(false);
  const quizRef = useRef<HTMLDivElement>(null);

  // Reset quiz when closed
  useEffect(() => {
    if (!isOpen) {
      // Delay reset to allow close animation
      const timeout = setTimeout(() => {
        setCurrentStep(0);
        setResponses({});
        setShowResult(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  // Scroll to top of quiz on step change
  useEffect(() => {
    quizRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep, showResult]);

  // Prevent body scroll when quiz is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const advanceStep = () => {
    if (currentStep < quizSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleSelect = (field: keyof QuizResponses, value: string | string[]) => {
    const newResponses = { ...responses, [field]: value };
    setResponses(newResponses);

    // For shirt type selection
    if (field === "shirtType" && typeof value === "string") {
      // If 90s band tees, auto-set decades to 90s and skip that step
      if (value === "90s_band") {
        setResponses((prev) => ({ ...prev, [field]: value, decades: ["90s"] }));
        // Skip to volume step (step 2, which is index 2 after shirt type)
        setTimeout(() => {
          setCurrentStep(2); // Skip decades step
        }, 300);
        return;
      }
    }

    // For non-multi-select fields, auto-advance
    const currentStepConfig = quizSteps[currentStep];
    if (!currentStepConfig.multiSelect) {
      setTimeout(advanceStep, 300);
    }
  };

  const handleContinue = () => {
    advanceStep();
  };

  const handleBack = () => {
    if (showResult) {
      setShowResult(false);
    } else if (currentStep > 0) {
      // If we're on volume step and shirt type is 90s_band, go back to shirt type
      if (currentStep === 2 && responses.shirtType === "90s_band") {
        setCurrentStep(0);
      } else {
        setCurrentStep((prev) => prev - 1);
      }
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setResponses({});
    setShowResult(false);
  };

  if (!isOpen) return null;

  const currentQuizStep = quizSteps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Quiz Modal - Full height on mobile for better UX */}
      <div
        ref={quizRef}
        className="relative w-full max-w-2xl h-[100dvh] md:h-auto md:max-h-[85vh] m-0 md:m-4 bg-cream md:rounded-2xl shadow-2xl overflow-y-auto"
      >
        {/* Header - Compact on mobile */}
        <div className="sticky top-0 bg-cream border-b border-gray-200 px-4 py-3 md:px-6 md:py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2 md:gap-4">
            {(currentStep > 0 || showResult) && (
              <button
                onClick={handleBack}
                className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft size={20} className="md:w-6 md:h-6 text-navy" />
              </button>
            )}
            <h2 className="text-lg md:text-xl font-serif font-bold text-navy">
              Get Your Cash Offer
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={20} className="md:w-6 md:h-6 text-navy" />
          </button>
        </div>

        {/* Content - Less padding on mobile */}
        <div className="p-4 md:p-8">
          {showResult ? (
            <QuizResult
              quizResponses={responses as QuizResponses}
              onReset={handleReset}
            />
          ) : (
            <QuizStep
              question={currentQuizStep.question}
              options={currentQuizStep.options}
              selectedValue={responses[currentQuizStep.field] || (currentQuizStep.multiSelect ? [] : null)}
              onSelect={(value) => handleSelect(currentQuizStep.field, value)}
              stepNumber={currentStep + 1}
              totalSteps={quizSteps.length}
              multiSelect={currentQuizStep.multiSelect}
              onContinue={currentQuizStep.multiSelect ? handleContinue : undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
}
