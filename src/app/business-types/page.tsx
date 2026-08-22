'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Utensils, Home, ShoppingBag, Building, Wrench, Car, Heart, Dumbbell, DollarSign, Shield, GraduationCap, Monitor, Megaphone, Briefcase, Factory, Package, Plane, Truck, Scale, Calculator, PartyPopper, Palette, Trophy, Dog, Tractor, Trees, Sofa, Smartphone, Shirt, Gem, Sparkles, Apple, Hammer, Zap, Wifi, Lock, Printer, Camera, PenTool, Church, Landmark, Droplets, Skull, Baby, Archive, Ship, Mountain, TestTube, Recycle, Pill, Award, Users, Beaker, Disc, Hotel, Grid3X3, List, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import Footer from '@/components/layout/footer';

interface BusinessType {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  _count?: {
    categories: number;
    businesses: number;
  };
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  utensils: Utensils,
  home: Home,
  'shopping-bag': ShoppingBag,
  building: Building,
  'building-2': Building,
  wrench: Wrench,
  car: Car,
  heart: Heart,
  'heart-handshake': Heart,
  dumbbell: Dumbbell,
  'dollar-sign': DollarSign,
  shield: Shield,
  'shield-check': Shield,
  'graduation-cap': GraduationCap,
  monitor: Monitor,
  laptop: Monitor,
  megaphone: Megaphone,
  briefcase: Briefcase,
  factory: Factory,
  package: Package,
  plane: Plane,
  truck: Truck,
  scale: Scale,
  calculator: Calculator,
  'party-popper': PartyPopper,
  palette: Palette,
  trophy: Trophy,
  dog: Dog,
  'paw-print': Dog,
  tractor: Tractor,
  trees: Trees,
  flower: Trees,
  sofa: Sofa,
  smartphone: Smartphone,
  shirt: Shirt,
  gem: Gem,
  sparkles: Sparkles,
  apple: Apple,
  hammer: Hammer,
  'brick-wall': Hammer,
  zap: Zap,
  sun: Zap,
  wifi: Wifi,
  signal: Wifi,
  lock: Lock,
  key: Lock,
  printer: Printer,
  camera: Camera,
  'pen-tool': PenTool,
  church: Church,
  landmark: Landmark,
  droplets: Droplets,
  skull: Skull,
  'candlestick-chart': Skull,
  baby: Baby,
  archive: Archive,
  warehouse: Archive,
  ship: Ship,
  anchor: Ship,
  mountain: Mountain,
  'test-tube': TestTube,
  'flask-conical': TestTube,
  'flask-round': TestTube,
  recycle: Recycle,
  leaf: Recycle,
  pill: Pill,
  pills: Pill,
  award: Award,
  users: Users,
  'users-2': Users,
  beaker: Beaker,
  disc: Disc,
  hotel: Hotel,
  'grid-3x3': Grid3X3,
  globe: Globe,
  'newspaper': PenTool,
  'file-search': Search,
  'languages': Globe,
  'box': Package,
  'settings': Wrench,
  'spray-can': Sparkles,
};

const colorMap: Record<string, string> = {
  '#FF6B6B': 'from-orange-500 to-red-500',
  '#4ECDC4': 'from-blue-500 to-indigo-500',
  '#96CEB4': 'from-purple-500 to-violet-500',
  '#45B7D1': 'from-cyan-500 to-teal-500',
  '#F39C12': 'from-amber-500 to-orange-500',
  '#E67E22': 'from-indigo-500 to-blue-500',
  '#3498DB': 'from-blue-500 to-indigo-500',
  '#9B59B6': 'from-green-500 to-emerald-500',
  '#1ABC9C': 'from-teal-500 to-cyan-500',
  '#00BCD4': 'from-cyan-500 to-blue-500',
  '#E74C3C': 'from-red-500 to-pink-500',
  '#E91E63': 'from-pink-500 to-rose-500',
  '#8B4513': 'from-amber-500 to-yellow-500',
  '#DDA0DD': 'from-purple-500 to-pink-500',
  '#607D8B': 'from-slate-600 to-gray-600',
  '#2C3E50': 'from-slate-700 to-gray-700',
  '#27AE60': 'from-emerald-500 to-green-500',
  '#2ECC71': 'from-green-500 to-teal-500',
  '#34495E': 'from-slate-500 to-gray-500',
  '#7F8C8D': 'from-gray-500 to-slate-500',
  '#16A085': 'from-teal-600 to-emerald-600',
  '#F1C40F': 'from-yellow-500 to-amber-500',
  '#673AB7': 'from-violet-500 to-purple-500',
  '#FF5722': 'from-orange-500 to-red-600',
  '#FF9800': 'from-amber-500 to-orange-500',
  '#4CAF50': 'from-green-500 to-emerald-500',
  '#795548': 'from-amber-700 to-stone-600',
  '#FF69B4': 'from-pink-500 to-rose-500',
  '#9C27B0': 'from-purple-500 to-violet-500',
  '#FFD700': 'from-yellow-400 to-amber-400',
  '#2196F3': 'from-blue-500 to-indigo-500',
  '#8D6E63': 'from-stone-500 to-amber-600',
  '#455A64': 'from-slate-600 to-gray-600',
  '#FF7043': 'from-orange-400 to-red-400',
  '#26A69A': 'from-teal-500 to-cyan-500',
  '#00ACC1': 'from-cyan-500 to-blue-500',
  '#7CB342': 'from-lime-500 to-green-500',
  '#8E24AA': 'from-purple-600 to-pink-600',
  '#5D4037': 'from-amber-800 to-stone-700',
  '#78909C': 'from-slate-400 to-gray-400',
  '#5C6BC0': 'from-indigo-400 to-purple-400',
  '#37474F': 'from-slate-800 to-gray-800',
  '#03A9F4': 'from-sky-500 to-blue-500',
  '#006064': 'from-cyan-700 to-blue-700',
  '#E53935': 'from-red-600 to-pink-600',
  '#546E7A': 'from-slate-500 to-gray-500',
  '#AB47BC': 'from-purple-500 to-pink-500',
};

function getIcon(iconName: string | null) {
  if (!iconName) return Building;
  const Icon = iconMap[iconName];
  return Icon || Building;
}

function getColor(color: string | null): string {
  if (!color) return 'from-slate-500 to-gray-500';
  return colorMap[color] || 'from-slate-500 to-gray-500';
}

export default function BusinessTypesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBusinessTypes() {
      try {
        const response = await fetch('/api/business-types');
        if (!response.ok) throw new Error('Failed to fetch business types');
        const data = await response.json();
        setBusinessTypes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchBusinessTypes();
  }, []);

  const filteredTypes = businessTypes.filter(type =>
    type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (type.description && type.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const PAGE_SIZE = 12;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredTypes.length) {
          setVisibleCount((c) => Math.min(c + PAGE_SIZE, filteredTypes.length));
        }
      },
      { rootMargin: '200px' }
    );
    const el = sentinelRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [filteredTypes.length, visibleCount]);

  const visible = filteredTypes.slice(0, visibleCount);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#0a897d] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading business types...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#0a897d] to-[#0d6e6a] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Business Types Directory</h1>
              <p className="text-xl text-white/90 mb-8">Browse through {businessTypes.length} different business categories to find what you&apos;re looking for</p>
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search business types..."
                  className="pl-12 h-12 text-base text-black bg-white rounded-full shadow-lg placeholder:text-gray-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
              <div className="text-center">
                <p className="text-3xl font-bold text-[#0a897d]">{businessTypes.length}</p>
                <p className="text-sm text-gray-500">Business Types</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[#0a897d]">
                  {businessTypes.reduce((sum, t) => sum + (t._count?.categories || 0), 0)}
                </p>
                <p className="text-sm text-gray-500">Categories</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[#0a897d]">
                  {businessTypes.reduce((sum, t) => sum + (t._count?.businesses || 0), 0).toLocaleString() || '5,000+'}
                </p>
                <p className="text-sm text-gray-500">Listed Businesses</p>
              </div>
            </div>
          </div>
        </section>

        {/* View Toggle */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {visible.length} of {filteredTypes.length} business types
            </p>
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#0a897d]' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-[#0a897d]' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Grid View */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {visible.map((type) => {
                const Icon = getIcon(type.icon);
                const gradientColor = getColor(type.color);
                const categoryCount = type._count?.categories || 0;
                const businessCount = type._count?.businesses || 0;

                return (
                  <Link key={type.id} href={`/business-types/${type.slug}`} className="block">
                    <div className="group relative bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:border-[#0a897d]/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                      {/* Gradient Background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${gradientColor} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />

                      {/* Icon */}
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradientColor} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-gray-200`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>

                      {/* Content */}
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#0a897d] transition-colors">
                        {type.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                        {type.description || `${categoryCount} categories available`}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-sm font-medium text-[#0a897d]">
                          {categoryCount > 0 ? `${categoryCount} categories` : `${businessCount} businesses`}
                        </span>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-[#0a897d] group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {visible.map((type) => {
                const Icon = getIcon(type.icon);
                const gradientColor = getColor(type.color);
                const categoryCount = type._count?.categories || 0;
                const businessCount = type._count?.businesses || 0;

                return (
                  <Link key={type.id} href={`/business-types/${type.slug}`} className="block">
                    <div className="group bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg hover:border-[#0a897d]/30 transition-all duration-300 flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradientColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-md shadow-gray-200`}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#0a897d] transition-colors">
                          {type.name}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">{type.description || `${categoryCount} categories available`}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-[#0a897d] whitespace-nowrap">
                          {categoryCount > 0 ? `${categoryCount} categories` : `${businessCount} businesses`}
                        </span>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-[#0a897d] group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Intersection Observer Sentinel */}
          <div ref={sentinelRef} className="h-10" />

          {/* Empty State */}
          {filteredTypes.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No business types found</h3>
              <p className="text-gray-500">Try adjusting your search query</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
