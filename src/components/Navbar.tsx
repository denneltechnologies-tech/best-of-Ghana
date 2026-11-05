"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Car, Key, ShieldCheck, Search } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const isHome = pathname === "/" || pathname.startsWith("/category") || pathname.startsWith("/places");
  const isRides = pathname.startsWith("/rides");
  const isRentals = pathname.startsWith("/rentals") || pathname.startsWith("/getting-around");
  const isAdmin = pathname.startsWith("/admin");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--line)] bg-[var(--card)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--acc)] text-white shadow-sm transition group-hover:scale-105">
            <Compass className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base md:text-lg tracking-tight text-[var(--ink)]">
                Best of Ghana
              </span>
              <span className="hidden sm:inline-flex items-center rounded-full bg-[var(--acc)]/10 px-2 py-0.5 text-[11px] font-bold text-[var(--acc)]">
                Akwaaba
              </span>
            </div>
            <span className="text-[11px] text-[var(--mut)] -mt-0.5 hidden md:inline">
              Curated tourism &amp; travel guide
            </span>
          </div>
        </Link>

        {/* Navigation Links (Desktop/Tablet) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Desktop Navigation">
          <Link
            href="/"
            className={`rounded-xl px-3.5 py-2 text-sm font-bold transition ${
              isHome && !isAdmin
                ? "bg-[var(--acc)]/10 text-[var(--acc)]"
                : "text-[var(--mut)] hover:text-[var(--ink)] hover:bg-[var(--line)]/50"
            }`}
          >
            Explore
          </Link>

          <Link
            href="/rides"
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-bold transition ${
              isRides
                ? "bg-[var(--acc)]/10 text-[var(--acc)]"
                : "text-[var(--mut)] hover:text-[var(--ink)] hover:bg-[var(--line)]/50"
            }`}
          >
            <Car className="h-4 w-4" />
            <span>Rides</span>
          </Link>

          <Link
            href="/rentals"
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-bold transition ${
              isRentals && !isRides
                ? "bg-[var(--acc)]/10 text-[var(--acc)]"
                : "text-[var(--mut)] hover:text-[var(--ink)] hover:bg-[var(--line)]/50"
            }`}
          >
            <Key className="h-4 w-4" />
            <span>Car Rentals</span>
          </Link>

          <Link
            href="/admin"
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-bold transition ${
              isAdmin
                ? "bg-[var(--acc)]/10 text-[var(--acc)]"
                : "text-[var(--mut)] hover:text-[var(--ink)] hover:bg-[var(--line)]/50"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Admin</span>
          </Link>
        </nav>

        {/* Right Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search on mobile & desktop */}
          <Link
            href="/search"
            aria-label="Search"
            className="flex h-9 w-9 md:h-10 md:w-auto md:px-3 items-center justify-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-sm text-[var(--mut)] hover:border-[var(--acc)] hover:text-[var(--ink)] transition"
          >
            <Search className="h-4 w-4 text-[var(--mut)]" />
            <span className="hidden md:inline text-xs text-[var(--mut)]">Search guide...</span>
          </Link>

          <Link
            href="/rides"
            className="hidden sm:flex h-9 md:h-10 items-center justify-center gap-1.5 rounded-xl bg-[var(--grn)] px-3 text-xs md:text-sm font-bold text-white shadow-sm transition hover:opacity-90 active:scale-95"
          >
            <Car className="h-4 w-4" />
            <span>Book Uber</span>
          </Link>

          <Link
            href="/rentals"
            className="hidden lg:flex h-10 items-center justify-center gap-1.5 rounded-xl border-[1.5px] border-[var(--ink)] bg-transparent px-3.5 text-xs md:text-sm font-bold text-[var(--ink)] transition hover:bg-[var(--line)]/50 active:scale-95"
          >
            <Key className="h-4 w-4" />
            <span>Rent a Car</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
