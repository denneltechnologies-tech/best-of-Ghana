import { describe, it, expect, beforeEach } from "vitest";
import { DatabaseRepository } from "../db";
import fs from "fs";
import path from "path";
import { initialDatabase } from "@/data/seed";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

describe("PRD Functional Requirements Acceptance Suite", () => {
  beforeEach(() => {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDatabase, null, 2), "utf-8");
  });

  // FR-01: Display six home categories
  it("FR-01: Exactly six categories exist, are active, and route consistently", () => {
    const categories = DatabaseRepository.getCategories();
    expect(categories).toHaveLength(6);
    expect(categories.every((c) => c.active)).toBe(true);

    const expectedSlugs = [
      "cultural-and-historical",
      "nightlife",
      "resorts",
      "eco-tourism",
      "restaurants",
      "recreational-centres-and-activities",
    ];
    expect(categories.map((c) => c.slug)).toEqual(expectedSlugs);
  });

  // FR-02: Browse listings and details (drafts are never public)
  it("FR-02: Draft records are hidden from public queries; only published are returned", () => {
    // Initial state: all deck items are draft
    const publicList = DatabaseRepository.getDestinations({ status: "published" });
    expect(publicList).toHaveLength(0);

    // Publishing one record
    const all = DatabaseRepository.getDestinations({ status: "all" });
    const target = all[0];
    DatabaseRepository.updateDestination(
      target.id,
      {
        verificationStatus: "fully_verified",
        source: "Direct inspection with local authority",
        status: "published",
      },
      "editor"
    );

    const publicAfter = DatabaseRepository.getDestinations({ status: "published" });
    expect(publicAfter).toHaveLength(1);
    expect(publicAfter[0].id).toBe(target.id);

    // Slug fetch for a draft item without allowDraft flag returns null
    const unverifiedDraft = all[1];
    expect(DatabaseRepository.getDestinationBySlug(unverifiedDraft.slug)).toBeNull();

    // With allowDraft flag (for preview in admin), returns record
    expect(DatabaseRepository.getDestinationBySlug(unverifiedDraft.slug, { allowDraft: true })).not.toBeNull();
  });

  // FR-03: Search names and approved descriptive text
  it("FR-03: Search matches keywords across title, summary, description, and tags", () => {
    DatabaseRepository.publishVerifiedSample("test_runner");

    // Search by title fragment
    const byName = DatabaseRepository.getDestinations({ status: "published", query: "Nkrumah" });
    expect(byName.some((d) => d.slug === "kwame-nkrumah-memorial-park")).toBe(true);

    // Search by locality
    const byLocality = DatabaseRepository.getDestinations({ status: "published", query: "Elmina" });
    expect(byLocality.length).toBeGreaterThan(0);

    // Search by highlight tag
    const byTag = DatabaseRepository.getDestinations({ status: "published", query: "Rainforest" });
    expect(byTag.some((d) => d.slug === "kakum-national-park")).toBe(true);

    // Empty query returns all published
    const allPublished = DatabaseRepository.getDestinations({ status: "published" });
    expect(DatabaseRepository.getDestinations({ status: "published", query: "" })).toHaveLength(allPublished.length);
  });

  // FR-04 & FR-05: Image alt text and external map directions
  it("FR-04 & FR-05: Seed records provide alt text and coordinates or locality for safe fallback", () => {
    const all = DatabaseRepository.getDestinations({ status: "all" });

    all.forEach((dest) => {
      // Check media alt text
      if (dest.media && dest.media.length > 0) {
        dest.media.forEach((m) => {
          expect(m.altText).toBeTruthy();
          expect(m.altText.length).toBeGreaterThan(5);
        });
      }

      // Check location fallback: must have either latitude/longitude or valid locality
      const hasCoordinates = typeof dest.latitude === "number" && typeof dest.longitude === "number";
      const hasLocality = typeof dest.locality === "string" && dest.locality.trim().length > 0;
      expect(hasCoordinates || hasLocality).toBe(true);
    });
  });

  // FR-06 & FR-07: Verified phone links and rental provider directory
  it("FR-06 & FR-07: Vehicle rental records have vehicle descriptions, service areas, and dialable phones", () => {
    const providers = DatabaseRepository.getProviders({ status: "all", type: "rental" });
    expect(providers.length).toBeGreaterThanOrEqual(7);

    providers.forEach((provider) => {
      expect(provider.vehicleTypes.length).toBeGreaterThan(0);
      expect(provider.serviceArea).toBeTruthy();
      expect(provider.contacts.length).toBeGreaterThan(0);

      // Verify phone format
      const primaryPhone = provider.contacts.find((c) => c.type === "phone");
      expect(primaryPhone).toBeDefined();
      expect(primaryPhone?.value).toMatch(/\+233/);
    });
  });

  // FR-08: QR Campaign resolution and fallback
  it("FR-08: Campaign landing resolves known codes and tracks scan counts without personal data", () => {
    const campaign = DatabaseRepository.getCampaign("HOTEL-LABADI-LOBBY");
    expect(campaign).not.toBeNull();
    expect(campaign?.placement).toContain("Concierge");

    const previousCount = campaign!.scansCount;
    DatabaseRepository.recordCampaignScan("HOTEL-LABADI-LOBBY");

    const updated = DatabaseRepository.getCampaign("HOTEL-LABADI-LOBBY");
    expect(updated?.scansCount).toBe(previousCount + 1);

    // Non-existent code falls back cleanly
    const unknown = DatabaseRepository.getCampaign("NON-EXISTENT-CODE");
    expect(unknown).toBeNull();
  });

  // FR-10: Incomplete publication blocker
  it("FR-10: Rejects publishing if title, summary, source, or verification is incomplete", () => {
    const check1 = DatabaseRepository.validateForPublication({
      name: "",
      primaryCategoryId: "cat-resorts",
      summary: "Some summary",
      source: "Manual check",
      verificationStatus: "fully_verified",
    });
    expect(check1.valid).toBe(false);
    expect(check1.errors).toContain("Title/Name is required.");

    const check2 = DatabaseRepository.validateForPublication({
      name: "Valid Place",
      primaryCategoryId: "cat-resorts",
      summary: "Some summary",
      source: "",
      verificationStatus: "fully_verified",
    });
    expect(check2.valid).toBe(false);
    expect(check2.errors).toContain("Source information is required.");

    const check3 = DatabaseRepository.validateForPublication({
      name: "Valid Place",
      primaryCategoryId: "cat-resorts",
      summary: "Some summary",
      source: "Deck",
      verificationStatus: "unverified",
    });
    expect(check3.valid).toBe(false);
    expect(check3.errors).toContain("Verification status must be updated from 'unverified' prior to publishing.");
  });

  // FR-14 & Privacy: Analytics events logging
  it("FR-14 & Privacy: Records aggregate action events without personal identity", () => {
    DatabaseRepository.recordAnalyticsEvent("directions_click", "dest-cape-coast-castle", {
      locality: "Cape Coast",
    });
    DatabaseRepository.recordAnalyticsEvent("call_click", "dest-aqua-safari");

    const events = DatabaseRepository.getAnalyticsEvents();
    expect(events.length).toBe(2);
    expect(events[0].eventName).toBe("directions_click");
    expect(events[0].targetId).toBe("dest-cape-coast-castle");
  });
});

