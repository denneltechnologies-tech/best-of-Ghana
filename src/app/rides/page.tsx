"use client";

import { useState } from "react";
import Link from "next/link";
import { Car, ArrowLeft, ExternalLink, MapPin, Navigation, Sparkles } from "lucide-react";

export default function RidesPage() {
  const [destination, setDestination] = useState("");

  const handleOpenUber = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = destination.trim();
    if (!clean) return;

    const url = `https://m.uber.com/ul/?action=setPref&dropoff[nickname]=${encodeURIComponent(
      clean
    )}&dropoff[formatted_address]=${encodeURIComponent(clean + ", Ghana")}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const popularPlaces = [
    { name: "Labadi Beach Hotel", locality: "Labadi, Accra", category: "Beach Resort" },
    { name: "Kwame Nkrumah Memorial Park", locality: "Downtown Accra", category: "Historical Site" },
    { name: "Kotoka International Airport Terminal 3", locality: "Airport City, Accra", category: "Airport" },
    { name: "Skybar 25", locality: "Airport Residential, Accra", category: "Rooftop Lounge" },
    { name: "Bloom Bar", locality: "Osu, Accra", category: "Nightlife" },
    { name: "Cape Coast Castle", locality: "Cape Coast, Central Region", category: "UNESCO Heritage" },
    { name: "Elmina Castle", locality: "Elmina, Central Region", category: "UNESCO Heritage" },
    { name: "Kakum National Park Canopy Walk", locality: "Central Region", category: "Eco-tourism" },
    { name: "Buka Restaurant", locality: "Osu, Accra", category: "African Dining" },
    { name: "Santoku Restaurant", locality: "Airport Residential, Accra", category: "Fine Dining" },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
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
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--grn)]">
            Verified Rides Integration
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--ink)]">
          Book an Uber in Ghana
        </h1>
        <p className="text-sm md:text-base leading-relaxed text-[var(--mut)] max-w-2xl">
          Enter any destination across Greater Accra or Kumasi. Tapping Open Uber launches the Uber app with your destination pre-filled so you get picked up immediately.
        </p>
      </div>

      {/* Destination Form Card */}
      <div className="rounded-2xl md:rounded-3xl border border-[var(--line)] bg-[var(--card)] p-5 md:p-8 shadow-sm">
        <form onSubmit={handleOpenUber} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--mut)]" />
            <input
              id="q"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Where to? e.g. Labadi Beach Hotel or Bloom Bar"
              aria-label="Destination"
              className="h-[54px] w-full rounded-2xl border-[1.5px] border-[var(--line)] bg-[var(--bg)] pl-12 pr-4 text-sm md:text-base text-[var(--ink)] placeholder-[var(--mut)] outline-none focus:border-[var(--acc)] focus:ring-2 focus:ring-[var(--acc)]/20 transition"
            />
          </div>

          <button
            type="submit"
            className="flex h-[54px] items-center justify-center gap-2 rounded-2xl bg-[var(--grn)] px-6 text-sm md:text-base font-bold text-white shadow-sm transition hover:bg-[var(--grn-hover)] active:scale-[0.98]"
          >
            <Car className="h-5 w-5" />
            <span>Open Uber</span>
            <ExternalLink className="h-4 w-4 opacity-80" />
          </button>
        </form>

        <p className="text-xs text-[var(--mut)] mt-3">
          Tip: You can also tap &ldquo;Order an Uber here&rdquo; directly on any listing in Best of Ghana.
        </p>
      </div>

      {/* Suggested Destination Shortcuts (Grid layout) */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[var(--acc)]" />
          <h2 className="text-lg md:text-xl font-bold text-[var(--ink)]">
            Popular Drop-off Destinations
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {popularPlaces.map((place) => (
            <button
              key={place.name}
              type="button"
              onClick={() => {
                setDestination(place.name);
                const url = `https://m.uber.com/ul/?action=setPref&dropoff[nickname]=${encodeURIComponent(
                  place.name
                )}&dropoff[formatted_address]=${encodeURIComponent(place.name + ", Ghana")}`;
                window.open(url, "_blank", "noopener,noreferrer");
              }}
              className="group flex items-center justify-between rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 text-left shadow-sm transition hover:border-[var(--acc)] hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--grn)]/10 text-[var(--grn)] group-hover:bg-[var(--grn)] group-hover:text-white transition">
                  <Navigation className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm md:text-base text-[var(--ink)] group-hover:text-[var(--acc)] transition">
                    {place.name}
                  </h3>
                  <p className="text-xs text-[var(--mut)]">
                    {place.locality} · {place.category}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-[var(--grn)] group-hover:translate-x-1 transition-transform">
                Ride &rarr;
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
