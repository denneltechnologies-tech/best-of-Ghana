import { notFound } from "next/navigation";
import Link from "next/link";
import { DatabaseRepository } from "@/lib/db";
import { ArrowLeft, Phone, MapPin, ExternalLink } from "lucide-react";

interface CategoryPageProps {
  params: { slug: string };
  searchParams?: { sub?: string };
}

export default function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = DatabaseRepository.getCategoryBySlug(params.slug);
  if (!category) {
    notFound();
  }

  // Config mapping from user's template
  const categoryConfig: Record<string, { title: string; color: string; desc: string; subChips?: string[] }> = {
    "cultural-and-historical": {
      title: "Cultural & Historical",
      color: "#8A3B12",
      desc: "Heritage and history sites. Call ahead to confirm opening hours and tour availability.",
    },
    nightlife: {
      title: "Nightlife",
      color: "#5B2A86",
      desc: "Clubs and bars. Call to reserve a table or ask about entry.",
    },
    resorts: {
      title: "Resorts",
      color: "#0F5C3A",
      desc: "Resort stays and leisure. Call to check rooms, rates and availability.",
    },
    "eco-tourism": {
      title: "Eco-tourism",
      color: "#2F6B1F",
      desc: "Parks and nature reserves. Call to book visits and guides.",
    },
    restaurants: {
      title: "Restaurants",
      color: "#C2410C",
      desc: "Call to book a table or ask about the menu.",
      subChips: ["Fine dining", "Local", "Breakfast"],
    },
    "recreational-centres-and-activities": {
      title: "Recreation",
      color: "#1D5FA8",
      desc: "Recreational centres and activities.",
    },
  };

  const cfg = categoryConfig[params.slug] || {
    title: category.name,
    color: "#C2410C",
    desc: category.description,
  };

  const selectedSub = searchParams?.sub || (cfg.subChips ? cfg.subChips[0] : undefined);

  // Fetch destinations (support both published and draft previews)
  const allDestinations = DatabaseRepository.getDestinations({
    categorySlug: params.slug,
    status: "all",
  });

  // Filter by sub chip if applicable
  const displayDestinations = allDestinations.filter((d) => {
    if (!selectedSub || !cfg.subChips) return true;
    if (selectedSub === "Fine dining") {
      return d.secondaryTags.some((t) => t.toLowerCase().includes("fine dining"));
    }
    if (selectedSub === "Local") {
      return d.secondaryTags.some((t) => t.toLowerCase().includes("local") || t.toLowerCase().includes("ghanaian"));
    }
    if (selectedSub === "Breakfast") {
      return d.secondaryTags.some((t) => t.toLowerCase().includes("breakfast"));
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header Row */}
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
            Category Directory
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--ink)]">
            {cfg.title}
          </h1>
          <span className="text-xs md:text-sm font-semibold text-[var(--mut)]">
            {displayDestinations.length} places available
          </span>
        </div>

        <p className="text-sm md:text-base leading-relaxed text-[var(--mut)] max-w-3xl">
          {cfg.desc}
        </p>
      </div>

      {/* Chips for Subcategories (e.g. Restaurants: Fine dining, Local, Breakfast) */}
      {cfg.subChips && (
        <div className="flex flex-wrap gap-2 pt-1">
          {cfg.subChips.map((s) => (
            <Link
              key={s}
              href={`/category/${params.slug}?sub=${encodeURIComponent(s)}`}
              className={`flex h-10 md:h-11 items-center rounded-full px-5 text-sm font-bold transition ${
                selectedSub === s
                  ? "bg-[var(--acc)] text-white shadow-sm"
                  : "border-[1.5px] border-[var(--acc)] bg-transparent text-[var(--acc)] hover:bg-[var(--card)]"
              }`}
            >
              {s}
            </Link>
          ))}
        </div>
      )}

      {/* Responsive Cards Grid */}
      {displayDestinations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {displayDestinations.map((dest) => {
            const primaryPhone =
              dest.contacts.find((c) => c.type === "phone" && c.isPrimary) ||
              dest.contacts.find((c) => c.type === "phone");

            const telClean = primaryPhone?.value.replace(/[^+\d]/g, "") || "";

            return (
              <div
                key={dest.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl md:rounded-3xl border border-[var(--line)] bg-[var(--card)] shadow-sm hover:shadow-md transition duration-200"
              >
                <div>
                  {/* Photo / Colored Banner */}
                  <div
                    style={{ backgroundColor: cfg.color }}
                    className="relative h-[130px] md:h-[150px] w-full flex items-end p-4 text-[13px] md:text-sm font-bold text-white overflow-hidden"
                  >
                    {dest.media?.[0]?.url && (
                      <img
                        src={dest.media[0].url}
                        alt={dest.name}
                        className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-300 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="relative z-10 flex w-full items-center justify-between">
                      <span className="font-bold">{cfg.title}</span>
                      <span className="text-xs bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5 text-white/95">
                        {dest.locality}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-col gap-2 p-4 md:p-5">
                    <h2 className="text-lg md:text-xl font-bold text-[var(--ink)] group-hover:text-[var(--acc)] transition">
                      {dest.name}
                    </h2>

                    <p className="text-sm leading-relaxed text-[var(--mut)] line-clamp-2">
                      {dest.summary}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-[var(--mut)]">
                      <MapPin className="h-3.5 w-3.5 text-[var(--acc)]" />
                      <span>{dest.locality}, {dest.region}</span>
                    </div>

                    <p className="text-sm text-[var(--ink)] pt-1">
                      {primaryPhone ? (
                        <span className="font-bold">{primaryPhone.value}</span>
                      ) : (
                        <span className="text-xs text-[var(--mut)]">No phone listed</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Buttons Row */}
                <div className="flex gap-2.5 p-4 md:p-5 pt-0">
                  <Link
                    href={`/places/${dest.slug}`}
                    className="flex h-[46px] flex-1 items-center justify-center rounded-[13px] border-[1.5px] border-[var(--ink)] bg-transparent px-3 text-sm font-bold text-[var(--ink)] transition hover:bg-[var(--line)]/40 active:scale-[0.98]"
                  >
                    View details
                  </Link>

                  {primaryPhone ? (
                    <a
                      href={`tel:${telClean}`}
                      className="flex h-[46px] flex-1 items-center justify-center gap-1.5 rounded-[13px] bg-[var(--acc)] px-3 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--acc-hover)] active:scale-[0.98]"
                    >
                      <Phone className="h-4 w-4" />
                      <span>Call</span>
                    </a>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-12 text-center max-w-xl mx-auto my-8">
          <h2 className="text-xl font-bold text-[var(--ink)]">Coming soon</h2>
          <p className="mt-2 text-sm text-[var(--mut)]">
            Recreational centres and activities will appear here shortly. Check back soon for curated activities across Ghana!
          </p>
        </div>
      )}
    </div>
  );
}
