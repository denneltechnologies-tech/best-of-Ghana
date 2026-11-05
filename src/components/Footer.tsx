import Link from "next/link";
import { Compass, Phone, ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--line)] bg-[var(--card)] text-[var(--ink)] hidden md:block">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="flex flex-col gap-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--acc)] text-white">
                <Compass className="h-4 w-4" />
              </div>
              <span className="font-extrabold text-base tracking-tight">Best of Ghana</span>
            </div>
            <p className="text-xs leading-relaxed text-[var(--mut)]">
              An all-in-one curated tourism guide for DIY travelers in Ghana. Verified heritage sites, beach resorts, nightlife spots, dining, and reliable transport handoffs.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[var(--mut)] pt-1">
              <span>Made with</span>
              <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500 inline" />
              <span>for Ghana tourism</span>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--acc)]">
              Explore Destinations
            </h3>
            <ul className="flex flex-col gap-2 text-xs text-[var(--mut)]">
              <li>
                <Link href="/category/cultural-and-historical" className="hover:text-[var(--ink)] transition">
                  Cultural &amp; Historical Sites
                </Link>
              </li>
              <li>
                <Link href="/category/nightlife" className="hover:text-[var(--ink)] transition">
                  Nightlife &amp; Lounges
                </Link>
              </li>
              <li>
                <Link href="/category/resorts" className="hover:text-[var(--ink)] transition">
                  Beach &amp; Lake Resorts
                </Link>
              </li>
              <li>
                <Link href="/category/eco-tourism" className="hover:text-[var(--ink)] transition">
                  Eco-Tourism &amp; Parks
                </Link>
              </li>
              <li>
                <Link href="/category/restaurants" className="hover:text-[var(--ink)] transition">
                  Fine Dining &amp; Local Cuisine
                </Link>
              </li>
            </ul>
          </div>

          {/* Transport & Services */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--acc)]">
              Transport &amp; Rides
            </h3>
            <ul className="flex flex-col gap-2 text-xs text-[var(--mut)]">
              <li>
                <Link href="/rides" className="hover:text-[var(--ink)] transition">
                  Uber Ride Integrations
                </Link>
              </li>
              <li>
                <Link href="/rentals" className="hover:text-[var(--ink)] transition">
                  Chauffeur Vehicle Rentals
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-[var(--ink)] transition">
                  Search Directory
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[var(--ink)] transition flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Editorial Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency & Safe Travel */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--acc)]">
              Travel Safety &amp; Emergency
            </h3>
            <p className="text-xs text-[var(--mut)]">
              Keep verified emergency lines saved on your phone during trips:
            </p>
            <div className="flex flex-col gap-1.5 text-xs text-[var(--ink)] font-semibold">
              <div className="flex items-center justify-between rounded-lg bg-[var(--bg)] px-2.5 py-1.5 border border-[var(--line)]">
                <span>Ghana Police Hotline:</span>
                <a href="tel:191" className="text-[var(--acc)] font-bold hover:underline">191 / 112</a>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-[var(--bg)] px-2.5 py-1.5 border border-[var(--line)]">
                <span>National Ambulance Service:</span>
                <a href="tel:193" className="text-[var(--acc)] font-bold hover:underline">193</a>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-[var(--bg)] px-2.5 py-1.5 border border-[var(--line)]">
                <span>Ghana Fire Service:</span>
                <a href="tel:192" className="text-[var(--acc)] font-bold hover:underline">192</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-8 pt-6 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--mut)]">
          <p>© {new Date().getFullYear()} Best of Ghana. Curated verified tourism directory.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/admin" className="hover:underline">Editorial Verification</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
