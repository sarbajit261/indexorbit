'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [35, 51],
  iconAnchor: [17, 51],
  popupAnchor: [1, -40],
  shadowSize: [41, 41],
});

interface BusinessMapProps {
  businesses?: any[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  className?: string;
}

// Component to handle map center updates
function MapCenter({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
}

export function BusinessMap({
  businesses = [],
  center = [40.7128, -74.0060], // Default: NYC
  zoom = 12,
  height = '400px',
  className = ''
}: BusinessMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate center from businesses if none provided
  const mapCenter = businesses.length > 0
    ? [
        businesses.reduce((sum, b) => sum + (b.latitude || center[0]), 0) / businesses.length,
        businesses.reduce((sum, b) => sum + (b.longitude || center[1]), 0) / businesses.length,
      ] as [number, number]
    : center;

  if (!isMounted) {
    return (
      <div
        className={`bg-gray-100 rounded-xl flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <span className="text-gray-500">Loading map...</span>
      </div>
    );
  }

  return (
    <div className={`rounded-xl overflow-hidden ${className}`} style={{ height }}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {businesses.map((business) => (
          business.latitude && business.longitude && (
            <Marker
              key={business.id}
              position={[business.latitude, business.longitude]}
              icon={business.isSelected ? customIcon : icon}
            >
              <Popup>
                <div className="min-w-[200px]">
                  {business.coverImage && (
                    <img
                      src={business.coverImage}
                      alt={business.name}
                      className="w-full h-24 object-cover rounded-lg mb-2"
                    />
                  )}
                  <h3 className="font-semibold text-gray-900">{business.name}</h3>
                  <p className="text-sm text-gray-500">{business.address || business.city}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-medium text-amber-600">
                      ★ {business.rating?.toFixed(1) || 'N/A'}
                    </span>
                    {business.businessType && (
                      <span className="text-xs text-gray-400">
                        • {business.businessType.name}
                      </span>
                    )}
                  </div>
                  <a
                    href={`/business/${business.slug}`}
                    className="inline-block mt-2 text-sm text-[#0a897d] hover:underline"
                  >
                    View Details →
                  </a>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
}

export default BusinessMap;
