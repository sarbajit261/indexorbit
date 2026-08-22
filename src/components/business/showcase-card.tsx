'use client';

import Link from 'next/link';
import { MapPin, Star, ArrowRight, Bookmark, Award } from 'lucide-react';

export function ShowcaseCard({ business }: { business: any }) {
  return (
    <div className="group relative h-[400px] rounded-3xl overflow-hidden bg-gray-900">
      {/* Full card link overlay */}
      <Link href={`/business/${business.slug}`} className="absolute inset-0 z-10">
        <span className="sr-only">View {business.name} details</span>
      </Link>

      {/* Background Image */}
      <div className="absolute inset-0">
        {business.coverImage ? (
          <img
            src={business.coverImage}
            alt={business.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0a897d]/20 to-[#0d6e6a]/10 flex items-center justify-center">
            <span className="text-6xl font-bold text-white/20">{business.name.charAt(0)}</span>
          </div>
        )}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Top Badges */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-20">
        <div className="flex gap-2">
          {business.featuredStatus !== 'NONE' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold shadow-lg">
              <Award className="h-3.5 w-3.5 fill-white" />
              Featured
            </span>
          )}
        </div>
        <button className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors z-30">
          <Bookmark className="h-4 w-4 text-white" />
        </button>
      </div>

      {/* Rating Badge */}
      {business.rating && business.rating > 0 && (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/95 backdrop-blur-sm shadow-lg z-20">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="text-sm font-bold text-gray-900">{business.rating.toFixed(1)}</span>
        </div>
      )}

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="flex items-end justify-between">
          <div className="flex-1 min-w-0">
            {/* Name with Verified Badge */}
            <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
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
            {business.category?.name && (
              <p className="text-sm text-white/70 mb-1">{business.category.name}</p>
            )}

            {/* Location */}
            {business.city && (
              <div className="flex items-center gap-1 text-white/70 text-sm mt-2">
                <MapPin className="h-4 w-4" />
                <span>{business.city}</span>
              </div>
            )}
          </div>

          {/* Arrow Button */}
          <div className="flex-shrink-0 ml-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-[#0a897d] group-hover:shadow-lg transition-all duration-300">
              <ArrowRight className="h-4 w-4 text-white group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
