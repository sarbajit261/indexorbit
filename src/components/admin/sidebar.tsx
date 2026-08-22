'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  ListOrdered,
  MapPin,
  Wrench,
  Package,
  Tag,
  Newspaper,
  Star,
  Users,
  Flag,
  Send,
  Sparkles,
  Settings,
  BarChart3,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/businesses', icon: Building2, label: 'Businesses' },
  { href: '/admin/business-types', icon: ListOrdered, label: 'Business Types' },
  { href: '/admin/categories', icon: ListOrdered, label: 'Categories' },
  { href: '/admin/locations', icon: MapPin, label: 'Locations' },
  { href: '/admin/services', icon: Wrench, label: 'Services' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/offers', icon: Tag, label: 'Offers' },
  { href: '/admin/news', icon: Newspaper, label: 'News' },
  { href: '/admin/reviews', icon: Star, label: 'Reviews' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/claims', icon: Flag, label: 'Claims' },
  { href: '/admin/submissions', icon: Send, label: 'Submissions' },
  { href: '/admin/ai', icon: Sparkles, label: 'AI Assistant' },
  { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/admin/searches', icon: Search, label: 'Searches' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-semibold">Admin Panel</span>
        </Link>
      </div>

      <nav className="space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
