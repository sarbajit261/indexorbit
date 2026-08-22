import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { cache } from 'react';

// Cache business types
const getCachedBusinessTypes = cache(async () => {
  const types = await prisma.businessType.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { order: 'asc' },
    include: {
      _count: {
        select: {
          categories: true,
          businesses: { where: { deletedAt: null } },
        },
      },
    },
  });

  return types;
});

export async function GET() {
  try {
    const types = await getCachedBusinessTypes();

    return NextResponse.json(types);
  } catch (error) {
    console.error('Error fetching business types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch business types' },
      { status: 500 }
    );
  }
}
