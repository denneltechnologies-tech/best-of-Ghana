import Link from "next/link";
import { DatabaseRepository } from "@/lib/db";
import { ArrowLeft, Search, Phone, MapPin } from "lucide-react";

interface SearchPageProps {
  searchParams?: { q?: string };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams?.q || "";
  const results = query
    ? DatabaseRepository.getDestinations({ status: "all", query })
    : [];

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] hover:border-[var(--acc)] transition"
            aria-label="Back to home"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--acc)]">
            Explore Directory
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--ink)]">
          Search Directory
        </h1>
        <p className="text-sm md:text-base text-[var(--mut)]">
          Find heritage castles, beach resorts, dining spots, nightlife lounges, and parks across Ghana.
        </p>
      </div>

      {/* Search Input Form */}
      <form
        action="/search"
        method="GET"
        className="flex items-center rounded-2xl md:rounded-3xl border border-[var(--line)] bg-[var(--card)] px-4 py-2 shadow-sm focus-within:border-[var(--acc)] focus-within:ring-2 focus-within:ring-[var(--acc)]/20 transition"
      >
        <Search className="h-5 w-5 text-[var(--mut)] mr-3 flex-shrink-0" />
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Search by name, region, cuisine, or category..."
          className="w-full bg-transparent py-2 text-sm md:text-base text-[var(--ink)] placeholder-[var(--mut)] outline-none"
          autoFocus
        />
        <button
          type="submit"
          className="rounded-xl bg-[var(--acc)] px-5 py-2.5 text-xs md:text-sm font-bold text-white shadow-sm hover:bg-[var(--acc-hover)] transition"
        >
          Search
        </button>
      </form>

      {/* Results Header */}
      {query && (
        <div className="flex items-center justify-between text-sm text-[var(--mut)]">
          <p>
            Found <b className="text-[var(--ink)]">{results.length}</b> places matching &ldquo;{query}&rdquo;
          </p>
        </div>
      )}

      {/* Responsive Results Grid */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {results.map((dest) => {
            const primaryPhone =
              dest.contacts.find((c) => c.type === "phone" && c.isPrimary) ||
              dest.contacts.find((c) => c.type === "phone");

            const telClean = primaryPhone?.value.replace(/[^+\d]/g, "") || "";

            return (
              <div
                key={dest.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl md:rounded-3xl border border-[var(--line)] bg-[var(--card)] shadow-sm hover:shadow-md transition"
              >
                <div>
                  {dest.media?.[0]?.url && (
                    <div className="relative h-40 w-full overflow-hidden bg-stone-200">
                      <img
                        src={dest.media[0].url}
                        alt={dest.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                  )}

                  <div className="flex flex-col gap-2 p-4 md:p-5">
                    <h2 className="text-lg md:text-xl font-bold text-[var(--ink)] group-hover:text-[var(--acc)] transition">
                      {dest.name}
                    </h2>

                    <p className="text-sm text-[var(--mut)] line-clamp-2 leading-relaxed">
                      {dest.summary}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-[var(--mut)]">
                      <MapPin className="h-3.5 w-3.5 text-[var(--acc)]" />
                      <span>{dest.locality}, {dest.region}</span>
                    </div>

                    <p className="text-xs text-[var(--ink)] font-semibold pt-1">
                      {primaryPhone ? primaryPhone.value : "No phone listed"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 p-4 md:p-5 pt-0">
                  <Link
                    href={`/places/${dest.slug}`}
                    className="flex h-[44px] flex-1 items-center justify-center rounded-[13px] border-[1.5px] border-[var(--ink)] bg-transparent text-xs md:text-sm font-bold text-[var(--ink)] hover:bg-[var(--line)]/40 transition"
                  >
                    View details
                  </Link>

                  {primaryPhone && (
                    <a
                      href={`tel:${telClean}`}
                      className="flex h-[44px] flex-1 items-center justify-center gap-1.5 rounded-[13px] bg-[var(--acc)] text-xs md:text-sm font-bold text-white shadow-sm hover:bg-[var(--acc-hover)] transition"
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
      ) : query ? (
        <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-12 text-center max-w-lg mx-auto">
          <p className="text-base font-bold text-[var(--ink)]">No destinations found</p>
          <p className="text-sm text-[var(--mut)] mt-1">
            Try searching for &ldquo;Castle&rdquo;, &ldquo;Beach&rdquo;, &ldquo;Accra&rdquo;, or &ldquo;Resort&rdquo;.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-10 text-center max-w-lg mx-auto">
          <p className="text-sm text-[var(--mut)]">
            Type in a destination name, city, or category above to search the Best of Ghana directory.
          </p>
        </div>
      )}
    </div>
  );
}
