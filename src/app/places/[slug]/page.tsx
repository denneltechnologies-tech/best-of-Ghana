import { notFound } from "next/navigation";
import Link from "next/link";
import { DatabaseRepository } from "@/lib/db";
import { ArrowLeft, MapPin, Car, Phone } from "lucide-react";

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
    <div className="flex flex-col gap-3.5 pb-6">
      {/* Top Navigation Row */}
      <div className="flex items-center gap-2 -ml-2">
        <Link
          href={`/category/${category.slug}`}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-[var(--ink)] hover:bg-[var(--card)]"
          aria-label="Back to category"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="text-xs font-bold tracking-wider uppercase text-[var(--grn)]">
          {category.name.toUpperCase()}
          {destination.secondaryTags?.[0] && ` · ${destination.secondaryTags[0].toUpperCase()}`}
        </span>
      </div>

      {/* Photo Banner Card */}
      <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--card)] shadow-sm">
        <div
          style={{ backgroundColor: themeColor }}
          className="relative h-[170px] w-full flex items-end p-3 text-sm font-bold text-white overflow-hidden"
        >
          {destination.media?.[0]?.url && (
            <img
              src={destination.media[0].url}
              alt={destination.media[0].altText || destination.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <span className="relative z-10">{destination.name}</span>
        </div>
      </div>

      {/* Destination Title & Location */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--ink)]">
          {destination.name}
        </h1>
        <p className="mt-1 text-sm text-[var(--mut)]">
          <b>Location:</b> {destination.locality}, {destination.region}
        </p>
      </div>

      {/* About Section */}
      <div className="flex flex-col gap-1.5">
        <h2 className="text-base font-bold text-[var(--ink)]">About</h2>
        <p className="text-sm leading-relaxed text-[var(--mut)]">
          {destination.description || destination.summary}
        </p>
        {destination.culturalHistory && (
          <p className="text-sm leading-relaxed text-[var(--mut)] mt-1">
            {destination.culturalHistory}
          </p>
        )}
      </div>

      {/* Distance and Route Explainer Card */}
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-3.5 flex flex-col gap-1 shadow-sm">
        <h2 className="text-base font-bold text-[var(--ink)]">Distance and route</h2>
        <p className="text-sm leading-relaxed text-[var(--mut)]">
          Tap Get directions to open Google Maps with the route, distance and travel time from where you are.
        </p>
      </div>

      {/* Direction & Uber Action Buttons */}
      <div className="flex flex-col gap-2 pt-1">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-[46px] items-center justify-center gap-2 rounded-[13px] bg-[var(--grn)] px-3 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--grn-hover)] active:scale-[0.98]"
        >
          <MapPin className="h-4 w-4" />
          <span>Get directions</span>
        </a>

        <a
          href={uberUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-[46px] items-center justify-center gap-2 rounded-[13px] border-[1.5px] border-[var(--ink)] bg-transparent px-3 text-sm font-bold text-[var(--ink)] transition hover:bg-[var(--card)] active:scale-[0.98]"
        >
          <Car className="h-4 w-4" />
          <span>Order an Uber here</span>
        </a>
      </div>

      {/* Contact and Booking Section */}
      <div className="flex flex-col gap-2 pt-2">
        <h2 className="text-base font-bold text-[var(--ink)]">Contact and booking</h2>
        {phones.length > 0 ? (
          phones.map((phone) => {
            const cleanTel = phone.normalizedValue || phone.value.replace(/[^+\d]/g, "");
            return (
              <a
                key={phone.id}
                href={`tel:${cleanTel}`}
                className="flex h-[46px] items-center justify-center gap-2 rounded-[13px] bg-[var(--acc)] px-3 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--acc-hover)] active:scale-[0.98]"
              >
                <Phone className="h-4 w-4" />
                <span>Call &amp; book · {phone.value}</span>
              </a>
            );
          })
        ) : (
          <div className="flex h-[46px] items-center justify-center rounded-[13px] bg-[var(--line)] text-sm font-bold text-[var(--mut)]">
            No phone number listed
          </div>
        )}
      </div>
    </div>
  );
}
