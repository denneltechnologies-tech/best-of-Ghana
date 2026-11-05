import Link from "next/link";
import { DatabaseRepository } from "@/lib/db";
import { DestinationCard } from "@/components/DestinationCard";
import { Search, X, Compass, ArrowRight, Sparkles } from "lucide-react";

interface SearchPageProps {
  searchParams?: { q?: string; category?: string };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams?.q || "";
  const categoryFilter = searchParams?.category;

  const categories = DatabaseRepository.getCategories();

  // Search published destinations
  const results = DatabaseRepository.getDestinations({
    status: "published",
    query: query,
    categorySlug: categoryFilter,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 pb-24">
      {/* Search Header */}
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
          Search the <span className="text-ghana-gold">Directory</span>
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Find verified castles, seaside resorts, Osu dining spots, and eco-parks across Ghana.
        </p>

        {/* Search Input Form */}
        <form
          method="GET"
          action="/search"
          className="mt-6 flex items-center rounded-2xl border border-ghana-border bg-white p-2 shadow-sm focus-within:border-ghana-gold focus-within:ring-2 focus-within:ring-ghana-gold/20"
        >
          <div className="flex items-center pl-3 text-neutral-400">
            <Search className="h-5 w-5 text-ghana-gold" />
          </div>
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search by name, locality, or highlight..."
            className="w-full border-none bg-transparent px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none"
            aria-label="Search places"
            autoFocus
          />
          {query && (
            <Link
              href="/search"
              className="mr-2 p-1 text-neutral-400 hover:text-neutral-700"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Link>
          )}
          <button
            type="submit"
            className="rounded-xl bg-ghana-green px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-ghana-greenDark transition"
          >
            Search
          </button>
        </form>

        {/* Category filters */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs">
          <Link
            href={query ? `/search?q=${encodeURIComponent(query)}` : "/search"}
            className={`rounded-full px-3 py-1 font-medium transition ${
              !categoryFilter
                ? "bg-ghana-green text-white"
                : "bg-white text-neutral-600 border border-ghana-border hover:bg-ghana-sand"
            }`}
          >
            All Categories
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/search?q=${encodeURIComponent(query)}&category=${c.slug}`}
              className={`rounded-full px-3 py-1 font-medium transition ${
                categoryFilter === c.slug
                  ? "bg-ghana-green text-white"
                  : "bg-white text-neutral-600 border border-ghana-border hover:bg-ghana-sand"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between border-b border-ghana-border/60 pb-3">
        <p className="text-sm font-semibold text-neutral-800">
          {query ? (
            <>
              Found <span className="text-ghana-green">{results.length}</span> results for &ldquo;
              <span className="text-neutral-900">{query}</span>&rdquo;
            </>
          ) : (
            `Showing all published destinations (${results.length})`
          )}
        </p>
      </div>

      {/* Results Grid or Empty State */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-ghana-border bg-white p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ghana-sand text-ghana-gold">
            <Compass className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-neutral-900">
            {query ? "No matching published destinations found" : "No published destinations yet"}
          </h2>
          <p className="mt-2 text-sm text-neutral-600 max-w-md mx-auto">
            {query
              ? `We couldn't find verified entries matching "${query}". Try searching broader terms like "Accra", "Castle", "Resort", or "Seafood".`
              : "Content is currently in draft editorial verification. You can review and publish entries in the Admin dashboard."}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="rounded-xl border border-ghana-border bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-ghana-sand"
            >
              Explore Six Categories
            </Link>
            <Link
              href="/admin"
              className="rounded-xl bg-ghana-green px-4 py-2 text-sm font-semibold text-white hover:bg-ghana-greenDark"
            >
              Editorial Admin
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

