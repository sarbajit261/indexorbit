'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Clock, Star, MapPin, Phone, Globe, Mail, Smartphone, Ticket, Copy, Check, Calendar, Tag, Sparkles, Flame, BadgeCheck, Gift, Share2, Bookmark, ChevronRight, Users, Award, ExternalLink, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Offer {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  discountType: string;
  discountValue: number | null;
  couponCode: string | null;
  terms: string | null;
  businessId: string;
  endDate: string;
  startDate: string;
  redeemType: string;
  redeemLink: string | null;
  redeemInstructions: string | null;
  isFeatured: boolean;
  isExclusive: boolean;
  minPurchase: number | null;
  perUserLimit: number | null;
  applicableDays: string[];
  tags: string[];
  views: number;
  clicks: number;
  business: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    city: string | null;
    state: string | null;
    address: string | null;
    phone: string | null;
    website: string | null;
    latitude: number | null;
    longitude: number | null;
    rating: number;
    reviewCount: number;
    verificationStatus: string;
    businessType?: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

function formatDiscount(discountType: string, discountValue: number | null) {
  if (discountType === 'BUY_ONE_GET_ONE') return 'BUY 1 GET 1';
  if (discountType === 'FREE_ITEM') return 'FREE';
  if (discountType === 'FIXED') return `$${discountValue} OFF`;
  return `${discountValue}% OFF`;
}

function getDiscountGradient(discountType: string, discountValue: number | null) {
  if (discountType === 'BUY_ONE_GET_ONE' || discountType === 'FREE_ITEM')
    return 'from-emerald-400 via-green-500 to-teal-600';
  if (discountType === 'PERCENTAGE' && discountValue && discountValue >= 50)
    return 'from-red-400 via-rose-500 to-pink-600';
  return 'from-[#0a897d] via-[#0d6e6a] to-[#0a544f]';
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
    case 'ONLINE': return 'Use Online';
    case 'IN_STORE': return 'Visit In-Store';
    case 'ONLINE_AND_INSTORE': return 'Use Online or In-Store';
    case 'PHONE': return 'Call to Claim';
    case 'EMAIL': return 'Email to Claim';
    case 'COUPON_CODE': return 'Use Coupon Code';
    case 'APP_ONLY': return 'Use Mobile App';
    default: return 'Use Online';
  }
}

function getRedeemDescription(redeemType: string) {
  switch (redeemType) {
    case 'ONLINE': return 'Apply this offer at checkout on their website.';
    case 'IN_STORE': return 'Show this offer at the store to redeem.';
    case 'ONLINE_AND_INSTORE': return 'Apply at checkout or show this offer in-store.';
    case 'PHONE': return 'Call the business and mention this offer.';
    case 'EMAIL': return 'Email the business with this offer to redeem.';
    case 'COUPON_CODE': return 'Enter the coupon code at checkout.';
    case 'APP_ONLY': return 'Redeem through the business mobile app.';
    default: return 'Apply this offer at checkout.';
  }
}

function getDaysLeft(endDate: string) {
  const days = Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (days < 0) return { label: 'Expired', urgent: true };
  if (days === 0) return { label: 'Ends Today', urgent: true };
  if (days === 1) return { label: '1 day left', urgent: true };
  if (days <= 7) return { label: `${days} days left`, urgent: true };
  return { label: `${days} days left`, urgent: false };
}

export default function OfferDetailPage() {
  const params = useParams();
  const router = useRouter();
  const offerSlug = params.offerSlug as string;

  const [offer, setOffer] = useState<Offer | null>(null);
  const [relatedOffers, setRelatedOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function fetchOffer() {
      setLoading(true);
      try {
        // Fetch the specific offer by slug
        const offerRes = await fetch(`/api/offers?slug=${encodeURIComponent(offerSlug)}&limit=1`);
        if (offerRes.ok) {
          const offerData = await offerRes.json();
          if (offerData.offers && offerData.offers.length > 0) {
            setOffer(offerData.offers[0]);

            // Fetch related offers
            const allRes = await fetch(`/api/offers?limit=50`);
            const allData = await allRes.json();
            const allOffers = allData.offers || [];
            const related = allOffers
              .filter((o: Offer) => o.id !== offerData.offers[0].id && o.business?.businessType?.slug === offerData.offers[0].business?.businessType?.slug)
              .slice(0, 3);
            setRelatedOffers(related);
          } else {
            setOffer(null);
          }
        } else {
          setOffer(null);
        }
      } catch (error) {
        console.error('Failed to fetch offer:', error);
        setOffer(null);
      } finally {
        setLoading(false);
      }
    }
    fetchOffer();
  }, [offerSlug]);

  const handleCopyCode = () => {
    if (offer?.couponCode) {
      navigator.clipboard.writeText(offer.couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClaim = () => {
    if (!offer) return;

    // Increment clicks
    fetch(`/api/offers/${offer.id}/click`, { method: 'POST' }).catch(() => {});

    // Route based on redeem type
    const onlineTypes = ['ONLINE', 'ONLINE_AND_INSTORE', 'COUPON_CODE', 'APP_ONLY'];

    if (onlineTypes.includes(offer.redeemType)) {
      // Online types → open redeem link if available, fallback to website, fallback to business page
      const link = offer.redeemLink || offer.business.website;
      if (link) {
        window.open(link, '_blank', 'noopener,noreferrer');
      } else {
        router.push(`/businesses/${offer.business.slug}`);
      }
    } else if (offer.redeemType === 'IN_STORE') {
      // In-store → go to business page
      router.push(`/businesses/${offer.business.slug}`);
    } else if (offer.redeemType === 'PHONE') {
      // Phone → call the business
      if (offer.business.phone) {
        window.location.href = `tel:${offer.business.phone}`;
      } else {
        router.push(`/businesses/${offer.business.slug}`);
      }
    } else if (offer.redeemType === 'EMAIL') {
      // Email → open mailto
      const email = `info@${offer.business.slug}.com`;
      window.location.href = `mailto:${email}`;
    } else {
      router.push(`/businesses/${offer.business.slug}`);
    }
  };

  const getClaimButtonContent = () => {
    if (!offer) return { icon: Gift, label: 'Claim This Offer' };
    const onlineTypes = ['ONLINE', 'ONLINE_AND_INSTORE', 'COUPON_CODE', 'APP_ONLY'];

    if (onlineTypes.includes(offer.redeemType)) {
      return { icon: ExternalLink, label: 'Redeem Online' };
    }
    if (offer.redeemType === 'IN_STORE') {
      return { icon: MapPin, label: 'Visit Store' };
    }
    if (offer.redeemType === 'PHONE') {
      return { icon: Phone, label: 'Call to Claim' };
    }
    if (offer.redeemType === 'EMAIL') {
      return { icon: Mail, label: 'Email to Claim' };
    }
    return { icon: Gift, label: 'Claim This Offer' };
  };

  const claimButton = getClaimButtonContent();
  const ClaimIcon = claimButton.icon;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-[#0a897d] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading offer...</p>
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <Tag className="h-10 w-10 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Offer Not Found</h1>
          <p className="text-gray-500 mb-8">This offer may have expired or been removed.</p>
          <Link href="/offers">
            <Button className="bg-gradient-to-r from-[#0a897d] to-[#0d6e6a] text-white">
              Browse All Offers
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const RedeemIcon = getRedeemIcon(offer.redeemType);
  const daysLeft = getDaysLeft(offer.endDate);
  const gradientClass = getDiscountGradient(offer.discountType, offer.discountValue);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6 text-gray-500">
          <Link href="/" className="hover:text-[#0a897d]">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/offers" className="hover:text-[#0a897d]">Offers</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-700 truncate max-w-xs">{offer.title}</span>
        </div>

        {/* Hero Banner */}
        <div className={`relative bg-gradient-to-br ${gradientClass} text-white rounded-3xl overflow-hidden mb-8 shadow-2xl`}>
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-20 w-40 h-40 bg-white rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 left-20 w-60 h-60 bg-white rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-yellow-200 rounded-full blur-xl"></div>
          </div>

          {/* Top badges */}
          <div className="relative flex flex-wrap gap-2 px-8 pt-6">
            {offer.isFeatured && (
              <span className="inline-flex items-center gap-1.5 bg-white/25 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
                <Sparkles className="h-3 w-3" />
                FEATURED
              </span>
            )}
            {offer.isExclusive && (
              <span className="inline-flex items-center gap-1.5 bg-purple-500/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
                <Award className="h-3 w-3" />
                VIP EXCLUSIVE
              </span>
            )}
            {daysLeft.urgent && (
              <span className="inline-flex items-center gap-1.5 bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
                <Flame className="h-3 w-3" />
                {daysLeft.label.toUpperCase()}
              </span>
            )}
          </div>

          <div className="relative px-8 py-10">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                {offer.title}
              </h1>
              <div className="mt-3 text-sm uppercase tracking-wider opacity-90">
                Limited Time Offer
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Tag className="h-5 w-5 text-[#0a897d]" />
                About This Offer
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {offer.description}
              </p>

              {/* Tags */}
              {offer.tags && offer.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                  {offer.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gradient-to-r from-[#0a897d]/10 to-[#0d6e6a]/10 text-[#0a897d] text-xs font-medium rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Offer Details */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#0a897d]" />
                Offer Details
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Calendar className="h-5 w-5 text-[#0a897d] flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500">Valid From</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {new Date(offer.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Calendar className="h-5 w-5 text-orange-500 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500">Expires On</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {new Date(offer.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                {offer.minPurchase && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Tag className="h-5 w-5 text-[#0a897d] flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-500">Min. Purchase</div>
                      <div className="text-sm font-semibold text-gray-900">${offer.minPurchase}</div>
                    </div>
                  </div>
                )}
                {offer.perUserLimit && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Users className="h-5 w-5 text-[#0a897d] flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-500">Per User Limit</div>
                      <div className="text-sm font-semibold text-gray-900">{offer.perUserLimit} time{offer.perUserLimit > 1 ? 's' : ''}</div>
                    </div>
                  </div>
                )}
                {offer.applicableDays && offer.applicableDays.length > 0 && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl sm:col-span-2">
                    <Clock className="h-5 w-5 text-[#0a897d] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-500">Valid On</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {offer.applicableDays.map(day => (
                          <span key={day} className="px-2 py-0.5 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded">
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Terms & Conditions */}
            {offer.terms && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Tag className="h-5 w-5 text-[#0a897d]" />
                  Terms & Conditions
                </h2>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{offer.terms}</p>
              </div>
            )}

            {/* Business Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BadgeCheck className="h-5 w-5 text-[#0a897d]" />
                About the Business
              </h2>
              <Link
                href={`/businesses/${offer.business.slug}`}
                className="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0a897d] to-[#0d6e6a] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-2xl">
                    {offer.business.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 group-hover:text-[#0a897d] transition-colors truncate">
                      {offer.business.name}
                    </h3>
                    {offer.business.verificationStatus === 'VERIFIED' && (
                      <BadgeCheck className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{offer.business.rating.toFixed(1)}</span>
                    </div>
                    <span>•</span>
                    <span>{offer.business.reviewCount} reviews</span>
                    {offer.business.city && (
                      <>
                        <span>•</span>
                        <span className="truncate">{offer.business.city}{offer.business.state ? `, ${offer.business.state}` : ''}</span>
                      </>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#0a897d] transition-colors" />
              </Link>

              {/* Contact */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                {offer.business.address && (
                  <a
                    href={(() => {
                      const lat = offer.business.latitude;
                      const lng = offer.business.longitude;
                      const query = encodeURIComponent(`${offer.business.name}, ${offer.business.address}`);
                      if (lat && lng) {
                        return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
                      }
                      return `https://www.google.com/maps/search/?api=1&query=${query}`;
                    })()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <MapPin className="h-4 w-4 text-[#0a897d] flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-gray-600 truncate flex items-center gap-1">
                      View on Google Maps
                      <ExternalLink className="h-3 w-3" />
                    </div>
                  </a>
                )}
                {offer.business.phone && (
                  <a
                    href={`tel:${offer.business.phone}`}
                    className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Phone className="h-4 w-4 text-[#0a897d] flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-gray-600">{offer.business.phone}</div>
                  </a>
                )}
                {offer.business.website && (
                  <a
                    href={offer.business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Globe className="h-4 w-4 text-[#0a897d] flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-gray-600 truncate flex items-center gap-1">
                      Visit Website
                      <ExternalLink className="h-3 w-3" />
                    </div>
                  </a>
                )}
                {offer.redeemLink && ['ONLINE', 'ONLINE_AND_INSTORE', 'COUPON_CODE', 'APP_ONLY'].includes(offer.redeemType) && (
                  <a
                    href={offer.redeemLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 p-3 bg-gradient-to-r from-[#0a897d]/10 to-[#0d6e6a]/10 border border-[#0a897d]/30 rounded-lg hover:from-[#0a897d]/20 hover:to-[#0d6e6a]/20 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 text-[#0a897d] flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-[#0a897d] font-medium truncate flex items-center gap-1">
                      Redeem Link
                      <ExternalLink className="h-3 w-3" />
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* How to Redeem */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <RedeemIcon className="h-5 w-5 text-[#0a897d]" />
                  How to Redeem
                </h2>
                <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-[#0a897d]/5 to-[#0d6e6a]/5 rounded-xl border border-[#0a897d]/20">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0a897d] to-[#0d6e6a] flex items-center justify-center flex-shrink-0">
                    <RedeemIcon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-sm">{getRedeemLabel(offer.redeemType)}</h3>
                    <p className="text-xs text-gray-600 mt-0.5">{getRedeemDescription(offer.redeemType)}</p>
                  </div>
                </div>

                {/* Coupon Code */}
                {offer.couponCode && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-dashed border-amber-300 rounded-xl">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[10px] font-medium text-amber-700 uppercase tracking-wider mb-0.5">Coupon Code</div>
                        <div className="text-xl font-extrabold font-mono text-amber-900 tracking-wider truncate">
                          {offer.couponCode}
                        </div>
                      </div>
                      <button
                        onClick={handleCopyCode}
                        className="px-3 py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white text-sm font-semibold rounded-lg transition-all shadow-md flex items-center gap-1.5 flex-shrink-0"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Custom Redeem Instructions */}
                {offer.redeemInstructions && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ListChecks className="h-4 w-4 text-[#0a897d]" />
                      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Step-by-Step Instructions</h3>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                        {offer.redeemInstructions}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Claim Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <Button
                  onClick={handleClaim}
                  className="w-full bg-gradient-to-r from-[#0a897d] to-[#0d6e6a] hover:from-[#0d6e6a] hover:to-[#0a897d] text-white text-base py-6 rounded-xl font-semibold shadow-md"
                >
                  <ClaimIcon className="h-5 w-5 mr-2" />
                  {claimButton.label}
                </Button>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button
                    onClick={() => setSaved(!saved)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      saved
                        ? 'bg-[#0a897d]/10 border-[#0a897d] text-[#0a897d]'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Bookmark className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
                    {saved ? 'Saved' : 'Save'}
                  </button>
                  <button className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-all">
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                </div>
              </div>

              {/* Quick Info */}
              <div className="bg-gradient-to-br from-[#0a897d]/5 to-[#0d6e6a]/5 rounded-2xl p-5 border border-[#0a897d]/20">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-[#0a897d]" />
                  Quick Info
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Type</span>
                    <span className="font-semibold text-gray-900">
                      {offer.discountType === 'BUY_ONE_GET_ONE' ? 'BOGO' :
                       offer.discountType === 'FREE_ITEM' ? 'Free Item' :
                       offer.discountType === 'FIXED' ? 'Fixed Amount' : 'Percentage'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Redeem</span>
                    <span className="font-semibold text-gray-900 text-xs">
                      {getRedeemLabel(offer.redeemType)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Offers */}
        {relatedOffers.length > 0 && (
          <section className="py-10 mt-8 bg-white rounded-2xl border border-gray-100">
            <div className="px-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Gift className="h-5 w-5 text-[#0a897d]" />
                  Similar Offers You May Like
                </h2>
                <Link href="/offers" className="text-sm text-[#0a897d] hover:text-[#0d6e6a] font-medium flex items-center gap-1">
                  View All
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedOffers.map((relatedOffer) => (
                  <Link
                    key={relatedOffer.id}
                    href={`/offers/${relatedOffer.slug}`}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 border border-gray-100"
                  >
                    <div className={`relative bg-gradient-to-br ${getDiscountGradient(relatedOffer.discountType, relatedOffer.discountValue)} text-white px-5 py-6 text-center overflow-hidden`}>
                      <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                      <div className="relative">
                        <div className="text-3xl font-extrabold tracking-tight">
                          {formatDiscount(relatedOffer.discountType, relatedOffer.discountValue)}
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#0a897d] transition-colors mb-1 line-clamp-2">
                        {relatedOffer.title}
                      </h3>
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{relatedOffer.description}</p>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500 truncate">{relatedOffer.business.name}</p>
                        <span className="text-xs text-[#0a897d] font-medium">View →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}