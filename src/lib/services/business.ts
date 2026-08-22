import prisma from '@/lib/db/prisma';
import { slugify } from '@/lib/utils';
import { SearchSort } from '@/types';
import type {
  SearchParams,
  SearchResult,
  Business,
  Category,
  Location,
} from '@/types';

// ============================================================================
// BUSINESS SERVICE
// ============================================================================

export async function getBusinesses(params: SearchParams): Promise<{
  businesses: Business[];
  total: number;
}> {
  const {
    query,
    businessType,
    category,
    location,
    latitude,
    longitude,
    radius,
    rating,
    priceRange,
    openNow,
    verified,
    featured,
    hasOffers,
    hasServices,
    hasProducts,
    sort = SearchSort.RELEVANCE,
    page = 1,
    limit = 20,
  } = params;

  const where: Record<string, unknown> = {
    deletedAt: null,
  };

  // Text search
  if (query) {
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { shortDescription: { contains: query, mode: 'insensitive' } },
    ];
  }

  // Filters
  if (businessType) {
    where.businessType = { slug: businessType };
  }

  if (category) {
    where.category = { slug: category };
  }

  if (location) {
    where.OR = [
      { city: { contains: location, mode: 'insensitive' } },
      { state: { contains: location, mode: 'insensitive' } },
      { country: { contains: location, mode: 'insensitive' } },
    ];
  }

  if (rating) {
    where.rating = { gte: rating };
  }

  if (priceRange && priceRange.length > 0) {
    where.priceRange = { in: priceRange };
  }

  if (verified) {
    where.verificationStatus = 'VERIFIED';
  }

  if (featured) {
    where.featuredStatus = { in: ['FEATURED', 'SPONSORED'] };
  }

  if (hasOffers) {
    where.offers = { some: { status: 'PUBLISHED', endDate: { gte: new Date() } } };
  }

  if (hasServices) {
    where.services = { some: { status: 'PUBLISHED' } };
  }

  if (hasProducts) {
    where.products = { some: { status: 'PUBLISHED' } };
  }

  // Sorting
  const orderBy = (() => {
    switch (sort) {
      case SearchSort.RATING:
        return { rating: 'desc' };
      case SearchSort.POPULARITY:
        return { viewCount: 'desc' };
      case SearchSort.NEWEST:
        return { createdAt: 'desc' };
      case SearchSort.FEATURED:
        return [{ featuredStatus: 'desc' }, { rating: 'desc' }];
      case SearchSort.DISTANCE:
        // For distance, we need to sort in memory after fetching
        return { createdAt: 'desc' };
      default:
        return [
          { featuredStatus: 'desc' },
          { rating: 'desc' },
        ];
    }
  })() as any;

  const [businesses, total] = await Promise.all([
    prisma.business.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        businessType: true,
        category: true,
        offers: {
          where: { status: 'PUBLISHED', endDate: { gte: new Date() } },
          take: 1,
        },
        services: {
          where: { status: 'PUBLISHED' },
          take: 3,
        },
        hours: true,
        _count: {
          select: { reviews: { where: { status: 'APPROVED' } } },
        },
      },
    }),
    prisma.business.count({ where }),
  ]);

  // Calculate distance if location provided
  type BusinessWithDistance = typeof businesses[number] & { distance?: number };
  let results: BusinessWithDistance[] = businesses;
  if (latitude && longitude) {
    results = businesses.map((b) => ({
      ...b,
      distance: calculateDistance(latitude, longitude, b.latitude || 0, b.longitude || 0),
    }));

    if (sort === SearchSort.DISTANCE) {
      results = results.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }
  }

  // Check open now
  if (openNow) {
    const currentDay = new Date().getDay();
    const currentTime = new Date().getHours() * 60 + new Date().getMinutes();

    results = results.filter((b) => {
      const todayHours = (b.hours || []).find((h) => h.dayOfWeek === currentDay);
      if (!todayHours || todayHours.isClosed) return false;
      if (!todayHours.openTime || !todayHours.closeTime) return false;

      const [openH, openM] = todayHours.openTime.split(':').map(Number);
      const [closeH, closeM] = todayHours.closeTime.split(':').map(Number);
      const open = openH * 60 + openM;
      const close = closeH * 60 + closeM;

      return currentTime >= open && currentTime <= close;
    });
  }

  return { businesses: results as unknown as Business[], total };
}

export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  const business = await prisma.business.findUnique({
    where: { slug, deletedAt: null },
    include: {
      businessType: true,
      category: true,
      primaryLocation: true,
      owner: { select: { id: true, name: true, image: true } },
      branches: {
        include: { hours: true },
      },
      services: {
        where: { status: 'PUBLISHED' },
        orderBy: { order: 'asc' },
      },
      products: {
        where: { status: 'PUBLISHED' },
        orderBy: { featured: 'desc' },
      },
      offers: {
        where: { status: 'PUBLISHED', endDate: { gte: new Date() } },
      },
      news: {
        where: { status: 'PUBLISHED' },
        orderBy: { publishDate: 'desc' },
        take: 5,
      },
      reviews: {
        where: { status: 'APPROVED' },
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
        take: 10,
      },
      hours: true,
    },
  });

  if (business) {
    await prisma.business.update({
      where: { id: business.id },
      data: { viewCount: { increment: 1 } },
    });
  }

  return business as unknown as Business;
}

export async function createBusiness(data: {
  name: string;
  businessTypeId: string;
  categoryId?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  description?: string;
  ownerId?: string;
}): Promise<Business> {
  const slug = slugify(data.name);

  const business = await prisma.business.create({
    data: {
      ...data,
      slug: await ensureUniqueSlug(slug),
    },
    include: {
      businessType: true,
      category: true,
    },
  });

  return business as unknown as Business;
}

export async function updateBusiness(
  id: string,
  data: Partial<Business>
): Promise<Business> {
  const business = await prisma.business.update({
    where: { id },
    data: {
      ...data,
      slug: data.name ? await ensureUniqueSlug(slugify(data.name), id) : undefined,
    } as Parameters<typeof prisma.business.update>[0]['data'],
    include: {
      businessType: true,
      category: true,
      services: true,
      products: true,
      offers: true,
      news: true,
      reviews: true,
      hours: true,
    },
  });

  return business as unknown as Business;
}

export async function deleteBusiness(id: string): Promise<void> {
  await prisma.business.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

export async function getRelatedBusinesses(
  businessId: string,
  categoryId: string | null,
  limit = 4
): Promise<Business[]> {
  const businesses = await prisma.business.findMany({
    where: {
      id: { not: businessId },
      deletedAt: null,
      categoryId: categoryId || undefined,
    },
    orderBy: [{ rating: 'desc' }, { viewCount: 'desc' }],
    take: limit,
    include: {
      businessType: true,
      offers: {
        where: { status: 'PUBLISHED', endDate: { gte: new Date() } },
        take: 1,
      },
    },
  });

  return businesses as unknown as Business[];
}

// ============================================================================
// CATEGORY SERVICE
// ============================================================================

export async function getCategories(params: {
  businessType?: string;
  parentId?: string | null;
  includeChildren?: boolean;
}): Promise<Category[]> {
  const { businessType, parentId, includeChildren = false } = params;

  const where: Record<string, unknown> = { status: 'PUBLISHED' };

  if (businessType) {
    where.businessType = { slug: businessType };
  }

  if (parentId === null) {
    where.parentId = null;
  } else if (parentId) {
    where.parentId = parentId;
  }

  const categories = await prisma.category.findMany({
    where,
    orderBy: { order: 'asc' },
    include: includeChildren
      ? {
          children: {
            where: { status: 'PUBLISHED' },
            orderBy: { order: 'asc' },
          },
        }
      : undefined,
  });

  return categories as unknown as Category[];
}

export async function getCategoryBySlug(
  slug: string,
  businessTypeSlug?: string
): Promise<Category | null> {
  const where: Record<string, unknown> = { slug, status: 'PUBLISHED' };

  if (businessTypeSlug) {
    where.businessType = { slug: businessTypeSlug };
  }

  const category = await prisma.category.findFirst({
    where,
    include: {
      parent: true,
      businessType: true,
      _count: {
        select: { businesses: { where: { deletedAt: null } } },
      },
    },
  });

  return category as unknown as Category | null;
}

// ============================================================================
// LOCATION SERVICE
// ============================================================================

export async function getLocations(params: {
  type?: string;
  parentId?: string | null;
}): Promise<Location[]> {
  const { type, parentId } = params;

  const where: Record<string, unknown> = {};

  if (type) {
    where.type = type;
  }

  if (parentId === null) {
    where.parentId = null;
  } else if (parentId) {
    where.parentId = parentId;
  }

  const locations = await prisma.location.findMany({
    where,
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { businesses: { where: { deletedAt: null } } },
      },
    },
  });

  return locations as unknown as Location[];
}

export async function getLocationByPath(pathSegments: string[]): Promise<Location | null> {
  let parentId: string | null = null;
  let location: unknown = null;

  for (const segment of pathSegments) {
    location = await prisma.location.findFirst({
      where: { slug: segment, parentId },
    });

    if (!location) return null;
    parentId = (location as { id: string }).id;
  }

  return location as Location | null;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.business.findFirst({
      where: {
        slug,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    });

    if (!existing) break;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (!lat2 || !lon2) return 0;

  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// ============================================================================
// SEARCH SERVICE
// ============================================================================

export async function searchBusinesses(params: SearchParams): Promise<{
  results: SearchResult[];
  total: number;
}> {
  const { businesses, total } = await getBusinesses(params);

  const results: SearchResult[] = businesses.map((business) => ({
    business,
    matchScore: calculateMatchScore(params, business),
    matchReasons: getMatchReasons(params, business),
  }));

  return { results, total };
}

function calculateMatchScore(params: SearchParams, business: Business): number {
  let score = 0;

  // Location match: 30 points
  if (params.location) {
    const loc = params.location.toLowerCase();
    if (
      business.city?.toLowerCase().includes(loc) ||
      business.state?.toLowerCase().includes(loc) ||
      business.country?.toLowerCase().includes(loc)
    ) {
      score += 30;
    }
  }

  // Category match: 20 points
  if (params.category && business.category?.slug === params.category) {
    score += 20;
  }

  // Business type match: 20 points
  if (params.businessType) {
    score += 20;
  }

  // Rating bonus: up to 15 points
  if (params.rating && business.rating >= params.rating) {
    score += 15;
  } else if (business.rating >= 4) {
    score += 10;
  }

  // Featured bonus: 10 points
  if (business.featuredStatus !== 'NONE') {
    score += 10;
  }

  // Verified bonus: 5 points
  if (business.verificationStatus === 'VERIFIED') {
    score += 5;
  }

  return Math.min(score, 100);
}

function getMatchReasons(params: SearchParams, business: Business): string[] {
  const reasons: string[] = [];

  if (params.location) {
    const loc = params.location.toLowerCase();
    if (business.city?.toLowerCase().includes(loc)) {
      reasons.push(`Located in ${business.city}`);
    } else if (business.state) {
      reasons.push(`Located in ${business.state}`);
    }
  }

  if (params.category && business.category) {
    reasons.push(`${business.category.name} category`);
  }

  if (params.rating && business.rating >= params.rating) {
    reasons.push(`${business.rating.toFixed(1)} star rating`);
  }

  if (params.openNow) {
    reasons.push('Open now');
  }

  if (business.verificationStatus === 'VERIFIED') {
    reasons.push('Verified business');
  }

  if (business.reviewCount > 0) {
    reasons.push(`${business.reviewCount} reviews`);
  }

  return reasons;
}

// ============================================================================
// FEATURED BUSINESSES
// ============================================================================

export async function getFeaturedBusinesses(limit = 10): Promise<Business[]> {
  const businesses = await prisma.business.findMany({
    where: {
      deletedAt: null,
      featuredStatus: { in: ['FEATURED', 'SPONSORED'] },
    },
    orderBy: [
      { featuredStatus: 'desc' },
      { rating: 'desc' },
    ],
    take: limit,
    include: {
      businessType: true,
      offers: {
        where: { status: 'PUBLISHED', endDate: { gte: new Date() } },
        take: 1,
      },
    },
  });

  return businesses as unknown as Business[];
}

// ============================================================================
// NEARBY BUSINESSES
// ============================================================================

export async function getNearbyBusinesses(
  latitude: number,
  longitude: number,
  radiusMiles: number,
  params: Partial<SearchParams> = {}
): Promise<SearchResult[]> {
  // Get all businesses within approximate bounding box
  const approxRadius = radiusMiles / 69; // Rough conversion to degrees

  const businesses = await prisma.business.findMany({
    where: {
      deletedAt: null,
      latitude: {
        gte: latitude - approxRadius,
        lte: latitude + approxRadius,
      },
      longitude: {
        gte: longitude - approxRadius,
        lte: longitude + approxRadius,
      },
      ...(params.businessType ? { businessType: { slug: params.businessType } } : {}),
      ...(params.category ? { category: { slug: params.category } } : {}),
    },
    include: {
      businessType: true,
      offers: {
        where: { status: 'PUBLISHED', endDate: { gte: new Date() } },
        take: 1,
      },
      hours: true,
    },
  });

  // Calculate exact distance and filter
  const withDistance = businesses
    .map((b) => ({
      business: b as unknown as Business,
      distance: calculateDistance(latitude, longitude, b.latitude || 0, b.longitude || 0),
    }))
    .filter((b) => b.distance <= radiusMiles)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, params.limit || 20);

  return withDistance.map(({ business, distance }) => ({
    business,
    matchScore: 100 - distance,
    matchReasons: [`${distance.toFixed(1)} miles away`],
    distance,
  }));
}
