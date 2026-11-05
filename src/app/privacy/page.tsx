import Link from "next/link";
import { ShieldCheck, Lock, MapPin, EyeOff, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-8 pb-24">
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <Link href="/" className="hover:text-ghana-green inline-flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="font-semibold text-neutral-800">Privacy Notice</span>
      </div>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Privacy by Design & Data Minimization</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
          Privacy Notice & Ethical Data Policy
        </h1>
        <p className="text-sm text-neutral-600">
          Last updated: November 2026 · Grounded in Best of Ghana Product Requirements Document (PRD v1.0)
        </p>
      </div>

      <div className="prose prose-neutral max-w-none text-neutral-700 leading-relaxed space-y-8">
        <section className="rounded-2xl border border-ghana-border bg-white p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-base font-bold text-neutral-900">
            <EyeOff className="h-5 w-5 text-ghana-green" />
            <h2>1. Zero Visitor Accounts & No Personal Profiles</h2>
          </div>
          <p className="text-sm text-neutral-600">
            Best of Ghana operates as an open, accessible public travel directory. We do not require
            or offer visitor registration, user accounts, passwords, or personal profile tracking.
            You can browse all destinations, cultural histories, categories, and transport directories
            without identifying yourself.
          </p>
        </section>

        <section className="rounded-2xl border border-ghana-border bg-white p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-base font-bold text-neutral-900">
            <MapPin className="h-5 w-5 text-ghana-green" />
            <h2>2. Location Data Policy</h2>
          </div>
          <p className="text-sm text-neutral-600">
            Your location is never tracked in the background. If you choose to use an optional
            distance calculation feature, your browser requests permission directly. Any distance
            computed is strictly client-side within your browser and is never stored on our servers
            or transmitted to third parties. Denying location permissions leaves browsing 100% intact.
          </p>
        </section>

        <section className="rounded-2xl border border-ghana-border bg-white p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-base font-bold text-neutral-900">
            <Lock className="h-5 w-5 text-ghana-green" />
            <h2>3. External Actions & Disclaimers</h2>
          </div>
          <p className="text-sm text-neutral-600">
            When you click &ldquo;Call&rdquo; or &ldquo;Directions&rdquo;, your device handles the action
            directly via its telephone dialer or your preferred map application (such as Google Maps).
            Best of Ghana records only anonymous aggregate counter metrics (e.g., &ldquo;Directions
            clicked for Cape Coast Castle&rdquo;) without capturing call contents, caller identity,
            or booking outcomes.
          </p>
          <p className="text-sm text-neutral-600">
            Uber links provide a validated external handoff to Uber's mobile web or native app. We
            never simulate ride placement, inspect your ride history, or collect ride commissions.
          </p>
        </section>

        <section className="rounded-2xl border border-ghana-border bg-white p-6 shadow-sm space-y-3">
          <h2 className="text-base font-bold text-neutral-900">
            4. QR Codes & Campaign Attribution
          </h2>
          <p className="text-sm text-neutral-600">
            QR codes placed at partner stands (such as airport welcome desks and hotel concierges)
            contain opaque placement identifiers. Scanning a QR code registers an aggregate counter
            increment for the specific physical stand to evaluate stand traffic, without personal
            device fingerprinting or ad network cookies.
          </p>
        </section>

        <section className="rounded-2xl border border-ghana-border bg-white p-6 shadow-sm space-y-3">
          <h2 className="text-base font-bold text-neutral-900">
            5. Contact and Reporting Issues
          </h2>
          <p className="text-sm text-neutral-600">
            If you notice inaccurate venue contact details, outdated operating hours, or wish to report
            a content concern, please reach out to the editorial team via the administrative portal.
          </p>
        </section>
      </div>
    </div>
  );
}

