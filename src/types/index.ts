export type PublicationStatus = 'draft' | 'review' | 'published' | 'archived';

export type VerificationStatus =
  | 'unverified'
  | 'phone_verified'
  | 'fully_verified'
  | 'verified'
  | 'disputed';

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  displayOrder: number;
  active: boolean;
}

export interface ContactPoint {
  id: string;
  destinationId?: string;
  providerId?: string;
  type: 'phone' | 'site' | 'email';
  label: string;
  value: string;
  normalizedValue: string; // e.g. +233...
  isPrimary: boolean;
  verificationStatus: VerificationStatus;
  verificationDate?: string;
  verificationSource?: string;
}

export interface MediaAsset {
  id: string;
  destinationId: string;
  url: string;
  altText: string;
  caption?: string;
  credit?: string;
  rightsStatus: 'rights_unverified' | 'editorial_approved' | 'public_domain' | 'licensed';
  source: string;
  displayOrder: number;
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  culturalHistory?: string;
  primaryCategoryId: string;
  secondaryTags: string[];
  locality: string;
  region: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  status: PublicationStatus;
  editorialRank?: number;
  source: string;
  verificationStatus: VerificationStatus;
  verifiedAt?: string;
  contacts: ContactPoint[];
  media: MediaAsset[];
  externalUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Provider {
  id: string;
  slug: string;
  name: string;
  description: string;
  type: 'rental' | 'transport' | 'venue';
  logoUrl?: string;
  hasLogoRights: boolean;
  vehicleTypes: string[];
  serviceArea: string;
  status: PublicationStatus;
  source: string;
  verificationStatus: VerificationStatus;
  contacts: ContactPoint[];
  websiteUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  code: string;
  partnerName: string;
  placement: string;
  targetRoute: string;
  promoVideoUrl?: string;
  status: 'active' | 'paused' | 'archived';
  scansCount: number;
  createdAt: string;
}

export interface AuditEvent {
  id: string;
  actor: string;
  entity: string;
  action: 'create' | 'update' | 'publish' | 'unpublish' | 'archive' | 'seed';
  timestamp: string;
  changedFields?: Record<string, unknown>;
}

export interface AnalyticsEvent {
  id: string;
  eventName:
    | 'campaign_landing_view'
    | 'promo_video_open'
    | 'category_open'
    | 'search_submit'
    | 'destination_view'
    | 'directions_click'
    | 'call_click'
    | 'external_transport_click'
    | 'rental_contact_click';
  targetId?: string;
  metadata?: Record<string, string | number | boolean>;
  timestamp: string;
}

export interface DatabaseSchema {
  categories: Category[];
  destinations: Destination[];
  providers: Provider[];
  campaigns: Campaign[];
  auditEvents: AuditEvent[];
  analyticsEvents: AnalyticsEvent[];
}

