import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { cache } from 'react';

// Cache individual business queries
const getCachedBusiness = cache(async (slug: string) => {
  const business = await prisma.business.findFirst({
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

  return business;
});

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = await params;
    const business = await getCachedBusiness(slug);

    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    // Increment view count asynchronously (fire and forget)
    prisma.business.update({
      where: { id: business.id },
      data: { viewCount: { increment: 1 } },
    }).catch(console.error);

    return NextResponse.json(business);
  } catch (error) {
    console.error('Error fetching business:', error);
    return NextResponse.json(
      { error: 'Failed to fetch business' },
      { status: 500 }
    );
  }
}
