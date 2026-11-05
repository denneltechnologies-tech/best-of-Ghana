"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Compass,
  Search,
  Car,
  ShieldCheck,
  Menu,
  X,
  MapPin,
  Sparkles,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Discover", icon: Compass },
    { href: "/search", label: "Search", icon: Search },
    { href: "/getting-around", label: "Getting Around", icon: Car },
    { href: "/admin", label: "Editorial Admin", icon: ShieldCheck },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-ghana-border/60 bg-ghana-surface/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-transform hover:scale-[1.02]"
            aria-label="Best of Ghana Home"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-ghana-green to-ghana-greenDark text-ghana-gold shadow-sm ring-1 ring-ghana-gold/40">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-ghana-dark sm:text-xl">
                Best of <span className="text-ghana-gold">Ghana</span>
              </span>
              <span className="hidden text-[10px] font-medium uppercase tracking-wider text-neutral-500 sm:block">
                Your Journey. Our Insight.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main Navigation">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-ghana-sand text-ghana-greenDark shadow-sm font-semibold"
                      : "text-neutral-700 hover:bg-ghana-sand/60 hover:text-neutral-900"
                  }`}
                >
                  <Icon className="h-4 w-4 text-ghana-gold" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Quick Action: Search trigger & Mobile Hamburger */}
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-ghana-border bg-white text-neutral-600 shadow-sm transition hover:bg-ghana-sand md:hidden"
              aria-label="Open search"
            >
              <Search className="h-4 w-4" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-ghana-border bg-white text-neutral-700 md:hidden"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="border-b border-ghana-border bg-ghana-surface px-4 py-3 shadow-lg md:hidden">
            <div className="space-y-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium ${
                      isActive
                        ? "bg-ghana-sand text-ghana-greenDark font-bold"
                        : "text-neutral-700 hover:bg-ghana-sand/50"
                    }`}
                  >
                    <Icon className="h-5 w-5 text-ghana-gold" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <div className="border-t border-ghana-border/80 pt-2">
                <Link
                  href="/privacy"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-1.5 text-xs text-neutral-500 hover:text-neutral-900"
                >
                  Privacy Notice & Data Policy
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Sticky Bottom Navigation Bar (Optimized for thumb zone) */}
      <nav
        className="fixed bottom-0 left-0 z-40 flex h-16 w-full items-center justify-around border-t border-ghana-border/80 bg-white/95 px-2 backdrop-blur-md md:hidden"
        aria-label="Mobile Navigation Bar"
      >
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors ${
                isActive
                  ? "text-ghana-greenDark font-bold"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <Icon
                className={`h-5 w-5 ${
                  isActive ? "text-ghana-green" : "text-neutral-400"
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

