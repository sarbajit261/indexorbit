import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { headers } from 'next/headers';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';

    const business = await prisma.business.findUnique({
      where: { slug, deletedAt: null },
      select: { id: true },
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    // Check if already liked from this IP
    const existingLike = await prisma.businessLike.findUnique({
      where: {
        businessId_ipAddress: {
          businessId: business.id,
          ipAddress: ip,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await prisma.businessLike.delete({
        where: { id: existingLike.id },
      });
      await prisma.business.update({
        where: { id: business.id },
        data: { likeCount: { decrement: 1 } },
      });
      return NextResponse.json({ liked: false, message: 'Like removed' });
    } else {
      // Like
      await prisma.businessLike.create({
        data: {
          businessId: business.id,
          ipAddress: ip,
        },
      });
      await prisma.business.update({
        where: { id: business.id },
        data: { likeCount: { increment: 1 } },
      });
      return NextResponse.json({ liked: true, message: 'Liked' });
    }
  } catch (error) {
    console.error('Like error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';

    const business = await prisma.business.findUnique({
      where: { slug, deletedAt: null },
      select: { id: true, likeCount: true },
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const liked = await prisma.businessLike.findUnique({
      where: {
        businessId_ipAddress: {
          businessId: business.id,
          ipAddress: ip,
        },
      },
    });

    return NextResponse.json({ liked: !!liked, likeCount: business.likeCount });
  } catch (error) {
    console.error('Get like error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
