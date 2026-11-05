"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Car, Key, ShieldCheck } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const isHome = pathname === "/" || pathname.startsWith("/category") || pathname.startsWith("/places");
  const isRides = pathname.startsWith("/rides");
  const isRentals = pathname.startsWith("/rentals") || pathname.startsWith("/getting-around");
  const isAdmin = pathname.startsWith("/admin");

  return (
    <nav
      className="md:hidden sticky bottom-0 z-40 flex w-full border-t border-[var(--line)] bg-[var(--card)] px-2 py-1.5 shadow-lg backdrop-blur-md"
      aria-label="Bottom Navigation"
    >
      <Link
        href="/"
        className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 text-xs transition ${
          isHome && !isAdmin
            ? "font-bold text-[var(--acc)]"
            : "text-[var(--mut)] hover:text-[var(--ink)]"
        }`}
      >
        <Compass className={`h-5 w-5 ${isHome && !isAdmin ? "text-[var(--acc)]" : "opacity-80"}`} />
        <span>Home</span>
      </Link>

      <Link
        href="/rides"
        className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 text-xs transition ${
          isRides
            ? "font-bold text-[var(--acc)]"
            : "text-[var(--mut)] hover:text-[var(--ink)]"
        }`}
      >
        <Car className={`h-5 w-5 ${isRides ? "text-[var(--acc)]" : "opacity-80"}`} />
        <span>Rides</span>
      </Link>

      <Link
        href="/rentals"
        className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 text-xs transition ${
          isRentals && !isRides
            ? "font-bold text-[var(--acc)]"
            : "text-[var(--mut)] hover:text-[var(--ink)]"
        }`}
      >
        <Key className={`h-5 w-5 ${isRentals && !isRides ? "text-[var(--acc)]" : "opacity-80"}`} />
        <span>Rentals</span>
      </Link>

      <Link
        href="/admin"
        className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 text-xs transition ${
          isAdmin
            ? "font-bold text-[var(--acc)]"
            : "text-[var(--mut)] hover:text-[var(--ink)]"
        }`}
      >
        <ShieldCheck className={`h-5 w-5 ${isAdmin ? "text-[var(--acc)]" : "opacity-80"}`} />
        <span>Admin</span>
      </Link>
    </nav>
  );
}
