'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Star, ArrowRight, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getOpeningStatus } from '@/lib/utils';

export function ListingCard({ business }: { business: any }) {
  const [status, setStatus] = useState({ label: '', text: '' });

  useEffect(() => {
    const updateStatus = () => setStatus(getOpeningStatus(business.hours));
    updateStatus();
    const interval = setInterval(updateStatus, 60000);
    return () => clearInterval(interval);
  }, [business.hours]);

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-lg transition-all duration-300">
      <div className="relative h-40 bg-gray-100">
        {business.coverImage ? (
          <img src={business.coverImage} alt={business.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0a897d]/10 to-[#0a897d]/5 flex items-center justify-center">
            <span className="text-4xl font-bold text-[#0a897d]/30">{business.name.charAt(0)}</span>
          </div>
        )}

        <div className="absolute top-3 left-3 flex items-center gap-2">
          {business.featuredStatus !== 'NONE' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold shadow-lg">
              <Award className="h-3.5 w-3.5 fill-white" />
              Featured
            </span>
          )}
        </div>

        {/* Rating on bottom right of image */}
        {business.rating > 0 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-white/90 backdrop-blur-sm shadow-sm">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-gray-900">{business.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-2">
          <Link href={`/businesses/${business.slug}`}>
            <h3 className="text-base font-bold text-gray-900 group-hover:text-[#0a897d] transition-colors truncate flex items-center gap-1.5">
              <span className="truncate">{business.name}</span>
              {business.verificationStatus === 'VERIFIED' && (
                <span className="w-4 h-4 rounded-full bg-[#2E30E8] flex items-center justify-center flex-shrink-0">
                  <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
              )}
            </h3>
          </Link>
          <span className="text-sm text-gray-500">{business.category?.name || business.businessType?.name}</span>
        </div>

        {business.shortDescription && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{business.shortDescription}</p>
        )}

        <div className="flex items-center justify-between mb-3">
          {status.label && (
            <div className={`flex items-center gap-1.5 ${status.label === 'Open' ? 'text-emerald-600' : 'text-amber-600'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${status.label === 'Open' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span className="text-xs font-medium">{status.text}</span>
            </div>
          )}
        </div>

        <div className="flex items-start gap-1.5 text-sm text-gray-500 mb-4 line-clamp-2">
          <MapPin className="h-4 w-4 text-[#0a897d] flex-shrink-0 mt-0.5" />
          <span>{business.address || business.city}</span>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/businesses/${business.slug}`} className="flex-1">
            <Button className="w-full h-10 rounded-xl bg-[#0a897d] hover:bg-[#0a897d]/90 text-white text-sm font-medium gap-2 transition-colors">
              View Details
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="outline" className="h-10 w-10 p-0 rounded-xl border-gray-200 hover:border-[#0a897d] hover:bg-[#0a897d]/5 hover:text-[#0a897d] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
