'use client';

import { useState } from 'react';
import { Search, Loader2, MapPin } from 'lucide-react';

interface HeroSearchProps {
  onSearch?: (query: string) => void;
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`, {
      headers: { 'Accept-Language': 'en' },
    });
    if (!res.ok) return `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
    const data = await res.json();
    const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || '';
    const country = data.address?.country || '';
    if (city && country) return `${city}, ${country}`;
    if (city) return city;
    return data.display_name?.split(',').slice(0, 2).join(',') || `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
  } catch {
    return `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
  }
}

export function HeroSearch({ onSearch }: HeroSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [locating, setLocating] = useState(false);
  const [locationName, setLocationName] = useState('All Locations');

  const handleLocationClick = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const name = await reverseGeocode(latitude, longitude);
        setLocationName(name);
        setLocating(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocating(false);
      }
    );
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="flex items-center bg-white rounded-full shadow-lg h-16">
        {/* Search icon + input */}
        <div className="flex items-center flex-1 pl-5">
          <Search className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
          <input
            type="text"
            placeholder="Find food, spas, services, shops, ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-900 text-base placeholder:text-gray-400"
          />
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200 mx-2" />

        {/* Location button */}
        <button
          type="button"
          onClick={handleLocationClick}
          disabled={locating}
          className="flex items-center gap-2 px-4 h-full text-gray-500 hover:text-[#0a897d] transition-colors disabled:opacity-50 flex-shrink-0"
          title="Use my current location"
        >
          {locating ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <MapPin className="h-5 w-5" />
          )}
          <span className="text-sm font-medium whitespace-nowrap max-w-[180px] truncate">{locationName}</span>
        </button>

        {/* Search button */}
        <button
          onClick={handleSearch}
          className="bg-[#0a897d] hover:bg-[#087a6f] text-white rounded-full px-6 py-2.5 font-medium flex items-center gap-2 transition-colors flex-shrink-0 mr-1.5"
        >
          <Search className="h-4 w-4" />
          <span>Search</span>
        </button>
      </div>
    </div>
  );
}
