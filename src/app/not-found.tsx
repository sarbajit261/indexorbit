import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import {
  Home,
  Search,
  ArrowLeft,
  Compass,
  MapPin,
  Sparkles,
} from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#0a897d]/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#14b8a6]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#0a897d]/5 to-[#14b8a6]/5 rounded-full blur-3xl" />
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-32 left-[15%] animate-bounce" style={{ animationDuration: '3s' }}>
            <MapPin className="h-8 w-8 text-[#0a897d]/20" />
          </div>
          <div className="absolute top-48 right-[20%] animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}>
            <Compass className="h-10 w-10 text-[#14b8a6]/20" />
          </div>
          <div className="absolute bottom-40 left-[25%] animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }}>
            <Search className="h-6 w-6 text-[#0a897d]/15" />
          </div>
          <div className="absolute bottom-32 right-[15%] animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '0.3s' }}>
            <Sparkles className="h-8 w-8 text-[#14b8a6]/15" />
          </div>
        </div>

        <div className="max-w-2xl mx-auto text-center relative z-10">
          {/* 404 Visual */}
          <div className="relative mb-8">
            <div className="text-[180px] md:text-[220px] font-bold leading-none select-none">
              <span className="bg-clip-text text-transparent bg-gradient-to-br from-[#0a897d] via-[#0d9488] to-[#14b8a6]">
                404
              </span>
            </div>

            {/* Decorative Elements around 404 */}
            <div className="absolute -top-4 -right-4 md:top-0 md:right-[-60px]">
              <div className="relative">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-[#0a897d] to-[#14b8a6] flex items-center justify-center shadow-lg shadow-[#0a897d]/30 rotate-6 hover:rotate-0 transition-transform duration-300">
                  <MapPin className="h-8 w-8 md:h-10 md:w-10 text-white" />
                </div>
              </div>
            </div>

            <div className="absolute -bottom-2 -left-4 md:bottom-0 md:left-[-60px]">
              <div className="relative">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-400/30 -rotate-6 hover:rotate-0 transition-transform duration-300">
                  <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Oops! You&apos;ve wandered off the map
            </h1>
            <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
              The page you&apos;re looking for has either moved, been removed, or never existed.
              Let&apos;s get you back on track to discover amazing local businesses.
            </p>
          </div>

          {/* Search Suggestions */}
          <div className="mt-10 p-6 bg-white rounded-2xl shadow-sm border">
            <p className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">
              Try searching instead
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/businesses">
                <Button variant="outline" className="gap-2 border-[#0a897d] text-[#0a897d] hover:bg-[#0a897d] hover:text-white">
                  <Compass className="h-4 w-4" />
                  Browse Businesses
                </Button>
              </Link>
              <Link href="/business-category">
                <Button variant="outline" className="gap-2 border-[#0a897d] text-[#0a897d] hover:bg-[#0a897d] hover:text-white">
                  <MapPin className="h-4 w-4" />
                  Browse Categories
                </Button>
              </Link>
              <Link href="/offers">
                <Button variant="outline" className="gap-2 border-[#0a897d] text-[#0a897d] hover:bg-[#0a897d] hover:text-white">
                  <Sparkles className="h-4 w-4" />
                  View Offers
                </Button>
              </Link>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8">
            <Link href="/">
              <Button className="gap-2 bg-gradient-to-r from-[#0a897d] to-[#0d9488] hover:from-[#0d9488] hover:to-[#0a897d] text-white shadow-lg shadow-[#0a897d]/25">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Fun Message */}
          <div className="mt-12 flex items-center justify-center gap-2 text-gray-400">
            <span className="text-2xl">🌍</span>
            <p className="text-sm">
              Every location has a story. Let&apos;s find yours.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
