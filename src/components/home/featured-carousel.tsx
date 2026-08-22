'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { BusinessCard } from '@/components/business/business-card';
import { Button } from '@/components/ui/button';

interface FeaturedCarouselProps {
  businesses: any[];
}

export function FeaturedCarousel({ businesses }: FeaturedCarouselProps) {
  const [isHovered, setIsHovered] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const scrollPrev = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollNext = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (!isHovered) {
      intervalRef.current = setInterval(() => {
        if (carouselRef.current) {
          carouselRef.current.scrollBy({ left: 340, behavior: 'smooth' });
          // Reset to start when reaching the end
          if (carouselRef.current.scrollLeft + carouselRef.current.clientWidth >= carouselRef.current.scrollWidth - 10) {
            setTimeout(() => {
              carouselRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
            }, 500);
          }
        }
      }, 4000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovered]);

  return (
    <section className="py-16">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl">
              <span className="font-light">Featured </span>
              <span className="font-bold">Businesses</span>
            </h2>
            <p className="text-muted-foreground mt-1">
              Top-rated businesses recommended for you
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={scrollPrev}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={scrollNext}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {businesses.map((business) => (
            <div key={business.id} className="flex-shrink-0 w-[320px] snap-start">
              <BusinessCard business={business} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
