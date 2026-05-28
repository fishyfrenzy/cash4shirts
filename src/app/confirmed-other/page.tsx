import { Suspense } from "react";
import ThankYou from "@/components/confirmation/ThankYou";

// Added beyond CLAUDE.md §6's three named routes to give the "other vintage"
// category its own segmented pixel destination.
export const metadata = { title: "You're all set! | Cash 4 Shirts", robots: { index: false } };

export default function ConfirmedOther() {
  return (
    <Suspense>
      <ThankYou category="other" />
    </Suspense>
  );
}
