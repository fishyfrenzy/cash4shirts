import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Cash 4 Shirts | We Buy Vintage Harley & Concert T-Shirts",
  description:
    "Turn your vintage 70s-90s Harley Davidson and concert t-shirts into cash. Fast, fair offers. Serving Indiana and Florida. Get your free quote today!",
  keywords: [
    "sell vintage t-shirts",
    "buy Harley Davidson shirts",
    "vintage concert tees",
    "sell old band shirts",
    "cash for vintage clothes",
    "Indiana",
    "Florida",
  ],
  authors: [{ name: "Cash 4 Shirts" }],
  openGraph: {
    title: "Cash 4 Shirts | We Buy Vintage Harley & Concert T-Shirts",
    description:
      "Turn your vintage 70s-90s Harley Davidson and concert t-shirts into cash. Fast, fair offers.",
    type: "website",
    locale: "en_US",
    siteName: "Cash 4 Shirts",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cash 4 Shirts | We Buy Vintage T-Shirts",
    description:
      "Turn your vintage 70s-90s Harley Davidson and concert t-shirts into cash.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// JSON-LD Schema for LocalBusiness (Indianapolis)
const jsonLdIndy = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Cash 4 Shirts - Indiana",
  description:
    "We buy vintage 70s-90s Harley Davidson and concert t-shirts for cash in Indiana.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Indiana",
    addressRegion: "IN",
    addressCountry: "US",
  },
  areaServed: {
    "@type": "State",
    name: "Indiana",
  },
  priceRange: "$50-$500+",
  paymentAccepted: "Cash",
  currenciesAccepted: "USD",
};

// JSON-LD Schema for LocalBusiness (Florida)
const jsonLdFlorida = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Cash 4 Shirts - Florida",
  description:
    "We buy vintage 70s-90s Harley Davidson and concert t-shirts for cash in Florida.",
  address: {
    "@type": "PostalAddress",
    addressRegion: "FL",
    addressCountry: "US",
  },
  areaServed: {
    "@type": "State",
    name: "Florida",
  },
  priceRange: "$50-$500+",
  paymentAccepted: "Cash",
  currenciesAccepted: "USD",
};

// FAQ Schema for AI optimization
const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What types of t-shirts do you buy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We specialize in vintage Harley Davidson t-shirts from the 70s-90s, concert and band tees from that era, and other vintage graphic tees. Single-stitch shirts from this period are especially valuable.",
      },
    },
    {
      "@type": "Question",
      name: "How much will you pay for my vintage t-shirts?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Prices vary based on brand, condition, rarity, and design. Single shirts typically range from $20-$150, while rare pieces can fetch $200-$500 or more. Collections are evaluated individually for the best offer.",
      },
    },
    {
      "@type": "Question",
      name: "How does the selling process work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Simply take a quiz about your shirts, upload photos, and we'll provide a cash offer within 24 hours. If you accept, we arrange pickup or you ship to us, and you get paid immediately.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdIndy) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFlorida) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      </head>
      <body className={`font-sans min-h-screen`} suppressHydrationWarning>{children}</body>
    </html>
  );
}
