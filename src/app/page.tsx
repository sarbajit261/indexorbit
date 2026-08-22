import Link from 'next/link';
import { Search, MapPin, Star, TrendingUp, ArrowRight, Phone, Mail, Globe, Clock, Utensils, Home, ShoppingBag, Wrench, Scissors, Dumbbell, Building, Stethoscope, Car, GraduationCap, Briefcase, Factory, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { FeaturedCarousel } from '@/components/home/featured-carousel';
import prisma from '@/lib/db/prisma';

// Demo images for different business types
const demoImages = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&q=80',
  'https://images.unsplash.com/photo-1521017432531-f0eb6d15da6c?w=600&q=80',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
];

async function getFeaturedBusinesses() {
  const businesses = await prisma.business.findMany({
    where: { deletedAt: null },
    take: 5,
    orderBy: [{ featuredStatus: 'desc' }, { rating: 'desc' }, { viewCount: 'desc' }],
    include: {
      businessType: true,
      offers: {
        where: { status: 'PUBLISHED', endDate: { gte: new Date() } },
        take: 1,
      },
      services: { take: 3 },
    },
  });
  return businesses.map((business, index) => ({
    ...business,
    coverImage: business.coverImage || demoImages[index % demoImages.length],
  }));
}

async function getLatestOffers() {
  const offers = await prisma.offer.findMany({
    where: {
      status: 'PUBLISHED',
      endDate: { gte: new Date() },
    },
    include: {
      business: {
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
          city: true,
          state: true,
          rating: true,
          reviewCount: true,
          verificationStatus: true,
        },
      },
      businessType: true,
      category: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 6,
  });
  return offers;
}

async function getLatestNews() {
  const news = await prisma.businessNews.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      business: {
        select: { name: true, slug: true },
      },
    },
    orderBy: { publishDate: 'desc' },
    take: 3,
  });
  return news;
}

async function getPopularCategories() {
  const categories = await prisma.category.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      businessType: {
        select: { name: true, slug: true },
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
    take: 12,
  });
  return categories;
}

async function getPopularLocations() {
  const locations = await prisma.location.findMany({
    take: 4,
    orderBy: { name: 'asc' },
    select: { id: true, name: true, slug: true },
  });
  return locations.map((loc) => ({
    name: loc.name,
    slug: loc.slug || loc.name.toLowerCase().replace(/\s+/g, '-'),
  }));
}

async function getTopBusinessTypes() {
  const types = await prisma.businessType.findMany({
    where: { isActive: true },
    take: 8,
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { businesses: true, categories: true },
      },
    },
  });
  return types;
}

async function getSiteSettings() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/site-settings`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}

const getCategoryIcon = (iconName: string | null, businessTypeSlug: string) => {
  const iconMap: Record<string, any> = {
    utensils: Utensils,
    home: Home,
    'shopping-bag': ShoppingBag,
    wrench: Wrench,
    scissors: Scissors,
    dumbbell: Dumbbell,
    car: Car,
    stethoscope: Stethoscope,
    'graduation-cap': GraduationCap,
    briefcase: Briefcase,
    factory: Factory,
    plane: Plane,
    building: Building,
    default: Building,
  };
  if (iconName && iconMap[iconName]) return iconMap[iconName];
  return iconMap[businessTypeSlug] || iconMap.default;
};

const getCategoryColors = (businessTypeSlug: string) => {
  const colorMap: Record<string, { bg: string; icon: string }> = {
    'food-dining': { bg: 'bg-orange-100', icon: 'text-orange-500' },
    'accommodation-hospitality': { bg: 'bg-blue-100', icon: 'text-blue-500' },
    'retail-shopping': { bg: 'bg-purple-100', icon: 'text-purple-500' },
    'health-medical': { bg: 'bg-red-100', icon: 'text-red-500' },
    'automotive': { bg: 'bg-gray-100', icon: 'text-gray-500' },
    'beauty-wellness': { bg: 'bg-pink-100', icon: 'text-pink-500' },
    'education-training': { bg: 'bg-indigo-100', icon: 'text-indigo-500' },
    'professional-services': { bg: 'bg-teal-100', icon: 'text-teal-500' },
    'entertainment': { bg: 'bg-yellow-100', icon: 'text-yellow-500' },
    'construction': { bg: 'bg-amber-100', icon: 'text-amber-500' },
    'travel-transportation': { bg: 'bg-cyan-100', icon: 'text-cyan-500' },
    'events': { bg: 'bg-rose-100', icon: 'text-rose-500' },
    'pets': { bg: 'bg-lime-100', icon: 'text-lime-500' },
    'agriculture': { bg: 'bg-green-100', icon: 'text-green-500' },
    'finance': { bg: 'bg-emerald-100', icon: 'text-emerald-500' },
    default: { bg: 'bg-gray-100', icon: 'text-gray-500' },
  };
  return colorMap[businessTypeSlug] || colorMap.default;
};

const businessTypeIcons: Record<string, any> = {
  'food-dining': Utensils,
  'accommodation-hospitality': Home,
  'retail-shopping': ShoppingBag,
  'professional-services': Briefcase,
  'health-medical': Stethoscope,
  'automotive': Car,
  'beauty-wellness': Scissors,
  'education-training': GraduationCap,
  'construction': Wrench,
  'travel-transportation': Plane,
  'entertainment': Building,
  'events': Factory,
  'pets': Dumbbell,
  'agriculture': Factory,
  'finance': Briefcase,
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= Math.round(rating)
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
          }`}
        />
      ))}
      <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  );
}

function OfferCard({ offer }: { offer: any }) {
  return (
    <Link href={`/businesses/${offer.business.slug}/offers/${offer.slug}`}>
      <CardContent className="p-4 hover:shadow-md transition-shadow cursor-pointer h-full">
        <div className="flex items-start justify-between mb-2">
          <Badge
            className={
              offer.isFeatured
                ? 'bg-red-100 text-red-700 hover:bg-red-100'
                : offer.isExclusive
                  ? 'bg-purple-100 text-purple-700 hover:bg-purple-100'
                  : 'bg-green-100 text-green-700 hover:bg-green-100'
            }
          >
            {offer.isFeatured ? '🔥 Featured' : offer.isExclusive ? '⭐ Exclusive' : 'Special'}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {offer.category?.name}
          </Badge>
        </div>
        <h4 className="font-semibold group-hover:text-primary transition-colors">
          {offer.title}
        </h4>
        <p className="text-sm text-muted-foreground">{offer.business.name}</p>
      </CardContent>
    </Link>
  );
}

export default async function HomePage() {
  const [featuredBusinesses, latestOffers, latestNews, popularCategories, popularLocations, topBusinessTypes, settings] = await Promise.all([
    getFeaturedBusinesses(),
    getLatestOffers(),
    getLatestNews(),
    getPopularCategories(),
    getPopularLocations(),
    getTopBusinessTypes(),
    getSiteSettings(),
  ]);

  const heroImage = settings?.heroImage || 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&q=80';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* Hero Section */}
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        </div>

        <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              {settings?.siteName || 'IndexOrbit'}
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto">
              {settings?.tagline || 'Discover local businesses with AI-powered search'}
            </p>

            {/* Search Bar */}
            <form className="relative max-w-2xl mx-auto mb-6" onSubmit={(e) => { e.preventDefault(); if (searchQuery) router.push(`/search?q=${encodeURIComponent(searchQuery)}`); }}>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for businesses, services, or offers..."
                className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 bg-white border-0 focus:ring-2 focus:ring-primary/50 text-lg"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[#0a897d] hover:bg-[#0d6e6a]"
              >
                Search
              </Button>
            </form>

            {/* Location selector */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="h-4 w-4 text-white/60" />
              <select className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/30">
                <option value="">All Locations</option>
                {popularLocations.map((loc) => (
                  <option key={loc.slug} value={loc.slug} className="text-gray-900">{loc.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-b">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-[#0a897d]">
                {featuredBusinesses.length > 0 ? `${(featuredBusinesses.length * 125).toLocaleString()}+` : '500+'}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Businesses Listed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#0a897d]">
                {topBusinessTypes.length}+
              </div>
              <div className="text-sm text-muted-foreground mt-1">Business Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#0a897d]">
                {popularLocations.length > 0 ? popularLocations.length : 4}+
              </div>
              <div className="text-sm text-muted-foreground mt-1">Cities Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#0a897d]">
                {latestOffers.length > 0 ? `${latestOffers.length * 24}+` : '100+'}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Active Offers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Businesses Carousel */}
      {featuredBusinesses.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Featured Businesses</h2>
                <p className="text-gray-600 mt-2">Top-rated businesses in your area</p>
              </div>
              <Link href="/businesses">
                <Button variant="outline" className="gap-2">
                  View All <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <FeaturedCarousel businesses={featuredBusinesses} />
          </div>
        </section>
      )}

      {/* Popular Categories */}
      {popularCategories.length > 0 && (
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Popular Categories</h2>
                <p className="text-gray-600 mt-2">Explore businesses by category</p>
              </div>
              <Link href="/business-category">
                <Button variant="ghost" className="text-sm text-primary hover:underline flex items-center gap-1 font-medium">
                  See more <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {popularCategories.map((category) => {
                const Icon = getCategoryIcon(category.icon, category.businessType?.slug || '');
                const colors = getCategoryColors(category.businessType?.slug || '');
                return (
                  <Link key={category.id} href={`/business-category/${category.slug}`} className="group">
                    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:-translate-y-1 hover:border-primary/50 transition-all duration-300">
                      <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <Icon className={`h-6 w-6 ${colors.icon}`} />
                      </div>
                      <h3 className="font-medium text-gray-900 text-sm mb-1 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {category._count?.businesses || 0} businesses
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Latest Offers */}
      {latestOffers.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Latest Offers</h2>
                <p className="text-gray-600 mt-2">Exclusive deals from local businesses</p>
              </div>
              <Link href="/offers">
                <Button variant="outline" className="gap-2">
                  View All <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Browse by Business Type */}
      {topBusinessTypes.length > 0 && (
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Browse by Business Type</h2>
              <p className="text-gray-600 mt-2">Find the right type of business for your needs</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {topBusinessTypes.map((type) => {
                const IconComponent = businessTypeIcons[type.slug] || Building;
                return (
                  <Link key={type.id} href={`/business-types/${type.slug}`} className="group">
                    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 hover:border-primary/50 transition-all duration-300 text-center">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                        <IconComponent className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                        {type.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {type._count?.businesses || 0} businesses
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#0a897d] to-[#0d6e6a] text-white">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {settings?.ctaTitle || 'Own a Business?'}
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            {settings?.ctaDescription || 'List your business on IndexOrbit and reach thousands of potential customers looking for services like yours.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                Get Started Free
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
