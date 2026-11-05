import { notFound } from "next/navigation";
import Link from "next/link";
import { DatabaseRepository } from "@/lib/db";
import { ArrowLeft, MapPin, Car, Phone, Navigation, ShieldCheck, Clock, Share2 } from "lucide-react";

interface PlaceDetailPageProps {
  params: { slug: string };
  searchParams?: { preview?: string };
}

export default function PlaceDetailPage({ params, searchParams }: PlaceDetailPageProps) {
  const allowDraft = true; // Support browsing all curated candidates
  const destination = DatabaseRepository.getDestinationBySlug(params.slug, {
    allowDraft,
  });

  if (!destination) {
    notFound();
  }

  const category = DatabaseRepository.getCategories().find(
    (c) => c.id === destination.primaryCategoryId
  ) || { slug: "cultural-and-historical", name: "Cultural & Historical" };

  // Category color mapping
  const categoryColors: Record<string, string> = {
    "cultural-and-historical": "#8A3B12",
    nightlife: "#5B2A86",
    resorts: "#0F5C3A",
    "eco-tourism": "#2F6B1F",
    restaurants: "#C2410C",
    "recreational-centres-and-activities": "#1D5FA8",
  };

  const themeColor = categoryColors[category.slug] || "#C2410C";

  // Google Maps directions
  const mapDestination = destination.address || `${destination.name}, ${destination.locality}, Ghana`;
  const googleMapsUrl = destination.latitude && destination.longitude
    ? `https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapDestination)}`;

  // Uber deep link
  const uberUrl = `https://m.uber.com/ul/?action=setPref&dropoff[nickname]=${encodeURIComponent(
    destination.name
  )}&dropoff[formatted_address]=${encodeURIComponent(mapDestination)}`;

  // Contact phones
  const phones = destination.contacts.filter((c) => c.type === "phone");

  return (
    <div className="flex flex-col gap-6">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href={`/category/${category.slug}`}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] hover:border-[var(--acc)] transition"
            aria-label="Back to category"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-[var(--grn)]">
            <span>{category.name.toUpperCase()}</span>
            {destination.secondaryTags?.[0] && (
              <>
                <span className="text-[var(--mut)]">·</span>
                <span>{destination.secondaryTags[0].toUpperCase()}</span>
              </>
            )}
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--grn)]/10 px-2.5 py-1 text-xs font-bold text-[var(--grn)]">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Verified Destination</span>
        </span>
      </div>

      {/* Main Responsive Grid Layout (Desktop: 2 columns, Mobile: 1 column) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column (Content & Photos) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          {/* Hero Photo Banner */}
          <div className="relative h-[220px] sm:h-[320px] md:h-[400px] w-full overflow-hidden rounded-2xl md:rounded-3xl border border-[var(--line)] bg-stone-200 shadow-sm">
            {destination.media?.[0]?.url && (
              <img
                src={destination.media[0].url}
                alt={destination.media[0].altText || destination.name}
                className="h-full w-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-xs uppercase tracking-wider font-semibold opacity-90">
                {destination.locality}, {destination.region}
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mt-0.5">
                {destination.name}
              </h1>
            </div>
          </div>

          {/* About Section */}
          <div className="rounded-2xl md:rounded-3xl border border-[var(--line)] bg-[var(--card)] p-5 md:p-8 flex flex-col gap-4 shadow-sm">
            <h2 className="text-lg md:text-xl font-bold text-[var(--ink)]">
              About this destination
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-[var(--ink)]/90">
              {destination.description || destination.summary}
            </p>

            {destination.culturalHistory && (
              <div className="mt-2 pt-4 border-t border-[var(--line)]">
                <h3 className="text-sm md:text-base font-bold text-[var(--ink)] mb-2">
                  Cultural &amp; Historical Significance
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-[var(--mut)]">
                  {destination.culturalHistory}
                </p>
              </div>
            )}

            {/* Address and details */}
            <div className="mt-2 pt-4 border-t border-[var(--line)] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs md:text-sm">
              <div>
                <b className="text-[var(--ink)]">Location &amp; Address:</b>
                <p className="text-[var(--mut)] mt-0.5">
                  {destination.address || `${destination.locality}, ${destination.region}, Ghana`}
                </p>
              </div>
              <div>
                <b className="text-[var(--ink)]">Recommended visit:</b>
                <p className="text-[var(--mut)] mt-0.5">
                  Call ahead to confirm today&apos;s visiting hours, tour guides, and table reservations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Sticky Actions & Booking Sidebar on Desktop) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4 lg:sticky lg:top-24">
          {/* Distance and Route Explainer Card */}
          <div className="rounded-2xl md:rounded-3xl border border-[var(--line)] bg-[var(--card)] p-5 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--grn)]/10 text-[var(--grn)]">
                <Navigation className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[var(--ink)]">Distance and route</h2>
                <p className="text-xs text-[var(--mut)]">Instant GPS navigation</p>
              </div>
            </div>
            <p className="text-xs md:text-sm leading-relaxed text-[var(--mut)]">
              Tap <b>Get directions</b> to launch Google Maps with live travel time and turn-by-turn routing from your current location in Ghana.
            </p>
          </div>

          {/* Action Buttons: Directions & Uber */}
          <div className="flex flex-col gap-2.5">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-[52px] items-center justify-center gap-2.5 rounded-[16px] bg-[var(--grn)] px-4 text-sm md:text-base font-bold text-white shadow-sm transition hover:bg-[var(--grn-hover)] active:scale-[0.98]"
            >
              <MapPin className="h-5 w-5" />
              <span>Get directions in Google Maps</span>
            </a>

            <a
              href={uberUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-[52px] items-center justify-center gap-2.5 rounded-[16px] border-2 border-[var(--ink)] bg-[var(--card)] px-4 text-sm md:text-base font-bold text-[var(--ink)] transition hover:bg-[var(--line)]/40 active:scale-[0.98]"
            >
              <Car className="h-5 w-5" />
              <span>Order an Uber here</span>
            </a>
          </div>

          {/* Contact and Direct Calling Section */}
          <div className="rounded-2xl md:rounded-3xl border border-[var(--line)] bg-[var(--card)] p-5 flex flex-col gap-3 shadow-sm">
            <h2 className="text-base font-bold text-[var(--ink)]">Contact and booking</h2>
            <p className="text-xs text-[var(--mut)]">
              Direct official dialer. Speak directly with the front desk, reservation team, or site guides.
            </p>

            <div className="flex flex-col gap-2 pt-1">
              {phones.length > 0 ? (
                phones.map((phone) => {
                  const cleanTel = phone.normalizedValue || phone.value.replace(/[^+\d]/g, "");
                  return (
                    <a
                      key={phone.id}
                      href={`tel:${cleanTel}`}
                      className="flex h-[50px] items-center justify-center gap-2.5 rounded-[14px] bg-[var(--acc)] px-4 text-sm md:text-base font-bold text-white shadow-sm transition hover:bg-[var(--acc-hover)] active:scale-[0.98]"
                    >
                      <Phone className="h-4 w-4" />
                      <span>Call {phone.value}</span>
                    </a>
                  );
                })
              ) : (
                <div className="flex h-[50px] items-center justify-center rounded-[14px] bg-[var(--line)] text-sm font-semibold text-[var(--mut)]">
                  No direct phone listed
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
