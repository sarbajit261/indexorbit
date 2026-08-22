import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  return 'unknown';
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const ip = getClientIP(request);

    // Find the business
    const business = await prisma.business.findFirst({
      where: { slug, deletedAt: null },
      select: { id: true },
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    // Check if this IP has already liked this business
    const existingLike = await prisma.businessLike.findFirst({
      where: {
        businessId: business.id,
        ipAddress: ip,
      },
    });

    let liked = false;
    let message = '';

    if (existingLike) {
      // Unlike - remove the like
      await prisma.$transaction([
        prisma.businessLike.delete({
          where: { id: existingLike.id },
        }),
        prisma.business.update({
          where: { id: business.id },
          data: {
            likeCount: { decrement: 1 },
          },
        }),
      ]);
      liked = false;
      message = 'Like removed';
    } else {
      // Like - add a new like
      await prisma.$transaction([
        prisma.businessLike.create({
          data: {
            businessId: business.id,
            ipAddress: ip,
          },
        }),
        prisma.business.update({
          where: { id: business.id },
          data: {
            likeCount: { increment: 1 },
          },
        }),
      ]);
      liked = true;
      message = 'Like added';
    }

    // Get updated like count
    const updatedBusiness = await prisma.business.findUnique({
      where: { id: business.id },
      select: { likeCount: true },
    });

    return NextResponse.json({
      success: true,
      liked,
      likeCount: updatedBusiness?.likeCount || 0,
      message,
    });

  } catch (error) {
    console.error('Like error:', error);
    return NextResponse.json(
      { error: 'Failed to process like' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const ip = getClientIP(request);

    // Find the business
    const business = await prisma.business.findFirst({
      where: { slug, deletedAt: null },
      select: { id: true, likeCount: true },
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    // Check if this IP has liked this business
    const existingLike = await prisma.businessLike.findFirst({
      where: {
        businessId: business.id,
        ipAddress: ip,
      },
    });

    return NextResponse.json({
      liked: !!existingLike,
      likeCount: business.likeCount || 0,
    });

  } catch (error) {
    console.error('Get like status error:', error);
    return NextResponse.json(
      { error: 'Failed to get like status' },
      { status: 500 }
    );
  }
}
