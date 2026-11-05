# Best of Ghana 🇬🇭
> **"Your Journey. Our Insight."**  
> Curated, independent tourism guide and discovery web application grounded in the 23-slide *Best of Ghana Concept Presentation* (Version 1.0 PRD).

---

## 1. Executive Summary & Direction

**Best of Ghana** is a mobile-first, lightweight responsive web application designed for do-it-yourself (DIY) international visitors, the African diaspora, and local travellers exploring Ghana independently.

* **Primary MVP Direction:** Curated DIY discovery guide with verified contacts, cultural/historical context, external map directions, vehicle rental listings, and QR-stand landing attribution.
* **Phase 2 Future Roadmap:** Sunseekers Tours reading companion with ordered itinerary stops and guide-led narrative companion pages.

---

## 2. Core Architectural Principles & Guardrails

The application strictly enforces all non-goals and security constraints defined in the PRD:
1. **Zero Fake Transactions:** No simulated bookings, payment gateways, ticketing inventories, or commissions. All arrangements are user-initiated directly via device dialer (`tel:`) or official external links.
2. **External Uber Handoff Only (FR-11):** Uber is provided purely as an approved external application link. No ride simulations, credential inputs, or API dependencies.
3. **Strict Editorial Publication Gate (FR-10):** All initial records transcribed from the pitch deck are seeded as `draft` / `unverified`. Records cannot be published publicly until `title`, `primaryCategory`, `summary`, `source`, and a non-unverified `verificationStatus` are populated.
4. **Privacy & Data Minimization:** No visitor accounts, passwords, or persistent tracking pixels. Device geolocation is strictly optional and client-side (for distance estimation only), and denial never breaks browsing.

---

## 3. The Six Exact Categories

| # | Category Slug | Name | Scope & Curated Highlights |
|---|---|---|---|
| 1 | `cultural-and-historical` | **Cultural and Historical** | UNESCO forts, ancestral kingdoms, national monuments (Cape Coast Castle, Elmina Castle, Manhyia Palace Museum, Kwame Nkrumah Memorial Park, Larabanga Mosque). |
| 2 | `nightlife` | **Nightlife** | Rooftop lounges, social clubs, Afrobeats venues across Accra (Skybar 25, Bloom Bar, Front/Back, Garage). |
| 3 | `resorts` | **Resorts** | Beachfront sanctuaries, riverfront chalets, and eco-lodges (Aqua Safari, Safari Valley, Zaina Lodge, Labadi Beach Hotel, Coconut Grove). |
| 4 | `eco-tourism` | **Eco-tourism** | Dense rainforests, hanging canopy walkways, and savannah wildlife (Mole National Park, Kakum National Park, Shai Hills). |
| 5 | `restaurants` | **Restaurants** | Curated collections for Fine Dining (Kozo, Santoku, Bistro 22), Local Ghanaian Cuisine (Buka, The Chop Bar), and Breakfast Spots (B2B, Pâte à Choux). |
| 6 | `recreational-centres-and-activities` | **Recreational Centres and Activities** | Outdoor adventure, sports, and recreational leisure activities. |

*Note on Vehicle Rentals & Minivans:* Long-distance minivans and vehicle rentals are housed under **Getting Around** (`/getting-around`), not as an unapproved top-level category.

---

## 4. Key Routes & Screen Architecture

* **`/` (Home):** Category-led navigation, full-text search trigger, Getting Around feature card, published destination highlights, and editorial trust notices.
* **`/category/[slug]`:** Category listing with sub-tag filters (e.g., Fine Dining vs. Local Cuisine), destination cards, and accessible empty states for unverified drafts.
* **`/places/[slug]`:** Destination profile with licensed photos, alt text, cultural/historical context, direct `tel:` dialer link, external Google Maps directions link with address fallback, and disclaimer notices.
* **`/getting-around`:** Dedicated mobility portal separating the external Uber handoff from the verified vehicle & minivan rental directory (Sunseekers Tours, Caradise Ghana, A1 Car Rental, etc.).
* **`/search`:** Fast full-text search across names, descriptions, tags, and localities with clear empty state.
* **`/landing?c=[code]` & `/qr/[code]`:** QR campaign landing for physical stands (e.g., Kotoka Airport, Labadi Hotel lobby). Tracks aggregate stand scans without personal cookies.
* **`/admin`:** Authenticated editorial console with pass-protected access, live draft/review/publish toggle, live validation gate (FR-10), preview drawer, and audit event history.
* **`/privacy`:** Transparent privacy policy outlining data minimization, zero-account architecture, and client-side-only geolocation.

---

## 5. Technology Stack

* **Framework:** Next.js 14+ (App Router) + React 18 / 19 + TypeScript
* **Styling:** Tailwind CSS with accessible Ghana-inspired color palette (Gold `#D4AF37`, Forest Green `#0B6623`, Sand `#F4EDE2`, Slate `#1A1A1A`)
* **Icons:** Lucide React
* **Persistence & Repository:** Self-contained JSON/SQLite repository pattern (`src/lib/db.ts`) with atomic file writes to `data/db.json` and complete audit trail
* **Testing:** Vitest with automated functional requirements test suite

---

## 6. Getting Started & Running Locally

### Prerequisites
* Node.js v18.17+ or v20+ / v22+
* npm v9+

### Installation & Execution
```bash
# 1. Install dependencies
npm install

# 2. Run test suite
npm run test

# 3. Start development server
npm run dev

# 4. Or build and run production server
npm run build
npm run start
```
The application will be live at `http://localhost:3000`.

---

## 7. Editorial Admin & Verification Workflow

1. Navigate to `http://localhost:3000/admin`.
2. Enter the editorial passcode (default development passcode: `ghana2026`).
3. **Publishing a Destination (Enforcing FR-10):**
   * Click **Edit & Verify** on any draft item.
   * Verify the phone number, GPS coordinates, source, and rights.
   * Change *Verification Status* to `phone_verified` or `fully_verified`.
   * Set *Publication Status* to `published` and click **Save Changes**.
4. **Quick Sample Bootstrap:** Click **Publish Verified Sample** in the top bar to immediately publish a curated cross-category sample for instant verification.
5. **Audit Trail:** Every create, edit, publish, and unpublish action records an immutable `AuditEvent` with timestamp, actor, and modified fields.

---

## 8. Decisions Log & Unresolved Pitch Deck Assumptions

Per Section 15 of the PRD, the following assumptions are explicitly documented rather than silently answered:

1. **Audience Priority:** Built for DIY discovery first; retained Sunseekers reading companion architecture for Phase 2.
2. **Tagline:** Adopted the deck tagline *"Your Journey. Our Insight."*
3. **Geographic Pilot:** The initial seed contains Accra as the urban anchor plus key regional attractions (Central Coast, Ashanti Kingdom, Mole Savannah, Volta Estuary).
4. **Unverified Market Figures:** Statistics in the pitch deck (e.g. 15,000 Sunseekers tourists, GH₵15.42bn sector revenue, 94% DIY share) are internal references and **must not be published as public marketing claims** until verified with the Ghana Tourism Authority (GTA).
5. **Physical QR Stands:** Pitch deck mentions 20 stands in one slide and 10 in the budget. The software dynamically supports any number of campaign codes (`ACC-AIRPORT-T3`, `HOTEL-LABADI-LOBBY`, etc.).
6. **Provider Awareness:** Listed venues and rental phone numbers transcribed from the deck are unverified candidates; the product owner must confirm that numbers have been contacted prior to public launch.

---

## 9. Launch & Deployment Verification Checklist

Before taking the application into public production:
- [ ] Product owner review and validation of venue contact numbers.
- [ ] Verify image licenses and commercial rights for all public assets.
- [ ] Configure production environment secrets (e.g. `ADMIN_SECRET_KEY`).
- [ ] Deploy to Vercel, Cloud Run, or custom Node.js host.
- [ ] Print QR stands with short redirect URLs pointing to `/qr/[code]`.
