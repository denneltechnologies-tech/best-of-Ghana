"use client";

import { useState } from "react";
import Link from "next/link";
import { Car, Compass, ArrowLeft, ExternalLink } from "lucide-react";

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
          Book an Uber
        </h1>
      </div>

      <p className="text-sm leading-relaxed text-[var(--mut)]">
        Enter where you want to go and the Uber app opens with your destination filled in.
      </p>

      {/* Destination Form */}
      <form onSubmit={handleOpenUber} className="flex flex-col gap-3">
        <input
          id="q"
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Where to? e.g. Labadi Beach Hotel"
          aria-label="Destination"
          className="h-[48px] rounded-[13px] border-[1.5px] border-[var(--line)] bg-[var(--card)] px-3.5 text-[15px] text-[var(--ink)] placeholder-[var(--mut)] outline-none focus:border-[var(--acc)]"
        />

        <button
          type="submit"
          className="flex h-[46px] items-center justify-center gap-2 rounded-[13px] bg-[var(--acc)] px-3 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--acc-hover)] active:scale-[0.98]"
        >
          <Car className="h-4 w-4" />
          <span>Open Uber</span>
          <ExternalLink className="h-3.5 w-3.5 opacity-80" />
        </button>
      </form>

      <p className="text-sm text-[var(--mut)] pt-1">
        Or pick a destination from any listing and tap &ldquo;Order an Uber here&rdquo;.
      </p>

      {/* Suggested Destination Shortcuts */}
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 flex flex-col gap-2 mt-2">
        <h2 className="text-sm font-bold text-[var(--ink)]">Popular Drop-off Destinations</h2>
        <div className="flex flex-col divide-y divide-[var(--line)]/60 text-sm">
          {[
            "Labadi Beach Hotel",
            "Kwame Nkrumah Memorial Park",
            "Kotoka International Airport Terminal 3",
            "Skybar 25, Airport Residential",
            "Bloom Bar, Osu",
            "Cape Coast Castle",
          ].map((place) => (
            <button
              key={place}
              type="button"
              onClick={() => {
                setDestination(place);
                const url = `https://m.uber.com/ul/?action=setPref&dropoff[nickname]=${encodeURIComponent(
                  place
                )}&dropoff[formatted_address]=${encodeURIComponent(place + ", Ghana")}`;
                window.open(url, "_blank", "noopener,noreferrer");
              }}
              className="flex items-center justify-between py-2.5 text-left text-[var(--ink)] hover:text-[var(--acc)]"
            >
              <span>{place}</span>
              <span className="text-xs text-[var(--acc)] font-bold">Ride &rarr;</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

