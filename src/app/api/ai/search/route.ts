import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import prisma from '@/lib/db/prisma';
import { z } from 'zod';

const searchSchema = z.object({
  query: z.string().min(1),
  filters: z.object({
    businessType: z.string().optional(),
    category: z.string().optional(),
    location: z.string().optional(),
    minRating: z.number().optional(),
    openNow: z.boolean().optional(),
    priceRange: z.array(z.string()).optional(),
  }).optional(),
  limit: z.number().min(1).max(50).default(10),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();
    const { query, filters, limit } = searchSchema.parse(body);

    // Build where clause from filters
    const where: Record<string, unknown> = {
      deletedAt: null,
    };

    if (filters?.businessType) {
      where.businessType = { slug: filters.businessType };
    }

    if (filters?.category) {
      where.category = { slug: filters.category };
    }

    if (filters?.location) {
      where.OR = [
        { city: { contains: filters.location, mode: 'insensitive' } },
        { state: { contains: filters.location, mode: 'insensitive' } },
        { country: { contains: filters.location, mode: 'insensitive' } },
      ];
    }

    if (filters?.minRating) {
      where.rating = { gte: filters.minRating };
    }

    if (filters?.priceRange && filters.priceRange.length > 0) {
      where.priceRange = { in: filters.priceRange };
    }

    if (filters?.openNow) {
      const now = new Date();
      const dayOfWeek = now.getDay();
      where.hours = {
        some: {
          dayOfWeek,
          isOpen: true,
          OR: [
            { closeTime: null },
            { closeTime: { gte: now.toTimeString().slice(0, 5) } },
          ],
        },
      };
    }

    const businesses = await prisma.business.findMany({
      where,
      take: limit,
      orderBy: [
        { featuredStatus: 'desc' },
        { rating: 'desc' },
        { reviewCount: 'desc' },
      ],
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        logo: true,
        coverImage: true,
        city: true,
        state: true,
        country: true,
        rating: true,
        reviewCount: true,
        priceRange: true,
        verificationStatus: true,
        featuredStatus: true,
        businessType: {
          select: { name: true, slug: true, color: true },
        },
        offers: {
          where: {
            status: 'PUBLISHED',
            endDate: { gte: new Date() },
          },
          take: 1,
        },
        services: {
          where: { status: 'PUBLISHED' },
          take: 5,
        },
      },
    });

    // Calculate match scores
    const results = businesses.map((business) => {
      const matchScore = calculateMatchScore(business, query);
      const matchReasons = extractMatchReasons(business, query);
      return { ...business, matchScore, matchReasons };
    }).sort((a, b) => b.matchScore - a.matchScore);

    // Store search event
    if (session?.user) {
      await prisma.searchEvent.create({
        data: {
          query,
          resultsCount: results.length,
          searchType: 'AI',
          userId: session.user.id,
          aiParsed: true,
        },
      });
    }

    return NextResponse.json({ results, query });
  } catch (error) {
    console.error('AI search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}

function calculateMatchScore(business: Record<string, unknown>, query: string): number {
  const queryLower = query.toLowerCase();
  let score = 50; // Base score

  // Name match
  if ((business.name as string)?.toLowerCase().includes(queryLower)) {
    score += 20;
  }

  // Description match
  if ((business.shortDescription as string)?.toLowerCase().includes(queryLower)) {
    score += 15;
  }

  // Location match
  if (queryLower.includes((business.city as string)?.toLowerCase() || '')) {
    score += 10;
  }
  if (queryLower.includes((business.state as string)?.toLowerCase() || '')) {
    score += 5;
  }

  // Business type match
  if (queryLower.includes((business.businessType as { slug: string })?.slug || '')) {
    score += 10;
  }

  // Rating bonus
  const rating = business.rating as number | null;
  if (rating && rating >= 4.5) score += 5;

  // Featured bonus
  if (business.featuredStatus === 'FEATURED' || business.featuredStatus === 'SPONSORED') {
    score += 5;
  }

  return Math.min(100, score);
}

function extractMatchReasons(business: Record<string, unknown>, query: string): string[] {
  const reasons: string[] = [];
  const queryLower = query.toLowerCase();

  // Location match
  if (queryLower.includes((business.city as string)?.toLowerCase() || '')) {
    reasons.push(`Located in ${business.city}`);
  }

  // Business type
  if ((business.businessType as { name: string })?.name) {
    reasons.push(`${(business.businessType as { name: string }).name}`);
  }

  // Rating
  const rating = business.rating as number | null;
  if (rating && rating >= 4) {
    reasons.push(`${rating.toFixed(1)} star rating`);
  }

  // Reviews
  const reviewCount = business.reviewCount as number;
  if (reviewCount && reviewCount > 10) {
    reasons.push(`${reviewCount} reviews`);
  }

  // Offers
  const offers = business.offers as Array<unknown>;
  if (offers && offers.length > 0) {
    reasons.push('Has active offers');
  }

  return reasons.slice(0, 4);
}
