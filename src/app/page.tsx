import Link from "next/link";
import { DatabaseRepository } from "@/lib/db";
import { Search, Compass, Car, Key } from "lucide-react";

export default function HomePage() {
  const categories = DatabaseRepository.getCategories();
  
  // Custom colors and subtitles exactly matching user UI specification
  const categoryConfig: Record<string, { title: string; color: string; sub: string; slug: string }> = {
    "cultural-and-historical": {
      title: "Cultural & Historical",
      color: "#8A3B12",
      sub: "10 places",
      slug: "cultural-and-historical",
    },
    nightlife: {
      title: "Nightlife",
      color: "#5B2A86",
      sub: "10 places",
      slug: "nightlife",
    },
    resorts: {
      title: "Resorts",
      color: "#0F5C3A",
      sub: "7 places",
      slug: "resorts",
    },
    "eco-tourism": {
      title: "Eco-tourism",
      color: "#2F6B1F",
      sub: "4 places",
      slug: "eco-tourism",
    },
    restaurants: {
      title: "Restaurants",
      color: "#C2410C",
      sub: "Fine dining, Local, Breakfast",
      slug: "restaurants",
    },
    "recreational-centres-and-activities": {
      title: "Recreation",
      color: "#1D5FA8",
      sub: "Coming soon",
      slug: "recreational-centres-and-activities",
    },
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Top Welcome Title */}
      <div>
        <p className="font-bold text-[var(--acc)] text-sm tracking-wide">Akwaaba</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--ink)]">
          Explore Ghana
        </h1>
      </div>

      {/* Quick Search Input */}
      <form
        action="/search"
        method="GET"
        className="flex items-center rounded-2xl border border-[var(--line)] bg-[var(--card)] px-3 py-1 shadow-sm focus-within:border-[var(--acc)]"
      >
        <Search className="h-4 w-4 text-[var(--mut)] mr-2" />
        <input
          type="text"
          name="q"
          placeholder="Search castles, resorts, dining..."
          aria-label="Search destinations"
          className="w-full bg-transparent py-2.5 text-sm text-[var(--ink)] placeholder-[var(--mut)] outline-none"
        />
      </form>

      {/* 2-Column Category Grid */}
      <div className="grid grid-cols-2 gap-3">
        {categories.map((cat) => {
          const cfg = categoryConfig[cat.slug] || {
            title: cat.name,
            color: "#C2410C",
            sub: "Explore places",
            slug: cat.slug,
          };

          return (
            <Link
              key={cat.id}
              href={`/category/${cfg.slug}`}
              style={{ backgroundColor: cfg.color }}
              className="group flex min-h-[132px] flex-col justify-between rounded-[18px] p-4 text-white shadow-sm transition hover:opacity-95 active:scale-[0.98]"
            >
              <b className="text-[16px] leading-tight font-bold">{cfg.title}</b>
              <small className="text-[12px] opacity-90">{cfg.sub}</small>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Buttons Row */}
      <div className="flex gap-2 pt-1">
        <Link
          href="/rides"
          className="flex h-[46px] flex-1 items-center justify-center gap-2 rounded-[13px] bg-[var(--grn)] px-3 text-sm font-bold text-white shadow-sm transition hover:opacity-90 active:scale-[0.98]"
        >
          <Car className="h-4 w-4" />
          <span>Book an Uber</span>
        </Link>

        <Link
          href="/rentals"
          className="flex h-[46px] flex-1 items-center justify-center gap-2 rounded-[13px] border-[1.5px] border-[var(--ink)] bg-transparent px-3 text-sm font-bold text-[var(--ink)] transition hover:bg-[var(--card)] active:scale-[0.98]"
        >
          <Key className="h-4 w-4" />
          <span>Rent a car</span>
        </Link>
      </div>
    </div>
  );
}
