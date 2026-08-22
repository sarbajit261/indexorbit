import type { MapProvider } from '@/types';

// Map configuration
export const mapConfig = {
  provider: (process.env.MAP_PROVIDER || 'mapbox') as MapProvider,

  mapbox: {
    accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '',
    style: 'mapbox://styles/mapbox/streets-v12',
  },

  google: {
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '',
  },
} as const;

// Check if maps are configured
export function isMapsConfigured(): boolean {
  if (mapConfig.provider === 'mapbox') {
    return !!mapConfig.mapbox.accessToken;
  }
  return !!mapConfig.google.apiKey;
}

export function getCurrentMapProvider(): MapProvider {
  return mapConfig.provider;
}

// Default map settings
export const DEFAULT_MAP_SETTINGS = {
  center: { lat: 40.7128, lng: -74.006 }, // New York
  zoom: 12,
  markerZoom: 15,
};

// Convert coordinates to a formatted address (simplified)
export function formatCoordinates(lat: number, lng: number): string {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

// Calculate distance between two points (Haversine formula)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
