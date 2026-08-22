'use client';

import { useState } from 'react';
import { Search, Loader2, Locate } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface HeroSearchProps {
  onSearch?: (query: string) => void;
}

export function HeroSearch({ onSearch }: HeroSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [locating, setLocating] = useState(false);

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Could be used to find nearest businesses via API in future
        alert(`Location detected: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        setLocating(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocating(false);
      }
    );
  };

  const handleSearch = () => {
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        <Input
          type="text"
          placeholder="Search for businesses, services, or offers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1 pl-12 pr-4 py-4 rounded-full text-gray-900 bg-white border-0 focus:ring-2 focus:ring-primary/50 text-lg"
        />
        <Button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[#0a897d] hover:bg-[#0d6e6a]"
        >
          Search
        </Button>
        <button
          type="button"
          onClick={handleLocationClick}
          disabled={locating}
          className="absolute right-24 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-[#0a897d] transition-colors disabled:opacity-50"
          title="Use my current location"
        >
          {locating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Locate className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
