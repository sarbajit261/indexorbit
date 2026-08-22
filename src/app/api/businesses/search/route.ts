import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { cache } from 'react';

// Cache search results
const getCachedSearchResults = cache(async (query: string, limit: number = 10) => {
  if (!query || query.length < 2) {
    return { businesses: [], categories: [], locations: [] };
  }

  const [businesses, categories, locations] = await Promise.all([
    // Search businesses
    prisma.business.findMany({
      where: {
        deletedAt: null,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { shortDescription: { contains: query, mode: 'insensitive' } },
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

    // Search categories
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

    // Search locations
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

  // Format locations
  const uniqueLocations = locations.reduce((acc: any[], loc) => {
    const key = `${loc.city}, ${loc.state}`;
    if (!acc.find(l => l.name === key)) {
      acc.push({ name: key, city: loc.city, state: loc.state });
    }
    return acc;
  }, []);

  return {
    businesses,
    categories,
    locations: uniqueLocations,
  };
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '10');

    const results = await getCachedSearchResults(query, limit);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
