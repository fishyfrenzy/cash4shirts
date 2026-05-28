// UTM + click-id capture (CLAUDE.md §11 Phase 1.5). Captured once on landing and
// persisted in sessionStorage so it survives the multi-step funnel, then attached
// to the conversion payload. `oppref` is OpenAI's click param; it must be grabbed
// from the URL before any client navigation strips it.

const STORAGE_KEY = "c4s_attribution";

const TRACKED_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
  "oppref",
  "__oppref",
] as const;

export type Attribution = Partial<Record<(typeof TRACKED_PARAMS)[number], string>>;

// Reads the current URL params and merges them into stored attribution.
// First-touch wins: existing values are not overwritten by later navigations.
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const existing = getAttribution();
    let changed = false;

    for (const key of TRACKED_PARAMS) {
      const value = params.get(key);
      if (value && !existing[key]) {
        existing[key] = value;
        changed = true;
      }
    }

    if (changed) {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    }
  } catch {
    // sessionStorage can throw in private mode — attribution is best-effort.
  }
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}
