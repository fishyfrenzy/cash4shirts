import { Suspense } from "react";
import ThankYou from "@/components/confirmation/ThankYou";

export const metadata = { title: "You're all set! | Cash 4 Shirts", robots: { index: false } };

export default function ConfirmedBoth() {
  return (
    <Suspense>
      <ThankYou category="both" />
    </Suspense>
  );
}
