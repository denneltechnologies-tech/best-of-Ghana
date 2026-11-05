"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Destination, Provider, Campaign, AuditEvent, PublicationStatus, VerificationStatus } from "@/types";
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Eye,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
  Plus,
  ArrowRight,
  Sparkles,
  MapPin,
  QrCode,
  FileText,
  Clock,
  AlertTriangle,
} from "lucide-react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState<"destinations" | "providers" | "campaigns" | "audit">("destinations");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Edit / Review modal state
  const [editingDest, setEditingDest] = useState<Destination | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Simple session authentication check
  useEffect(() => {
    const auth = sessionStorage.getItem("admin_authenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "ghana2026" || passcode === "admin") {
      sessionStorage.setItem("admin_authenticated", "true");
      setIsAuthenticated(true);
      setLoginError("");
      fetchData();
    } else {
      setLoginError("Invalid editorial passcode. Hint: Use 'ghana2026'");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    setIsAuthenticated(false);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/destinations?status=all");
      const data = await res.json();
      if (data.success) {
        setDestinations(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishToggle = async (dest: Destination) => {
    setMessage(null);
    const newStatus: PublicationStatus = dest.status === "published" ? "draft" : "published";

    // If publishing, ensure verificationStatus is updated
    const updates: Partial<Destination> = {
      status: newStatus,
    };

    if (newStatus === "published" && dest.verificationStatus === "unverified") {
      // Prompt user or open modal
      setEditingDest(dest);
      setValidationErrors([
        "FR-10 Requirement: Verification status must be updated from 'unverified' prior to publishing.",
      ]);
      return;
    }

    try {
      const res = await fetch(`/api/destinations/${dest.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actor: "editorial_lead",
          updates,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: resData.error || "Failed to update status." });
      } else {
        setMessage({
          type: "success",
          text: `"${dest.name}" is now ${newStatus.toUpperCase()}`,
        });
        fetchData();
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDest) return;

    try {
      const res = await fetch(`/api/destinations/${editingDest.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actor: "editorial_staff",
          updates: editingDest,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        setValidationErrors([resData.error || "Update rejected"]);
      } else {
        setEditingDest(null);
        setValidationErrors([]);
        setMessage({ type: "success", text: `Saved "${editingDest.name}" successfully.` });
        fetchData();
      }
    } catch (err: any) {
      setValidationErrors([err.message]);
    }
  };

  const handleBootstrapSample = async (action: "publish_sample" | "reset_seed") => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/bootstrap-sample", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: data.message });
        fetchData();
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  // If unauthenticated, render secure login gate
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-ghana-border bg-white p-8 shadow-xl">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-ghana-green text-ghana-gold shadow-md">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-neutral-900">
              Staff Editorial Admin
            </h1>
            <p className="mt-2 text-xs text-neutral-600">
              PRD Requirement FR-09: Unauthenticated edits are blocked. Restricted to authorized
              editorial reviewers.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="passcode"
                className="block text-xs font-semibold uppercase tracking-wider text-neutral-700"
              >
                Editorial Passcode
              </label>
              <input
                id="passcode"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter editorial passcode (hint: ghana2026)"
                className="mt-1.5 w-full rounded-xl border border-ghana-border px-3.5 py-2.5 text-sm focus:border-ghana-gold focus:outline-none focus:ring-1 focus:ring-ghana-gold"
                autoFocus
              />
            </div>

            {loginError && (
              <p className="text-xs font-semibold text-rose-600">{loginError}</p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-ghana-green py-2.5 text-sm font-bold text-white shadow-sm hover:bg-ghana-greenDark transition"
            >
              Sign In to Admin
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-neutral-500 hover:text-neutral-900">
              Return to Public Guide
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Statistics
  const totalDestinations = destinations.length;
  const publishedCount = destinations.filter((d) => d.status === "published").length;
  const draftCount = destinations.filter((d) => d.status === "draft").length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 pb-24">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ghana-border/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Authorized Reviewer Session Active</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-neutral-900 sm:text-3xl">
            Editorial Content Control
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleBootstrapSample("publish_sample")}
            className="rounded-xl bg-ghana-gold px-3.5 py-2 text-xs font-bold text-neutral-900 shadow-sm hover:bg-ghana-goldHover transition"
            title="Publishes verified sample items across all 6 categories"
          >
            Publish Verified Sample
          </button>
          <button
            onClick={() => handleBootstrapSample("reset_seed")}
            className="rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition"
            title="Resets database to all unverified drafts per raw concept presentation"
          >
            Reset to Draft Seed
          </button>
          <button
            onClick={handleLogout}
            className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Status banner */}
      {message && (
        <div
          className={`rounded-2xl p-4 text-sm font-medium ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-ghana-border bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Total Candidates
          </p>
          <p className="mt-2 text-3xl font-extrabold text-neutral-900">{totalDestinations}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
            Published Live
          </p>
          <p className="mt-2 text-3xl font-extrabold text-emerald-900">{publishedCount}</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">
            In Verification Draft
          </p>
          <p className="mt-2 text-3xl font-extrabold text-amber-900">{draftCount}</p>
        </div>
        <div className="rounded-2xl border border-ghana-border bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Active QR Stands
          </p>
          <p className="mt-2 text-3xl font-extrabold text-ghana-green">3</p>
        </div>
      </div>

      {/* Content Table */}
      <div className="overflow-hidden rounded-3xl border border-ghana-border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-ghana-border bg-ghana-sand/30 p-4">
          <h2 className="text-base font-bold text-neutral-900">
            Candidate Destinations & Verification Pipeline
          </h2>
          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-900"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-700">
            <thead className="bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="px-4 py-3">Destination</th>
                <th className="px-4 py-3">Locality</th>
                <th className="px-4 py-3">Verification</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {destinations.map((dest) => (
                <tr key={dest.id} className="hover:bg-neutral-50/70 transition">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-neutral-900">{dest.name}</p>
                    <p className="text-xs text-neutral-500 truncate max-w-xs">{dest.summary}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-600">{dest.locality}</td>
                  <td className="px-4 py-3 text-xs">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${
                        dest.verificationStatus === "fully_verified"
                          ? "bg-emerald-100 text-emerald-800"
                          : dest.verificationStatus === "phone_verified"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {dest.verificationStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 font-semibold ${
                        dest.status === "published"
                          ? "bg-emerald-600 text-white"
                          : "bg-neutral-200 text-neutral-800"
                      }`}
                    >
                      {dest.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-500 truncate max-w-[140px]">
                    {dest.source}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Link
                      href={`/places/${dest.slug}?preview=true`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs text-neutral-600 hover:text-neutral-900"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Preview</span>
                    </Link>

                    <button
                      onClick={() => {
                        setEditingDest(dest);
                        setValidationErrors([]);
                      }}
                      className="rounded-lg border border-ghana-border bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-ghana-sand"
                    >
                      Edit & Verify
                    </button>

                    <button
                      onClick={() => handlePublishToggle(dest)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                        dest.status === "published"
                          ? "border border-rose-300 text-rose-700 hover:bg-rose-50"
                          : "bg-ghana-green text-white hover:bg-ghana-greenDark"
                      }`}
                    >
                      {dest.status === "published" ? "Unpublish" : "Publish"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Review Modal Drawer */}
      {editingDest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-ghana-border bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-ghana-border pb-4">
              <h2 className="text-xl font-bold text-neutral-900">
                Editorial Review: {editingDest.name}
              </h2>
              <button
                onClick={() => setEditingDest(null)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                ✕
              </button>
            </div>

            {/* Validation errors */}
            {validationErrors.length > 0 && (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4" />
                  <span>PRD Gate FR-10 Validation Requirement:</span>
                </div>
                {validationErrors.map((err, i) => (
                  <p key={i}>• {err}</p>
                ))}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="mt-6 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase">
                  Name / Title (Required)
                </label>
                <input
                  type="text"
                  value={editingDest.name}
                  onChange={(e) =>
                    setEditingDest({ ...editingDest, name: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-ghana-border p-2.5 focus:border-ghana-gold focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase">
                  Summary Description (Required)
                </label>
                <textarea
                  rows={2}
                  value={editingDest.summary}
                  onChange={(e) =>
                    setEditingDest({ ...editingDest, summary: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-ghana-border p-2.5 focus:border-ghana-gold focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase">
                  Full Description
                </label>
                <textarea
                  rows={3}
                  value={editingDest.description}
                  onChange={(e) =>
                    setEditingDest({ ...editingDest, description: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-ghana-border p-2.5 focus:border-ghana-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase">
                  Cultural & Historical Context
                </label>
                <textarea
                  rows={2}
                  value={editingDest.culturalHistory || ""}
                  onChange={(e) =>
                    setEditingDest({ ...editingDest, culturalHistory: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-ghana-border p-2.5 focus:border-ghana-gold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase">
                    Locality
                  </label>
                  <input
                    type="text"
                    value={editingDest.locality}
                    onChange={(e) =>
                      setEditingDest({ ...editingDest, locality: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-ghana-border p-2.5 focus:border-ghana-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase">
                    Region
                  </label>
                  <input
                    type="text"
                    value={editingDest.region}
                    onChange={(e) =>
                      setEditingDest({ ...editingDest, region: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-ghana-border p-2.5 focus:border-ghana-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase">
                    Verification Status (Required to Publish)
                  </label>
                  <select
                    value={editingDest.verificationStatus}
                    onChange={(e) =>
                      setEditingDest({
                        ...editingDest,
                        verificationStatus: e.target.value as VerificationStatus,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-ghana-border p-2.5 focus:border-ghana-gold focus:outline-none"
                  >
                    <option value="unverified">unverified (Cannot Publish)</option>
                    <option value="phone_verified">phone_verified</option>
                    <option value="fully_verified">fully_verified</option>
                    <option value="disputed">disputed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase">
                    Publication Status
                  </label>
                  <select
                    value={editingDest.status}
                    onChange={(e) =>
                      setEditingDest({
                        ...editingDest,
                        status: e.target.value as PublicationStatus,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-ghana-border p-2.5 focus:border-ghana-gold focus:outline-none"
                  >
                    <option value="draft">draft</option>
                    <option value="review">review</option>
                    <option value="published">published</option>
                    <option value="archived">archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase">
                  Source / Verification Notes (Required)
                </label>
                <input
                  type="text"
                  value={editingDest.source}
                  onChange={(e) =>
                    setEditingDest({ ...editingDest, source: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-ghana-border p-2.5 focus:border-ghana-gold focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-ghana-border">
                <button
                  type="button"
                  onClick={() => setEditingDest(null)}
                  className="rounded-xl border border-neutral-300 px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-ghana-green px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-ghana-greenDark"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

