import Link from "next/link";
import { Sparkles, ShieldCheck, MapPin, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-ghana-border bg-ghana-sand/40 pb-20 pt-12 md:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand & Value */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ghana-green text-ghana-gold">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-ghana-dark">
                Best of <span className="text-ghana-gold">Ghana</span>
              </span>
            </div>
            <p className="mt-3 max-w-md text-sm text-neutral-600 leading-relaxed">
              Curated, independent travel directory designed for do-it-yourself travellers.
              Discover authentic cultural landmarks, pristine eco-tourism, beach resorts, dining,
              and nightlife across Ghana with verified contacts and external directions.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-neutral-500">
              <ShieldCheck className="h-4 w-4 text-ghana-green" />
              <span>Zero-account policy · Privacy-preserving · Direct provider arrangements</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900">
              Navigation
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-neutral-600">
              <li>
                <Link href="/" className="hover:text-ghana-green hover:underline">
                  Home Directory
                </Link>
              </li>
              <li>
                <Link href="/getting-around" className="hover:text-ghana-green hover:underline">
                  Getting Around & Rentals
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-ghana-green hover:underline">
                  Search Places
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-ghana-green hover:underline">
                  Privacy Policy & Data Notice
                </Link>
              </li>
            </ul>
          </div>

          {/* Administration & Transparency */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900">
              Editorial
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-neutral-600">
              <li>
                <Link href="/admin" className="hover:text-ghana-green hover:underline">
                  Editorial Admin Dashboard
                </Link>
              </li>
              <li>
                <Link href="/landing?c=ACC-AIRPORT-T3" className="hover:text-ghana-green hover:underline">
                  QR Stand Demo (Airport)
                </Link>
              </li>
            </ul>
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-800">
              <p className="font-medium">Independent Travel Companion</p>
              <p className="mt-1 text-[11px] text-amber-700">
                All transport and bookings are arranged directly with providers. Best of Ghana does
                not take booking commissions or collect fees.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-ghana-border/60 pt-6 text-center text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Best of Ghana. Grounded in founder validation requirements.</p>
        </div>
      </div>
    </footer>
  );
}

