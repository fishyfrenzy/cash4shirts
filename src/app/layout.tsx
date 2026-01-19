import { Inter } from "next/font/google";
import "./globals.css";
import { siteMetadata } from "./metadata";
import JSONLD from "@/components/seo/JSONLD";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <JSONLD />
      </head>
      <body className={`font-sans min-h-screen`} suppressHydrationWarning>{children}</body>
    </html>
  );
}
