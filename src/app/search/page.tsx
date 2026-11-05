import Link from "next/link";
import { DatabaseRepository } from "@/lib/db";
import { ArrowLeft, Search, Phone } from "lucide-react";

interface SearchPageProps {
  searchParams?: { q?: string };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams?.q || "";
  const results = query
    ? DatabaseRepository.getDestinations({ status: "all", query })
    : [];

  return (
    <div className="flex flex-col gap-4">
      {/* Top Header */}
      <div className="flex items-center gap-1.5 -ml-2">
        <Link
          href="/"
          className="flex h-11 w-11 items-center justify-center rounded-xl text-[var(--ink)] hover:bg-[var(--card)]"
          aria-label="Back to home"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--ink)]">
          Search Directory
        </h1>
      </div>

      {/* Search Input Form */}
      <form
        action="/search"
        method="GET"
        className="flex items-center rounded-2xl border border-[var(--line)] bg-[var(--card)] px-3 py-1 shadow-sm focus-within:border-[var(--acc)]"
      >
        <Search className="h-4 w-4 text-[var(--mut)] mr-2" />
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Search places, castles, food..."
          className="w-full bg-transparent py-2.5 text-sm text-[var(--ink)] placeholder-[var(--mut)] outline-none"
          autoFocus
        />
        <button
          type="submit"
          className="rounded-[11px] bg-[var(--acc)] px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[var(--acc-hover)]"
        >
          Search
        </button>
      </form>

      {/* Results Header */}
      {query && (
        <p className="text-xs text-[var(--mut)]">
          Found <b>{results.length}</b> places matching &ldquo;{query}&rdquo;
        </p>
      )}

      {/* Results List */}
      {results.length > 0 ? (
        <div className="flex flex-col gap-3">
          {results.map((dest) => {
            const primaryPhone =
              dest.contacts.find((c) => c.type === "phone" && c.isPrimary) ||
              dest.contacts.find((c) => c.type === "phone");

            const telClean = primaryPhone?.value.replace(/[^+\d]/g, "") || "";

            return (
              <div
                key={dest.id}
                className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--card)] shadow-sm"
              >
                <div className="flex flex-col gap-2 p-3">
                  <h2 className="text-[17px] font-bold text-[var(--ink)]">
                    {dest.name}
                  </h2>
                  <p className="text-[13px] text-[var(--mut)] line-clamp-2">
                    {dest.summary}
                  </p>
                  <p className="text-xs text-[var(--ink)]">
                    {primaryPhone ? <b>{primaryPhone.value}</b> : "No phone number listed"}
                  </p>
                  <div className="flex gap-2 pt-1">
                    <Link
                      href={`/places/${dest.slug}`}
                      className="flex h-[44px] flex-1 items-center justify-center rounded-[13px] border-[1.5px] border-[var(--ink)] bg-transparent text-xs font-bold text-[var(--ink)]"
                    >
                      View details
                    </Link>
                    {primaryPhone && (
                      <a
                        href={`tel:${telClean}`}
                        className="flex h-[44px] flex-1 items-center justify-center gap-1.5 rounded-[13px] bg-[var(--acc)] text-xs font-bold text-white shadow-sm"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        <span>Call</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : query ? (
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-6 text-center">
          <p className="text-sm font-semibold text-[var(--ink)]">No destinations found</p>
          <p className="mt-1 text-xs text-[var(--mut)]">
            Try searching for &ldquo;Castle&rdquo;, &ldquo;Resort&rdquo;, &ldquo;Accra&rdquo;, or &ldquo;National Park&rdquo;.
          </p>
        </div>
      ) : null}
    </div>
  );
}
