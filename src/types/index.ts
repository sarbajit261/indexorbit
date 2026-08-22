// Core types for IndexOrbit Business Directory

// ============================================================================
// ENUMS
// ============================================================================

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  MODERATOR = 'MODERATOR',
  BUSINESS_OWNER = 'BUSINESS_OWNER',
  USER = 'USER',
}

export enum VerificationStatus {
  UNVERIFIED = 'UNVERIFIED',
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export enum ClaimStatus {
  NONE = 'NONE',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum FeaturedStatus {
  NONE = 'NONE',
  FEATURED = 'FEATURED',
  SPONSORED = 'SPONSORED',
}

export enum ReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  FLAGGED = 'FLAGGED',
  REJECTED = 'REJECTED',
}

export enum BusinessType {
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
  PRODUCT_SELLER = 'PRODUCT_SELLER',
  HOTEL = 'HOTEL',
  RESTAURANT = 'RESTAURANT',
  SHOP = 'SHOP',
  AGENCY = 'AGENCY',
  CLINIC = 'CLINIC',
  SALON = 'SALON',
  GYM = 'GYM',
  CONTRACTOR = 'CONTRACTOR',
  PROFESSIONAL = 'PROFESSIONAL',
  SCHOOL = 'SCHOOL',
  TRAVEL = 'TRAVEL',
  REPAIR = 'REPAIR',
  ENTERTAINMENT = 'ENTERTAINMENT',
  REAL_ESTATE = 'REAL_ESTATE',
  AUTOMOTIVE = 'AUTOMOTIVE',
  OTHER = 'OTHER',
}

export enum LocationType {
  COUNTRY = 'COUNTRY',
  STATE = 'STATE',
  CITY = 'CITY',
  DISTRICT = 'DISTRICT',
  NEIGHBORHOOD = 'NEIGHBORHOOD',
}

export enum ContentStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  SCHEDULED = 'SCHEDULED',
}

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
  BUY_ONE_GET_ONE = 'BUY_ONE_GET_ONE',
  FREE_ITEM = 'FREE_ITEM',
}

export enum LeadType {
  CONTACT = 'CONTACT',
  PHONE = 'PHONE',
  WEBSITE = 'WEBSITE',
  QUOTE = 'QUOTE',
  BOOKING = 'BOOKING',
  DIRECTIONS = 'DIRECTIONS',
}

export enum SearchType {
  MANUAL = 'MANUAL',
  AI = 'AI',
}

export enum AIProvider {
  OPENAI = 'OPENAI',
  ANTHROPIC = 'ANTHROPIC',
}

export enum MapProvider {
  MAPBOX = 'MAPBOX',
  GOOGLE = 'GOOGLE',
}

// ============================================================================
// BASE TYPES
// ============================================================================

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends BaseEntity {
  email: string;
  name: string | null;
  image: string | null;
  emailVerified: Date | null;
  role: UserRole;
  mfaEnabled: boolean;
  lastLoginAt: Date | null;
  preferences: Record<string, unknown>;
}

export interface BusinessTypeEntity extends BaseEntity {
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  fields: BusinessTypeField[];
  order: number;
  status: ContentStatus;
}

export interface BusinessTypeField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'multiselect';
  required: boolean;
  options?: string[];
}

export interface Category extends BaseEntity {
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  icon: string | null;
  parentId: string | null;
  parent?: Category;
  children?: Category[];
  businessTypeId: string;
  seoTitle: string | null;
  seoDescription: string | null;
  faqs: FAQ[];
  order: number;
  status: ContentStatus;
}

export interface Location extends BaseEntity {
  name: string;
  slug: string;
  type: LocationType;
  parentId: string | null;
  parent?: Location;
  children?: Location[];
  latitude: number | null;
  longitude: number | null;
  population: number | null;
}

export interface Business extends BaseEntity {
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  logo: string | null;
  coverImage: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  socialLinks: SocialLinks;
  yearEstablished: number | null;
  priceRange: PriceRange;
  languages: string[];
  paymentMethods: string[];
  verificationStatus: VerificationStatus;
  claimedStatus: ClaimStatus;
  featuredStatus: FeaturedStatus;
  rating: number;
  reviewCount: number;
  viewCount: number;
  qualityScore: number;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  serviceAreas: string[];
  customAttributes: Record<string, unknown>;
  metadata: Record<string, unknown>;
  businessTypeId: string;
  categoryId: string | null;
  primaryLocationId: string | null;
  ownerId: string | null;
  lastVerifiedAt: Date | null;
  deletedAt: Date | null;

  // Relations
  businessType?: BusinessTypeEntity;
  category?: Category;
  primaryLocation?: Location;
  owner?: User;
  branches?: BusinessBranch[];
  services?: Service[];
  products?: Product[];
  offers?: Offer[];
  news?: BusinessNews[];
  reviews?: Review[];
  hours?: BusinessHours[];
}

export interface BusinessBranch extends BaseEntity {
  businessId: string;
  name: string;
  address: string;
  phone: string | null;
  email: string | null;
  latitude: number | null;
  longitude: number | null;
  isPrimary: boolean;
  hours: BusinessHours[];
}

export interface BusinessHours {
  id: string;
  businessId: string | null;
  branchId: string | null;
  dayOfWeek: DayOfWeek;
  openTime: string | null;
  closeTime: string | null;
  isClosed: boolean;
  specialHours: SpecialHours[] | null;
}

export interface SpecialHours {
  date: string;
  openTime: string | null;
  closeTime: string | null;
  isClosed: boolean;
  reason: string | null;
}

export interface DayOfWeek {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  open: string;
  close: string;
  isClosed: boolean;
}

export interface Service extends BaseEntity {
  businessId: string;
  categoryId: string | null;
  name: string;
  slug: string;
  description: string | null;
  startingPrice: number | null;
  pricingType: PricingType;
  duration: number | null;
  availability: string | null;
  serviceArea: string | null;
  bookingUrl: string | null;
  images: string[];
  status: ContentStatus;
  order: number;
}

export interface Product extends BaseEntity {
  businessId: string;
  categoryId: string | null;
  name: string;
  slug: string;
  description: string | null;
  brand: string | null;
  sku: string | null;
  price: number | null;
  salePrice: number | null;
  currency: string;
  availability: ProductAvailability;
  images: string[];
  productUrl: string | null;
  featured: boolean;
  status: ContentStatus;
}

export interface Offer extends BaseEntity {
  businessId: string;
  title: string;
  slug: string;
  description: string | null;
  discountType: DiscountType;
  discountValue: number | null;
  originalPrice: number | null;
  offerPrice: number | null;
  couponCode: string | null;
  terms: string | null;
  image: string | null;
  url: string | null;
  startDate: Date;
  endDate: Date;
  views: number;
  clicks: number;
  status: ContentStatus;
}

export interface BusinessNews extends BaseEntity {
  businessId: string;
  authorId: string | null;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  featuredImage: string | null;
  publishDate: Date;
  status: ContentStatus;
  seoTitle: string | null;
  seoDescription: string | null;
  views: number;
}

export interface Review extends BaseEntity {
  businessId: string;
  userId: string;
  rating: number;
  title: string | null;
  content: string | null;
  images: string[];
  status: ReviewStatus;
  helpfulCount: number;
  reportCount: number;
  adminResponse: string | null;
  responseDate: Date | null;

  // Relations
  user?: User;
  business?: Business;
}

export interface Claim extends BaseEntity {
  businessId: string;
  userId: string;
  status: ClaimStatus;
  verificationMethod: string;
  notes: string | null;
  reviewedAt: Date | null;
  reviewedById: string | null;
}

export interface BusinessSubmission extends BaseEntity {
  userId: string | null;
  data: Record<string, unknown>;
  status: ClaimStatus;
  submittedAt: Date;
  reviewedAt: Date | null;
  reviewedById: string | null;
  notes: string | null;
}

export interface Favorite extends BaseEntity {
  userId: string;
  businessId: string;
}

export interface Collection extends BaseEntity {
  userId: string;
  name: string;
  description: string | null;
  businessIds: string[];
}

export interface SearchEvent extends BaseEntity {
  query: string;
  filters: Record<string, unknown>;
  location: string | null;
  userId: string | null;
  resultsCount: number;
  clickedBusinessId: string | null;
  searchType: SearchType;
}

export interface AIConversation extends BaseEntity {
  userId: string | null;
  messages: AIMessage[];
  context: Record<string, unknown>;
}

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface Lead extends BaseEntity {
  businessId: string;
  type: LeadType;
  userId: string | null;
  metadata: Record<string, unknown>;
}

export interface FeaturedPlacement extends BaseEntity {
  businessId: string;
  startDate: Date;
  endDate: Date;
  categoryId: string | null;
  locationId: string | null;
  priority: number;
  label: string | null;
}

export interface Article extends BaseEntity {
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featuredImage: string | null;
  categoryId: string | null;
  authorId: string | null;
  status: ContentStatus;
  publishedAt: Date | null;
  seoTitle: string | null;
  seoDescription: string | null;
  views: number;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
  pinterest?: string;
}

export interface PriceRange {
  level: 1 | 2 | 3 | 4;
  symbol: string;
}

export enum PricingType {
  FIXED = 'FIXED',
  STARTING_AT = 'STARTING_AT',
  ESTIMATE = 'ESTIMATE',
  PER_HOUR = 'PER_HOUR',
  PER_UNIT = 'PER_UNIT',
}

export enum ProductAvailability {
  IN_STOCK = 'IN_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  LIMITED = 'LIMITED',
  PRE_ORDER = 'PRE_ORDER',
}

export interface Notification extends BaseEntity {
  userId: string;
  type: string;
  title: string;
  message: string;
  data: Record<string, unknown>;
  read: boolean;
}

export interface AuditLog extends BaseEntity {
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  changes: Record<string, unknown>;
  ipAddress: string | null;
}

// ============================================================================
// API TYPES
// ============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SearchParams {
  query?: string;
  businessType?: string;
  category?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  rating?: number;
  priceRange?: number[];
  openNow?: boolean;
  verified?: boolean;
  featured?: boolean;
  hasOffers?: boolean;
  hasProducts?: boolean;
  hasServices?: boolean;
  sort?: SearchSort;
  page?: number;
  limit?: number;
}

export enum SearchSort {
  RELEVANCE = 'RELEVANCE',
  RATING = 'RATING',
  POPULARITY = 'POPULARITY',
  DISTANCE = 'DISTANCE',
  NEWEST = 'NEWEST',
  FEATURED = 'FEATURED',
}

export interface SearchResult {
  business: Business;
  matchScore: number;
  matchReasons: string[];
  distance?: number;
}

export interface ParsedAIQuery {
  businessType?: string;
  category?: string;
  location?: string;
  services?: string[];
  products?: string[];
  attributes?: Record<string, unknown>;
  priceRange?: number;
  minRating?: number;
  openNow?: boolean;
  other?: string[];
}

// ============================================================================
// AI TYPES
// ============================================================================

export interface AITool {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export interface AISearchResult {
  businesses: SearchResult[];
  explanation: string;
  conversationId?: string;
}

export interface AdminAICommand {
  action: string;
  target?: string;
  parameters?: Record<string, unknown>;
  confirmation?: boolean;
}

// ============================================================================
// CONFIG TYPES
// ============================================================================

export interface AIConfig {
  provider: AIProvider;
  openai?: {
    apiKey: string;
    model: string;
  };
  anthropic?: {
    apiKey: string;
    model: string;
  };
}

export interface MapConfig {
  provider: MapProvider;
  mapbox?: {
    accessToken: string;
  };
  google?: {
    apiKey: string;
  };
}

export interface StorageConfig {
  provider: 's3' | 'r2';
  endpoint?: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicUrl: string;
}
