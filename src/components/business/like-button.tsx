'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LikeButtonProps {
  slug: string;
  initialCount: number;
}

export function LikeButton({ slug, initialCount }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialCount ?? 0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if already liked (stored in localStorage)
    const likedBusinesses = JSON.parse(localStorage.getItem('likedBusinesses') || '[]');
    setLiked(likedBusinesses.includes(slug));
  }, [slug]);

  const handleLike = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/business/${slug}/like`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setLiked(data.liked);
        setLikeCount(data.likeCount ?? 0);

        // Store in localStorage
        const likedBusinesses = JSON.parse(localStorage.getItem('likedBusinesses') || '[]');
        if (data.liked) {
          likedBusinesses.push(slug);
        } else {
          const index = likedBusinesses.indexOf(slug);
          if (index > -1) likedBusinesses.splice(index, 1);
        }
        localStorage.setItem('likedBusinesses', JSON.stringify(likedBusinesses));
      }
    } catch (error) {
      console.error('Failed to like:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      disabled={loading}
      className={`gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full hover:bg-black/40 ${liked ? 'text-primary' : 'text-white'}`}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <ThumbsUp className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
      )}
      <span className="text-sm">{likeCount.toLocaleString()}</span>
    </Button>
  );
}
