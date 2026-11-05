import Link from "next/link";
import { DatabaseRepository } from "@/lib/db";
import { DestinationCard } from "@/components/DestinationCard";
import {
  Landmark,
  PartyPopper,
  Umbrella,
  TreePine,
  UtensilsCrossed,
  Activity,
  Search,
  Car,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  MapPin,
} from "lucide-react";

// Category icon mapper
const categoryIcons: Record<string, any> = {
  "cultural-and-historical": Landmark,
  nightlife: PartyPopper,
  resorts: Umbrella,
  "eco-tourism": TreePine,
  restaurants: UtensilsCrossed,
  "recreational-centres-and-activities": Activity,
};

export default function HomePage() {
  const categories = DatabaseRepository.getCategories();
  const publishedDestinations = DatabaseRepository.getDestinations({
    status: "published",
  });
  const allDraftsCount = DatabaseRepository.getDestinations({
    status: "all",
  }).length;

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-ghana-sand/80 via-ghana-surface to-white px-4 pt-12 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-ghana-border bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-ghana-greenDark shadow-sm">
            <ShieldCheck className="h-4 w-4 text-ghana-gold" />
            <span>Curated & Verified Independent Guide</span>
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-ghana-dark sm:text-5xl lg:text-6xl">
            Discover the Heart of <span className="text-ghana-gold">Ghana</span>
          </h1>

          <p className="mt-4 text-base text-neutral-600 sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Your independent companion for discovering historic castles, coastal beach
            resorts, rainforest canopies, fine dining, and reliable transport across Ghana.
          </p>

          {/* Search Bar Form */}
          <form
            action="/search"
            method="GET"
            className="mt-8 mx-auto flex max-w-xl items-center rounded-2xl border border-ghana-border bg-white p-2 shadow-lg shadow-neutral-200/50 focus-within:border-ghana-gold focus-within:ring-2 focus-within:ring-ghana-gold/20"
          >
            <div className="flex items-center pl-3 text-neutral-400">
              <Search className="h-5 w-5 text-ghana-gold" />
            </div>
            <input
              type="text"
              name="q"
              placeholder="Search castles, beach resorts, Osu restaurants..."
              aria-label="Search destinations in Ghana"
              className="w-full border-none bg-transparent px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-ghana-green px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-ghana-greenDark focus:outline-none"
            >
              Explore
            </button>
          </form>

          {/* Quick Category Chips */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-neutral-600">
            <span className="font-medium text-neutral-400">Popular:</span>
            <Link
              href="/category/cultural-and-historical"
              className="rounded-full bg-white px-3 py-1 border border-ghana-border/60 hover:border-ghana-gold hover:text-ghana-greenDark transition"
            >
              Historic Forts & Castles
            </Link>
            <Link
              href="/category/resorts"
              className="rounded-full bg-white px-3 py-1 border border-ghana-border/60 hover:border-ghana-gold hover:text-ghana-greenDark transition"
            >
              Beach Resorts
            </Link>
            <Link
              href="/category/restaurants"
              className="rounded-full bg-white px-3 py-1 border border-ghana-border/60 hover:border-ghana-gold hover:text-ghana-greenDark transition"
            >
              Accra Dining
            </Link>
            <Link
              href="/getting-around"
              className="rounded-full bg-white px-3 py-1 border border-ghana-border/60 hover:border-ghana-gold hover:text-ghana-greenDark transition"
            >
              Vehicle Rentals
            </Link>
          </div>
        </div>
      </section>

      {/* Six Exact Core Categories Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ghana-green">
              Curated Taxonomy
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
              Explore by Category
            </h2>
          </div>
          <p className="text-sm text-neutral-500 max-w-sm">
            Six verified categories covering historic landmarks, hospitality, cuisine, and nature.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.slug] || Compass;
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-ghana-border bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-ghana-gold hover:shadow-md"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ghana-sand text-ghana-greenDark ring-1 ring-ghana-border/80 group-hover:bg-ghana-green group-hover:text-ghana-gold transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-neutral-900 group-hover:text-ghana-greenDark">
                    {cat.name}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-ghana-green">
                  <span>Browse Directory</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Getting Around Feature Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-800 to-ghana-greenDark p-8 sm:p-10 text-white shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-ghana-gold backdrop-blur-sm">
              <Car className="h-4 w-4" />
              <span>Independent Mobility</span>
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl text-white">
              Getting Around Ghana with Ease
            </h2>
            <p className="mt-3 text-sm text-neutral-200 leading-relaxed">
              Navigate city trips and regional expeditions with our verified transport guide.
              Access external Uber handoff in metropolitan Accra and Kumasi, or contact vetted
              long-distance minivan and vehicle rental operators for Cape Coast, Mole, and Volta travel.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/getting-around"
                className="inline-flex items-center gap-2 rounded-xl bg-ghana-gold px-5 py-2.5 text-sm font-semibold text-neutral-900 shadow-sm transition hover:bg-ghana-goldHover"
              >
                <span>View Transport & Rentals</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Published Destinations Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ghana-green">
              Verified Entries
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
              Featured Published Destinations
            </h2>
          </div>
          {publishedDestinations.length > 0 && (
            <Link
              href="/search"
              className="text-sm font-semibold text-ghana-green hover:underline"
            >
              View all ({publishedDestinations.length})
            </Link>
          )}
        </div>

        {publishedDestinations.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {publishedDestinations.slice(0, 6).map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-ghana-border bg-white p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-800">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-neutral-900">
              Content Currently in Draft / Verification Status
            </h3>
            <p className="mt-2 text-sm text-neutral-600 max-w-md mx-auto">
              Per strict PRD requirements, all {allDraftsCount} seeded destinations from the
              concept deck start in draft status until contacts, rights, and locations are verified.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/admin"
                className="rounded-xl bg-ghana-green px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-ghana-greenDark transition"
              >
                Go to Admin to Review & Publish Drafts
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Editorial Trust & Value Proposition Notice */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-ghana-border bg-ghana-sand/40 p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-ghana-green/10 p-2 text-ghana-green">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-900">Curated & Editorial Only</h4>
                <p className="mt-1 text-xs text-neutral-600 leading-relaxed">
                  We don't crowd-source unverified listings. Every entry contains vetted historical
                  context and verified phone contacts.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-ghana-green/10 p-2 text-ghana-green">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-900">External Maps & Directions</h4>
                <p className="mt-1 text-xs text-neutral-600 leading-relaxed">
                  Direct handoff to Google Maps with coordinate pins and address fallbacks. No
                  tracking of your private travel routes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-ghana-green/10 p-2 text-ghana-green">
                <PhoneCall className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-900">Direct Phone Connections</h4>
                <p className="mt-1 text-xs text-neutral-600 leading-relaxed">
                  Book directly with local venues and vehicle operators without hidden fees,
                  middlemen markups, or commission charges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

