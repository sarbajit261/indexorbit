'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MapPin, Star, ArrowRight, Utensils, Home, ShoppingBag, Wrench, Scissors, Dumbbell, Building, Clock, Heart, DollarSign, Shield, GraduationCap, Monitor, Megaphone, Briefcase, Factory, Package, Plane, Truck, Scale, Calculator, PartyPopper, Palette, Trophy, Dog, Tractor, Trees, Sofa, Smartphone, Shirt, Gem, Sparkles, Apple, Hammer, Zap, Wifi, Lock, Printer, Camera, PenTool, Church, Landmark, Droplets, Skull, Baby, Archive, Ship, Mountain, Recycle, Pill, Award, Users, Beaker, Wine, Hotel, Car, Globe, ChevronLeft, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ListingCard } from '@/components/business/listing-card';

const typeIcons: Record<string, any> = {
  'food-dining': Utensils,
  'hotels-accommodation': Hotel,
  'retail-shopping': ShoppingBag,
  'professional-services': Building,
  'healthcare-medical': Heart,
  'beauty-personal-care': Scissors,
  'fitness-wellness': Dumbbell,
  'automotive': Car,
  'home-property-services': Home,
  'technology-it': Monitor,
  'real-estate-property': Building,
  'education-training': GraduationCap,
  'pets-animals': Dog,
  'travel-tourism': Plane,
  'legal-services': Scale,
  'events-wedding': PartyPopper,
  'financial-services': DollarSign,
  'manufacturing-industrial': Factory,
  'sports-recreation': Trophy,
  'arts-entertainment': Palette,
  'media-communication': Megaphone,
  'agriculture': Tractor,
  'construction': Hammer,
  'consulting': Briefcase,
  'consumer-services': Sparkles,
  'education': GraduationCap,
  'energy': Zap,
  'engineering': Beaker,
  'environment': Recycle,
  'finance': Calculator,
  'food-beverage': Apple,
  'government': Landmark,
  'healthcare': Heart,
  'hospitality': Hotel,
  'human-resources': Users,
  'information-technology': Wifi,
  'insurance': Shield,
  'legal': Scale,
  'logistics': Truck,
  'manufacturing': Package,
  'marketing': Megaphone,
  'media': Camera,
  'non-profit': Heart,
  'real-estate': Building,
  'religious': Church,
  'research': Beaker,
  'retail': ShoppingBag,
  'science': Beaker,
  'security': Lock,
  'sports': Trophy,
  'telecommunications': Smartphone,
  'transportation': Truck,
  'travel': Plane,
  'utilities': Zap,
  'wholesale': Archive,
  'other': Globe,
};

interface BusinessType {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  businessTypeId: string;
  _count: {
    businesses: number;
  };
}

interface Business {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  rating: number;
  reviewCount: number;
  city: string | null;
  state: string | null;
  address: string | null;
  logo: string | null;
  coverImage: string | null;
  priceRange: number | null;
  verificationStatus: string;
  featuredStatus: string;
}

export default function BusinessTypePage() {
  const params = useParams();
  const slug = params.slug as string;

  const [businessType, setBusinessType] = useState<BusinessType | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const Icon = typeIcons[slug] || Globe;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch business type
        const typeRes = await fetch(`/api/business-types?slug=${slug}`);
        const typeData = await typeRes.json();

        if (typeData && typeData.length > 0) {
          setBusinessType(typeData[0]);

          // Fetch categories for this type
          const catRes = await fetch(`/api/categories?type=${slug}`);
          const catData = await catRes.json();
          setCategories(catData);
        }

        // Fetch businesses for this type
        const bizRes = await fetch(`/api/businesses?type=${slug}&limit=12&page=1`);
        const bizData = await bizRes.json();
        setBusinesses(bizData.businesses || []);
        setHasMore(bizData.pagination?.hasMore || false);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchData();
    }
  }, [slug]);

  // Fetch businesses when category changes
  useEffect(() => {
    async function fetchBusinesses() {
      setLoading(true);
      setPage(1);
      try {
        const url = selectedCategory
          ? `/api/businesses?type=${slug}&category=${selectedCategory}&limit=12&page=1`
          : `/api/businesses?type=${slug}&limit=12&page=1`;
        const bizRes = await fetch(url);
        const bizData = await bizRes.json();
        setBusinesses(bizData.businesses || []);
        setHasMore(bizData.pagination?.hasMore || false);
      } catch (error) {
        console.error('Failed to fetch businesses:', error);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchBusinesses();
    }
  }, [selectedCategory, slug]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const url = selectedCategory
        ? `/api/businesses?type=${slug}&category=${selectedCategory}&limit=12&page=${nextPage}`
        : `/api/businesses?type=${slug}&limit=12&page=${nextPage}`;
      const bizRes = await fetch(url);
      const bizData = await bizRes.json();
      setBusinesses(prev => [...prev, ...(bizData.businesses || [])]);
      setPage(nextPage);
      setHasMore(bizData.pagination?.hasMore || false);
    } catch (error) {
      console.error('Failed to load more:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#0a897d] mx-auto mb-4" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!businessType) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Business type not found</h1>
            <Link href="/business-types">
              <Button>Browse Business Types</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0a897d] to-[#0d6e6a] text-white py-12">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-white/70 mb-4">
            <Link href="/business-types" className="hover:text-white flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              Business Types
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <Icon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{businessType.name}</h1>
              {businessType.description && (
                <p className="text-white/80 mt-1">{businessType.description}</p>
              )}
              <p className="text-white/70 text-sm mt-1">
                {categories.length} categories • {businesses.length} businesses
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="bg-white border-b">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === null
                  ? 'bg-[#0a897d] text-white shadow-lg shadow-[#0a897d]/25'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({businesses.length})
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.slug)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category.slug
                    ? 'bg-[#0a897d] text-white shadow-lg shadow-[#0a897d]/25'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.name}
                {category._count?.businesses > 0 && (
                  <span className={`text-xs ${selectedCategory === category.slug ? 'text-white/70' : 'text-gray-400'}`}>
                    ({category._count.businesses})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Businesses Grid */}
      <section className="py-8">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          {businesses.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businesses.map((business) => (
                  <ListingCard key={business.id} business={business} />
                ))}
              </div>

              {hasMore && (
                <div className="mt-8 text-center">
                  <Button
                    onClick={loadMore}
                    disabled={loadingMore}
                    variant="outline"
                    className="min-w-[200px]"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Loading...
                      </>
                    ) : (
                      'Load More'
                    )}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <Icon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No businesses found</h2>
              <p className="text-gray-500 mb-6">
                {selectedCategory
                  ? 'No businesses in this category yet.'
                  : 'No businesses in this type yet.'
                }
              </p>
              <Button variant="outline" onClick={() => setSelectedCategory(null)}>
                View All
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
