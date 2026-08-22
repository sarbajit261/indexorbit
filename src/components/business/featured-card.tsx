'use client';

import Link from 'next/link';
import { MapPin, Star, ArrowRight, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeaturedCardProps {
  business: {
    id: string;
    name: string;
    slug: string;
    shortDescription?: string;
    city?: string;
    state?: string;
    rating?: number;
    reviewCount?: number;
    coverImage?: string | null;
    logo?: string | null;
    verificationStatus?: string;
    featuredStatus?: string;
    category?: { name: string };
    businessType?: { name: string };
  };
}

export function FeaturedCard({ business }: FeaturedCardProps) {
  return (
    <Link href={`/businesses/${business.slug}`} className="group block">
      <div className="relative h-44 rounded-2xl overflow-hidden bg-gradient-to-br from-[#0a897d] to-[#0d6e6a]">
        {/* Background Image or Gradient */}
        {business.coverImage ? (
          <img
            src={business.coverImage}
            alt={business.name}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a897d]/90 to-[#0d6e6a]/90" />
        )}

        {/* Featured Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold shadow-lg shadow-amber-500/30">
            <Award className="h-3.5 w-3.5 fill-white" />
            Featured
          </span>
        </div>

        {/* Rating Badge */}
        {business.rating && business.rating > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/95 backdrop-blur-sm shadow-lg">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-bold text-gray-900">{business.rating.toFixed(1)}</span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-end justify-between">
            <div className="flex-1 min-w-0">
              {/* Business Name */}
              <h3 className="text-lg font-bold text-white truncate drop-shadow-lg flex items-center gap-2">
                {business.name}
                {business.verificationStatus === 'VERIFIED' && (
                  <span className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </span>
                )}
              </h3>

              {/* Category */}
              <p className="text-sm text-white/80 truncate flex items-center gap-1.5 mt-0.5">
                {business.category?.name || business.businessType?.name}
              </p>

              {/* Location */}
              {(business.city || business.state) && (
                <p className="text-xs text-white/70 flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" />
                  {[business.city, business.state].filter(Boolean).join(', ')}
                </p>
              )}
            </div>

            {/* View Button */}
            <div className="flex-shrink-0 ml-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-[#0a897d] group-hover:shadow-lg transition-all duration-300">
                <ArrowRight className="h-4 w-4 text-white group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
