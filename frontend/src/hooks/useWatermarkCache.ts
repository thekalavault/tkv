import { useCallback, useState } from 'react';

interface WatermarkCache {
  [key: string]: string;
}

export function useWatermarkCache() {
  const [cache, setCache] = useState<WatermarkCache>({});

  const get = useCallback((key: string) => {
    return cache[key];
  }, [cache]);

  const set = useCallback((key: string, value: string) => {
    setCache(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const clear = useCallback(() => {
    setCache({});
  }, []);

  return { get, set, clear, cache };
}
