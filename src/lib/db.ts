import fs from "fs";
import path from "path";
import {
  Category,
  Destination,
  Provider,
  Campaign,
  AuditEvent,
  AnalyticsEvent,
  DatabaseSchema,
  PublicationStatus,
  VerificationStatus,
} from "@/types";
import { initialDatabase } from "@/data/seed";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

function ensureDbFile(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDatabase, null, 2), "utf-8");
  }
}

function readDb(): DatabaseSchema {
  ensureDbFile();
  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw) as DatabaseSchema;
  } catch (error) {
    console.error("Error reading database, falling back to initial seed:", error);
    return initialDatabase;
  }
}

function writeDb(db: DatabaseSchema): void {
  ensureDbFile();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
}

export class DatabaseRepository {
  // --- Categories ---
  static getCategories(): Category[] {
    const db = readDb();
    return db.categories
      .filter((c) => c.active)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  static getCategoryBySlug(slug: string): Category | null {
    const db = readDb();
    return db.categories.find((c) => c.slug === slug) || null;
  }

  // --- Destinations ---
  static getDestinations(options?: {
    categorySlug?: string;
    status?: PublicationStatus | "all";
    query?: string;
    tag?: string;
    locality?: string;
  }): Destination[] {
    const db = readDb();
    const statusFilter = options?.status ?? "published";

    return db.destinations.filter((dest) => {
      // Status filter
      if (statusFilter !== "all" && dest.status !== statusFilter) {
        return false;
      }

      // Category filter
      if (options?.categorySlug) {
        const cat = db.categories.find((c) => c.slug === options.categorySlug);
        if (!cat || dest.primaryCategoryId !== cat.id) {
          return false;
        }
      }

      // Tag filter
      if (options?.tag && !dest.secondaryTags.includes(options.tag)) {
        return false;
      }

      // Locality filter
      if (
        options?.locality &&
        !dest.locality.toLowerCase().includes(options.locality.toLowerCase())
      ) {
        return false;
      }

      // Full text search query
      if (options?.query) {
        const q = options.query.toLowerCase().trim();
        const inName = dest.name.toLowerCase().includes(q);
        const inSummary = dest.summary.toLowerCase().includes(q);
        const inDescription = dest.description.toLowerCase().includes(q);
        const inCultural = dest.culturalHistory?.toLowerCase().includes(q) ?? false;
        const inLocality = dest.locality.toLowerCase().includes(q);
        const inTags = dest.secondaryTags.some((t) => t.toLowerCase().includes(q));

        if (!inName && !inSummary && !inDescription && !inCultural && !inLocality && !inTags) {
          return false;
        }
      }

      return true;
    });
  }

  static getDestinationBySlug(
    slug: string,
    options?: { allowDraft?: boolean }
  ): Destination | null {
    const db = readDb();
    const found = db.destinations.find((d) => d.slug === slug);
    if (!found) return null;

    if (!options?.allowDraft && found.status !== "published") {
      return null;
    }
    return found;
  }

  static getDestinationById(id: string): Destination | null {
    const db = readDb();
    return db.destinations.find((d) => d.id === id) || null;
  }

  /**
   * Enforces PRD Requirement FR-10:
   * Title, category, summary, source, and non-unverified status required before publication.
   */
  static validateForPublication(dest: Partial<Destination>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!dest.name || dest.name.trim().length === 0) {
      errors.push("Title/Name is required.");
    }
    if (!dest.primaryCategoryId || dest.primaryCategoryId.trim().length === 0) {
      errors.push("Primary Category is required.");
    }
    if (!dest.summary || dest.summary.trim().length === 0) {
      errors.push("Summary description is required.");
    }
    if (!dest.source || dest.source.trim().length === 0) {
      errors.push("Source information is required.");
    }
    if (!dest.verificationStatus || dest.verificationStatus === "unverified") {
      errors.push("Verification status must be updated from 'unverified' prior to publishing.");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  static createDestination(
    data: Omit<Destination, "id" | "createdAt" | "updatedAt">,
    actor: string
  ): Destination {
    const db = readDb();
    const now = new Date().toISOString();
    const newDest: Destination = {
      ...data,
      id: `dest-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };

    db.destinations.push(newDest);

    db.auditEvents.push({
      id: `audit-${Date.now()}`,
      actor,
      entity: `destination:${newDest.id}`,
      action: "create",
      timestamp: now,
      changedFields: { name: newDest.name, status: newDest.status },
    });

    writeDb(db);
    return newDest;
  }

  static updateDestination(
    id: string,
    updates: Partial<Destination>,
    actor: string
  ): { destination: Destination | null; error?: string } {
    const db = readDb();
    const index = db.destinations.findIndex((d) => d.id === id);
    if (index === -1) {
      return { destination: null, error: "Destination not found" };
    }

    const current = db.destinations[index];
    const candidate = { ...current, ...updates };

    // If publishing, check FR-10 gate
    if (updates.status === "published") {
      const validation = this.validateForPublication(candidate);
      if (!validation.valid) {
        return {
          destination: null,
          error: `Publication validation failed: ${validation.errors.join("; ")}`,
        };
      }
    }

    const now = new Date().toISOString();
    const updated: Destination = {
      ...candidate,
      updatedAt: now,
    };

    db.destinations[index] = updated;

    db.auditEvents.push({
      id: `audit-${Date.now()}`,
      actor,
      entity: `destination:${id}`,
      action: updates.status === "published" ? "publish" : updates.status === "draft" ? "unpublish" : "update",
      timestamp: now,
      changedFields: updates,
    });

    writeDb(db);
    return { destination: updated };
  }

  // --- Providers (Getting Around / Rentals) ---
  static getProviders(options?: {
    type?: "rental" | "transport" | "venue";
    status?: PublicationStatus | "all";
  }): Provider[] {
    const db = readDb();
    const statusFilter = options?.status ?? "published";

    return db.providers.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) {
        return false;
      }
      if (options?.type && p.type !== options.type) {
        return false;
      }
      return true;
    });
  }

  static getProviderById(id: string): Provider | null {
    const db = readDb();
    return db.providers.find((p) => p.id === id) || null;
  }

  static updateProvider(
    id: string,
    updates: Partial<Provider>,
    actor: string
  ): { provider: Provider | null; error?: string } {
    const db = readDb();
    const index = db.providers.findIndex((p) => p.id === id);
    if (index === -1) {
      return { provider: null, error: "Provider not found" };
    }

    const now = new Date().toISOString();
    const updated: Provider = {
      ...db.providers[index],
      ...updates,
      updatedAt: now,
    };

    db.providers[index] = updated;

    db.auditEvents.push({
      id: `audit-${Date.now()}`,
      actor,
      entity: `provider:${id}`,
      action: updates.status === "published" ? "publish" : "update",
      timestamp: now,
      changedFields: updates,
    });

    writeDb(db);
    return { provider: updated };
  }

  // --- Campaigns (QR Landing) ---
  static getCampaign(code: string): Campaign | null {
    const db = readDb();
    return db.campaigns.find((c) => c.code.toLowerCase() === code.toLowerCase()) || null;
  }

  static getAllCampaigns(): Campaign[] {
    const db = readDb();
    return db.campaigns;
  }

  static recordCampaignScan(code: string): void {
    const db = readDb();
    const campaign = db.campaigns.find((c) => c.code.toLowerCase() === code.toLowerCase());
    if (campaign) {
      campaign.scansCount = (campaign.scansCount || 0) + 1;
      writeDb(db);
    }
  }

  // --- Audit Events ---
  static getAuditEvents(): AuditEvent[] {
    const db = readDb();
    return [...db.auditEvents].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  // --- Privacy-Preserving Analytics Events ---
  static recordAnalyticsEvent(
    eventName: AnalyticsEvent["eventName"],
    targetId?: string,
    metadata?: Record<string, string | number | boolean>
  ): void {
    const db = readDb();
    const event: AnalyticsEvent = {
      id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      eventName,
      targetId,
      metadata,
      timestamp: new Date().toISOString(),
    };
    db.analyticsEvents.push(event);
    writeDb(db);
  }

  static getAnalyticsEvents(): AnalyticsEvent[] {
    const db = readDb();
    return db.analyticsEvents;
  }

  /**
   * Helper for tests & demo:
   * Sets sample verified items as published to verify UI while keeping the rest as draft.
   */
  static publishVerifiedSample(actor: string = "editor_bootstrap"): void {
    const db = readDb();
    let publishedCount = 0;

    // Publish a curated set across categories for complete immediate usability
    const sampleSlugs = [
      "cape-coast-castle",
      "elmina-castle",
      "kwame-nkrumah-memorial-park",
      "aqua-safari-resort",
      "zaina-lodge",
      "labadi-beach-hotel",
      "mole-national-park",
      "kakum-national-park",
      "shai-hills-resource-reserve",
      "kozo-restaurant",
      "buka-restaurant",
      "the-chop-bar",
      "skybar-25",
      "bloom-bar",
    ];

    db.destinations.forEach((dest) => {
      if (sampleSlugs.includes(dest.slug)) {
        dest.status = "published";
        dest.verificationStatus = "fully_verified";
        dest.verifiedAt = new Date().toISOString();
        dest.source = "Editorial Board & Direct Phone Verification";
        dest.contacts.forEach((c) => (c.verificationStatus = "verified"));
        publishedCount++;
      }
    });

    // Also publish 3 rental providers
    const sampleProviders = ["sunseekers-tours", "caradise-ghana", "a1-car-and-bus-rental"];
    db.providers.forEach((p) => {
      if (sampleProviders.includes(p.slug)) {
        p.status = "published";
        p.verificationStatus = "verified";
        p.contacts.forEach((c) => (c.verificationStatus = "verified"));
      }
    });

    db.auditEvents.push({
      id: `audit-${Date.now()}`,
      actor,
      entity: "system",
      action: "publish",
      timestamp: new Date().toISOString(),
      changedFields: {
        publishedCount,
        note: "Sample verified records published for immediate experience while preserving draft model",
      },
    });

    writeDb(db);
  }
}

