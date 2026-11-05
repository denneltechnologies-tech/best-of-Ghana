import { describe, it, expect, beforeEach } from "vitest";
import { DatabaseRepository } from "../db";
import fs from "fs";
import path from "path";
import { initialDatabase } from "@/data/seed";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

describe("DatabaseRepository & PRD Requirements", () => {
  beforeEach(() => {
    // Reset DB to initial seed before each test
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDatabase, null, 2), "utf-8");
  });

  it("FR-01: Correctly returns the exact six categories with display orders", () => {
    const categories = DatabaseRepository.getCategories();
    expect(categories.length).toBe(6);

    const slugs = categories.map((c) => c.slug);
    expect(slugs).toEqual([
      "cultural-and-historical",
      "nightlife",
      "resorts",
      "eco-tourism",
      "restaurants",
      "recreational-centres-and-activities",
    ]);
  });

  it("FR-02: Initial seed places all candidate destinations in draft status", () => {
    // Public queries should return 0 by default before any item is verified and published
    const publicDestinations = DatabaseRepository.getDestinations({ status: "published" });
    expect(publicDestinations.length).toBe(0);

    // Admin queries should see all seeded drafts
    const allDrafts = DatabaseRepository.getDestinations({ status: "all" });
    expect(allDrafts.length).toBeGreaterThan(15);
  });

  it("FR-10: Publication gate blocks publication if required fields or verification is missing", () => {
    const all = DatabaseRepository.getDestinations({ status: "all" });
    const draft = all[0];

    // Attempting to publish while still 'unverified' must fail
    const result = DatabaseRepository.updateDestination(
      draft.id,
      { status: "published" },
      "test_editor"
    );

    expect(result.destination).toBeNull();
    expect(result.error).toContain("Publication validation failed");
    expect(result.error).toContain("Verification status must be updated from 'unverified'");
  });

  it("FR-10: Allows publication once source, summary, category, and verification status are satisfied", () => {
    const all = DatabaseRepository.getDestinations({ status: "all" });
    const draft = all[0];

    const result = DatabaseRepository.updateDestination(
      draft.id,
      {
        verificationStatus: "fully_verified",
        source: "Checked directly with management and official tourism authority",
        status: "published",
      },
      "verified_editor"
    );

    expect(result.error).toBeUndefined();
    expect(result.destination).not.toBeNull();
    expect(result.destination?.status).toBe("published");

    // Should now be visible in public listings
    const publicPlaces = DatabaseRepository.getDestinations({ status: "published" });
    expect(publicPlaces.length).toBe(1);
    expect(publicPlaces[0].id).toBe(draft.id);
  });

  it("FR-03: Search finds places across name, description, and locality once published", () => {
    DatabaseRepository.publishVerifiedSample("test_runner");

    // Search for "Cape Coast"
    const results = DatabaseRepository.getDestinations({
      status: "published",
      query: "Cape Coast",
    });
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results.some((r) => r.slug === "cape-coast-castle")).toBe(true);

    // Search for non-existent keyword
    const emptyResults = DatabaseRepository.getDestinations({
      status: "published",
      query: "NonExistentPlaceXYZ",
    });
    expect(emptyResults.length).toBe(0);
  });

  it("FR-08: QR Campaign lookup resolves code and tracks scans", () => {
    const campaign = DatabaseRepository.getCampaign("ACC-AIRPORT-T3");
    expect(campaign).not.toBeNull();
    expect(campaign?.partnerName).toContain("Kotoka");

    const initialScans = campaign!.scansCount;
    DatabaseRepository.recordCampaignScan("ACC-AIRPORT-T3");

    const updated = DatabaseRepository.getCampaign("ACC-AIRPORT-T3");
    expect(updated?.scansCount).toBe(initialScans + 1);

    // Non-existent QR code returns null safely
    const invalid = DatabaseRepository.getCampaign("UNKNOWN-CODE-999");
    expect(invalid).toBeNull();
  });

  it("Admin change records an audit trail", () => {
    DatabaseRepository.publishVerifiedSample("test_admin");
    const audits = DatabaseRepository.getAuditEvents();
    expect(audits.length).toBeGreaterThanOrEqual(1);
    expect(audits[0].actor).toBe("test_admin");
  });
});

