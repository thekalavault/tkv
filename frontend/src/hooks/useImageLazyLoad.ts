import { useEffect, useRef, useState } from 'react';

interface UseImageLazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  placeholder?: string;
}

export function useImageLazyLoad(
  src: string | null,
  options: UseImageLazyLoadOptions = { threshold: 0.1 }
) {
  const ref = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [displaySrc, setDisplaySrc] = useState<string | null>(options.placeholder || null);

  useEffect(() => {
    if (!src) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && ref.current) {
        const img = new Image();
        
        img.onload = () => {
          setDisplaySrc(src);
          setIsLoaded(true);
        };

        img.onerror = () => {
          setError(true);
        };

        img.src = src;
        observer.unobserve(ref.current);
      }
    }, {
      threshold: options.threshold,
      rootMargin: options.rootMargin,
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [src, options.threshold, options.rootMargin, options.placeholder]);

  return { ref, isLoaded, error, displaySrc };
}
