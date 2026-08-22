'use client';

import { useState } from 'react';
import { Search, MapPin, Loader2, Locate } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Location {
  id: string;
  name: string;
  slug: string;
  latitude: number | null;
  longitude: number | null;
}

interface HeroSearchProps {
  popularLocations: Location[];
  onSearch?: (query: string) => void;
  onLocationSelect?: (slug: string) => void;
}

function getDistanceFromLatLonInKm(
  lat1: number, lon1: number, lat2: number, lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function HeroSearch({ popularLocations, onSearch, onLocationSelect }: HeroSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [locating, setLocating] = useState(false);

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Find nearest location from DB
        const locationsWithCoords = popularLocations.filter(
          (loc) => loc.latitude != null && loc.longitude != null
        );

        if (locationsWithCoords.length > 0) {
          let nearest = locationsWithCoords[0];
          let minDist = getDistanceFromLatLonInKm(
            latitude,
            longitude,
            nearest.latitude!,
            nearest.longitude!
          );

          for (const loc of locationsWithCoords) {
            const dist = getDistanceFromLatLonInKm(
              latitude,
              longitude,
              loc.latitude!,
              loc.longitude!
            );
            if (dist < minDist) {
              minDist = dist;
              nearest = loc;
            }
          }

          onLocationSelect?.(nearest.slug);
        }

        setLocating(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocating(false);
        alert('Unable to retrieve your location. Please check your browser permissions.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  return (
    <>
      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        <Input
          type="text"
          placeholder="Search for businesses, services, or offers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && searchQuery.trim()) {
              onSearch?.(searchQuery.trim());
            }
          }}
          className="w-full pl-12 pr-24 py-4 rounded-full text-gray-900 bg-white border-0 focus:ring-2 focus:ring-primary/50 text-lg"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleLocationClick}
            disabled={locating}
            className="h-9 w-9 rounded-full text-gray-400 hover:text-[#0a897d] hover:bg-gray-100"
            title="Use my current location"
          >
            {locating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Locate className="h-4 w-4" />
            )}
          </Button>
          <Button
            type="button"
            onClick={() => searchQuery.trim() && onSearch?.(searchQuery.trim())}
            className="h-9 rounded-full bg-[#0a897d] hover:bg-[#0d6e6a] text-white text-sm px-4"
          >
            Search
          </Button>
        </div>
      </div>

      {/* Location selector */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <MapPin className="h-4 w-4 text-white/60" />
        <select
          onChange={(e) => e.target.value && onLocationSelect?.(e.target.value)}
          defaultValue=""
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          <option value="">All Locations</option>
          {popularLocations.map((loc) => (
            <option key={loc.slug} value={loc.slug} className="text-gray-900">
              {loc.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
