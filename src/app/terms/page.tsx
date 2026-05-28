import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { BUYER_PHONE_DISPLAY, BUYER_PHONE_TEL } from "@/lib/config";

export const metadata = {
  title: "Terms of Service | Cash 4 Shirts",
  description: "The terms for using cash4shirts.com and our quote process.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="bg-cream">
        <div className="container-narrow py-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-navy mb-2">
            Terms of Service
          </h1>
          <p className="text-navy/50 mb-10">Last updated: May 28, 2026</p>

          <div className="space-y-8 text-lg text-navy/80 leading-relaxed">
            <p>
              By using cash4shirts.com, you agree to these terms. We&apos;ve kept them short and
              plain. If anything&apos;s unclear, just reach out.
            </p>

            <section>
              <h2 className="text-2xl font-serif font-bold text-navy mb-3">Estimates are not final offers</h2>
              <p>
                The price range shown after the quiz is an <strong>estimate</strong> based on the
                type and age of your shirts. It is not a binding offer. Your actual offer is made
                after we see the shirts in person or receive them by mail, and may be higher or
                lower depending on condition, authenticity, and demand.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-navy mb-3">No obligation</h2>
              <p>
                Getting an estimate or talking with us puts you under no obligation to sell. You
                can decline any offer for any reason, and so can we.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-navy mb-3">Your information and photos</h2>
              <p>
                You confirm that the information you submit is accurate and that you own the items
                you&apos;re offering to sell. Any photos you upload are used to evaluate your
                shirts and prepare an offer.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-navy mb-3">Payment and pickup</h2>
              <p>
                For local sellers in Indiana and Florida, we typically meet in person and pay cash
                on the spot. For other locations, we provide prepaid shipping and pay by your
                preferred method once we receive and verify the shirts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-navy mb-3">Limitation of liability</h2>
              <p>
                The site and our estimates are provided &ldquo;as is.&rdquo; To the fullest extent
                allowed by law, Cash 4 Shirts is not liable for any indirect or incidental damages
                arising from your use of the site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-navy mb-3">Governing law</h2>
              <p>These terms are governed by the laws of the State of Indiana.</p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-navy mb-3">Contact us</h2>
              <p>
                Questions about these terms? Reach us at{" "}
                <a href="mailto:hello@cash4shirts.com" className="text-money font-semibold underline">
                  hello@cash4shirts.com
                </a>{" "}
                or{" "}
                <a href={`tel:${BUYER_PHONE_TEL}`} className="text-money font-semibold underline">
                  {BUYER_PHONE_DISPLAY}
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
