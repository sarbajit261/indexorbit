// Rate limiting configuration
export const RATE_LIMITS = {
  // Public endpoints
  search: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30,
  },
  aiSearch: {
    windowMs: 60 * 1000,
    maxRequests: 10,
  },
  api: {
    windowMs: 60 * 1000,
    maxRequests: 100,
  },
  // Auth endpoints
  login: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
  },
  register: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3,
  },
  // Content submission
  review: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 5,
  },
  businessSubmission: {
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    maxRequests: 3,
  },
} as const;

// API Response codes
export const API_CODES = {
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  RATE_LIMITED: 'RATE_LIMITED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// Business quality score weights
export const QUALITY_WEIGHTS = {
  name: 5,
  description: 10,
  category: 10,
  address: 10,
  phone: 10,
  website: 5,
  hours: 10,
  image: 10,
  services: 10,
  products: 5,
  socialLinks: 5,
  verified: 10,
} as const;

// Match score calculation weights
export const MATCH_WEIGHTS = {
  exactLocation: 25,
  sameCategory: 20,
  sameType: 15,
  hasRating: 10,
  hasOffers: 10,
  isFeatured: 10,
  isVerified: 5,
  hasPhotos: 5,
} as const;

// Demo data flag
export const IS_DEMO = process.env.NODE_ENV === 'development';

// Feature flags
export const FEATURES = {
  AI_SEARCH: process.env.NEXT_PUBLIC_AI_SEARCH_ENABLED === 'true',
  MAPS: process.env.NEXT_PUBLIC_MAP_ENABLED === 'true',
  REVIEWS: true,
  FAVORITES: true,
  COMPARISONS: true,
  LEADS: true,
  ANALYTICS: true,
  ADS: process.env.NEXT_PUBLIC_ADS_ENABLED === 'true',
} as const;
