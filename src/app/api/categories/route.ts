import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '12');
  const type = searchParams.get('type') || undefined;
  const slug = searchParams.get('slug') || undefined;

  const where: any = { status: 'PUBLISHED' };
  if (type) {
    const businessType = await prisma.businessType.findFirst({
      where: { slug: type },
      select: { id: true },
    });
    if (businessType) {
      where.businessTypeId = businessType.id;
    }
  }
  if (slug) {
    where.slug = slug;
  }

  const categories = await prisma.category.findMany({
    where,
    include: {
      businessType: {
        select: { name: true, slug: true, icon: true, color: true },
      },
      _count: {
        select: { businesses: true },
      },
    },
    orderBy: {
      businesses: {
        _count: 'desc',
      },
    },
    take: limit,
  });

  return NextResponse.json(categories);
}
