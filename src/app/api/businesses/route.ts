import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { cache } from 'react';

// Helper function to check if business is currently open
function getBusinessStatus(hours: any[]) {
  if (!hours || hours.length === 0) return { isOpen: null, hours: null, nextOpen: null, nextOpenTime: null };

  const now = new Date();
  const dayOfWeek = now.getDay();
  const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"

  const todayHours = hours.find(h => h.dayOfWeek === dayOfWeek);

  // Check if currently open
  let isOpen = false;
  if (todayHours && !todayHours.isClosed && todayHours.openTime && todayHours.closeTime) {
    isOpen = currentTime >= todayHours.openTime && currentTime <= todayHours.closeTime;
  }

  // Get tomorrow's status
  const tomorrowDay = (dayOfWeek + 1) % 7;
  const tomorrowHours = hours.find(h => h.dayOfWeek === tomorrowDay);

  let nextOpen = null;
  let nextOpenTime = null;

  if (tomorrowHours) {
    if (tomorrowHours.isClosed) {
      nextOpen = 'Closed tomorrow';
      nextOpenTime = null;
    } else if (tomorrowHours.openTime) {
      nextOpen = `Opens tomorrow (${formatTime(tomorrowHours.openTime)})`;
      nextOpenTime = formatTime(tomorrowHours.openTime);
    }
  }

  return { isOpen, hours: todayHours || null, nextOpen, nextOpenTime };
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

// Cache the business listing query for better performance
const getCachedBusinesses = cache(async (params: {
  type?: string;
  category?: string;
  location?: string;
  search?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
  sort?: string;
}) => {
  const { type, category, location, search, page = 1, limit = 12, featured, sort } = params;

  const where: any = {
    deletedAt: null,
  };

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
      { address: { contains: location, mode: 'insensitive' } },
    ];
  }

  // Search by name or description
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { shortDescription: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Filter featured only
  if (featured) {
    where.featuredStatus = 'FEATURED';
  }

  // Build orderBy based on sort parameter
  let orderBy: any[] = [
    { featuredStatus: 'desc' },
    { qualityScore: 'desc' },
    { rating: 'desc' },
  ];

  if (sort === 'rating') {
    orderBy = [
      { rating: 'desc' },
      { featuredStatus: 'desc' },
      { qualityScore: 'desc' },
    ];
  } else if (sort === 'name') {
    orderBy = { name: 'asc' };
  }

  const [businesses, total] = await Promise.all([
    prisma.business.findMany({
      where,
      include: {
        businessType: true,
        category: true,
        hours: true,
        _count: {
          select: { reviews: { where: { status: 'APPROVED' } } },
        },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.business.count({ where }),
  ]);

  // Transform to include fields needed by ListingCard
  const transformedBusinesses = businesses.map(b => {
    const status = getBusinessStatus(b.hours);
    return {
      ...b,
      coverImage: b.coverImage || b.image || null,
      reviewCount: b._count?.reviews || 0,
      isOpen: status.isOpen,
      openTime: status.hours?.openTime ? formatTime(status.hours.openTime) : null,
      closeTime: status.hours?.closeTime ? formatTime(status.hours.closeTime) : null,
      nextOpen: status.nextOpen,
    };
  });

  return {
    businesses: transformedBusinesses,
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

    const type = searchParams.get('type') || undefined;
    const category = searchParams.get('category') || undefined;
    const location = searchParams.get('location') || undefined;
    const search = searchParams.get('search') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const featured = searchParams.get('featured') === 'true';
    const sort = searchParams.get('sort') || undefined;

    const result = await getCachedBusinesses({
      type,
      category,
      location,
      search,
      page,
      limit,
      featured,
      sort,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch businesses' },
      { status: 500 }
    );
  }
}
