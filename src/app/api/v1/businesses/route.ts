import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { SearchSort } from '@/types';
import { searchBusinesses, getFeaturedBusinesses, getBusinesses } from '@/lib/services/business';

// Validation schema for search params
const searchSchema = z.object({
  query: z.string().optional(),
  businessType: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  radius: z.coerce.number().optional(),
  rating: z.coerce.number().optional(),
  priceRange: z.string().optional().transform((val) =>
    val ? val.split(',').map(Number) : undefined
  ),
  openNow: z.coerce.boolean().optional(),
  verified: z.coerce.boolean().optional(),
  featured: z.coerce.boolean().optional(),
  hasOffers: z.coerce.boolean().optional(),
  hasServices: z.coerce.boolean().optional(),
  hasProducts: z.coerce.boolean().optional(),
  sort: z.enum(['RELEVANCE', 'RATING', 'POPULARITY', 'DISTANCE', 'NEWEST', 'FEATURED' as const]).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate params
    const params = Object.fromEntries(searchParams.entries());
    const validated = searchSchema.parse(params);

    // Get businesses
    const result = await getBusinesses({
      query: validated.query,
      businessType: validated.businessType,
      category: validated.category,
      location: validated.location,
      latitude: validated.latitude,
      longitude: validated.longitude,
      radius: validated.radius,
      rating: validated.rating,
      priceRange: validated.priceRange,
      openNow: validated.openNow,
      verified: validated.verified,
      featured: validated.featured,
      hasOffers: validated.hasOffers,
      hasServices: validated.hasServices,
      hasProducts: validated.hasProducts,
      sort: validated.sort as SearchSort | undefined,
      page: validated.page,
      limit: validated.limit,
    });

    return NextResponse.json({
      success: true,
      data: result.businesses,
      pagination: {
        page: validated.page,
        limit: validated.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / validated.limit),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid parameters',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    console.error('Error fetching businesses:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// Schema for creating a business
const createBusinessSchema = z.object({
  name: z.string().min(1).max(200),
  businessTypeId: z.string().min(1),
  categoryId: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  description: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createBusinessSchema.parse(body);

    // TODO: Check authentication
    // TODO: Call createBusiness service

    return NextResponse.json({
      success: true,
      message: 'Business created successfully',
      data: validated,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    console.error('Error creating business:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
