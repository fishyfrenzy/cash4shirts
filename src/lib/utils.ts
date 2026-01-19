import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

export function getValueEstimate(quizResponses: {
  volume: string;
  condition: string;
  shirtType: string;
  decades: string[];
}): { min: string; max: string; perShirt: string } {
  // Per-shirt pricing based on type and decade
  let minPerShirt = 0;
  let maxPerShirt = 0;

  if (quizResponses.shirtType === "classic_rock") {
    // Classic Rock: $20-$40 per shirt regardless of decade
    minPerShirt = 20;
    maxPerShirt = 40;
  } else if (quizResponses.shirtType === "harley") {
    // Harley: varies by decade - use highest value decade selected
    const decadePrices: Record<string, number> = {
      "70s": 30,
      "80s": 25,
      "90s": 20,
    };
    const prices = quizResponses.decades.map((d) => decadePrices[d] || 20);
    minPerShirt = Math.min(...prices);
    maxPerShirt = Math.max(...prices);
  } else if (quizResponses.shirtType === "90s_band") {
    // 90s Band Tees: $50-$100 per shirt
    minPerShirt = 50;
    maxPerShirt = 100;
  } else {
    // Other vintage: $15-$30 per shirt
    minPerShirt = 15;
    maxPerShirt = 30;
  }

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
