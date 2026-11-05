import Link from "next/link";
import { DatabaseRepository } from "@/lib/db";
import {
  Sparkles,
  Play,
  ArrowRight,
  ShieldCheck,
  Compass,
  MapPin,
  CheckCircle2,
} from "lucide-react";

interface LandingPageProps {
  searchParams?: { c?: string };
}

export default function LandingPage({ searchParams }: LandingPageProps) {
  const code = searchParams?.c || "";
  const campaign = code ? DatabaseRepository.getCampaign(code) : null;

  // Track scan if campaign exists
  if (campaign) {
    DatabaseRepository.recordCampaignScan(campaign.code);
  }

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-b from-ghana-sand/90 via-ghana-surface to-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl text-center space-y-8">
        {/* Partner / Stand Placement Badge */}
        {campaign ? (
          <div className="inline-flex items-center gap-2 rounded-full border border-ghana-border bg-white px-4 py-1.5 text-xs font-semibold text-neutral-800 shadow-sm">
            <MapPin className="h-4 w-4 text-ghana-gold" />
            <span>Welcome from {campaign.partnerName}</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 rounded-full border border-ghana-border bg-white px-4 py-1.5 text-xs font-semibold text-neutral-700 shadow-sm">
            <Sparkles className="h-4 w-4 text-ghana-gold" />
            <span>Official Tourism QR Discovery Stand</span>
          </div>
        )}

        {/* Main Value Proposition */}
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-ghana-dark sm:text-5xl">
            Welcome to <span className="text-ghana-gold">Ghana</span>
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-lg mx-auto">
            Your independent, curated travel guide. Explore verified destinations, historic
            heritage, pristine eco-tourism, local culinary hotspots, and reliable transport—without
            needing a tour operator.
          </p>
        </div>

        {/* Optional Promo Video section if configured */}
        {campaign?.promoVideoUrl && (
          <div className="overflow-hidden rounded-2xl border border-ghana-border bg-black shadow-lg">
            <div className="aspect-video w-full">
              <iframe
                src={campaign.promoVideoUrl}
                title="Ghana Tourism Video Introduction"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
            <div className="bg-neutral-900 p-2 text-xs text-neutral-300">
              <span>Ghana Tourism Video Overview</span>
            </div>
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href={campaign?.targetRoute || "/"}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-ghana-green px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-ghana-greenDark focus:outline-none"
          >
            <Compass className="h-5 w-5 text-ghana-gold" />
            <span>Explore Curated Guide</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/getting-around"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-ghana-border bg-white px-6 py-3.5 text-base font-semibold text-neutral-800 shadow-sm hover:bg-ghana-sand transition"
          >
            <span>Getting Around & Rentals</span>
          </Link>
        </div>

        {/* Stand context & zero-friction reassurance */}
        <div className="rounded-2xl border border-ghana-border/80 bg-white/70 p-4 text-left text-xs text-neutral-600 shadow-sm space-y-2">
          <div className="flex items-center gap-2 font-semibold text-neutral-900">
            <ShieldCheck className="h-4 w-4 text-ghana-green" />
            <span>Zero install required · No account or payment needed</span>
          </div>
          <p className="leading-relaxed">
            You are browsing directly via our lightweight web app. No app store download,
            passwords, or personal data collection required.
          </p>
          {campaign && (
            <p className="text-[11px] text-neutral-400">
              Attribution code: <code className="font-mono">{campaign.code}</code> ({campaign.placement})
            </p>
          )}
        </div>

        {/* Privacy Link */}
        <div className="text-xs text-neutral-400">
          <Link href="/privacy" className="hover:underline">
            Privacy Notice & Minimal Data Collection Policy
          </Link>
        </div>
      </div>
    </div>
  );
}

