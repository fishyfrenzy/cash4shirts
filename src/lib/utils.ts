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

// ─── Pricing (single source of truth) ───────────────────────────────────────
// Per-shirt $ range depends ONLY on type + decade (quantity does not affect the
// per-shirt price). Harley and Classic Rock vary by decade; 90s Band Tees are
// inherently 90s; Other Vintage is flat.
type PriceRange = [min: number, max: number];

const PRICING: Record<string, { byDecade?: Record<string, PriceRange>; flat?: PriceRange }> = {
  harley: { byDecade: { "70s": [40, 100], "80s": [20, 50], "90s": [10, 30] } },
  classic_rock: { byDecade: { "70s": [50, 100], "80s": [40, 70], "90s": [30, 60] } },
  // 90s Band Tees are 90s by definition — wide range, can hit grails.
  "90s_band": { flat: [40, 250] },
  other: { flat: [15, 30] },
};

// Per-shirt range for one type across the selected decades.
function perShirtRange(type: string, decades: string[]): PriceRange {
  const p = PRICING[type] ?? PRICING.other;
  if (p.flat) return p.flat;
  const table = p.byDecade!;
  const decs = decades.filter((d) => table[d]);
  const use = decs.length ? decs : Object.keys(table); // no decade picked → span all
  const mins = use.map((d) => table[d][0]);
  const maxs = use.map((d) => table[d][1]);
  return [Math.min(...mins), Math.max(...maxs)];
}

// Overall per-shirt range across every selected type+decade combo.
function aggregatePerShirt(quizResponses: { shirtType: string[]; decades: string[] }): PriceRange {
  const types = quizResponses.shirtType.length ? quizResponses.shirtType : ["other"];
  const ranges = types.map((t) => perShirtRange(t, quizResponses.decades));
  return [Math.min(...ranges.map((r) => r[0])), Math.max(...ranges.map((r) => r[1]))];
}

// Numeric conversion value (USD) for the pixel/CAPI `value` — per-shirt midpoint
// × quantity midpoint. Quantity only matters here (total lead value for ad
// optimization), not for the per-shirt price the seller sees. Local leads get a
// higher value applied by the caller (CLAUDE.md §5/§10).
export function getEstimatedValue(quizResponses: QuizResponses): number {
  const [min, max] = aggregatePerShirt(quizResponses);
  const perShirtMid = (min + max) / 2;
  const qtyMid: Record<QuizResponses["volume"], number> = {
    "10_or_less": 5,
    "20_to_50": 35,
    "50_plus": 75,
  };
  return Math.round(perShirtMid * (qtyMid[quizResponses.volume] ?? 5));
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

// Blended average per shirt — assumes a realistic mix across the seller's pile:
// 75% at the low price, 15% at mid-high (¾ up the range), 10% at the top.
// Works out to ≈ 0.79·low + 0.21·high — conservative, protects the in-person offer.
function blendedAvg(min: number, max: number): number {
  const midHigh = min + 0.75 * (max - min);
  return 0.75 * min + 0.15 * midHigh + 0.1 * max;
}

const round10 = (n: number) => Math.round(n / 10) * 10;
const money = (n: number) => `$${round10(n).toLocaleString()}`;

// Seller-facing estimate shown on the estimate page:
//  - perShirt: the price range for one shirt (type + decade)
//  - total:    estimated collection total (blended avg × their quantity bucket)
export function getValueEstimate(quizResponses: {
  volume: string;
  condition?: string;
  shirtType: string[];
  decades: string[];
}): { perShirt: string; total: string } {
  const [minPerShirt, maxPerShirt] = aggregatePerShirt(quizResponses);
  const avg = blendedAvg(minPerShirt, maxPerShirt);

  let total: string;
  switch (quizResponses.volume) {
    case "10_or_less":
      total = `up to ${money(avg * 10)}`;
      break;
    case "20_to_50":
      total = `${money(avg * 20)}–${money(avg * 50)}`;
      break;
    case "50_plus":
      total = `${money(avg * 50)}+`;
      break;
    default:
      total = `up to ${money(avg * 10)}`;
  }

  return {
    perShirt: minPerShirt === maxPerShirt ? `$${minPerShirt}` : `$${minPerShirt}–$${maxPerShirt}`,
    total,
  };
}
