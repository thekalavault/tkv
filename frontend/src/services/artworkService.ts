import { addWatermarkToImage, WatermarkOptions } from '../lib/watermark';
import { auth } from '../lib/firebase';

export interface Artwork {
  id: string;
  title: string;
  artist?: string;
  description?: string;
  medium?: string;
  dimensions?: string;
  rentalPriceCents?: number;
  replacementValue?: number;
  status?: string;
  sku?: string;
  metadata?: any;
  localImagePath?: string; // Path to local image file
  images?: {
    id: string;
    fileKey: string;
    variant: string;
    mimeType: string;
  }[];
}

export interface ArtworksResponse {
  page: number;
  limit: number;
  total: number;
  items: Artwork[];
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Curated local masterworks with high-definition museum-grade paintings
export const LOCAL_ARTWORKS: Artwork[] = [
  {
    id: '1',
    artist: 'Elena Rossi',
    title: 'The Gaze of Silence',
    description: 'A vertical contemporary portrait with bold, expressionistic brushstrokes and classical chiaroscuro.',
    medium: 'Oil on Canvas',
    dimensions: '120 x 150 cm',
    rentalPriceCents: 15000,
    replacementValue: 120000,
    status: 'Available for Lease',
    localImagePath: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: '2',
    artist: 'Marcus Chen',
    title: 'Urban Tectonic II',
    description: 'A minimalist abstract composition featuring tectonic geometry, raw charcoal, and metallic leaf.',
    medium: 'Mixed Media, Charcoal & Ash',
    dimensions: '100 x 100 cm',
    rentalPriceCents: 18500,
    replacementValue: 95000,
    status: 'Available for Acquisition',
    localImagePath: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: '3',
    artist: 'Sana Varma',
    title: 'Monsoon Whispers',
    description: 'An atmospheric watercolor and ink landscape capturing misty mountain ridges and monsoon rains.',
    medium: 'Watercolor & Ink on Raw Silk',
    dimensions: '90 x 120 cm',
    rentalPriceCents: 21000,
    replacementValue: 140000,
    status: 'Available for Lease',
    localImagePath: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: '4',
    artist: 'Vikram Seth',
    title: 'Celestial Flow',
    description: 'A monumental abstract work featuring gilded gold leaf, deep indigo inks, and stellar currents.',
    medium: 'Gold Leaf and Indigo Ink on Canvas',
    dimensions: '140 x 180 cm',
    rentalPriceCents: 24000,
    replacementValue: 180000,
    status: 'Available for Lease',
    localImagePath: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: '5',
    artist: 'Anya Gupta',
    title: 'Heritage Rhythms',
    description: 'A vibrant contemporary masterwork using saturated cinnabar reds, raw ochre, and earthy mineral pigments.',
    medium: 'Acrylic and Earth Pigments',
    dimensions: '100 x 100 cm',
    rentalPriceCents: 13000,
    replacementValue: 85000,
    status: 'Available for Lease',
    localImagePath: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: '6',
    artist: 'Kaito Tanaka',
    title: 'Zen Garden I',
    description: 'A serene minimalist sumi ink study of botanical balance and Japanese garden aesthetics.',
    medium: 'Sumi Ink on Washi Paper',
    dimensions: '60 x 80 cm',
    rentalPriceCents: 11000,
    replacementValue: 70000,
    status: 'Available for Acquisition',
    localImagePath: 'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: '7',
    artist: 'David Vance',
    title: 'Imperial Noir',
    description: 'Deep textured impasto and obsidian tones created for monumental executive suites and boardroom walls.',
    medium: 'Oil & Pigment on Linen',
    dimensions: '130 x 160 cm',
    rentalPriceCents: 22000,
    replacementValue: 160000,
    status: 'Available for Lease',
    localImagePath: 'https://images.unsplash.com/photo-1582561073898-0c675a898b9f?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: '8',
    artist: 'Claire De Witt',
    title: 'Elysian Horizon',
    description: 'Atmospheric sunset study with golden glaze over layered oil glazes, exuding tranquility.',
    medium: 'Oil Glaze on Panel',
    dimensions: '110 x 140 cm',
    rentalPriceCents: 17500,
    replacementValue: 115000,
    status: 'Available for Lease',
    localImagePath: 'https://images.unsplash.com/photo-1579541814924-49fef17c5be5?auto=format&fit=crop&w=1000&q=80',
  }
];

// Module-level in-memory cache
let _inMemoryArtworksCache: ArtworksResponse | null = (() => {
  try {
    const saved = localStorage.getItem('kb_cached_artworks_v3');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed?.items?.length) return parsed;
    }
  } catch (e) {
    // Ignore storage parsing errors
  }
  return null;
})();

let _prefetchPromise: Promise<ArtworksResponse> | null = null;

export async function prefetchArtworks(): Promise<ArtworksResponse> {
  if (_prefetchPromise) return _prefetchPromise;

  _prefetchPromise = (async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      try {
        if (auth.currentUser) {
          const token = await auth.currentUser.getIdToken();
          if (token) headers['Authorization'] = `Bearer ${token}`;
        }
      } catch {
        // Continue without auth header for public catalog
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/artworks?page=1&limit=50`, {
        headers,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          _inMemoryArtworksCache = data;
          try {
            localStorage.setItem('kb_cached_artworks_v3', JSON.stringify(data));
          } catch {}
          return data;
        }
      }
    } catch (error) {
      console.warn('Backend prefetch error or timeout:', error);
    }

    if (_inMemoryArtworksCache && _inMemoryArtworksCache.items.length > 0) {
      return _inMemoryArtworksCache;
    }

    return {
      page: 1,
      limit: LOCAL_ARTWORKS.length,
      total: LOCAL_ARTWORKS.length,
      items: LOCAL_ARTWORKS,
    };
  })();

  return _prefetchPromise;
}

// In-memory quick lookup map for 0ms instant retrieval by ID
const _artworkMap = new Map<string, Artwork>();

// Populate _artworkMap from LOCAL_ARTWORKS initially
LOCAL_ARTWORKS.forEach(a => _artworkMap.set(a.id, a));

export function getInstantArtworkById(id: string): Artwork | null {
  if (_artworkMap.has(id)) return _artworkMap.get(id)!;
  
  if (_inMemoryArtworksCache?.items) {
    const found = _inMemoryArtworksCache.items.find(a => a.id === id);
    if (found) {
      _artworkMap.set(id, found);
      return found;
    }
  }

  try {
    const raw = localStorage.getItem('kb_cached_artworks_v3');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.items) {
        const found = parsed.items.find((a: Artwork) => a.id === id);
        if (found) {
          _artworkMap.set(id, found);
          return found;
        }
      }
    }
  } catch {}

  return LOCAL_ARTWORKS.find(a => a.id === id) || null;
}

export function preloadAllCatalogAssets(): void {
  if (typeof window === 'undefined') return;
  
  // 1. Preload local artworks
  LOCAL_ARTWORKS.forEach(art => {
    _artworkMap.set(art.id, art);
    const imgUrl = getArtworkImagePath(art);
    if (imgUrl) {
      const img = new Image();
      img.src = imgUrl;
    }
  });

  // 2. Preload room in-situ scenes and common key art
  const priorityImages = [
    '/assets/rooms/boardroom.png',
    '/assets/rooms/living_room.png',
    '/assets/rooms/gallery_lounge.png',
    '/assets/museum_gallery_hero.jpg',
    '/assets/artistic_hotel_foyer.jpg',
    '/assets/artistic_boardroom.jpg',
    '/assets/artistic_cafe_dining.jpg',
    '/assets/artistic_showflat_penthouse.jpg',
    '/assets/curator_white_glove.jpg',
    '/assets/keyhole_magnifier_art.jpg',
    '/assets/protocol_01_cartography.jpg',
    '/assets/protocol_02_accession.jpg',
    '/assets/protocol_03_conservation.jpg',
    '/assets/protocol_04_installation.jpg',
    '/assets/protocol_05_rotation.jpg',
  ];
  priorityImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  // 3. Fetch full catalog in background & preload all images into browser cache
  fetchArtworks(1, 100).then(res => {
    if (res?.items) {
      res.items.forEach(art => {
        _artworkMap.set(art.id, art);
        const imgUrl = getArtworkImagePath(art);
        if (imgUrl) {
          const img = new Image();
          img.src = imgUrl;
        }
      });
    }
  }).catch(() => {});
}

// Auto-trigger preloading immediately when module loads
if (typeof window !== 'undefined') {
  preloadAllCatalogAssets();
}

export async function fetchArtworks(page = 1, limit = 50): Promise<ArtworksResponse> {
  // If we already have warm cache in memory for initial view, immediately return cached items if page is 1
  if (page === 1 && _inMemoryArtworksCache && _inMemoryArtworksCache.items.length > 0) {
    return _inMemoryArtworksCache;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    try {
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;
      }
    } catch {
      // Continue without auth
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/artworks?page=${page}&limit=${limit}`, {
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        data.items.forEach((a: Artwork) => _artworkMap.set(a.id, a));
        if (page === 1) {
          _inMemoryArtworksCache = data;
          try {
            localStorage.setItem('kb_cached_artworks_v3', JSON.stringify(data));
          } catch {}
        }
        return data;
      }
    }
  } catch (error) {
    console.warn('API fetch timed out or failed, serving cached/local catalog:', error);
  }

  if (_inMemoryArtworksCache && _inMemoryArtworksCache.items.length > 0) {
    return _inMemoryArtworksCache;
  }

  return {
    page,
    limit,
    total: LOCAL_ARTWORKS.length,
    items: LOCAL_ARTWORKS,
  };
}

export async function fetchArtworkById(id: string): Promise<Artwork | null> {
  // Instant synchronous hit from memory map
  const cached = getInstantArtworkById(id);
  if (cached) {
    // Revalidate in background without blocking
    (async () => {
      try {
        const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';
        const response = await fetch(`${API_BASE_URL}/api/v1/artworks/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const fresh = await response.json();
          _artworkMap.set(id, fresh);
        }
      } catch {}
    })();
    return cached;
  }

  try {
    const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';
    const response = await fetch(`${API_BASE_URL}/api/v1/artworks/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      _artworkMap.set(id, data);
      return data;
    }
  } catch (error) {
    console.error('API fetch by ID failed:', error);
  }
  
  // Fallback to local data
  return LOCAL_ARTWORKS.find(a => a.id === id) || null;
}

const FALLBACK_PAINTINGS = [
  'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1582561073898-0c675a898b9f?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1579541814924-49fef17c5be5?auto=format&fit=crop&w=1000&q=80',
];

export function getArtworkImagePath(artwork: Artwork): string {
  // If localImagePath exists and is a valid URL or path
  if (artwork.localImagePath && (artwork.localImagePath.startsWith('http') || artwork.localImagePath.startsWith('/assets/'))) {
    return artwork.localImagePath;
  }

  // Try to get from API images (presigned URLs or full URLs)
  if (artwork.images?.[0]?.fileKey) {
    const key = artwork.images[0].fileKey;
    if (key.startsWith('http://') || key.startsWith('https://')) {
      return key;
    }
    if (key.startsWith('/uploads/')) {
      return `${API_BASE_URL}${key}`;
    }
  }

  // Fallback using deterministic index from id/title
  const seed = (artwork.id || artwork.title || '1').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return FALLBACK_PAINTINGS[seed % FALLBACK_PAINTINGS.length];
}

export async function getArtworkImageWithWatermark(
  artwork: Artwork,
  watermarkOptions?: WatermarkOptions
): Promise<string> {
  const imagePath = getArtworkImagePath(artwork);

  if (!imagePath) {
    return '';
  }

  try {
    const watermarkedUrl = await addWatermarkToImage(imagePath, {
      text: '© KALAVAULT',
      fontSize: 28,
      opacity: 0.4,
      position: 'bottom-right',
      color: '#FFFFFF',
      ...watermarkOptions,
    });
    return watermarkedUrl;
  } catch (error) {
    console.error('Error adding watermark:', error);
    return imagePath; // Return original if watermarking fails
  }
}

export function formatPrice(priceInRupees?: number): string {
  if (!priceInRupees) return 'Contact for pricing';
  return `₹${priceInRupees.toLocaleString('en-IN')} / mo`;
}
