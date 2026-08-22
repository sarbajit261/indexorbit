import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star, Clock, BadgeCheck, Heart, Share2, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BusinessCardProps {
  business: {
    id: string;
    slug: string;
    name: string;
    category: string;
    subcategory?: string;
    location: { city: string; state: string };
    rating: number;
    reviewCount: number;
    priceRange?: number;
    image: string;
    featured?: boolean;
    verified?: boolean;
    isOpen?: boolean;
    shortDescription?: string;
    hasOffer?: boolean;
  };
  variant?: 'default' | 'compact' | 'list';
  showActions?: boolean;
  className?: string;
}

export function BusinessCard({
  business,
  variant = 'default',
  showActions = true,
  className,
}: BusinessCardProps) {
  const renderPriceRange = (range?: number) => {
    if (!range) return null;
    return '$'.repeat(range);
  };

  if (variant === 'compact') {
    return (
      <Link href={`/businesses/${business.slug}`}>
        <Card className={cn('overflow-hidden hover:shadow-md transition-shadow', className)}>
          <div className="flex gap-3 p-3">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
              <Image
                src={business.image}
                alt={business.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <h3 className="font-semibold truncate">{business.name}</h3>
                {business.verified && (
                  <BadgeCheck className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">{business.category}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{business.rating}</span>
                  <span className="text-muted-foreground">({business.reviewCount})</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">
                  {business.location.city}, {business.location.state}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  if (variant === 'list') {
    return (
      <Link href={`/businesses/${business.slug}`}>
        <Card className={cn('overflow-hidden hover:shadow-md transition-shadow', className)}>
          <div className="flex">
            <div className="relative h-24 w-24 flex-shrink-0">
              <Image
                src={business.image}
                alt={business.name}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="flex-1 p-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1">
                    <h3 className="font-semibold">{business.name}</h3>
                    {business.verified && (
                      <BadgeCheck className="h-4 w-4 text-primary" />
                    )}
                    {business.featured && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold shadow-lg">
                        <Award className="h-3.5 w-3.5 fill-white" />
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{business.category}</p>
                  <div className="flex items-center gap-3 mt-1 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{business.rating}</span>
                      <span className="text-muted-foreground">({business.reviewCount})</span>
                    </div>
                    <span className="text-muted-foreground">•</span>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{business.location.city}, {business.location.state}</span>
                    </div>
                    {business.priceRange && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">
                          {renderPriceRange(business.priceRange)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {business.isOpen !== undefined && (
                  <Badge variant={business.isOpen ? 'success' : 'secondary'}>
                    {business.isOpen ? 'Open' : 'Closed'}
                  </Badge>
                )}
              </div>
            </CardContent>
          </div>
        </Card>
      </Link>
    );
  }

  // Default card
  return (
    <Link href={`/businesses/${business.slug}`}>
      <Card className={cn('overflow-hidden hover:shadow-lg transition-shadow', className)}>
        <div className="relative h-40 w-full">
          <Image
            src={business.image}
            alt={business.name}
            fill
            className="object-cover"
          />
          {business.featured && (
            <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold shadow-lg">
              <Award className="h-3.5 w-3.5 fill-white" />
              Featured
            </span>
          )}
          {business.hasOffer && (
            <Badge variant="destructive" className="absolute top-3 right-3">
              Special Offer
            </Badge>
          )}
          {showActions && (
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 hover:opacity-100 transition-opacity">
              <Button size="icon" variant="secondary" className="h-8 w-8">
                <Heart className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="secondary" className="h-8 w-8">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-lg">{business.name}</h3>
              <p className="text-sm text-muted-foreground">{business.category}</p>
            </div>
            {business.verified && (
              <BadgeCheck className="h-5 w-5 text-primary flex-shrink-0" />
            )}
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{business.rating}</span>
              <span className="text-muted-foreground">({business.reviewCount})</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{business.location.city}, {business.location.state}</span>
            </div>
          </div>

          {business.shortDescription && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {business.shortDescription}
            </p>
          )}

          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-3">
              {business.isOpen !== undefined && (
                <div className="flex items-center gap-1">
                  <div
                    className={cn(
                      'h-2 w-2 rounded-full',
                      business.isOpen ? 'bg-green-500' : 'bg-red-500'
                    )}
                  />
                  <span className="text-sm">
                    {business.isOpen ? 'Open now' : 'Closed'}
                  </span>
                </div>
              )}
              {business.priceRange && (
                <span className="text-sm text-muted-foreground">
                  {renderPriceRange(business.priceRange)}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
