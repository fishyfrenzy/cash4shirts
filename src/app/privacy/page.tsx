import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { BUYER_PHONE_DISPLAY, BUYER_PHONE_TEL } from "@/lib/config";

export const metadata = {
  title: "Privacy Policy | Cash 4 Shirts",
  description: "How Cash 4 Shirts collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="bg-cream">
        <div className="container-narrow py-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-navy mb-2">
            Privacy Policy
          </h1>
          <p className="text-navy/50 mb-10">Last updated: May 28, 2026</p>

          <div className="space-y-8 text-lg text-navy/80 leading-relaxed">
            <p>
              Cash 4 Shirts (&ldquo;we,&rdquo; &ldquo;us&rdquo;) buys vintage Harley-Davidson
              and concert t-shirts from sellers in Indiana, Florida, and across the U.S. This
              policy explains what information we collect when you use cash4shirts.com and how
              we use it. We keep this simple, and we don&apos;t sell your personal information.
            </p>

            <section>
              <h2 className="text-2xl font-serif font-bold text-navy mb-3">Information you give us</h2>
              <p>
                When you fill out our quote form, we collect the details you provide: your
                name, phone number, state, optional photos of your shirts, and any notes you
                add. We only ask for what we need to make you an offer. We do not require an
                email address.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-navy mb-3">Information collected automatically</h2>
              <p>
                Like most websites, we use cookies and advertising/analytics pixels (including
                Meta and OpenAI/ChatGPT Ads) to understand how visitors find and use our site
                and to measure our advertising. These tools may collect device, browser, and
                usage information and ad-click identifiers. You can control cookies through your
                browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-navy mb-3">How we use your information</h2>
              <p>
                We use your information to contact you (by text or phone) about buying your
                shirts, to make and finalize an offer, and to improve our website and ads. A
                real person from our team reaches out — we don&apos;t use your number for spam
                or robocalls.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-navy mb-3">Who we share it with</h2>
              <p>
                We do not sell your personal information. We share it only with the service
                providers that help us run the business &mdash; for example, our database and
                photo storage provider (Supabase), our text-message provider (Twilio), our
                email provider (Resend), and advertising/analytics platforms (Meta, OpenAI) for
                ad measurement. These providers may only use it to provide services to us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-navy mb-3">Text messages</h2>
              <p>
                If you give us your phone number, you agree we may text you about your
                submission. Message and data rates may apply. You can stop messages anytime by
                replying STOP.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-navy mb-3">Your choices</h2>
              <p>
                You can ask us to access or delete the information we have about you at any
                time &mdash; just contact us using the details below and we&apos;ll take care
                of it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-navy mb-3">Children</h2>
              <p>Our site is intended for adults. We do not knowingly collect information from anyone under 18.</p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-navy mb-3">Contact us</h2>
              <p>
                Questions about your privacy? Reach us at{" "}
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
