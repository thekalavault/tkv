import React, { useState, useEffect } from 'react';
import { FALLBACK_PAINTINGS, sanitizeArtworkImageUrl } from '../services/artworkService';

export interface RobustArtworkImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  fallbackUrls?: string[];
  seed?: string;
  alt?: string;
  className?: string;
  containerClassName?: string;
  showShimmer?: boolean;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
  onLoad?: React.ReactEventHandler<HTMLImageElement>;
  onError?: React.ReactEventHandler<HTMLImageElement>;
  onDragStart?: React.DragEventHandler<HTMLImageElement>;
  onContextMenu?: React.MouseEventHandler<HTMLImageElement>;
}

export default function RobustArtworkImage({
  src,
  fallbackUrls = [],
  seed = '1',
  alt = 'Masterwork painting',
  className = '',
  containerClassName = '',
  showShimmer = true,
  style,
  loading = 'lazy',
  decoding = 'async',
  onLoad,
  onError,
  ...rest
}: RobustArtworkImageProps) {
  const [currentSrcIndex, setCurrentSrcIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [, setHasError] = useState(false);

  // Build candidate URL list with sanitized primary, fallbacks, and deterministic backup
  const candidates = React.useMemo(() => {
    const list: string[] = [];
    if (src) list.push(sanitizeArtworkImageUrl(src, seed));
    fallbackUrls.forEach(u => {
      if (u) list.push(sanitizeArtworkImageUrl(u, seed));
    });
    // Add deterministic fallbacks from the verified catalog
    const seedNum = (seed || '1').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    list.push(FALLBACK_PAINTINGS[seedNum % FALLBACK_PAINTINGS.length]);
    list.push(FALLBACK_PAINTINGS[(seedNum + 1) % FALLBACK_PAINTINGS.length]);
    list.push('/assets/museum_gallery_hero.jpg');

    return Array.from(new Set(list));
  }, [src, fallbackUrls, seed]);

  const activeSrc = candidates[currentSrcIndex] || FALLBACK_PAINTINGS[0];

  useEffect(() => {
    setCurrentSrcIndex(0);
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (currentSrcIndex < candidates.length - 1) {
      setCurrentSrcIndex(prev => prev + 1);
    } else {
      setHasError(true);
    }
    if (onError) onError(e);
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  return (
    <div className={`relative overflow-hidden flex items-center justify-center ${containerClassName}`}>
      {/* Shimmer Placeholder while Loading */}
      {showShimmer && !isLoaded && (
        <div className="absolute inset-0 bg-[#EAE2D5]/40 animate-pulse flex items-center justify-center">
          <div className="w-5 h-5 rounded-full border-2 border-[#C5A059]/30 border-t-[#4A0E17] animate-spin" />
        </div>
      )}

      <img
        {...rest}
        src={activeSrc}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`${className} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={style}
        loading={loading}
        decoding={decoding}
      />
    </div>
  );
}
