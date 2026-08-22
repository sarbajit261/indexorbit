'use client';

import { useEffect } from 'react';

interface ViewTrackerProps {
  slug: string;
}

export function ViewTracker({ slug }: ViewTrackerProps) {
  useEffect(() => {
    // Track view on page load
    const trackView = async () => {
      try {
        await fetch(`/api/business/${slug}/track`, {
          method: 'POST',
        });
      } catch (error) {
        console.error('Failed to track view:', error);
      }
    };

    trackView();
  }, [slug]);

  // This component doesn't render anything
  return null;
}
