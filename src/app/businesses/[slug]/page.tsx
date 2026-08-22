import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Mail, Globe, Star, Clock, ChevronLeft, ExternalLink, Tag, Award, CheckCircle, ArrowRight, Navigation, Eye, Heart, Bookmark, Share2, Flag, X, Send, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import prisma from '@/lib/db/prisma';
import type { Metadata } from 'next';
import { BusinessPageClient } from './client';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getBusiness(slug: string) {
  const business = await prisma.business.findFirst({
    where: { slug, deletedAt: null },
    include: {
      businessType: true,
      offers: {
        where: { status: 'PUBLISHED', endDate: { gte: new Date() } },
        orderBy: { endDate: 'asc' },
      },
      reviews: {
        where: { status: 'APPROVED' },
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, image: true } } },
      },
      hours: { orderBy: { dayOfWeek: 'asc' } },
      amenities: { include: { amenity: true } },
      facilities: { include: { facility: true } },
      gallery: { orderBy: { order: 'asc' } },
      faqs: { orderBy: { order: 'asc' } },
    },
  });

  if (!business) return null;

  const similarBusinesses = await prisma.business.findMany({
    where: { deletedAt: null, id: { not: business.id }, businessTypeId: business.businessTypeId },
    select: { id: true, name: true, slug: true, logo: true, rating: true, reviewCount: true },
    take: 4,
  });

  return { business, similarBusinesses };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getBusiness(slug);
  if (!data) return { title: 'Business Not Found' };
  return {
    title: `${data.business.name} - IndexOrbit`,
    description: data.business.shortDescription || data.business.description,
  };
}

export default async function BusinessPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getBusiness(slug);
  if (!data) notFound();

  const { business, similarBusinesses } = data;
  const googleMapsUrl = business.latitude && business.longitude
    ? `https://www.google.com/maps?q=${business.latitude},${business.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address || business.name)}`;

  const amenityIcons: Record<string, string> = {
    'wifi': '📶', 'car': '🚗', 'accessibility': '♿', 'wind': '💨',
    'paw-print': '🐾', 'users': '👥', 'sun': '☀️', 'home': '🏠',
    'music': '🎵', 'tv': '📺', 'concierge-bell': '🔔', 'waves': '🌊',
    'door-open': '🚪', 'coffee': '☕', 'lock': '🔒',
  };

  return (
    <>
      <Header />
      <BusinessPageClient
        business={JSON.parse(JSON.stringify(business))}
        similarBusinesses={JSON.parse(JSON.stringify(similarBusinesses))}
        googleMapsUrl={googleMapsUrl}
        amenityIcons={amenityIcons}
      />
      <Footer />
    </>
  );
}
