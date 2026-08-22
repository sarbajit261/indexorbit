import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { cache } from 'react';

// Cache categories
const getCachedCategories = cache(async (slug?: string) => {
  const where: any = { status: 'PUBLISHED' };

  if (slug) {
    where.slug = slug;
  }

  const categories = await prisma.category.findMany({
    where,
    orderBy: { order: 'asc' },
    include: {
      businessType: true,
      _count: {
        select: { businesses: { where: { deletedAt: null } } },
      },
    },
  });

  return categories;
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug') || undefined;
    const type = searchParams.get('type') || undefined;

    let categories = await getCachedCategories(slug);

    // If type is provided, filter categories by business type
    if (type && !slug) {
      categories = categories.filter(c => c.businessType.slug === type);
    }

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
