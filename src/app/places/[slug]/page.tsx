import { notFound } from "next/navigation";
import Link from "next/link";
import { DatabaseRepository } from "@/lib/db";
import {
  MapPin,
  Phone,
  ExternalLink,
  ShieldCheck,
  ArrowLeft,
  Compass,
  Clock,
  BookOpen,
  Info,
  AlertCircle,
} from "lucide-react";

interface PlaceDetailPageProps {
  params: { slug: string };
  searchParams?: { preview?: string };
}

export default function PlaceDetailPage({ params, searchParams }: PlaceDetailPageProps) {
  const allowDraft = searchParams?.preview === "true";
  const destination = DatabaseRepository.getDestinationBySlug(params.slug, {
    allowDraft,
  });

  if (!destination) {
    notFound();
  }

  const category = DatabaseRepository.getCategoryBySlug(
    destination.primaryCategoryId.replace("cat-", "")
  ) || DatabaseRepository.getCategories().find((c) => c.id === destination.primaryCategoryId);

  // Verified primary phone
  const primaryPhone = destination.contacts.find(
    (c) => c.type === "phone" && c.isPrimary
  ) || destination.contacts.find((c) => c.type === "phone");

  // Google Maps directions URL
  const googleMapsUrl = destination.latitude && destination.longitude
    ? `https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}`
    : destination.address
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination.address)}`
    : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-10 pb-24">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <Link href="/" className="hover:text-ghana-green inline-flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
          {category && (
            <>
              <span>/</span>
              <Link
                href={`/category/${category.slug}`}
                className="hover:text-ghana-green"
              >
                {category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="font-semibold text-neutral-800 truncate max-w-xs">
            {destination.name}
          </span>
        </div>

        {/* Status Preview pill if viewing draft */}
        {destination.status !== "published" && (
          <div className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-300">
            Preview Mode: {destination.status.toUpperCase()}
          </div>
        )}
      </div>

      {/* Main Header */}
      <div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="rounded-full bg-ghana-sand px-3 py-1 text-ghana-greenDark">
            {destination.region}
          </span>
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-neutral-700">
            {destination.locality}
          </span>
          {destination.verificationStatus === "fully_verified" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Verified Entry</span>
            </span>
          )}
        </div>

        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
          {destination.name}
        </h1>

        <p className="mt-3 text-lg text-neutral-600 leading-relaxed max-w-3xl">
          {destination.summary}
        </p>
      </div>

      {/* Hero Media & Image Rights Credit */}
      {destination.media?.[0] ? (
        <div className="overflow-hidden rounded-3xl border border-ghana-border bg-neutral-100 shadow-md">
          <div className="relative aspect-[16/9] w-full">
            <img
              src={destination.media[0].url}
              alt={destination.media[0].altText}
              className="h-full w-full object-cover"
            />
          </div>
          {destination.media[0].caption && (
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-ghana-border/60 bg-white px-4 py-2 text-xs text-neutral-500">
              <span>{destination.media[0].caption}</span>
              {destination.media[0].credit && (
                <span className="text-[11px] text-neutral-400">
                  Credit: {destination.media[0].credit}
                </span>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex aspect-[21/9] w-full items-center justify-center rounded-3xl border border-ghana-border bg-ghana-sand/40 text-neutral-400">
          <Compass className="h-12 w-12 opacity-30" />
        </div>
      )}

      {/* Content & Action Bar Grid */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Left Column: Context, History, and Narrative */}
        <div className="lg:col-span-2 space-y-8">
          {/* Detailed Overview */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-neutral-900">About this Destination</h2>
            <div className="prose prose-neutral max-w-none text-neutral-700 leading-relaxed text-base space-y-4">
              <p>{destination.description}</p>
            </div>
          </section>

          {/* Cultural & Historical Context (PRD Section 6 requirement) */}
          {destination.culturalHistory && (
            <section className="rounded-2xl border border-ghana-border bg-gradient-to-br from-amber-50/50 via-white to-ghana-sand/40 p-6 sm:p-7">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-lg">
                <BookOpen className="h-5 w-5 text-ghana-gold" />
                <h2>Cultural & Historical Context</h2>
              </div>
              <p className="mt-3 text-neutral-700 leading-relaxed text-sm sm:text-base">
                {destination.culturalHistory}
              </p>
            </section>
          )}

          {/* Tags */}
          {destination.secondaryTags?.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Highlights & Features
              </h3>
              <div className="flex flex-wrap gap-2">
                {destination.secondaryTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-xl border border-ghana-border bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 shadow-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Editorial Source Attribution */}
          <div className="border-t border-ghana-border/60 pt-4 text-xs text-neutral-400 flex items-center gap-2">
            <Info className="h-4 w-4 text-neutral-400" />
            <span>Editorial source: {destination.source}</span>
          </div>
        </div>

        {/* Right Column: Verified Actions & Practical Information */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-ghana-border bg-white p-6 shadow-sm space-y-6 sticky top-24">
            <h2 className="text-lg font-bold text-neutral-900">Practical Actions</h2>

            {/* Address & Locality */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Location
              </span>
              <p className="text-sm font-medium text-neutral-800">
                {destination.address || destination.locality}
              </p>
              <p className="text-xs text-neutral-500">{destination.region}, Ghana</p>
            </div>

            {/* Action 1: External Directions */}
            <div>
              {googleMapsUrl ? (
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-ghana-green px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-ghana-greenDark focus:outline-none"
                >
                  <MapPin className="h-4 w-4 text-ghana-gold" />
                  <span>Get Directions (Google Maps)</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                </a>
              ) : (
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-500">
                  <div className="flex items-center gap-1.5 font-medium text-neutral-700">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>Exact Map Pin Pending</span>
                  </div>
                  <p className="mt-1">
                    GPS coordinates are currently undergoing verification. Please refer to the
                    locality description.
                  </p>
                </div>
              )}
            </div>

            {/* Action 2: Direct Verified Phone Contact */}
            <div className="space-y-2 border-t border-neutral-100 pt-4">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Direct Contact
              </span>

              {destination.contacts.length > 0 ? (
                <div className="space-y-2">
                  {destination.contacts.map((contact) => (
                    <div key={contact.id}>
                      {contact.type === "phone" ? (
                        <a
                          href={`tel:${contact.normalizedValue || contact.value}`}
                          className="flex items-center justify-between rounded-xl border border-ghana-border bg-ghana-sand/40 px-3.5 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-ghana-sand hover:border-ghana-gold"
                        >
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-ghana-green" />
                            <div>
                              <p className="text-xs text-neutral-500">{contact.label}</p>
                              <p className="font-semibold">{contact.value}</p>
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-ghana-green">Call</span>
                        </a>
                      ) : (
                        <a
                          href={contact.value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between rounded-xl border border-ghana-border px-3.5 py-2 text-xs text-neutral-700 hover:bg-neutral-50"
                        >
                          <span>{contact.label}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-400 italic">
                  No verified phone numbers listed yet.
                </p>
              )}
            </div>

            {/* Transparency & Disclaimer Box */}
            <div className="rounded-xl border border-amber-200/80 bg-amber-50/60 p-3 text-[11px] text-amber-900 leading-relaxed">
              <p className="font-semibold">Direct Arrangement</p>
              <p className="mt-1">
                Call to enquire or book directly with the provider. Best of Ghana does not take
                booking commissions, hold ticket inventory, or intermediate customer transactions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

