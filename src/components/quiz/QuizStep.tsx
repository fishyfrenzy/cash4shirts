"use client";

import { Check, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

interface QuizOption {
  value: string;
  label: string;
  description?: string;
}

interface QuizStepProps {
  question: string;
  options: QuizOption[];
  selectedValue: string | string[] | null;
  onSelect: (value: string | string[]) => void;
  stepNumber: number;
  totalSteps: number;
  multiSelect?: boolean;
  onContinue?: () => void;
}

export default function QuizStep({
  question,
  options,
  selectedValue,
  onSelect,
  stepNumber,
  totalSteps,
  multiSelect = false,
  onContinue,
}: QuizStepProps) {
  const selectedArray = Array.isArray(selectedValue) ? selectedValue : [];

  const handleOptionClick = (value: string) => {
    if (multiSelect) {
      // Toggle selection for multi-select
      if (selectedArray.includes(value)) {
        onSelect(selectedArray.filter((v) => v !== value));
      } else {
        onSelect([...selectedArray, value]);
      }
    } else {
      // Single select - just pass the value
      onSelect(value);
    }
  };

  const isSelected = (value: string) => {
    if (multiSelect) {
      return selectedArray.includes(value);
    }
    return selectedValue === value;
  };

  return (
    <div className="animate-fade-in-up">
      {/* Progress Bar - Compact on mobile */}
      <div className="mb-4 md:mb-6">
        <div className="flex justify-between text-sm md:text-base text-navy/60 mb-1">
          <span>Step {stepNumber} of {totalSteps}</span>
          <span>{Math.round((stepNumber / totalSteps) * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-money rounded-full transition-all duration-500"
            style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <h3 className="text-xl md:text-2xl font-serif font-bold text-navy mb-4 md:mb-6 text-center">
        {question}
      </h3>

      {/* Multi-select hint */}
      {multiSelect && (
        <p className="text-sm text-navy/60 text-center mb-3">
          Select all that apply
        </p>
      )}

      {/* Options Grid - Compact on mobile */}
      <div className="grid gap-2 md:gap-3">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleOptionClick(option.value)}
            className={`
              relative p-3 md:p-4 rounded-xl border-2 text-left transition-all duration-200
              ${
                isSelected(option.value)
                  ? "border-money bg-money/5 shadow-md"
                  : "border-gray-200 hover:border-money/50 hover:shadow-sm bg-white"
              }
            `}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-lg md:text-xl font-semibold text-navy">{option.label}</p>
                {option.description && (
                  <p className="text-sm md:text-base text-navy/60 mt-0.5 truncate">
                    {option.description}
                  </p>
                )}
              </div>

              {/* Checkmark */}
              <div
                className={`
                  w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all
                  ${
                    isSelected(option.value)
                      ? "bg-money text-white"
                      : "border-2 border-gray-300"
                  }
                `}
              >
                {isSelected(option.value) && <Check size={16} className="md:w-5 md:h-5" />}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Continue button for multi-select */}
      {multiSelect && onContinue && (
        <div className="mt-6">
          <Button
            onClick={onContinue}
            disabled={selectedArray.length === 0}
            className="w-full"
            size="lg"
          >
            Continue
            <ArrowRight className="ml-2" size={20} />
          </Button>
        </div>
      )}
    </div>
  );
}
