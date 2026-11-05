import Link from "next/link";
import { DatabaseRepository } from "@/lib/db";
import { Search, Car, Key, MapPin, ArrowRight, Phone, Sparkles } from "lucide-react";

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

  // Get curated featured destinations for the highlights section
  const allDestinations = DatabaseRepository.getDestinations({ status: "all" });
  const featuredDestinations = allDestinations.slice(0, 4);

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Top Welcome Title & Hero */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <p className="font-bold text-[var(--acc)] text-sm tracking-wide uppercase">
            Akwaaba
          </p>
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--acc)] opacity-60"></span>
          <span className="text-xs font-semibold text-[var(--mut)]">Welcome to Ghana</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--ink)]">
              Explore Ghana
            </h1>
            <p className="text-sm md:text-base text-[var(--mut)] max-w-2xl mt-1">
              Curated tourism directory for DIY travelers. Heritage castles, beach resorts, nightlife hotspots, dining, and verified transport handoffs.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Search Input */}
      <form
        action="/search"
        method="GET"
        className="flex items-center rounded-2xl md:rounded-3xl border border-[var(--line)] bg-[var(--card)] px-4 py-1.5 md:py-2.5 shadow-sm focus-within:border-[var(--acc)] focus-within:ring-2 focus-within:ring-[var(--acc)]/20 transition"
      >
        <Search className="h-5 w-5 text-[var(--mut)] mr-3 flex-shrink-0" />
        <input
          type="text"
          name="q"
          placeholder="Search castles, resorts, dining, nightlife..."
          aria-label="Search destinations"
          className="w-full bg-transparent py-2 text-sm md:text-base text-[var(--ink)] placeholder-[var(--mut)] outline-none"
        />
        <button
          type="submit"
          className="hidden sm:inline-flex items-center justify-center rounded-xl bg-[var(--acc)] px-4 py-2 text-xs md:text-sm font-bold text-white shadow-sm hover:bg-[var(--acc-hover)] transition"
        >
          Search
        </button>
      </form>

      {/* Category Grid (Responsive: 2 cols on mobile, 3 cols on tablet & desktop) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-bold text-[var(--ink)]">
            Explore Categories
          </h2>
          <span className="text-xs text-[var(--mut)]">6 curated categories</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 lg:gap-6">
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
                className="group flex min-h-[135px] sm:min-h-[150px] md:min-h-[175px] flex-col justify-between rounded-[20px] md:rounded-[24px] p-4 md:p-6 text-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-[0.98]"
              >
                <div className="flex items-start justify-between">
                  <b className="text-[17px] sm:text-[19px] md:text-[22px] leading-tight font-extrabold tracking-tight">
                    {cfg.title}
                  </b>
                  <ArrowRight className="h-4 w-4 md:h-5 md:w-5 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
                </div>
                <div className="flex items-center justify-between pt-4">
                  <small className="text-[12px] sm:text-[13px] md:text-[14px] font-medium opacity-90">
                    {cfg.sub}
                  </small>
                  <span className="text-xs bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-0.5 font-bold">
                    View &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Action Buttons Row (Rides & Rentals) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-5 pt-1">
        <Link
          href="/rides"
          className="group flex h-[54px] md:h-[64px] items-center justify-between rounded-[16px] md:rounded-[20px] bg-[var(--grn)] px-5 text-sm md:text-base font-bold text-white shadow-sm transition hover:opacity-95 active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
              <Car className="h-5 w-5" />
            </div>
            <div className="flex flex-col text-left">
              <span>Book an Uber</span>
              <span className="text-xs font-normal opacity-85 hidden sm:inline">Instant ride with pre-filled destination</span>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </Link>

        <Link
          href="/rentals"
          className="group flex h-[54px] md:h-[64px] items-center justify-between rounded-[16px] md:rounded-[20px] border-2 border-[var(--ink)] bg-[var(--card)] px-5 text-sm md:text-base font-bold text-[var(--ink)] transition hover:bg-[var(--line)]/30 active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--line)]/60">
              <Key className="h-5 w-5" />
            </div>
            <div className="flex flex-col text-left">
              <span>Rent a Car</span>
              <span className="text-xs font-normal text-[var(--mut)] hidden sm:inline">Chauffeur SUVs, minivans &amp; buses</span>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Featured Destination Highlights (Expands Desktop View) */}
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[var(--acc)]" />
            <h2 className="text-lg md:text-xl font-bold text-[var(--ink)]">
              Curated Highlights
            </h2>
          </div>
          <span className="text-xs text-[var(--mut)]">Handpicked for visitors</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {featuredDestinations.map((dest) => {
            const primaryPhone =
              dest.contacts.find((c) => c.type === "phone" && c.isPrimary) ||
              dest.contacts.find((c) => c.type === "phone");

            return (
              <div
                key={dest.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--card)] shadow-sm hover:shadow-md transition duration-200"
              >
                <div>
                  <div className="relative h-40 w-full overflow-hidden bg-stone-300">
                    {dest.media?.[0]?.url && (
                      <img
                        src={dest.media[0].url}
                        alt={dest.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <span className="absolute bottom-2.5 left-3 text-xs font-semibold text-white/90 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-[var(--acc)]" />
                      <span>{dest.locality}, {dest.region}</span>
                    </span>
                  </div>

                  <div className="p-4 flex flex-col gap-1.5">
                    <h3 className="font-bold text-base text-[var(--ink)] group-hover:text-[var(--acc)] transition line-clamp-1">
                      {dest.name}
                    </h3>
                    <p className="text-xs text-[var(--mut)] line-clamp-2 leading-relaxed">
                      {dest.summary}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 flex gap-2">
                  <Link
                    href={`/places/${dest.slug}`}
                    className="flex-1 flex h-10 items-center justify-center rounded-xl border border-[var(--ink)] text-xs font-bold text-[var(--ink)] hover:bg-[var(--line)]/40 transition"
                  >
                    Details
                  </Link>
                  {primaryPhone && (
                    <a
                      href={`tel:${primaryPhone.value.replace(/[^+\d]/g, "")}`}
                      className="flex h-10 px-3 items-center justify-center gap-1 rounded-xl bg-[var(--acc)] text-xs font-bold text-white hover:bg-[var(--acc-hover)] transition"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>Call</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
