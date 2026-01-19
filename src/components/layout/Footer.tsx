import { Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white">
      <div className="container-wide py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand & Description */}
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4">
              Cash<span className="text-money-light">4</span>Shirts
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              We buy vintage Harley Davidson and concert t-shirts from the 70s,
              80s, and 90s. Fair prices, fast payment, hassle-free process.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-bold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <a
                href="mailto:hello@cash4shirts.com"
                className="flex items-center gap-3 text-lg text-gray-300 hover:text-white transition-colors no-underline"
              >
                <Mail size={20} className="text-money-light" />
                hello@cash4shirts.com
              </a>
            </div>
          </div>

          {/* Locations */}
          <div>
            <h4 className="text-xl font-bold mb-4">Our Locations</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-lg text-gray-300">
                <MapPin size={20} className="text-money-light mt-1" />
                <span>Indiana</span>
              </div>
              <div className="flex items-start gap-3 text-lg text-gray-300">
                <MapPin size={20} className="text-money-light mt-1" />
                <span>Florida</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-base">
            &copy; {currentYear} Cash 4 Shirts. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-white transition-colors no-underline text-base"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-gray-400 hover:text-white transition-colors no-underline text-base"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
