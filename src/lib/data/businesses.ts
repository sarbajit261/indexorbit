import prisma from '@/lib/db/prisma';
import { cache } from 'react';

// Cache keys for consistent caching
export const CACHE_KEYS = {
  BUSINESS: 'business',
  BUSINESSES: 'businesses',
  BUSINESS_TYPES: 'business-types',
  CATEGORIES: 'categories',
  FEATURED: 'featured-businesses',
  HOME: 'home-data',
} as const;

// Cache duration in seconds
export const CACHE_DURATION = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
} as const;

// ============================================
// SERVER COMPONENT DATA FETCHING
// These functions are used in Server Components
// ============================================

/**
 * Get all published business types
 */
export async function getBusinessTypes() {
  return cache(async () => {
    return prisma.businessType.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { businesses: { where: { deletedAt: null } } },
        },
      },
    });
  })();
}

/**
 * Get all published categories
 */
export async function getCategories(businessTypeSlug?: string) {
  return cache(async () => {
    const where: any = { status: 'PUBLISHED' };

    if (businessTypeSlug) {
      where.businessType = { slug: businessTypeSlug };
    }

    return prisma.category.findMany({
      where,
      orderBy: { order: 'asc' },
      include: {
        businessType: true,
        _count: {
          select: { businesses: { where: { deletedAt: null } } },
        },
      },
    });
  })();
}

/**
 * Get paginated businesses for listing pages
 */
export async function getBusinesses(params: {
  type?: string;
  category?: string;
  location?: string;
  search?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
}) {
  const { type, category, location, search, page = 1, limit = 12, featured } = params;

  const where: any = { deletedAt: null };

    // Filter by business type
    if (type && type !== 'all') {
      where.businessType = { slug: type };
    }

    // Filter by category
    if (category) {
      where.category = { slug: category };
    }

    // Filter by location
    if (location) {
      where.OR = [
        { city: { contains: location, mode: 'insensitive' } },
        { state: { contains: location, mode: 'insensitive' } },
      ];
    }

    // Search
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Featured only
    if (featured) {
      where.featuredStatus = 'FEATURED';
    }

    const [businesses, total] = await Promise.all([
      prisma.business.findMany({
        where,
        include: {
          businessType: true,
          category: true,
          _count: {
            select: { reviews: { where: { status: 'APPROVED' } } },
          },
        },
        orderBy: [
          { featuredStatus: 'desc' },
          { qualityScore: 'desc' },
          { rating: 'desc' },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.business.count({ where }),
    ]);

    return {
      businesses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    };
}

/**
 * Get a single business by slug
 */
export async function getBusiness(slug: string) {
  return cache(async () => {
    return prisma.business.findFirst({
      where: {
        slug,
        deletedAt: null,
      },
      include: {
        businessType: true,
        category: true,
        services: {
          where: { status: 'PUBLISHED' },
          orderBy: { name: 'asc' },
        },
        products: {
          where: { status: 'PUBLISHED' },
          take: 20,
        },
        offers: {
          where: { status: 'PUBLISHED' },
          orderBy: { endDate: 'asc' },
        },
        news: {
          where: { status: 'PUBLISHED' },
          take: 5,
          orderBy: { publishDate: 'desc' },
        },
        reviews: {
          where: { status: 'APPROVED' },
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { name: true, image: true } },
          },
        },
        branches: {
          where: { isPrimary: false },
        },
        hours: {
          orderBy: { dayOfWeek: 'asc' },
        },
      },
    });
  })();
}

/**
 * Get featured businesses for homepage
 */
export async function getFeaturedBusinesses(limit: number = 10) {
  return cache(async () => {
    return prisma.business.findMany({
      where: {
        deletedAt: null,
        featuredStatus: 'FEATURED',
      },
      include: {
        businessType: true,
        category: true,
        _count: {
          select: { reviews: { where: { status: 'APPROVED' } } },
        },
      },
      orderBy: { qualityScore: 'desc' },
      take: limit,
    });
  })();
}

/**
 * Get top rated businesses
 */
export async function getTopRatedBusinesses(limit: number = 10) {
  return cache(async () => {
    return prisma.business.findMany({
      where: { deletedAt: null },
      include: {
        businessType: true,
        category: true,
        _count: {
          select: { reviews: { where: { status: 'APPROVED' } } },
        },
      },
      orderBy: { rating: 'desc' },
      take: limit,
    });
  })();
}

/**
 * Get home page data (multiple queries in parallel)
 */
export async function getHomePageData() {
  return cache(async () => {
    const [businessTypes, featured, topRated, categories] = await Promise.all([
      getBusinessTypes(),
      getFeaturedBusinesses(10),
      getTopRatedBusinesses(10),
      getCategories(),
    ]);

    return {
      businessTypes,
      featured,
      topRated,
      categories,
    };
  })();
}

/**
 * Search businesses, categories, and locations
 */
export async function searchAll(query: string, limit: number = 10) {
  if (!query || query.length < 2) {
    return { businesses: [], categories: [], locations: [] };
  }

  return cache(async () => {
    const [businesses, categories, locations] = await Promise.all([
      prisma.business.findMany({
        where: {
          deletedAt: null,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          name: true,
          slug: true,
          shortDescription: true,
          city: true,
          state: true,
          businessType: { select: { name: true, slug: true } },
          category: { select: { name: true, slug: true } },
        },
        take: limit,
        orderBy: { rating: 'desc' },
      }),

      prisma.category.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
          status: 'PUBLISHED',
        },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          businessType: { select: { name: true, slug: true } },
        },
        take: limit,
      }),

      prisma.business.findMany({
        where: {
          deletedAt: null,
          OR: [
            { city: { contains: query, mode: 'insensitive' } },
            { state: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: {
          city: true,
          state: true,
          country: true,
        },
        distinct: ['city', 'state'],
        take: limit,
      }),
    ]);

    // Format unique locations
    const uniqueLocations = [...new Map(
      locations
        .filter(l => l.city)
        .map(l => [`${l.city}, ${l.state}`, { city: l.city, state: l.state, country: l.country }])
    ).values()];

    return {
      businesses,
      categories,
      locations: uniqueLocations,
    };
  })();
}
