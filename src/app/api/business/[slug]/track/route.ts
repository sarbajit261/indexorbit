import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { headers } from 'next/headers';

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

    // Check if this IP has already viewed this business today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingView = await prisma.businessView.findFirst({
      where: {
        businessId: business.id,
        ipAddress: ip,
        viewedAt: {
          gte: today,
        },
      },
    });

    // Only increment if not viewed today
    if (!existingView) {
      await prisma.$transaction([
        prisma.businessView.create({
          data: {
            businessId: business.id,
            ipAddress: ip,
            viewedAt: new Date(),
          },
        }),
        prisma.business.update({
          where: { id: business.id },
          data: {
            viewCount: { increment: 1 },
          },
        }),
      ]);
    }

    // Get updated view count
    const updatedBusiness = await prisma.business.findUnique({
      where: { id: business.id },
      select: { viewCount: true },
    });

    return NextResponse.json({
      success: true,
      viewCount: updatedBusiness?.viewCount || 0,
    });
  } catch (error) {
    console.error('View tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track view' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    const business = await prisma.business.findFirst({
      where: { slug, deletedAt: null },
      select: { viewCount: true, likeCount: true },
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    return NextResponse.json({
      viewCount: business.viewCount,
      likeCount: business.likeCount,
    });
  } catch (error) {
    console.error('Get counts error:', error);
    return NextResponse.json(
      { error: 'Failed to get counts' },
      { status: 500 }
    );
  }
}
