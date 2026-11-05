import Link from "next/link";
import { DatabaseRepository } from "@/lib/db";
import {
  Car,
  Phone,
  ShieldCheck,
  ExternalLink,
  Navigation,
  Compass,
  AlertTriangle,
  Info,
  CheckCircle2,
} from "lucide-react";

export default function GettingAroundPage() {
  // Get verified providers
  const publishedProviders = DatabaseRepository.getProviders({ status: "published" });
  const allDraftProviders = DatabaseRepository.getProviders({ status: "all" });

  const displayProviders =
    publishedProviders.length > 0 ? publishedProviders : allDraftProviders;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12 pb-24">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-ghana-border bg-ghana-sand px-3 py-1 text-xs font-semibold text-ghana-greenDark">
          <Navigation className="h-3.5 w-3.5 text-ghana-gold" />
          <span>Mobility & Transport Guide</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
          Getting Around Ghana
        </h1>
        <p className="mt-3 text-base text-neutral-600 max-w-3xl leading-relaxed">
          Reliable transport is essential for independent exploration. Discover ride-hailing
          options for city travel, and direct contact numbers for verified minivan charters and
          car rental operators for cross-country journeys.
        </p>
      </div>

      {/* Part 1: Uber External Handoff (FR-11) */}
      <section className="rounded-3xl border border-neutral-900 bg-neutral-950 p-6 sm:p-10 text-white shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-md bg-white/10 px-2.5 py-1 text-xs font-semibold text-ghana-gold">
            <span>Ride-Hailing in Cities</span>
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl text-white">
            Uber & City Transit (Accra & Kumasi)
          </h2>
          <p className="mt-3 text-sm text-neutral-300 leading-relaxed">
            Uber operates widely in metropolitan Accra and Kumasi for daily hops, airport trips, and
            dining outings. You can launch Uber directly on your mobile device.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <a
              href="https://m.uber.com/ul/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-neutral-950 transition hover:bg-neutral-100 shadow-md"
            >
              <span>Open Uber Web / Mobile App</span>
              <ExternalLink className="h-4 w-4" />
            </a>

            <span className="text-xs text-neutral-400">
              Opens external app/website. Best of Ghana does not intermediate rides.
            </span>
          </div>

          <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-900/80 p-4 text-xs text-neutral-400">
            <div className="flex items-center gap-2 font-medium text-amber-400">
              <Info className="h-4 w-4" />
              <span>External Handoff Boundary</span>
            </div>
            <p className="mt-1 leading-relaxed">
              Best of Ghana never simulates ride ordering or collects fare payments. All driver
              dispatch, vehicle tracking, and fare calculations occur independently within the
              official Uber application.
            </p>
          </div>
        </div>
      </section>

      {/* Part 2: Long-Distance Minivan & Vehicle Rental Operators (FR-07) */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            Vehicle & Long-Distance Minivan Rentals
          </h2>
          <p className="mt-1 text-sm text-neutral-600 max-w-2xl">
            For trips beyond Accra—such as Cape Coast, Kakum, Mole National Park, or the Volta
            Region—travellers frequently arrange private minivans or SUVs with seasoned drivers.
          </p>
        </div>

        {/* Disclaimer box */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <AlertTriangle className="h-4 w-4 text-amber-700" />
            <span>Direct Arrangement Notice</span>
          </div>
          <p className="mt-1 leading-relaxed">
            All rental bookings and price negotiations occur directly between you and the transport
            operator. Best of Ghana does not guarantee fleet availability, pricing, insurance, or
            schedules.
          </p>
        </div>

        {/* Provider Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayProviders.map((provider) => {
            const primaryPhone = provider.contacts.find((c) => c.type === "phone" && c.isPrimary) || provider.contacts[0];

            return (
              <div
                key={provider.id}
                className="flex flex-col justify-between rounded-2xl border border-ghana-border bg-white p-6 shadow-sm transition-all hover:border-ghana-gold hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-ghana-sand px-2.5 py-0.5 text-xs font-semibold text-ghana-greenDark">
                      Chauffeur & Rental
                    </span>
                    {provider.verificationStatus === "verified" ? (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        Verification Pending
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 text-lg font-bold text-neutral-900">
                    {provider.name}
                  </h3>

                  <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                    {provider.description}
                  </p>

                  {/* Vehicle Types */}
                  {provider.vehicleTypes?.length > 0 && (
                    <div className="mt-4 space-y-1.5">
                      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Available Fleets:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {provider.vehicleTypes.map((type) => (
                          <span
                            key={type}
                            className="rounded-lg bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-700"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Service Area */}
                  {provider.serviceArea && (
                    <p className="mt-3 text-xs text-neutral-500">
                      <span className="font-semibold text-neutral-700">Coverage:</span>{" "}
                      {provider.serviceArea}
                    </p>
                  )}
                </div>

                {/* Direct Dial Action */}
                <div className="mt-6 border-t border-neutral-100 pt-4">
                  {primaryPhone ? (
                    <a
                      href={`tel:${primaryPhone.normalizedValue || primaryPhone.value}`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-ghana-green px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-ghana-greenDark"
                    >
                      <Phone className="h-4 w-4 text-ghana-gold" />
                      <span>Call {primaryPhone.value}</span>
                    </a>
                  ) : (
                    <span className="block text-center text-xs text-neutral-400">
                      Contact under verification
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

