import { notFound } from "next/navigation";
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
  Compass,
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
  Filter,
} from "lucide-react";

const categoryIcons: Record<string, any> = {
  "cultural-and-historical": Landmark,
  nightlife: PartyPopper,
  resorts: Umbrella,
  "eco-tourism": TreePine,
  restaurants: UtensilsCrossed,
  "recreational-centres-and-activities": Activity,
};

interface CategoryPageProps {
  params: { slug: string };
  searchParams?: { tag?: string; locality?: string };
}

export default function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = DatabaseRepository.getCategoryBySlug(params.slug);
  if (!category) {
    notFound();
  }

  const selectedTag = searchParams?.tag;
  const destinations = DatabaseRepository.getDestinations({
    categorySlug: params.slug,
    status: "published",
    tag: selectedTag,
  });

  const allCategoryDrafts = DatabaseRepository.getDestinations({
    categorySlug: params.slug,
    status: "all",
  });

  // Extract available tags within this category for reliable filtering
  const availableTags = Array.from(
    new Set(allCategoryDrafts.flatMap((d) => d.secondaryTags))
  );

  const Icon = categoryIcons[category.slug] || Compass;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 pb-20">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <Link href="/" className="hover:text-ghana-green inline-flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="font-semibold text-neutral-800">{category.name}</span>
      </div>

      {/* Category Header */}
      <div className="rounded-3xl border border-ghana-border bg-gradient-to-br from-ghana-sand/60 to-white p-6 sm:p-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ghana-green text-ghana-gold shadow-sm">
            <Icon className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
              {category.name}
            </h1>
            <p className="mt-2 text-base text-neutral-600 max-w-2xl leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>

        {/* Filter tags (e.g. Fine Dining, Local, Breakfast Spots for Restaurants) */}
        {availableTags.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-ghana-border/60 pt-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 mr-2">
              <Filter className="h-3.5 w-3.5" />
              <span>Filter:</span>
            </div>
            <Link
              href={`/category/${category.slug}`}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                !selectedTag
                  ? "bg-ghana-green text-white shadow-sm"
                  : "bg-white text-neutral-700 border border-ghana-border hover:bg-ghana-sand"
              }`}
            >
              All
            </Link>
            {availableTags.map((tag) => (
              <Link
                key={tag}
                href={`/category/${category.slug}?tag=${encodeURIComponent(tag)}`}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  selectedTag === tag
                    ? "bg-ghana-green text-white shadow-sm"
                    : "bg-white text-neutral-700 border border-ghana-border hover:bg-ghana-sand"
                }`}
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Listing Grid or Accessible Empty State */}
      {destinations.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-ghana-border bg-white p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-700">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-neutral-900">
            {allCategoryDrafts.length > 0
              ? `${allCategoryDrafts.length} entries in verification review`
              : "No destinations listed yet"}
          </h2>
          <p className="mt-2 text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
            {allCategoryDrafts.length > 0
              ? "The draft candidates for this category are undergoing editorial validation for phone contacts, accurate GPS pins, and licensing rights before public publication."
              : "Our editorial team is researching and vetting authentic venues for this category."}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="rounded-xl border border-ghana-border bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-ghana-sand transition"
            >
              Back to All Categories
            </Link>
            <Link
              href="/admin"
              className="rounded-xl bg-ghana-green px-4 py-2 text-sm font-semibold text-white hover:bg-ghana-greenDark transition"
            >
              Review in Admin
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

