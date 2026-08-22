import Link from 'next/link';
import { Search, MapPin, Star, TrendingUp, ArrowRight, Phone, Mail, Globe, Clock, Utensils, Home, ShoppingBag, Wrench, Scissors, Dumbbell, Building, Stethoscope, Car, GraduationCap, Briefcase, Factory, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { FeaturedCarousel } from '@/components/home/featured-carousel';
import prisma from '@/lib/db/prisma';

// Popular locations
const popularLocations = [
  { name: 'New York City', slug: 'new-york-city', count: 1234 },
  { name: 'Los Angeles', slug: 'los-angeles', count: 987 },
  { name: 'Austin', slug: 'austin', count: 654 },
  { name: 'Miami', slug: 'miami', count: 543 },
];

// Demo images for different business types
const demoImages = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80', // Restaurant
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80', // Hotel
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80', // Shop
  'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80', // Service
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80', // Salon
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80', // Gym
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80', // Bar/Cafe
  'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=600&q=80', // Spa
];

async function getFeaturedBusinesses() {
  const businesses = await prisma.business.findMany({
    where: {
      deletedAt: null,
    },
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

  // Assign demo images if no cover image exists
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
    take: 6,
    orderBy: { createdAt: 'desc' },
    include: {
      business: {
        select: {
          name: true,
          slug: true,
          logo: true,
          city: true,
          rating: true,
        },
      },
    },
  });
  return offers;
}

async function getLatestNews() {
  const news = await prisma.businessNews.findMany({
    where: { status: 'PUBLISHED' },
    take: 3,
    orderBy: { publishDate: 'desc' },
    include: {
      business: {
        select: { name: true, slug: true },
      },
    },
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

// Icon mapping for categories based on business type
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

  if (iconName && iconMap[iconName]) {
    return iconMap[iconName];
  }
  return iconMap[businessTypeSlug] || iconMap.default;
};

// Color mapping for categories
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
    'home-property': { bg: 'bg-amber-100', icon: 'text-amber-500' },
    'entertainment-events': { bg: 'bg-rose-100', icon: 'text-rose-500' },
    'sports-recreation': { bg: 'bg-green-100', icon: 'text-green-500' },
    'financial-services': { bg: 'bg-emerald-100', icon: 'text-emerald-500' },
    default: { bg: 'bg-gray-100', icon: 'text-gray-500' },
  };

  return colorMap[businessTypeSlug] || colorMap.default;
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
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {offer.business.logo && (
              <img
                src={offer.business.logo}
                alt=""
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <Badge className="mb-2 bg-red-500">
                {offer.discountType === 'PERCENTAGE'
                  ? `${offer.discountValue}% OFF`
                  : offer.discountType === 'FIXED'
                  ? `$${offer.discountValue} OFF`
                  : 'Special'}
              </Badge>
              <h4 className="font-semibold group-hover:text-primary transition-colors">
                {offer.title}
              </h4>
              <p className="text-sm text-muted-foreground">{offer.business.name}</p>
            </div>
          </div>
          {offer.description && (
            <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
              {offer.description}
            </p>
          )}
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Expires {new Date(offer.endDate).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default async function HomePage() {
  const [featuredBusinesses, latestOffers, latestNews, popularCategories] = await Promise.all([
    getFeaturedBusinesses(),
    getLatestOffers(),
    getLatestNews(),
    getPopularCategories(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* Hero Section */}
      <section className="relative overflow-hidden text-white">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        </div>

        <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-balance">
              Discover Local Businesses
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              IndexOrbit is the region&apos;s top business discovery platform
            </p>

            {/* Large rounded search bar */}
            <form action="/businesses" method="get" className="bg-white rounded-full p-1.5 shadow-2xl flex flex-col md:flex-row items-stretch gap-1 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="q"
                  placeholder="Find food, spas, services, shops, ..."
                  className="w-full h-12 pl-12 pr-4 rounded-full text-gray-900 placeholder:text-gray-400 focus:outline-none text-base"
                />
              </div>

              <div className="hidden md:block w-px bg-gray-200 self-center h-8" />

              <div className="relative md:w-56">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  name="location"
                  className="w-full h-12 pl-11 pr-4 rounded-full text-gray-900 focus:outline-none appearance-none bg-transparent cursor-pointer text-base"
                  defaultValue=""
                >
                  <option value="" disabled>All Locations</option>
                  <option value="new-york-city">New York City</option>
                  <option value="los-angeles">Los Angeles</option>
                  <option value="austin">Austin</option>
                  <option value="miami">Miami</option>
                </select>
              </div>

              <Button
                type="submit"
                size="lg"
                className="h-12 px-6 rounded-full bg-primary hover:bg-primary/90 gap-2"
              >
                <Search className="h-5 w-5" />
                <span className="hidden sm:inline">Search</span>
              </Button>
            </form>

            {/* Pill-shaped category tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              <button className="px-6 py-2 rounded-full bg-white text-gray-900 font-medium shadow-sm text-sm hover:bg-gray-100 transition-colors">
                Businesses
              </button>
              <button className="px-6 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors font-medium text-sm">
                Services
              </button>
              <button className="px-6 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors font-medium text-sm">
                Offers
              </button>
            </div>

            <p className="text-base text-white/90">
              Search across thousands of businesses, shops, and services near you.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      {featuredBusinesses.length > 0 && (
        <FeaturedCarousel businesses={featuredBusinesses} />
      )}

      {/* Browse by Category */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl">
                <span className="font-light">Browse by </span>
                <span className="font-bold">Category</span>
              </h2>
            </div>
            <Link href="/business-category" className="text-sm text-primary hover:underline flex items-center gap-1 font-medium">
              See more <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Categories Grid - from database */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {popularCategories.map((category) => {
              const Icon = getCategoryIcon(category.icon, category.businessType?.slug || '');
              const colors = getCategoryColors(category.businessType?.slug || '');
              return (
                <Link key={category.id} href={`/business-category/${category.slug}`} className="group">
                  <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:-translate-y-1 hover:border-primary/50 transition-all duration-300">
                    <div className={`w-14 h-14 rounded-2xl ${colors.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 mb-3`}>
                      <Icon className={`h-7 w-7 ${colors.icon}`} />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 block truncate">{category.name}</span>
                    <span className="text-xs text-gray-500">{category._count.businesses} businesses</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Browse by Business Type */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl">
                <span className="font-light">Browse by </span>
                <span className="font-bold">Business Type</span>
              </h2>
              <p className="text-sm text-gray-500 mt-1">Find exactly what you need</p>
            </div>
            <Link href="/businesses" className="text-sm text-primary hover:underline flex items-center gap-1 font-medium">
              See all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Business Types Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              { name: 'Food & Dining', slug: 'food-dining', icon: Utensils, color: 'from-orange-100 to-red-100', iconText: 'text-orange-600', description: 'Restaurants, Cafes, Bakeries, Fast Food' },
              { name: 'Hotels & Accommodation', slug: 'hotels-accommodation', icon: Home, color: 'from-blue-100 to-indigo-100', iconText: 'text-blue-600', description: 'Hotels, Resorts, Motels, Hostels' },
              { name: 'Retail & Shopping', slug: 'retail-shopping', icon: ShoppingBag, color: 'from-purple-100 to-violet-100', iconText: 'text-purple-600', description: 'Stores, Supermarkets, Specialty Shops' },
              { name: 'Professional Services', slug: 'professional-services', icon: Building, color: 'from-slate-100 to-gray-100', iconText: 'text-slate-600', description: 'Consultants, Lawyers, Architects' },
              { name: 'Home & Property Services', slug: 'home-property-services', icon: Wrench, color: 'from-cyan-100 to-teal-100', iconText: 'text-cyan-600', description: 'Plumbers, Electricians, HVAC, Cleaning' },
              { name: 'Construction & Contractors', slug: 'construction-contractors', icon: Building, color: 'from-amber-100 to-orange-100', iconText: 'text-amber-600', description: 'Builders, Remodelers, Flooring' },
              { name: 'Automotive', slug: 'automotive', icon: Building, color: 'from-gray-100 to-slate-100', iconText: 'text-gray-600', description: 'Car Dealers, Mechanics, Auto Repair' },
              { name: 'Health & Medical', slug: 'health-medical', icon: Building, color: 'from-red-100 to-pink-100', iconText: 'text-red-600', description: 'Doctors, Dentists, Clinics, Hospitals' },
              { name: 'Beauty & Personal Care', slug: 'beauty-personal-care', icon: Scissors, color: 'from-pink-100 to-rose-100', iconText: 'text-pink-600', description: 'Salons, Spas, Nail Salons' },
              { name: 'More Types', slug: 'business-types', icon: ArrowRight, color: 'from-gray-100 to-slate-100', iconText: 'text-gray-600', description: 'View all 70+ business types' },
            ].map((type) => (
              <Link key={type.slug} href={type.slug === 'more-types' ? '/business-types' : `/business-types/${type.slug}`}>
                <div className="group relative bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg hover:border-[#0a897d]/30 transition-all duration-300 overflow-hidden">
                  {/* Gradient background on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0a897d]/5 to-[#0a897d]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Icon */}
                  <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <type.icon className={`h-7 w-7 ${type.iconText}`} />
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <h3 className="font-semibold text-base text-gray-900 mb-1 group-hover:text-[#0a897d] transition-colors">
                      {type.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{type.description}</p>
                  </div>

                  {/* Arrow indicator */}
                  <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <div className="w-6 h-6 rounded-full bg-[#0a897d] flex items-center justify-center">
                      <ArrowRight className="h-3.5 w-3.5 text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* Latest Offers */}
      {latestOffers.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Latest Deals</h2>
                <p className="text-muted-foreground mt-1">
                  Exclusive offers from local businesses
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Locations */}
      <section className="py-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Popular Locations</h2>
              <p className="text-muted-foreground mt-1">
                Find businesses in top cities
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularLocations.map((location) => (
              <Link key={location.slug} href={`/businesses?location=${location.slug}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {location.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {location.count} businesses
                      </p>
                    </div>
                    <MapPin className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      {latestNews.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Business News</h2>
                <p className="text-muted-foreground mt-1">
                  Latest updates from local businesses
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {latestNews.map((article) => (
                <Link key={article.id} href={`/businesses/${article.business.slug}/news/${article.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                    {article.featuredImage && (
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img
                          src={article.featuredImage}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground mb-2">
                        {article.business.name} • {new Date(article.publishDate).toLocaleDateString()}
                      </p>
                      <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      {article.summary && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {article.summary}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-purple-700 text-white">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Own a Business?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            List your business on IndexOrbit and reach thousands of potential customers
            looking for services like yours.
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
