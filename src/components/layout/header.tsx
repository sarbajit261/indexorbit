'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  User,
  Menu,
  X,
  Building2,
  Building,
  Compass,
  LayoutGrid,
  Tag,
  Newspaper,
  ChevronDown,
  MapPin,
  Clock,
  Star,
  ArrowRight,
  Bell,
  List,
  Loader2,
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BusinessType {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  businessTypeId: string;
  businessType?: BusinessType;
  _count?: {
    businesses: number;
  };
}

interface NavItem {
  label: string;
  href: string;
  icon: any;
  isMegaMenu?: boolean;
}

interface PopularSearch {
  query: string;
  icon: any;
}

const navItems: NavItem[] = [
  { label: 'Explore', href: '/businesses', icon: Compass },
  { label: 'Categories', href: '/business-category', icon: LayoutGrid, isMegaMenu: true },
  { label: 'Business Types', href: '/business-types', icon: LayoutGrid },
  { label: 'Offers', href: '/offers', icon: Tag },
  { label: 'News Updates', href: '/news', icon: Newspaper },
];

export function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const [popularSearches, setPopularSearches] = useState<PopularSearch[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch categories, business types, popular searches, and settings
  useEffect(() => {
    async function fetchMenuData() {
      setLoadingMenu(true);
      try {
        const [categoriesRes, typesRes, settingsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/business-types'),
          fetch('/api/site-settings'),
        ]);
        const categoriesData = await categoriesRes.json();
        const typesData = await typesRes.json();
        const settingsData = await settingsRes.json();

        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setBusinessTypes(Array.isArray(typesData) ? typesData : []);

        // Build popular searches from settings + fallback
        if (settingsData.popularSearches && Array.isArray(settingsData.popularSearches)) {
          setPopularSearches(settingsData.popularSearches.map((q: string) => ({
            query: q,
            icon: MapPin as any,
          })));
        } else {
          setPopularSearches([
            { query: 'restaurants near me', icon: MapPin },
            { query: 'hotels in downtown', icon: Building },
            { query: 'best coffee shops', icon: Clock },
            { query: '24 hour gyms', icon: Star },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch menu data:', error);
      } finally {
        setLoadingMenu(false);
      }
    }
    fetchMenuData();
  }, []);

  // Group categories by business type (exclude automotive, car-rental, and transportation)
  const excludedTypes = ['automotive', 'car-rental-transport', 'transportation-logistics'];
  const categoriesByType = businessTypes
    .filter(type => !excludedTypes.includes(type.slug))
    .slice(0, 6)
    .map(type => ({
      ...type,
      categories: categories.filter(cat => cat.businessTypeId === type.id).slice(0, 5),
    }))
    .filter(group => group.categories.length > 0);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearch = (query: string) => {
    if (!query.trim()) return;

    const searches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(searches);
    localStorage.setItem('recentSearches', JSON.stringify(searches));

    setIsSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-xl border-b">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Logo className="h-12 w-auto" asLink={false} />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.isMegaMenu && handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                      'hover:bg-accent'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                    {item.isMegaMenu && <ChevronDown className="h-3 w-3" />}
                  </Link>

                  {/* Mega Menu */}
                  {item.isMegaMenu && activeDropdown === item.label && (
                    <div className="absolute top-full left-0 w-[700px] p-6 bg-background border rounded-2xl shadow-xl">
                      {loadingMenu ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin text-[#0a897d]" />
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-6">
                          {categoriesByType.slice(0, 9).map((type) => (
                            <div key={type.id}>
                              <Link
                                href={`/business-types/${type.slug}`}
                                className="font-semibold text-sm text-[#0a897d] hover:underline mb-2 block"
                              >
                                {type.name}
                              </Link>
                              <div className="space-y-1">
                                {type.categories.slice(0, 5).map((cat) => (
                                  <Link
                                    key={cat.id}
                                    href={`/business-category/${cat.slug}`}
                                    className="block text-sm text-muted-foreground hover:text-foreground py-1"
                                  >
                                    {cat.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="mt-4 pt-4 border-t flex justify-between items-center">
                        <Link
                          href="/business-category"
                          className="text-sm font-medium text-[#0a897d] hover:underline"
                        >
                          Browse All Categories
                        </Link>
                        <Link
                          href="/business-types"
                          className="text-sm text-muted-foreground hover:text-foreground"
                        >
                          View Business Types →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Search Trigger */}
            <Button
              variant="outline"
              className="hidden sm:flex items-center gap-2 h-10 px-4"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
              <span className="hidden md:inline">Search...</span>
              <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>

            {/* Mobile Search */}
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Auth Buttons */}
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="gap-2">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t bg-background">
            <div className="mx-auto max-w-[1400px] px-4 py-4">
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-4 pt-4 border-t space-y-2">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <User className="h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full gap-2">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Search Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-2xl p-0 gap-0">
          <form onSubmit={handleSubmit} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search businesses, categories, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 border-0 rounded-none text-base focus:ring-0"
            />
            <kbd className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              ESC
            </kbd>
          </form>

          {recentSearches.length > 0 && !searchQuery && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Recent Searches
                </p>
                <button
                  onClick={() => setRecentSearches([])}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, i) => (
                  <button
                    key={i}
                    onClick={() => handleSearch(search)}
                    className="flex items-center gap-3 w-full px-2 py-2 text-sm rounded-lg hover:bg-accent text-left"
                  >
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!searchQuery && (
            <div className="p-4 border-t">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search, i) => (
                  <button
                    key={i}
                    onClick={() => handleSearch(search.query)}
                    className="flex items-center gap-2 px-3 py-2 text-sm rounded-full border hover:bg-muted transition-colors"
                  >
                    <search.icon className="h-4 w-4 text-muted-foreground" />
                    {search.query}
                  </button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
