"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Menu, X } from "lucide-react";
import { BUYER_PHONE_DISPLAY, BUYER_PHONE_TEL } from "@/lib/config";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container-wide">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 no-underline">
            <span className="text-2xl md:text-3xl font-serif font-bold text-navy">
              Cash<span className="text-money">4</span>Shirts
            </span>
          </Link>

          {/* Desktop Navigation - No hamburger, visible links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#how-it-works"
              className="text-lg text-navy hover:text-money transition-colors no-underline"
            >
              How It Works
            </Link>
            <Link
              href="#about"
              className="text-lg text-navy hover:text-money transition-colors no-underline"
            >
              About Us
            </Link>
            <Link
              href="#faq"
              className="text-lg text-navy hover:text-money transition-colors no-underline"
            >
              FAQ
            </Link>
            <Link
              href="/blog"
              className="text-lg text-navy hover:text-money transition-colors no-underline"
            >
              Blog
            </Link>
          </div>

          {/* Click-to-call — always visible, including on mobile (CLAUDE.md §9) */}
          <div className="flex items-center gap-2">
            <a
              href={`tel:${BUYER_PHONE_TEL}`}
              className="flex items-center gap-2 bg-money text-white px-3 py-2 md:px-5 md:py-3 rounded-lg font-bold no-underline hover:bg-money-dark transition-colors"
              aria-label={`Call us at ${BUYER_PHONE_DISPLAY}`}
            >
              <Phone size={20} />
              <span className="hidden sm:inline">{BUYER_PHONE_DISPLAY}</span>
              <span className="sm:hidden">Call</span>
            </a>

            {/* Mobile Menu Button - Only shows on small screens */}
            <button
              className="md:hidden p-2 text-navy"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              <Link
                href="#how-it-works"
                className="text-xl text-navy hover:text-money transition-colors no-underline py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="#about"
                className="text-xl text-navy hover:text-money transition-colors no-underline py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                href="#faq"
                className="text-xl text-navy hover:text-money transition-colors no-underline py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link
                href="/blog"
                className="text-xl text-navy hover:text-money transition-colors no-underline py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
