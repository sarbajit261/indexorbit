import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { searchBusinesses } from '@/lib/services/business';
import prisma from '@/lib/db/prisma';

// Validation schema for search
const searchSchema = z.object({
  q: z.string().min(1).max(500),
  location: z.string().optional(),
  type: z.string().optional(),
  category: z.string().optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
  openNow: z.coerce.boolean().optional(),
  hasOffers: z.coerce.boolean().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  userId: z.string().optional(),
  sessionId: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate
    const params = {
      q: searchParams.get('q') || '',
      location: searchParams.get('location') || undefined,
      type: searchParams.get('type') || undefined,
      category: searchParams.get('category') || undefined,
      rating: searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined,
      openNow: searchParams.get('openNow') === 'true',
      hasOffers: searchParams.get('hasOffers') === 'true',
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 20,
    };

    const validated = searchSchema.parse(params);

    // Search businesses
    const { results, total } = await searchBusinesses({
      query: validated.q,
      businessType: validated.type,
      category: validated.category,
      location: validated.location,
      rating: validated.rating,
      openNow: validated.openNow,
      hasOffers: validated.hasOffers,
      page: validated.page,
      limit: validated.limit,
    });

    // Track search event
    try {
      await prisma.searchEvent.create({
        data: {
          query: validated.q,
          location: validated.location,
          filters: {
            type: validated.type,
            category: validated.category,
            rating: validated.rating,
            openNow: validated.openNow,
            hasOffers: validated.hasOffers,
          },
          userId: validated.userId || null,
          sessionId: validated.sessionId || null,
          resultsCount: total,
          searchType: 'MANUAL',
        },
      });
    } catch (trackError) {
      // Don't fail the search if tracking fails
      console.error('Failed to track search:', trackError);
    }

    return NextResponse.json({
      success: true,
      data: results,
      meta: {
        query: validated.q,
        total,
        page: validated.page,
        limit: validated.limit,
        totalPages: Math.ceil(total / validated.limit),
        hasMore: validated.page * validated.limit < total,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid search parameters',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    console.error('Search error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Search failed',
      },
      { status: 500 }
    );
  }
}
