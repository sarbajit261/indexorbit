'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Mail, Globe, Star, Clock, ExternalLink, Tag, CheckCircle, ArrowRight, Navigation, Eye, Heart, Bookmark, Share2, Flag, X, Send, Loader2, Camera, ChevronLeft, ChevronRight, AlertTriangle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface BusinessData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  logo: string | null;
  coverImage: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
  rating: number;
  reviewCount: number;
  viewCount: number;
  likeCount: number;
  verificationStatus: string;
  featuredStatus: string;
  yearEstablished: number | null;
  priceRange: number | null;
  languages: string[];
  paymentMethods: string[];
  businessType: { name: string; slug: string };
  offers: any[];
  reviews: any[];
  hours: any[];
  amenities: { amenity: { name: string; icon: string | null } }[];
  facilities: { facility: { name: string; icon: string | null } }[];
  gallery: { id: string; url: string; caption: string | null }[];
  faqs: { id: string; question: string; answer: string; order: number }[];
}

interface SimilarBusiness {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  rating: number;
  reviewCount: number;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getOpenStatus(hours: any[]) {
  const now = new Date();
  const day = now.getDay();
  const todayHours = hours.find(h => h.dayOfWeek === day);
  if (!todayHours || todayHours.isClosed) return { isOpen: false, text: 'Closed', closeTime: '' };

  const formatTime = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  return {
    isOpen: true,
    text: `Open · Closes at ${formatTime(todayHours.closeTime)}`,
    closeTime: todayHours.closeTime,
  };
}

export function BusinessPageClient({ business, similarBusinesses, googleMapsUrl, amenityIcons }: { business: BusinessData; similarBusinesses: SimilarBusiness[]; googleMapsUrl: string; amenityIcons: Record<string, string> }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(business.likeCount);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'offers' | 'reviews' | 'gallery'>('about');

  const openStatus = getOpenStatus(business.hours);
  const mapsUrl = googleMapsUrl;

  useEffect(() => {
    // Check if liked
    fetch(`/api/businesses/${business.slug}/like`)
      .then(r => r.json())
      .then(d => setIsLiked(d.liked))
      .catch(() => {});
  }, [business.slug]);

  const handleLike = async () => {
    const res = await fetch(`/api/businesses/${business.slug}/like`, { method: 'POST' });
    const data = await res.json();
    setIsLiked(data.liked);
    setLikeCount(c => data.liked ? c + 1 : c - 1);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: business.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied!');
    }
  };

  const handleBookmark = () => {
    const saved = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    const idx = saved.indexOf(business.slug);
    if (idx > -1) {
      saved.splice(idx, 1);
    } else {
      saved.push(business.slug);
    }
    localStorage.setItem('bookmarks', JSON.stringify(saved));
    alert(idx > -1 ? 'Removed from bookmarks' : 'Added to bookmarks');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-teal-600 to-teal-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <Link href="/businesses" className="flex items-center gap-2 text-white/80 hover:text-white transition">
              <ChevronLeft className="h-5 w-5" />
              <span>Back to Businesses</span>
            </Link>
            <div className="flex items-center gap-3">
              <button onClick={handleLike} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition ${isLiked ? 'bg-red-500' : 'bg-white/10 hover:bg-white/20'}`}>
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-white' : ''}`} />
                <span className="text-sm font-medium">{likeCount}</span>
              </button>
              <button onClick={handleBookmark} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
                <Bookmark className="h-4 w-4" />
              </button>
              <button onClick={handleShare} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              {business.logo ? (
                <Image src={business.logo} alt={business.name} width={100} height={100} className="rounded-xl" />
              ) : (
                <div className="w-24 h-24 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-3xl font-bold">{business.name[0]}</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{business.name}</h1>
                {business.verificationStatus === 'VERIFIED' && (
                  <span className="flex items-center gap-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                    <CheckCircle className="h-3 w-3" /> Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-white/90 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{business.rating.toFixed(1)}</span>
                  <span className="text-white/60">({business.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{business.viewCount} views</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className={`flex items-center gap-1 ${openStatus.isOpen ? 'text-green-300' : 'text-red-300'}`}>
                  <Clock className="h-4 w-4" />
                  {openStatus.text}
                </span>
                {business.address && (
                  <span className="flex items-center gap-1 text-white/80">
                    <MapPin className="h-4 w-4" />
                    {business.address}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            {(['about', 'offers', 'reviews', 'gallery'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`py-4 text-sm font-medium border-b-2 transition capitalize ${activeTab === tab ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                {tab} {tab === 'offers' && business.offers.length > 0 && <span className="ml-1 bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded-full text-xs">{business.offers.length}</span>}
                {tab === 'reviews' && business.reviews.length > 0 && <span className="ml-1 bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-full text-xs">{business.reviews.length}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            {activeTab === 'about' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">About {business.name}</h2>
                <p className="text-gray-600 leading-relaxed">{business.description || business.shortDescription || 'No description available.'}</p>

                {/* Amenities */}
                {business.amenities.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-medium mb-3">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {business.amenities.map(a => (
                        <span key={a.amenity.name} className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">{a.amenity.name}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Facilities */}
                {business.facilities.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-medium mb-3">Facilities</h3>
                    <div className="flex flex-wrap gap-2">
                      {business.facilities.map(f => (
                        <span key={f.facility.name} className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full text-sm">{f.facility.name}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Info */}
                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  {business.yearEstablished && <div><span className="text-gray-500">Established:</span> {business.yearEstablished}</div>}
                  {business.priceRange && (
                    <div><span className="text-gray-500">Price Range:</span> {'$'.repeat(business.priceRange)}</div>
                  )}
                  {business.languages.length > 0 && <div><span className="text-gray-500">Languages:</span> {business.languages.join(', ')}</div>}
                </div>

                {/* FAQ Section */}
                {business.faqs.length > 0 && (
                  <div className="mt-8 pt-6 border-t">
                    <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
                    <div className="space-y-3">
                      {business.faqs.map((faq) => (
                        <FAQItem key={faq.id} faq={faq} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Offers Section - 4 Column Grid */}
            {activeTab === 'offers' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Active Offers ({business.offers.length})</h2>
                {business.offers.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {business.offers.map(offer => (
                      <Link key={offer.id} href={`/offers/${offer.slug}`} className="group">
                        <div className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl p-4 text-white h-full">
                          <div className="text-xs bg-white/20 rounded px-2 py-0.5 inline-block mb-2">
                            {offer.discountType === 'PERCENTAGE' ? `${offer.discountValue}% OFF` : offer.discountType === 'BUY_ONE_GET_ONE' ? 'BOGO' : 'SPECIAL'}
                          </div>
                          <h3 className="font-semibold text-sm line-clamp-2 mb-2">{offer.title}</h3>
                          <p className="text-xs text-white/80 line-clamp-2">Valid until {new Date(offer.endDate).toLocaleDateString()}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No active offers at the moment.</p>
                )}
              </div>
            )}

            {/* Reviews Section */}
            {activeTab === 'reviews' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Reviews ({business.reviews.length})</h2>
                  <Button onClick={() => setShowReviewModal(true)} className="bg-teal-600 hover:bg-teal-700">Write a Review</Button>
                </div>
                {business.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {business.reviews.map(review => (
                      <div key={review.id} className="border-b pb-4 last:border-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                            {review.user?.name?.[0] || 'A'}
                          </div>
                          <div>
                            <span className="font-medium text-sm">{review.user?.name || 'Anonymous'}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                              ))}
                            </div>
                          </div>
                        </div>
                        {review.title && <h4 className="font-medium text-sm mb-1">{review.title}</h4>}
                        <p className="text-gray-600 text-sm">{review.content}</p>
                        {review.images?.length > 0 && (
                          <div className="flex gap-2 mt-2">
                            {review.images.map((img, i) => (
                              <Image key={i} src={img} alt="" width={60} height={60} className="rounded object-cover" />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
                )}
              </div>
            )}

            {/* Gallery Section */}
            {activeTab === 'gallery' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Photo Gallery ({business.gallery.length})</h2>
                {business.gallery.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {business.gallery.map((img, i) => (
                      <button key={img.id} onClick={() => { setGalleryIndex(i); setShowGalleryModal(true); }} className="relative aspect-square rounded-xl overflow-hidden group">
                        <Image src={img.url} alt={img.caption || ''} fill className="object-cover group-hover:scale-105 transition" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No photos available.</p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold mb-4">Contact Information</h3>
              <div className="space-y-3">
                {business.phone && (
                  <a href={`tel:${business.phone}`} className="flex items-center gap-3 text-gray-600 hover:text-teal-600">
                    <Phone className="h-5 w-5" /> {business.phone}
                  </a>
                )}
                {business.email && (
                  <a href={`mailto:${business.email}`} className="flex items-center gap-3 text-gray-600 hover:text-teal-600">
                    <Mail className="h-5 w-5" /> {business.email}
                  </a>
                )}
                {business.website && (
                  <a href={business.website} target="_blank" rel="noopener" className="flex items-center gap-3 text-gray-600 hover:text-teal-600">
                    <Globe className="h-5 w-5" /> Visit Website
                  </a>
                )}
                <a href={mapsUrl} target="_blank" rel="noopener" className="flex items-center gap-3 text-gray-600 hover:text-teal-600">
                  <MapPin className="h-5 w-5" /> Get Directions
                </a>
              </div>

              {/* Business Hours */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-3">Business Hours</h4>
                <div className="space-y-2 text-sm">
                  {DAYS.map((day, i) => {
                    const hours = business.hours.find(h => h.dayOfWeek === i);
                    return (
                      <div key={day} className={`flex justify-between ${i === new Date().getDay() ? 'text-teal-600 font-medium' : 'text-gray-600'}`}>
                        <span>{day}</span>
                        <span>{hours?.isClosed ? 'Closed' : hours ? `${hours.openTime} - ${hours.closeTime}` : 'N/A'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Report Button */}
              <button onClick={() => setShowReportModal(true)} className="mt-4 w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-red-600 py-2 border border-gray-200 rounded-lg transition">
                <Flag className="h-4 w-4" /> Report this business
              </button>
            </div>

            {/* Similar Businesses */}
            {similarBusinesses.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold mb-4">Similar Businesses</h3>
                <div className="space-y-4">
                  {similarBusinesses.map(b => (
                    <Link key={b.id} href={`/businesses/${b.slug}`} className="flex items-center gap-3 group">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                        {b.logo ? <Image src={b.logo} alt={b.name} width={48} height={48} className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-lg font-bold text-gray-400">{b.name[0]}</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate group-hover:text-teal-600">{b.name}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{b.rating.toFixed(1)}</span>
                          <span>({b.reviewCount})</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Write a Review for {business.name}</DialogTitle>
          </DialogHeader>
          <ReviewForm onClose={() => setShowReviewModal(false)} businessSlug={business.slug} />
        </DialogContent>
      </Dialog>

      {/* Report Modal */}
      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Report Business</DialogTitle>
          </DialogHeader>
          <ReportForm onClose={() => setShowReportModal(false)} businessSlug={business.slug} />
        </DialogContent>
      </Dialog>

      {/* Gallery Modal */}
      <Dialog open={showGalleryModal} onOpenChange={setShowGalleryModal}>
        <DialogContent className="max-w-4xl p-0">
          <div className="relative">
            <button onClick={() => setShowGalleryModal(false)} className="absolute top-2 right-2 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70">
              <X className="h-5 w-5" />
            </button>
            {business.gallery.length > 0 && (
              <>
                <div className="relative h-[70vh]">
                  <Image src={business.gallery[galleryIndex]?.url} alt="" fill className="object-contain" />
                </div>
                {business.gallery.length > 1 && (
                  <>
                    <button onClick={() => setGalleryIndex(i => (i - 1 + business.gallery.length) % business.gallery.length)} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70">
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button onClick={() => setGalleryIndex(i => (i + 1) % business.gallery.length)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70">
                      <ChevronRight className="h-6 w-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {business.gallery.map((_, i) => (
                        <button key={i} onClick={() => setGalleryIndex(i)} className={`w-2 h-2 rounded-full ${i === galleryIndex ? 'bg-white' : 'bg-white/50'}`} />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}

function FAQItem({ faq }: { faq: { question: string; answer: string } }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition"
      >
        <span className="font-medium text-sm text-gray-800">{faq.question}</span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-600">{faq.answer}</p>
        </div>
      )}
    </div>
  );
}

function ReviewForm({ onClose, businessSlug }: { onClose: () => void; businessSlug: string }) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) return alert('Please select a rating');
    if (content.length < 10) return alert('Review must be at least 10 characters');

    setSubmitting(true);
    try {
      const res = await fetch(`/api/businesses/${businessSlug}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, title, content }),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(onClose, 2000);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to submit review');
      }
    } catch (err) {
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return <div className="text-center py-8"><CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" /><p className="font-medium">Thank you! Your review has been submitted for approval.</p></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Rating *</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(r => (
            <button type="button" key={r} onClick={() => setRating(r)} className="p-1">
              <Star className={`h-8 w-8 ${r <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Title (optional)</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" placeholder="Summarize your experience" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Review *</label>
        <textarea value={content} onChange={e => setContent(e.target.value)} rows={4} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" placeholder="Share your experience..." required minLength={10} />
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
        <Button type="submit" disabled={submitting} className="flex-1 bg-teal-600 hover:bg-teal-700">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit Review'}
        </Button>
      </div>
    </form>
  );
}

function ReportForm({ onClose, businessSlug }: { onClose: () => void; businessSlug: string }) {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const reasons = [
    { value: 'INCORRECT_INFO', label: 'Incorrect Information' },
    { value: 'CLOSED_BUSINESS', label: 'Business is Closed' },
    { value: 'FAKE_LISTING', label: 'Fake Listing' },
    { value: 'INAPPROPRIATE_CONTENT', label: 'Inappropriate Content' },
    { value: 'SPAM', label: 'Spam' },
    { value: 'OTHER', label: 'Other' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return alert('Please select a reason');

    setSubmitting(true);
    try {
      const res = await fetch(`/api/businesses/${businessSlug}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, description }),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(onClose, 2000);
      } else {
        alert('Failed to submit report');
      }
    } catch (err) {
      alert('Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return <div className="text-center py-8"><CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" /><p className="font-medium">Thank you for your report. We will review it shortly.</p></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Reason *</label>
        <select value={reason} onChange={e => setReason(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" required>
          <option value="">Select a reason</option>
          {reasons.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Description (optional)</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" placeholder="Provide more details..." />
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
        <Button type="submit" disabled={submitting} className="flex-1 bg-red-600 hover:bg-red-700">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit Report'}
        </Button>
      </div>
    </form>
  );
}
