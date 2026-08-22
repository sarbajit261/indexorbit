import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import prisma from '@/lib/db/prisma';
import { Tag, Percent, Clock, Gift, MapPin, Star, Bookmark, Zap, Flame, BadgeCheck, Sparkles, Globe, Smartphone, Phone, Mail, Ticket, ArrowRight, ChevronRight } from 'lucide-react';

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

interface Offer {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  discountType: string;
  discountValue: number | null;
  couponCode: string | null;
  endDate: Date;
  redeemType: string;
  isFeatured: boolean;
  isExclusive: boolean;
  isVerified: boolean;
  business: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    city: string | null;
    state: string | null;
    rating: number;
    reviewCount: number;
    verificationStatus: string;
    businessType?: {
      name: string;
      slug: string;
    };
  };
}

interface BusinessType {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  color: string | null;
}

async function getOffers(category?: string): Promise<Offer[]> {
  const whereClause: any = {
    status: 'PUBLISHED',
    endDate: { gte: new Date() },
  };

  if (category) {
    whereClause.business = {
      businessType: { slug: category },
    };
  }

  const offers = await prisma.offer.findMany({
    where: whereClause,
    include: {
      business: {
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
          city: true,
          state: true,
          rating: true,
          reviewCount: true,
          verificationStatus: true,
          businessType: {
            select: { name: true, slug: true },
          },
        },
      },
    },
    orderBy: [{ isFeatured: 'desc' }, { endDate: 'asc' }],
    take: 100,
  });

  return offers as unknown as Offer[];
}

async function getBusinessTypes(): Promise<BusinessType[]> {
  const types = await prisma.businessType.findMany({
    where: { status: 'PUBLISHED' },
    select: { id: true, name: true, slug: true, icon: true, color: true },
    orderBy: { order: 'asc' },
    take: 12,
  });
  return types;
}

function formatDiscount(discountType: string, discountValue: number | null) {
  if (discountType === 'BUY_ONE_GET_ONE') return 'BUY 1 GET 1';
  if (discountType === 'FREE_ITEM') return 'FREE';
  if (discountType === 'FIXED') return `$${discountValue} OFF`;
  return `${discountValue}% OFF`;
}

function getRedeemIcon(redeemType: string) {
  switch (redeemType) {
    case 'ONLINE': return Globe;
    case 'IN_STORE': return MapPin;
    case 'ONLINE_AND_INSTORE': return Globe;
    case 'PHONE': return Phone;
    case 'EMAIL': return Mail;
    case 'COUPON_CODE': return Ticket;
    case 'APP_ONLY': return Smartphone;
    default: return Globe;
  }
}

function getRedeemLabel(redeemType: string) {
  switch (redeemType) {
    case 'ONLINE': return 'Online';
    case 'IN_STORE': return 'In-Store';
    case 'ONLINE_AND_INSTORE': return 'Online & In-Store';
    case 'PHONE': return 'Call to Claim';
    case 'EMAIL': return 'Email to Claim';
    case 'COUPON_CODE': return 'Use Code';
    case 'APP_ONLY': return 'App Only';
    default: return 'Online';
  }
}

function getDaysLeft(endDate: Date) {
  const days = Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (days < 0) return 'Expired';
  if (days === 0) return 'Ends today';
  if (days === 1) return '1 day left';
  return `${days} days left`;
}

export default async function OffersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const selectedCategory = params.category || null;

  const [offers, businessTypes] = await Promise.all([
    getOffers(selectedCategory || undefined),
    getBusinessTypes(),
  ]);

  const featuredOffers = offers.filter(o => o.isFeatured).slice(0, 4);
  const regularOffers = offers.filter(o => !o.isFeatured);
  const displayOffers = featuredOffers.length > 0 ? regularOffers : offers;

  const activeCount = offers.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0a897d] via-[#0d6e6a] to-[#0a544f] text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-yellow-300 rounded-full blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl">
              <Gift className="h-7 w-7" />
            </div>
            <span className="text-sm font-medium bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full flex items-center gap-2">
              <Flame className="h-3.5 w-3.5" />
              Hot Deals
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">
            Exclusive Offers <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">& Deals</span>
          </h1>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Save big on the best local businesses. Updated daily with new deals you won&apos;t find anywhere else.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span>{activeCount}+ Active Offers</span>
            </div>
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-blue-300" />
              <span>Verified Businesses</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-300" />
              <span>New Deals Daily</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <Link
              href="/offers"
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !selectedCategory
                  ? 'bg-[#0a897d] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Offers
            </Link>
            {businessTypes.map((type) => (
              <Link
                key={type.id}
                href={`/offers?category=${type.slug}`}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === type.slug
                    ? 'bg-[#0a897d] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Offers */}
        {featuredOffers.length > 0 && !selectedCategory && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Zap className="h-6 w-6 text-orange-500" />
                Featured Deals
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredOffers.map((offer) => {
                const gradientClass = offer.discountType === 'BUY_ONE_GET_ONE' || offer.discountType === 'FREE_ITEM'
                  ? 'from-emerald-400 via-green-500 to-teal-600'
                  : offer.discountType === 'PERCENTAGE' && offer.discountValue && offer.discountValue >= 50
                  ? 'from-red-400 via-rose-500 to-pink-600'
                  : 'from-[#0a897d] via-[#0d6e6a] to-[#0a544f]';

                return (
                  <Link
                    key={offer.id}
                    href={`/offers/${offer.slug}`}
                    className="group block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    {/* Discount Badge */}
                    <div className={`relative bg-gradient-to-br ${gradientClass} text-white px-4 py-6 text-center overflow-hidden`}>
                      <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                      <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                      <div className="relative">
                        <div className="text-3xl font-extrabold tracking-tight">
                          {formatDiscount(offer.discountType, offer.discountValue)}
                        </div>
                        <div className="text-[10px] uppercase tracking-wider mt-1 opacity-90">
                          {offer.isExclusive ? 'Exclusive Deal' : 'Special Offer'}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#0a897d] transition-colors line-clamp-2 text-sm mb-2">
                        {offer.title}
                      </h3>

                      {/* Business Info */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0a897d]/15 to-[#0d6e6a]/15 flex items-center justify-center flex-shrink-0">
                          {offer.business.logo ? (
                            <img src={offer.business.logo} alt="" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <span className="text-[#0a897d] font-bold text-xs">
                              {offer.business.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <p className="font-medium text-sm text-gray-900 truncate">{offer.business.name}</p>
                            {offer.business.verificationStatus === 'VERIFIED' && (
                              <BadgeCheck className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            {offer.business.rating > 0 && (
                              <>
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{offer.business.rating.toFixed(1)}</span>
                              </>
                            )}
                            {offer.business.city && <span className="truncate">{offer.business.city}</span>}
                          </div>
                        </div>
                      </div>

                      {/* Bottom */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1 px-2.5 py-1 bg-gray-50 rounded">
                          {(() => {
                            const Icon = getRedeemIcon(offer.redeemType);
                            return <Icon className="h-3 w-3 text-gray-600" />;
                          })()}
                          <span className="text-xs font-medium text-gray-600">
                            {getRedeemLabel(offer.redeemType)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-orange-500" />
                          <span className="text-xs font-semibold text-orange-600">
                            {getDaysLeft(offer.endDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* All Offers Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Tag className="h-6 w-6 text-[#0a897d]" />
              {selectedCategory
                ? `${businessTypes.find(t => t.slug === selectedCategory)?.name} Offers`
                : 'All Offers'}
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({displayOffers.length} deals)
              </span>
            </h2>
          </div>

          {displayOffers.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayOffers.map((offer) => {
                const gradientClass = offer.discountType === 'BUY_ONE_GET_ONE' || offer.discountType === 'FREE_ITEM'
                  ? 'from-emerald-400 via-green-500 to-teal-600'
                  : offer.discountType === 'PERCENTAGE' && offer.discountValue && offer.discountValue >= 50
                  ? 'from-red-400 via-rose-500 to-pink-600'
                  : 'from-[#0a897d] via-[#0d6e6a] to-[#0a544f]';

                return (
                  <Link
                    key={offer.id}
                    href={`/offers/${offer.slug}`}
                    className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    {/* Discount Badge */}
                    <div className={`relative bg-gradient-to-br ${gradientClass} text-white px-3 py-4 text-center`}>
                      <div className="text-xl font-extrabold tracking-tight">
                        {formatDiscount(offer.discountType, offer.discountValue)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#0a897d] transition-colors text-sm line-clamp-2 mb-2">
                        {offer.title}
                      </h3>

                      {/* Business */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#0a897d]/15 to-[#0d6e6a]/15 flex items-center justify-center flex-shrink-0">
                          {offer.business.logo ? (
                            <img src={offer.business.logo} alt="" className="w-full h-full object-cover rounded-md" />
                          ) : (
                            <span className="text-[#0a897d] font-bold text-[10px]">
                              {offer.business.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-700 font-medium truncate">{offer.business.name}</p>
                      </div>

                      {/* Bottom Row */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-[10px] text-gray-500">{getRedeemLabel(offer.redeemType)}</span>
                        <span className="text-[10px] font-semibold text-orange-600">{getDaysLeft(offer.endDate)}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Tag className="h-8 w-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2 text-gray-900">No offers found</h2>
              <p className="text-gray-500 mb-6">
                {selectedCategory ? 'No offers in this category yet.' : 'Check back later for new deals!'}
              </p>
              <Link
                href="/offers"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0a897d] text-white rounded-lg font-medium hover:bg-[#0d6e6a] transition-colors"
              >
                View All Offers
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
