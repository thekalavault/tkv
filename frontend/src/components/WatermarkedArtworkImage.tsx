import React, { useEffect, useState } from 'react';
import { getArtworkImageWithWatermark, Artwork } from '../services/artworkService';

interface WatermarkedArtworkImageProps {
  artwork: Artwork;
  className?: string;
  alt?: string;
  fallback?: React.ReactNode;
}

export default function WatermarkedArtworkImage({
  artwork,
  className = 'w-full h-auto object-cover',
  alt,
  fallback = <div className="bg-subtle-smoke h-96 flex items-center justify-center">Loading...</div>,
}: WatermarkedArtworkImageProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWatermarkedImage();
  }, [artwork.id]);

  const loadWatermarkedImage = async () => {
    try {
      setLoading(true);
      const url = await getArtworkImageWithWatermark(artwork);
      setImageUrl(url);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load image');
      console.error('Error loading watermarked image:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <>{fallback}</>;
  }

  if (error || !imageUrl) {
    return (
      <div className="bg-subtle-smoke h-96 flex items-center justify-center">
        <p className="text-on-surface-variant">{error || 'No image available'}</p>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt || artwork.title}
      className={className}
    />
  );
}
