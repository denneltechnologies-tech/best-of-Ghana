import Link from "next/link";
import { DatabaseRepository } from "@/lib/db";
import { ArrowLeft, Phone, Car, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function RentalsPage() {
  const providers = DatabaseRepository.getProviders({ status: "all", type: "rental" });

  return (
    <div className="flex flex-col gap-6">
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
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--acc)]">
            Verified Private Transport
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--ink)]">
            Vehicle &amp; Chauffeur Rentals
          </h1>
          <span className="text-xs md:text-sm font-semibold text-[var(--mut)]">
            {providers.length} verified agencies
          </span>
        </div>

        <p className="text-sm md:text-base leading-relaxed text-[var(--mut)] max-w-3xl">
          Verified car rental agencies with chauffeur-driven fleets. Perfect for long-distance travel, day tours across Central and Volta regions, or safari expeditions to Mole National Park. Call directly to book.
        </p>
      </div>

      {/* Rental Companies Grid (Responsive: 1 col on mobile, 2 cols on tablet & desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {providers.map((provider) => {
          const primaryPhone =
            provider.contacts.find((c) => c.type === "phone" && c.isPrimary) ||
            provider.contacts.find((c) => c.type === "phone");

          const cleanTel = primaryPhone?.value.replace(/[^+\d]/g, "") || "";

          return (
            <div
              key={provider.id}
              className="group flex flex-col justify-between rounded-2xl md:rounded-3xl border border-[var(--line)] bg-[var(--card)] p-5 md:p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col gap-4">
                {/* Header row: avatar + name */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-[var(--acc)]/10 text-base font-extrabold text-[var(--acc)] border border-[var(--acc)]/20">
                      {provider.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-lg md:text-xl font-bold text-[var(--ink)] group-hover:text-[var(--acc)] transition">
                        {provider.name}
                      </h2>
                      <div className="flex items-center gap-1 text-xs text-[var(--grn)] font-semibold mt-0.5">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Licensed Operator</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-[var(--mut)] leading-relaxed">
                  {provider.description}
                </p>

                {/* Fleet badges */}
                <div className="flex flex-wrap gap-1.5">
                  {provider.vehicleTypes.map((v) => (
                    <span
                      key={v}
                      className="inline-flex items-center gap-1 rounded-lg bg-[var(--bg)] px-2.5 py-1 text-xs font-semibold text-[var(--ink)] border border-[var(--line)]"
                    >
                      <Car className="h-3 w-3 text-[var(--mut)]" />
                      <span>{v}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Call CTA */}
              <div className="mt-5 pt-4 border-t border-[var(--line)] flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <span className="text-[11px] text-[var(--mut)] uppercase tracking-wide">
                    Direct Booking Line
                  </span>
                  <span className="text-sm font-bold text-[var(--ink)]">
                    {primaryPhone ? primaryPhone.value : "Phone on request"}
                  </span>
                </div>

                {primaryPhone ? (
                  <a
                    href={`tel:${cleanTel}`}
                    className="flex h-[46px] items-center justify-center gap-2 rounded-xl bg-[var(--acc)] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--acc-hover)] active:scale-95"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call to Book</span>
                  </a>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
