import Link from "next/link";
import Image from "next/image";
import { Destination } from "@/types";
import { MapPin, Phone, Compass, ShieldCheck } from "lucide-react";

export function DestinationCard({ destination }: { destination: Destination }) {
  const primaryPhone = destination.contacts.find(
    (c) => c.type === "phone" && c.isPrimary
  ) || destination.contacts.find((c) => c.type === "phone");

  const heroMedia = destination.media?.[0];

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-ghana-border/70 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-ghana-gold/50 hover:shadow-md">
      {/* Media Image container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
        {heroMedia ? (
          <img
            src={heroMedia.url}
            alt={heroMedia.altText || destination.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-ghana-sand/60 text-ghana-green">
            <Compass className="h-10 w-10 opacity-40" />
          </div>
        )}

        {/* Locality badge */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
          <MapPin className="h-3 w-3 text-ghana-gold" />
          <span>{destination.locality}</span>
        </div>

        {/* Verification badge */}
        {destination.verificationStatus === "fully_verified" && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-ghana-green/90 px-2 py-0.5 text-[11px] font-semibold text-white shadow-sm backdrop-blur-sm">
            <ShieldCheck className="h-3 w-3 text-ghana-gold" />
            <span>Verified</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-amber-800">
            {destination.region}
          </span>
          {destination.secondaryTags?.[0] && (
            <>
              <span className="text-neutral-300">•</span>
              <span className="text-xs text-neutral-500">
                {destination.secondaryTags[0]}
              </span>
            </>
          )}
        </div>

        <h3 className="mt-1.5 text-lg font-bold text-neutral-900 group-hover:text-ghana-greenDark">
          <Link href={`/places/${destination.slug}`} className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            {destination.name}
          </Link>
        </h3>

        <p className="mt-2 flex-1 text-sm text-neutral-600 line-clamp-2 leading-relaxed">
          {destination.summary}
        </p>

        {/* Contact & Map Actions Info */}
        <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 text-xs text-neutral-500">
          <div className="flex items-center gap-1 text-ghana-green">
            <MapPin className="h-3.5 w-3.5 text-ghana-gold" />
            <span>{destination.latitude ? "Map directions available" : destination.locality}</span>
          </div>

          {primaryPhone && primaryPhone.verificationStatus === "verified" ? (
            <span className="flex items-center gap-1 font-medium text-neutral-700">
              <Phone className="h-3 w-3 text-ghana-green" />
              <span>Verified Contact</span>
            </span>
          ) : (
            <span className="text-neutral-400">View profile</span>
          )}
        </div>
      </div>
    </article>
  );
}

