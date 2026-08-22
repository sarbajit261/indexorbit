import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { headers } from 'next/headers';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { rating, title, content, images } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    if (!content || content.length < 10) {
      return NextResponse.json({ error: 'Review content must be at least 10 characters' }, { status: 400 });
    }

    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';

    const business = await prisma.business.findUnique({
      where: { slug, deletedAt: null },
      select: { id: true, reviewCount: true, rating: true },
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        businessId: business.id,
        userId: null, // Anonymous review
        rating,
        title: title || null,
        content,
        images: images || [],
        status: 'PENDING', // Reviews need approval
        ipAddress: ip,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Review submitted for approval',
      review,
    });
  } catch (error) {
    console.error('Review error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const business = await prisma.business.findUnique({
      where: { slug, deletedAt: null },
      select: { id: true },
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const reviews = await prisma.review.findMany({
      where: {
        businessId: business.id,
        status: 'APPROVED',
      },
      include: {
        user: {
          select: { name: true, image: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Reviews fetch error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
