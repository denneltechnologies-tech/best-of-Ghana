import Link from "next/link";
import { DatabaseRepository } from "@/lib/db";
import { ArrowLeft, Phone, Car } from "lucide-react";

export default function RentalsPage() {
  const providers = DatabaseRepository.getProviders({ status: "all", type: "rental" });

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
          Vehicle rentals
        </h1>
      </div>

      <p className="text-sm leading-relaxed text-[var(--mut)]">
        Rental companies with their vehicles. Call directly to arrange chauffeur-driven minivans, buses, and 4x4 SUVs for regional trips across Ghana.
      </p>

      {/* Rental Companies List matching exact UI format */}
      <div className="flex flex-col gap-3">
        {providers.map((provider) => {
          const primaryPhone =
            provider.contacts.find((c) => c.type === "phone" && c.isPrimary) ||
            provider.contacts.find((c) => c.type === "phone");

          const cleanTel = primaryPhone?.value.replace(/[^+\d]/g, "") || "";
          const vehicleSummary = provider.vehicleTypes.join(", ");

          return (
            <div
              key={provider.id}
              className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-3 shadow-sm"
            >
              {/* Circular Logo placeholder */}
              <div className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-[var(--line)] text-xs font-bold text-[var(--mut)]">
                {provider.name.slice(0, 2).toUpperCase()}
              </div>

              {/* Company Info */}
              <div className="flex-1 min-w-0">
                <h2 className="text-[16px] font-bold text-[var(--ink)] truncate">
                  {provider.name}
                </h2>
                <p className="text-[13px] text-[var(--mut)] line-clamp-2 leading-tight mt-0.5">
                  {vehicleSummary || provider.description}
                </p>
                {primaryPhone && (
                  <p className="text-[12px] font-semibold text-[var(--ink)] mt-1">
                    {primaryPhone.value}
                  </p>
                )}
              </div>

              {/* Call Button */}
              {primaryPhone ? (
                <a
                  href={`tel:${cleanTel}`}
                  className="flex h-[44px] min-w-[70px] flex-none items-center justify-center rounded-[13px] bg-[var(--acc)] px-3 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--acc-hover)] active:scale-[0.98]"
                >
                  Call
                </a>
              ) : (
                <div className="flex h-[44px] min-w-[70px] flex-none items-center justify-center rounded-[13px] bg-[var(--line)] text-xs text-[var(--mut)]">
                  N/A
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

