export type DecorCategorySlug =
  | 'toy-dekoru'
  | 'nisan-dekoru'
  | 'xina-dekoru'
  | 'ad-gunu-dekoru'
  | 'korporativ-dekor'
  | 'zal-dekoru'
  | 'xonca-xidmeti';

export type RegionalSuitability = 'local' | 'regional' | 'premiumRegional';

export interface DecorItem {
  id: string;
  name: string;
  slug: string;
  category: DecorCategorySlug;
  categoryName: string;
  style: string;
  city: string;
  shortDescription: string;
  fullDescription?: string;
  mainImage: string;
  galleryImages: string[];
  includedServices: string[];
  regionalService: boolean;
  regionalSuitability: RegionalSuitability;
  minimumRegionalOrderValue?: number;
  priceDisplay?: string;
  seoTitle: string;
  metaDescription: string;
  imageAltText: string;
  status: 'published' | 'draft';
  isPublished?: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface CategoryInfo {
  id: string;
  name: string;
  slug: DecorCategorySlug;
  heroImage: string;
  shortDescription: string;
  seoH1: string;
  seoIntroduction: string;
  metaTitle: string;
  metaDescription: string;
  faqs: FAQItem[];
  canonicalSlug: string;
}

export interface InquiryRequest {
  id: string;
  name: string;
  phone: string;
  eventType: string;
  date: string;
  location: string;
  notes: string;
  decorId?: string;
  decorName?: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'completed';
}

export type CustomerInquiry = InquiryRequest;

export interface RegionalLocationInfo {
  city: string;
  slug: string;
  isMajorHub: boolean;
  distanceFromBaku: string;
  logisticsNotice: string;
  recommendedDecorTypes: string[];
  sampleVenues?: string[];
}

export interface SiteSettings {
  brandName: string;
  brandSubtitle: string;
  phoneDisplay: string;
  phoneRaw: string;
  whatsappNumber: string;
  email: string;
  address: string;
  instagram: string;
  regionalLogisticsNotice: string;
}

export interface VenueItem {
  id: string;
  name: string;
  slug: string;
  city: string;
  district?: string;
  address?: string;
  shortDescription: string;
  venueNotes?: string;
  mainImage: string;
  galleryImages: string[];
  hasRealProject: boolean;
  relatedDecorIds: string[];
  relatedServices: string[];
  faqs: FAQItem[];
  seoTitle: string;
  metaDescription: string;
  status: 'published' | 'draft';
  indexStatus: 'index' | 'noindex';
  createdAt: string;
  updatedAt?: string;
}

