import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { headers } from 'next/headers';
import { ReportReason } from '@prisma/client';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { reason, description } = body;

    if (!reason) {
      return NextResponse.json({ error: 'Reason is required' }, { status: 400 });
    }

    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';

    const business = await prisma.business.findUnique({
      where: { slug, deletedAt: null },
      select: { id: true },
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const report = await prisma.businessReport.create({
      data: {
        businessId: business.id,
        reason: reason as ReportReason,
        description: description || null,
        reporterIp: ip,
      },
    });

    return NextResponse.json({ success: true, message: 'Report submitted', report });
  } catch (error) {
    console.error('Report error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
