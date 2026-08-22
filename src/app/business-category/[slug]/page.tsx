'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, MapPin, Star, ArrowRight, Building2, Utensils, Home, ShoppingBag, Wrench, Scissors, Dumbbell, Bus, Heart, Stethoscope, Briefcase, Palette, Car, GraduationCap, Plane, ChevronLeft, Loader2, ChevronRight, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ListingCard } from '@/components/business/listing-card';
import { getOpeningStatus } from '@/lib/utils';

// Icon mapping
const iconMap: Record<string, any> = {
  utensils: Utensils,
  home: Home,
  'shopping-bag': ShoppingBag,
  wrench: Wrench,
  scissors: Scissors,
  dumbbell: Dumbbell,
  bus: Bus,
  heart: Heart,
  stethoscope: Stethoscope,
  briefcase: Briefcase,
  palette: Palette,
  car: Car,
  'graduation-cap': GraduationCap,
  plane: Plane,
  building: Building2,
  building2: Building2,
};

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  businessTypeId: string;
  businessType: {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
  };
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
  hours?: any[];
}

function CategoryPageContent() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [relatedCategories, setRelatedCategories] = useState<Category[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [featuredBusinesses, setFeaturedBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [openingStatuses, setOpeningStatuses] = useState<Record<string, { label: string; text: string }>>({});

  // Update opening statuses every minute
  useEffect(() => {
    const updateStatuses = () => {
      const statuses: Record<string, { label: string; text: string }> = {};
      [...featuredBusinesses, ...businesses].forEach(b => {
        statuses[b.id] = getOpeningStatus(b.hours);
      });
      setOpeningStatuses(statuses);
    };
    updateStatuses();
    const interval = setInterval(updateStatuses, 60000);
    return () => clearInterval(interval);
  }, [featuredBusinesses, businesses]);

  // Fetch category and businesses
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch category by slug
        const catRes = await fetch(`/api/categories?slug=${slug}`);
        const catData = await catRes.json();

        if (catData.length > 0) {
          const cat = catData[0];
          setCategory(cat);

          // Fetch related categories (same business type)
          const relatedRes = await fetch(`/api/categories?type=${cat.businessType.slug}`);
          const relatedData = await relatedRes.json();
          setRelatedCategories(relatedData.filter((c: Category) => c.id !== cat.id));

          // Fetch businesses for this category
          const bizRes = await fetch(`/api/businesses?category=${slug}&limit=12&page=1`);
          const bizData = await bizRes.json();
          setBusinesses(bizData.businesses || []);
          setHasMore(bizData.pagination?.page < bizData.pagination?.totalPages);

          // Fetch top 10 featured businesses for this category
          const featuredRes = await fetch(`/api/businesses?category=${slug}&limit=10&sort=rating`);
          const featuredData = await featuredRes.json();
          setFeaturedBusinesses(featuredData.businesses || []);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  // Load more businesses
  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const bizRes = await fetch(`/api/businesses?category=${slug}&limit=12&page=${nextPage}&search=${searchQuery}`);
      const bizData = await bizRes.json();
      setBusinesses(prev => [...prev, ...(bizData.businesses || [])]);
      setPage(nextPage);
      setHasMore(bizData.pagination?.page < bizData.pagination?.totalPages);
    } catch (error) {
      console.error('Failed to load more:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Search effect - uses local loading state without full page reload
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function searchBusinesses() {
      if (!searchQuery) {
        // Reset to original list
        try {
          setSearchLoading(true);
          const bizRes = await fetch(`/api/businesses?category=${slug}&limit=12&page=1`, {
            signal: controller.signal
          });
          const bizData = await bizRes.json();
          setBusinesses(bizData.businesses || []);
          setHasMore(bizData.pagination?.page < bizData.pagination?.totalPages);
        } catch (e) {
          if ((e as Error).name !== 'AbortError') console.error('Failed to search:', e);
        } finally {
          setSearchLoading(false);
        }
        return;
      }

      setSearchLoading(true);
      setPage(1);
      try {
        const bizRes = await fetch(`/api/businesses?category=${slug}&search=${encodeURIComponent(searchQuery)}&limit=12&page=1`, {
          signal: controller.signal
        });
        const bizData = await bizRes.json();
        setBusinesses(bizData.businesses || []);
        setHasMore(bizData.pagination?.page < bizData.pagination?.totalPages);
      } catch (e) {
        if ((e as Error).name !== 'AbortError') console.error('Failed to search:', e);
      } finally {
        setSearchLoading(false);
      }
    }

    const timer = setTimeout(() => {
      if (slug) searchBusinesses();
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery, slug]);

  if (loading && !searchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#0a897d] mx-auto mb-4" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Category not found</h1>
            <Link href="/business-category">
              <Button>Browse Categories</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const TypeIcon = category.businessType?.icon ? iconMap[category.businessType.icon] || Building2 : Building2;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#0a897d] to-[#0d6e6a] text-white py-12">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-white/70 mb-4">
              <Link href="/business-category" className="hover:text-white flex items-center gap-1">
                <ChevronLeft className="h-4 w-4" />
                Categories
              </Link>
              <span>/</span>
              <span className="text-white">{category.businessType?.name}</span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                <TypeIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{category.name}</h1>
                <p className="text-white/80">
                  {category._count?.businesses || 0} businesses
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="relative max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder={`Search in ${category.name}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-white rounded-xl border-0 shadow-lg text-black placeholder:text-gray-400"
              />
            </div>
          </div>
        </section>

        {/* Top 10 Businesses Carousel - Full Width */}
        {featuredBusinesses.length > 0 && (
          <section className="bg-white py-8">
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl text-gray-900 flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  <span className="font-light">#Top 10 in</span> <span className="font-bold">{category?.name}</span>
                </h2>
              </div>
              <div className="relative">
                <div className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2">
                  {featuredBusinesses.map((business, index) => (
                    <Link
                      key={business.id}
                      href={`/businesses/${business.slug}`}
                      className="flex-shrink-0 w-[280px] group"
                    >
                      <div className="relative h-[200px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#0a897d] to-[#0d6e6a]">
                        {business.coverImage ? (
                          <img
                            src={business.coverImage}
                            alt={business.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0a897d] to-[#0d6e6a]">
                            <span className="text-6xl font-bold text-white/30">{business.name.charAt(0)}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Rank Badge - Top Left */}
                        <div className="absolute top-3 left-3">
                          <div className={`relative overflow-hidden px-3 py-1.5 rounded-lg font-bold text-sm shadow-lg ${
                            index === 0 ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-white' :
                            index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-500 text-white' :
                            index === 2 ? 'bg-gradient-to-r from-amber-600 to-amber-800 text-white' :
                            'bg-white/90 text-gray-800'
                          }`}>
                            Rank #{index + 1}
                            {index < 3 && (
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shine" />
                            )}
                          </div>
                        </div>

                        {/* Rating Badge - Top Right */}
                        {business.rating > 0 && (
                          <div className="absolute top-3 right-3">
                            <div className="flex items-center gap-1 bg-white text-black px-2 py-1 rounded-lg shadow-lg">
                              <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                              <span className="text-sm font-bold">{business.rating.toFixed(1)}</span>
                            </div>
                          </div>
                        )}

                        {/* Bottom Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 flex items-center gap-1.5">
                            {business.name}
                            {business.verificationStatus === 'VERIFIED' && (
                              <span className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                                <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"/>
                                </svg>
                              </span>
                            )}
                          </h3>
                          {business.address && (
                            <div className="flex items-center gap-1 mb-1">
                              <MapPin className="h-3 w-3 text-white/60" />
                              <span className="text-white/70 text-xs truncate">{business.address}{business.city ? `, ${business.city}` : ''}{business.state ? `, ${business.state}` : ''}</span>
                            </div>
                          )}
                          {openingStatuses[business.id]?.text && (
                            <div className={`flex items-center gap-1 ${openingStatuses[business.id]?.label === 'Open' ? 'text-green-400' : 'text-red-400'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${openingStatuses[business.id]?.label === 'Open' ? 'bg-green-400' : 'bg-red-400'}`} />
                              <span className="text-xs">
                                {openingStatuses[business.id]?.text}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* More in Business Type - Compact Pills Below Top 10 */}
        {relatedCategories.length > 0 && (
          <section className="bg-gray-50 py-4">
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap items-center gap-2">
                {relatedCategories.slice(0, 10).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/business-category/${cat.slug}`}
                    className="px-3 py-1.5 bg-white rounded-full text-sm text-gray-700 hover:bg-[#0a897d] hover:text-white transition-colors shadow-sm"
                  >
                    {cat.name} ({cat._count?.businesses || 0})
                  </Link>
                ))}
                {relatedCategories.length > 10 && (
                  <Link
                    href={`/business-types/${category?.businessType?.slug}`}
                    className="px-3 py-1.5 text-sm text-[#0a897d] hover:text-[#0d6e6a] font-medium flex items-center gap-1"
                  >
                    View All
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
            </div>
          </section>
        )}

        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Main Content */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  {businesses.length} businesses found
                </p>
                {searchLoading && (
                  <Loader2 className="h-5 w-5 animate-spin text-[#0a897d]" />
                )}
              </div>

              {/* Business List */}
              {businesses.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {businesses.map((business) => (
                      <ListingCard key={business.id} business={business} />
                    ))}
                  </div>

                  {/* Load More */}
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
                <div className="text-center py-16 bg-white rounded-2xl">
                  <p className="text-gray-500 mb-4">No businesses found in this category yet</p>
                  <Link href="/business-category">
                    <Button variant="outline">Browse Categories</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#0a897d] mx-auto mb-4" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    }>
      <CategoryPageContent />
    </Suspense>
  );
}
