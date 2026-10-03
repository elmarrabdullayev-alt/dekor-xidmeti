export type DecorCategorySlug =
  | 'toy-dekoru'
  | 'nisan-dekoru'
  | 'xina-dekoru'
  | 'ad-gunu-dekoru'
  | 'korporativ-dekor'
  | 'zal-dekoru'
  | 'xonca-xidmeti'
  | 'heri-sufresi'
  | 'yubiley-dekoru'
  | 'ozel-gunler-dekoru'
  | 'magaza-acilis-dekoru';

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
  isRealProject?: boolean;
  indexStatus?: 'index' | 'noindex';
  venueId?: string;
  venueSlug?: string;
  venueName?: string;
  decorElements?: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface CategoryProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface GeoDirectAnswer {
  question: string;
  answer: string;
}

export interface CategorySubSection {
  title: string;
  badge?: string;
  description: string;
  items?: string[];
  ctaText?: string;
}

export interface CategoryPricingFactorInfo {
  title: string;
  intro: string;
  factors: { title: string; description: string }[];
  ctaLabel?: string;
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
  whatIncluded?: string[];
  suitableFor?: string[];
  planningProcess?: CategoryProcessStep[];
  geoDirectAnswer?: GeoDirectAnswer;
  directAnswers?: GeoDirectAnswer[];
  subSections?: CategorySubSection[];
  pricingFactors?: CategoryPricingFactorInfo;
  relatedDecorIds?: string[];
  relatedProjectSlugs?: string[];
  relatedVenueSlugs?: string[];
  relatedCuratedLocalSlugs?: string[];
  whatsappPrefill?: string;
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
  instagramUrl?: string;
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

export type ImageSection =
  | 'home_hero'
  | 'hero_mobile'
  | 'category_cover'
  | 'decor_project'
  | 'venue_project'
  | 'xonca_service'
  | 'portfolio_lookbook'
  | 'regional_service'
  | 'indian_wedding'
  | 'destination_wedding';

export interface ManagedImage {
  id: string;
  url: string;
  thumbUrl?: string;
  filename: string;
  altText: string;
  alt?: string;
  section: ImageSection;
  targetId: string;
  targetName: string;
  isCover: boolean;
  order: number;
  width?: number;
  height?: number;
  focalPoint?: { x: number; y: number };
  sizeKb?: number;
  format: 'webp' | 'jpeg' | 'png';
  uploadedAt: string;
  updatedAt?: string;
}

export interface ArticleSubSection {
  title: string;
  content: string;
  bulletPoints?: string[];
}

export interface ArticleSection {
  id?: string;
  title: string;
  content: string;
  bulletPoints?: string[];
  callout?: string;
  subSections?: ArticleSubSection[];
  image?: string;
  imageAlt?: string;
}

export interface ArticleServiceLink {
  title: string;
  slug: string;
  description: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  publishDate: string;
  updatedDate: string;
  author: string;
  authorRole?: string;
  heroImage: string;
  heroAlt: string;
  directAnswer?: string;
  readingTimeMinutes: number;
  sections: ArticleSection[];
  faqs: FAQItem[];
  relatedServices: ArticleServiceLink[];
  relatedProjects: string[]; // project slugs
  relatedVenues?: string[]; // venue slugs
  keywords: string[];
  isPublished: boolean;
  isFeatured?: boolean;
}



