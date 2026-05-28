import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { LeadCategory, QuizResponses } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Local pickup detection (CLAUDE.md §10). Accepts the full-state-code values the
// funnel now submits ("IN"/"FL") and the legacy values still in older DB rows.
export function isLocalLocation(location: string): boolean {
  const v = location.trim().toLowerCase();
  return v === "in" || v === "fl" || v === "indianapolis" || v === "florida";
}

// Numeric conversion value (USD) for pixel/CAPI `value` — the midpoint of the
// quoted range (per-shirt midpoint × quantity midpoint). CLAUDE.md §5/§10:
// local leads get a higher value applied by the caller, since they close better.
export function getEstimatedValue(quizResponses: QuizResponses): number {
  const perShirt: Record<string, number> = {
    classic_rock: 30,
    harley: 20,
    "90s_band": 75,
    other: 22,
  };
  const qty: Record<QuizResponses["volume"], number> = {
    "10_or_less": 5,
    "20_to_50": 35,
    "50_plus": 75,
  };
  // Use the highest-value selected type (optimistic, matches the "good news" framing).
  const best = Math.max(...(quizResponses.shirtType.length ? quizResponses.shirtType : ["other"]).map((t) => perShirt[t] ?? 20));
  return Math.round(best * (qty[quizResponses.volume] ?? 5));
}

// Maps the quiz shirt type to a pixel/notification category (CLAUDE.md §5).
// `both` is reserved for Phase 3 multi-bucket selection — the current
// single-select quiz can only produce one bucket at a time.
export function getLeadCategory(quizResponses: QuizResponses): LeadCategory {
  const types = quizResponses.shirtType;
  const hasHarley = types.includes("harley");
  const hasConcert = types.includes("classic_rock") || types.includes("90s_band");
  if (hasHarley && hasConcert) return "both"; // gold lead — highest LTV (§6)
  if (hasHarley) return "harley";
  if (hasConcert) return "concert";
  return "other";
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Per-shirt $ range for a single shirt type (Harley varies by decade).
function perShirtRange(type: string, decades: string[]): { min: number; max: number } {
  if (type === "classic_rock") return { min: 20, max: 40 };
  if (type === "90s_band") return { min: 50, max: 100 };
  if (type === "harley") {
    const decadePrices: Record<string, number> = { "70s": 25, "80s": 20, "90s": 15 };
    const prices = decades.map((d) => decadePrices[d] || 20);
    return { min: Math.min(...(prices.length ? prices : [20])), max: Math.max(...(prices.length ? prices : [20])) };
  }
  return { min: 15, max: 30 }; // other vintage
}

export function getValueEstimate(quizResponses: {
  volume: string;
  condition: string;
  shirtType: string[];
  decades: string[];
}): { min: string; max: string; perShirt: string } {
  // Across all selected shirt types, take the lowest floor and highest ceiling.
  const types = quizResponses.shirtType.length ? quizResponses.shirtType : ["other"];
  const ranges = types.map((t) => perShirtRange(t, quizResponses.decades));
  let minPerShirt = Math.min(...ranges.map((r) => r.min));
  let maxPerShirt = Math.max(...ranges.map((r) => r.max));

  // Get shirt count range based on volume
  let minCount = 1;
  let maxCount = 10;
  if (quizResponses.volume === "10_or_less") {
    minCount = 1;
    maxCount = 10;
  } else if (quizResponses.volume === "20_to_50") {
    minCount = 20;
    maxCount = 50;
  } else if (quizResponses.volume === "50_plus") {
    minCount = 50;
    maxCount = 100;
  }

  // Calculate total range
  const totalMin = minPerShirt * minCount;
  const totalMax = maxPerShirt * maxCount;

  return {
    min: `$${totalMin.toLocaleString()}`,
    max: `$${totalMax.toLocaleString()}`,
    perShirt: minPerShirt === maxPerShirt
      ? `$${minPerShirt}`
      : `$${minPerShirt}-$${maxPerShirt}`,
  };
}
