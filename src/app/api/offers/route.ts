import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { cache } from 'react';

// Cache offers query
const getCachedOffers = cache(async (params: {
  slug?: string;
  businessId?: string;
  businessType?: string;
  page?: number;
  limit?: number;
}) => {
  const { slug, businessId, businessType, page = 1, limit = 12 } = params;

  const where: any = {
    status: 'PUBLISHED',
    endDate: { gte: new Date() },
  };

  if (slug) {
    where.slug = slug;
  }

  if (businessId) {
    where.businessId = businessId;
  }

  if (businessType) {
    where.business = { businessType: { slug: businessType } };
  }

  const [offers, total] = await Promise.all([
    prisma.offer.findMany({
      where,
      include: {
        business: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            city: true,
            state: true,
            address: true,
            phone: true,
            website: true,
            latitude: true,
            longitude: true,
            rating: true,
            reviewCount: true,
            verificationStatus: true,
            category: {
              select: { id: true, name: true, slug: true }
            },
            businessType: {
              select: { id: true, name: true, slug: true }
            },
          },
        },
      },
      orderBy: [
        { isFeatured: 'desc' },
        { endDate: 'asc' },
        { createdAt: 'desc' },
      ],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.offer.count({ where }),
  ]);

  return {
    offers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  };
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug') || undefined;
    const businessId = searchParams.get('businessId') || undefined;
    const businessType = searchParams.get('businessType') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    const result = await getCachedOffers({
      slug,
      businessId,
      businessType,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching offers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch offers' },
      { status: 500 }
    );
  }
}