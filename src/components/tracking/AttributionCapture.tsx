"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

// Mounted once in the root layout so UTM/oppref params are captured on the very
// first page load, before the visitor navigates into the funnel.
export default function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
