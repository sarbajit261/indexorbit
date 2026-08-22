import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'site_settings' },
    });

    if (!settings) {
      return NextResponse.json({
        siteName: 'IndexOrbit',
        tagline: 'Discover local businesses with AI-powered search',
        contactEmail: null,
        contactPhone: null,
        contactAddress: null,
        socialTwitter: null,
        socialFacebook: null,
        socialInstagram: null,
        socialLinkedin: null,
        newsletterTitle: 'Stay updated',
        newsletterDesc: 'Get the latest business listings and updates delivered to your inbox.',
        footerBrandDesc: 'Discover local businesses with AI-powered search.',
        heroImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&q=80',
        popularSearches: ['restaurants near me', 'hotels in downtown', 'best coffee shops', '24 hour gyms'],
      });
    }

    const popularSearches = Array.isArray(settings.popularSearches)
      ? settings.popularSearches
      : [];

    return NextResponse.json({
      siteName: settings.siteName,
      siteDescription: settings.siteDescription,
      tagline: settings.tagline,
      ctaTitle: settings.ctaTitle,
      ctaDescription: settings.ctaDescription,
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone,
      contactAddress: settings.contactAddress,
      socialTwitter: settings.socialTwitter,
      socialFacebook: settings.socialFacebook,
      socialInstagram: settings.socialInstagram,
      socialLinkedin: settings.socialLinkedin,
      newsletterTitle: settings.newsletterTitle,
      newsletterDesc: settings.newsletterDesc,
      footerBrandDesc: settings.footerBrandDesc,
      heroImage: settings.heroImage,
      popularSearches,
    });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site settings' },
      { status: 500 }
    );
  }
}
