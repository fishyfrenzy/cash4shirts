import { Inter } from "next/font/google";
import "./globals.css";
import { siteMetadata } from "./metadata";
import JSONLD from "@/components/seo/JSONLD";
import { MetaPixel, OpenAIPixelHead } from "@/components/tracking/Pixels";
import AttributionCapture from "@/components/tracking/AttributionCapture";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = siteMetadata;

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* OpenAI pixel first so it captures `oppref` before any navigation */}
        <OpenAIPixelHead />
        <JSONLD />
        <MetaPixel />
      </head>
      <body className={`font-sans min-h-screen`} suppressHydrationWarning>
        <AttributionCapture />
        {children}
      </body>
    </html>
  );
}
