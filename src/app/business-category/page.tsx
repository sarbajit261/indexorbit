'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Building2, Utensils, Home, ShoppingBag, Wrench, Scissors, Dumbbell, Bus, Stethoscope, Briefcase, Palette, Car, GraduationCap, Plane, Heart, Coffee, Search, ArrowRight, Loader2, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

// Icon mapping
const iconMap: Record<string, any> = {
  utensils: Utensils,
  home: Home,
  'shopping-bag': ShoppingBag,
  wrench: Wrench,
  scissors: Scissors,
  dumbbell: Dumbbell,
  bus: Bus,
  'stethoscope': Stethoscope,
  briefcase: Briefcase,
  palette: Palette,
  car: Car,
  'graduation-cap': GraduationCap,
  plane: Plane,
  heart: Heart,
  coffee: Coffee,
  building: Building2,
  building2: Building2,
  star: Star,
};

interface BusinessType {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  businessTypeId: string;
  businessType: BusinessType;
  _count: {
    businesses: number;
  };
}

export default function BusinessCategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [categoriesRes, typesRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/business-types'),
        ]);

        const categoriesData = await categoriesRes.json();
        const typesData = await typesRes.json();

        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setBusinessTypes(Array.isArray(typesData) ? typesData : []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setCategories([]);
        setBusinessTypes([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const slug = entry.target.getAttribute('data-type-slug');
            if (slug) {
              setVisibleSections((prev) => new Set([...prev, slug]));
            }
          }
        });
      },
      { rootMargin: '100px', threshold: 0.1 }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [businessTypes]);

  // Group categories by business type
  const categoriesByType = businessTypes
    .map((type) => ({
      ...type,
      categories: categories.filter((cat) => cat.businessTypeId === type.id),
    }))
    .filter((type) => type.categories.length > 0);

  // Filter categories for search
  const filteredCategories = searchQuery
    ? categories.filter(
        (cat) =>
          cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.businessType?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  const totalCategories = categories.length;
  const totalTypes = categoriesByType.length;

  const setSectionRef = (slug: string) => (el: HTMLDivElement | null) => {
    sectionRefs.current[slug] = el;
  };

  const getIcon = (iconName: string | null) => {
    if (!iconName) return Building2;
    return iconMap[iconName] || Building2;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#0a897d] mx-auto mb-4" />
          <p className="text-gray-500">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#0a897d] to-[#0d6e6a] text-white py-12 md:py-16">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Browse Categories</h1>
              <p className="text-white/80 mb-6">
                {totalCategories} categories across {totalTypes} types
              </p>
              {/* Search */}
              <div className="relative max-w-lg mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-white rounded-xl border-0 shadow-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-white/50"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Search Results */}
        {searchQuery && filteredCategories && (
          <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-xl font-semibold mb-6">
              Search Results ({filteredCategories.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/business-category/${category.slug}`}
                  className="group bg-white rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <h3 className="font-medium text-gray-900 text-sm mb-1 group-hover:text-[#0a897d] transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {category.businessType?.name}
                  </p>
                </Link>
              ))}
            </div>
            {filteredCategories.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No categories found for "{searchQuery}"</p>
              </div>
            )}
          </section>
        )}

        {/* Categories by Type */}
        {!searchQuery && (
          <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
            {categoriesByType.map((type) => {
              const TypeIcon = getIcon(type.icon);
              return (
                <div
                  key={type.id}
                  ref={setSectionRef(type.slug)}
                  data-type-slug={type.slug}
                  className={`mb-12 transition-all duration-700 ${
                    visibleSections.has(type.slug) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  {/* Type Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#0a897d] flex items-center justify-center">
                      <TypeIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{type.name}</h2>
                      <p className="text-sm text-gray-500">{type.categories.length} categories</p>
                    </div>
                    <Link
                      href={`/business-types/${type.slug}`}
                      className="ml-auto text-sm text-[#0a897d] hover:text-[#0d6e6a] font-medium flex items-center gap-1"
                    >
                      View All Business
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>

                  {/* Categories Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {type.categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/business-category/${category.slug}`}
                        className="group bg-white rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                      >
                        <h3 className="font-medium text-gray-900 text-sm mb-1 group-hover:text-[#0a897d] transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {category._count?.businesses || 0} businesses
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
