import { notFound } from "next/navigation";
import Link from "next/link";
import { DatabaseRepository } from "@/lib/db";
import { ArrowLeft, Phone, Compass } from "lucide-react";

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
    <div className="flex flex-col gap-4">
      {/* Top Header Row */}
      <div className="flex items-center gap-1.5 -ml-2">
        <Link
          href="/"
          className="flex h-11 w-11 items-center justify-center rounded-xl text-[var(--ink)] hover:bg-[var(--card)]"
          aria-label="Back to home"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--ink)]">
          {cfg.title}
        </h1>
      </div>

      {/* Chips for Subcategories (e.g. Restaurants: Fine dining, Local, Breakfast) */}
      {cfg.subChips && (
        <div className="flex flex-wrap gap-2">
          {cfg.subChips.map((s) => (
            <Link
              key={s}
              href={`/category/${params.slug}?sub=${encodeURIComponent(s)}`}
              className={`flex h-11 items-center rounded-full px-4 text-sm font-bold transition ${
                selectedSub === s
                  ? "bg-[var(--acc)] text-white"
                  : "border-[1.5px] border-[var(--acc)] bg-transparent text-[var(--acc)] hover:bg-[var(--card)]"
              }`}
            >
              {s}
            </Link>
          ))}
        </div>
      )}

      {/* Description */}
      <p className="text-sm leading-relaxed text-[var(--mut)]">
        {cfg.desc}
      </p>

      {/* Cards List or Empty State */}
      {displayDestinations.length > 0 ? (
        <div className="flex flex-col gap-3">
          {displayDestinations.map((dest) => {
            const primaryPhone =
              dest.contacts.find((c) => c.type === "phone" && c.isPrimary) ||
              dest.contacts.find((c) => c.type === "phone");

            const telClean = primaryPhone?.value.replace(/[^+\d]/g, "") || "";

            return (
              <div
                key={dest.id}
                className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--card)] shadow-sm"
              >
                {/* Photo / Colored Banner */}
                <div
                  style={{ backgroundColor: cfg.color }}
                  className="flex h-[110px] items-end p-3 text-[13px] font-bold text-white relative overflow-hidden"
                >
                  {dest.media?.[0]?.url && (
                    <img
                      src={dest.media[0].url}
                      alt={dest.name}
                      className="absolute inset-0 h-full w-full object-cover opacity-85"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <span className="relative z-10">{cfg.title}</span>
                </div>

                {/* Card Body */}
                <div className="flex flex-col gap-2 p-3">
                  <h2 className="text-[17px] font-bold text-[var(--ink)]">
                    {dest.name}
                  </h2>

                  <p className="text-[14px] leading-snug text-[var(--mut)] line-clamp-2">
                    {dest.summary}
                  </p>

                  <p className="text-[14px] text-[var(--ink)]">
                    {primaryPhone ? (
                      <b>{primaryPhone.value}</b>
                    ) : (
                      <span className="text-[var(--mut)]">No phone number listed</span>
                    )}
                  </p>

                  {/* Buttons Row */}
                  <div className="flex gap-2 pt-1">
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
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-6 text-center">
          <h2 className="text-base font-bold text-[var(--ink)]">Coming soon</h2>
          <p className="mt-1 text-sm text-[var(--mut)]">
            Recreational centres and activities will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
