'use client';

import { useState, useEffect, Suspense, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Star, Utensils, Home, ShoppingBag, Wrench, Scissors, Dumbbell, Building, X, ChevronLeft, ChevronRight, Loader2, Coffee, Car, Heart, Stethoscope, GraduationCap, Briefcase, Scale, Camera, Music, Hammer, ArrowRight, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { ListingCard } from '@/components/business/listing-card';
import { FeaturedCard } from '@/components/business/featured-card';
import { businessApi } from '@/lib/api/client';

// Business types for filters
const businessTypes = [
  { slug: 'all', name: 'All', icon: '🏪' },
  { slug: 'restaurant', name: 'Restaurants', icon: '🍽️' },
  { slug: 'hotel', name: 'Hotels', icon: '🏨' },
  { slug: 'shop', name: 'Shopping', icon: '🛒' },
  { slug: 'service', name: 'Services', icon: '🔧' },
  { slug: 'beauty', name: 'Beauty', icon: '💇' },
  { slug: 'health', name: 'Health', icon: '🏥' },
  { slug: 'entertainment', name: 'Entertainment', icon: '🎭' },
];

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
    factory: Building,
    plane: Plane,
    building: Building,
    coffee: Coffee,
    heart: Heart,
    scale: Scale,
    camera: Camera,
    music: Music,
    hammer: Hammer,
    default: Building,
  };

  if (iconName && iconMap[iconName]) {
    return iconMap[iconName];
  }
  return iconMap[businessTypeSlug] || iconMap.default;
};

function BusinessListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const featuredScrollRef = useRef<HTMLDivElement>(null);

  // State
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [featuredBusinesses, setFeaturedBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [popularCategories, setPopularCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasMore: false,
  });

  // Filter state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch featured businesses
  useEffect(() => {
    async function fetchFeatured() {
      try {
        const result = await businessApi.list({ featured: true, limit: 8 });
        setFeaturedBusinesses(result.businesses);
      } catch (error) {
        console.error('Failed to fetch featured:', error);
      } finally {
        setFeaturedLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  // Fetch popular categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories?limit=8');
        const data = await res.json();
        setPopularCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    }
    fetchCategories();
  }, []);

  // Fetch businesses
  const fetchBusinesses = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const result = await businessApi.list({
        type: selectedType === 'all' ? undefined : selectedType,
        search: debouncedSearch || undefined,
        page,
        limit: 12,
      });
      setBusinesses(result.businesses);
      setPagination(result.pagination);
    } catch (error) {
      console.error('Failed to fetch businesses:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedType, debouncedSearch]);

  useEffect(() => {
    fetchBusinesses(1);
  }, [selectedType, debouncedSearch]);

  const handlePageChange = (newPage: number) => {
    fetchBusinesses(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    router.push('/businesses');
  };

  const scrollFeatured = (direction: 'left' | 'right') => {
    if (featuredScrollRef.current) {
      const scrollAmount = 320;
      featuredScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const hasActiveFilters = searchQuery || selectedType !== 'all';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Search Header */}
        <div className="bg-gradient-to-r from-[#0a897d] to-[#0d6e6a] text-white py-10">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Discover Local Businesses</h1>

            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search businesses, restaurants, services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-white text-gray-900 border-0 rounded-xl text-base"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Popular Categories */}
        <div className="bg-white border-b sticky top-16 z-10">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-medium">
                <span className="text-gray-400 font-light">Popular</span> Categories
              </h2>
              <Link
                href="/business-category"
                className="text-sm text-[#0a897d] hover:text-[#0d6e6a] font-medium flex items-center gap-1"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide pb-2">
              {popularCategories.map((cat: any) => {
                const IconComponent = getCategoryIcon(cat.icon, cat.businessType?.slug || '');
                return (
                  <Link
                    key={cat.id}
                    href={`/business-category/${cat.slug}`}
                    className="flex flex-col items-center gap-2 min-w-[90px] group"
                  >
                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                      <IconComponent className="h-6 w-6 text-gray-600" />
                    </div>
                    <span className="text-sm text-gray-700 text-center">{cat.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Featured Businesses Carousel */}
        {!featuredLoading && featuredBusinesses.length > 0 && !hasActiveFilters && (
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    <span className="text-[#0a897d]">#</span>Top Picks <span className="font-light">for you</span>
                  </h2>
                  <p className="text-sm text-gray-500">Handpicked by our team</p>
                </div>
              </div>
              <div className="hidden sm:flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full border-2 hover:border-[#0a897d] hover:bg-[#0a897d]/5"
                  onClick={() => scrollFeatured('left')}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full border-2 hover:border-[#0a897d] hover:bg-[#0a897d]/5"
                  onClick={() => scrollFeatured('right')}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Carousel */}
            <div className="relative">
              <div
                ref={featuredScrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {featuredBusinesses.map((business) => (
                  <div key={business.id} className="flex-shrink-0 w-[calc(25%-12px)] min-w-[280px]">
                    <FeaturedCard business={business} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading Skeleton for Featured */}
        {featuredLoading && !hasActiveFilters && (
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-shrink-0 w-[calc(25%-12px)] min-w-[280px]">
                  <Card className="animate-pulse">
                    <CardContent className="p-0">
                      <div className="h-44 bg-gray-200 rounded-t-2xl" />
                      <div className="p-4">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                        <div className="h-4 bg-gray-200 rounded w-full" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {hasActiveFilters ? 'Search Results' : 'All Businesses'}
              </h2>
              <p className="text-sm text-gray-500">
                {loading ? 'Loading...' : `${pagination.total} businesses found`}
              </p>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-sm text-gray-500">Active filters:</span>
              {searchQuery && (
                <Badge variant="secondary" className="gap-1 px-3 py-1">
                  Search: {searchQuery}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                </Badge>
              )}
              {selectedType !== 'all' && (
                <Badge variant="secondary" className="gap-1 px-3 py-1">
                  Type: {businessTypes.find((t) => t.slug === selectedType)?.name}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedType('all')} />
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-gray-500 hover:text-red-500">
                Clear all
              </Button>
            </div>
          )}

          {/* Business Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-0">
                    <div className="h-36 bg-gray-200 rounded-t-xl" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-3 bg-gray-200 rounded w-2/3" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : businesses.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No businesses found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
              <Button onClick={clearFilters} variant="outline" className="gap-2">
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {businesses.map((business) => (
                  <ListingCard key={business.id} business={business} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        return (
                          page === 1 ||
                          page === pagination.totalPages ||
                          Math.abs(page - pagination.page) <= 1
                        );
                      })
                      .map((page, index, array) => {
                        const showEllipsis = index > 0 && page - array[index - 1] > 1;
                        return (
                          <div key={page} className="flex items-center">
                            {showEllipsis && (
                              <span className="px-2 text-gray-400">...</span>
                            )}
                            <Button
                              variant={pagination.page === page ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handlePageChange(page)}
                              className={`w-10 h-10 ${pagination.page === page ? 'bg-[#0a897d]' : ''}`}
                            >
                              {page}
                            </Button>
                          </div>
                        );
                      })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasMore}
                    className="gap-1"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function BusinessListingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#0a897d] mx-auto mb-4" />
          <p className="text-gray-500">Loading businesses...</p>
        </div>
      </div>
    }>
      <BusinessListContent />
    </Suspense>
  );
}
