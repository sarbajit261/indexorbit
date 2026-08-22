import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { cache } from 'react';

// Cache featured businesses
const getCachedFeaturedBusinesses = cache(async (limit: number = 10) => {
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
    orderBy: [
      { qualityScore: 'desc' },
      { rating: 'desc' },
    ],
    take: limit,
  });
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const businesses = await getCachedFeaturedBusinesses(limit);

    return NextResponse.json(businesses);
  } catch (error) {
    console.error('Error fetching featured businesses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured businesses' },
      { status: 500 }
    );
  }
}
