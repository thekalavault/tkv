import { addWatermarkToImage, WatermarkOptions } from '../lib/watermark';
import { auth } from '../lib/firebase';

export interface ArtworkImageView {
  id: string;
  fileKey: string;
  variant: 'front' | 'detail' | 'angle' | 'insitu' | string;
  label: string;
  mimeType: string;
  fallbackUrls?: string[];
}

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
  localImagePath?: string; // Primary image path
  images?: ArtworkImageView[];
}

export interface ArtworksResponse {
  page: number;
  limit: number;
  total: number;
  items: Artwork[];
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Curated verified high-resolution masterwork paintings with multiple perspective views
export const LOCAL_ARTWORKS: Artwork[] = [
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
    localImagePath: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85',
    images: [
      {
        id: '5-front',
        fileKey: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85',
        variant: 'front',
        label: 'Frontal Museum View',
        mimeType: 'image/jpeg'
      },
      {
        id: '5-detail',
        fileKey: 'https://images.unsplash.com/photo-1579541814924-49fef17c5be5?auto=format&fit=crop&w=1200&q=85',
        variant: 'detail',
        label: 'Cinnabar & Ochre Pigment Detail',
        mimeType: 'image/jpeg'
      },
      {
        id: '5-angle',
        fileKey: 'https://images.unsplash.com/photo-1582561073898-0c675a898b9f?auto=format&fit=crop&w=1200&q=85',
        variant: 'angle',
        label: 'Hand-Carved Gold Leaf Profile',
        mimeType: 'image/jpeg'
      },
      {
        id: '5-insitu',
        fileKey: '/assets/rooms/living_room.png',
        variant: 'insitu',
        label: 'Luxury Residence In-Situ',
        mimeType: 'image/png'
      }
    ]
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
    localImagePath: 'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=1200&q=85',
    images: [
      {
        id: '6-front',
        fileKey: 'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=1200&q=85',
        variant: 'front',
        label: 'Frontal Museum View',
        mimeType: 'image/jpeg'
      },
      {
        id: '6-detail',
        fileKey: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=85',
        variant: 'detail',
        label: 'Handmade Washi Paper Fiber',
        mimeType: 'image/jpeg'
      },
      {
        id: '6-angle',
        fileKey: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=85',
        variant: 'angle',
        label: 'Ebonized Ash Minimal Frame',
        mimeType: 'image/jpeg'
      },
      {
        id: '6-insitu',
        fileKey: '/assets/rooms/gallery_lounge.png',
        variant: 'insitu',
        label: 'Atrium Foyer In-Situ',
        mimeType: 'image/png'
      }
    ]
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
    localImagePath: 'https://images.unsplash.com/photo-1582561073898-0c675a898b9f?auto=format&fit=crop&w=1200&q=85',
    images: [
      {
        id: '7-front',
        fileKey: 'https://images.unsplash.com/photo-1582561073898-0c675a898b9f?auto=format&fit=crop&w=1200&q=85',
        variant: 'front',
        label: 'Frontal Museum View',
        mimeType: 'image/jpeg'
      },
      {
        id: '7-detail',
        fileKey: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1200&q=85',
        variant: 'detail',
        label: 'Textured Impasto High-Relief',
        mimeType: 'image/jpeg'
      },
      {
        id: '7-angle',
        fileKey: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85',
        variant: 'angle',
        label: 'Dark Bronze Patina Frame',
        mimeType: 'image/jpeg'
      },
      {
        id: '7-insitu',
        fileKey: '/assets/rooms/boardroom.png',
        variant: 'insitu',
        label: 'Executive Boardroom In-Situ',
        mimeType: 'image/png'
      }
    ]
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
    localImagePath: 'https://images.unsplash.com/photo-1579541814924-49fef17c5be5?auto=format&fit=crop&w=1200&q=85',
    images: [
      {
        id: '8-front',
        fileKey: 'https://images.unsplash.com/photo-1579541814924-49fef17c5be5?auto=format&fit=crop&w=1200&q=85',
        variant: 'front',
        label: 'Frontal Museum View',
        mimeType: 'image/jpeg'
      },
      {
        id: '8-detail',
        fileKey: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85',
        variant: 'detail',
        label: 'Glaze Luminosity & Translucency',
        mimeType: 'image/jpeg'
      },
      {
        id: '8-angle',
        fileKey: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=85',
        variant: 'angle',
        label: 'Champagne Gold Leaf Fillet',
        mimeType: 'image/jpeg'
      },
      {
        id: '8-insitu',
        fileKey: '/assets/rooms/living_room.png',
        variant: 'insitu',
        label: 'Penthouse Salon In-Situ',
        mimeType: 'image/png'
      }
    ]
  },
  {
    id: '9',
    artist: 'Rohan Mehra',
    title: 'Solstice Radiance',
    description: 'Monumental geometric abstraction exploring solar cycles, radiant cadmium yellows, and raw linen ground.',
    medium: 'Oil and 24K Gold Leaf on Belgian Linen',
    dimensions: '150 x 180 cm',
    rentalPriceCents: 26000,
    replacementValue: 195000,
    status: 'Available for Lease',
    localImagePath: 'https://images.unsplash.com/photo-1578301978018-3005759f48f7?auto=format&fit=crop&w=1200&q=85',
    images: [
      {
        id: '9-front',
        fileKey: 'https://images.unsplash.com/photo-1578301978018-3005759f48f7?auto=format&fit=crop&w=1200&q=85',
        variant: 'front',
        label: 'Frontal Museum View',
        mimeType: 'image/jpeg'
      },
      {
        id: '9-detail',
        fileKey: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85',
        variant: 'detail',
        label: 'Gold Leaf & Cadmium Pigment Detail',
        mimeType: 'image/jpeg'
      },
      {
        id: '9-angle',
        fileKey: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=85',
        variant: 'angle',
        label: 'Bespoke Oak Float Frame Profile',
        mimeType: 'image/jpeg'
      },
      {
        id: '9-insitu',
        fileKey: '/assets/rooms/gallery_lounge.png',
        variant: 'insitu',
        label: 'Executive Atrium In-Situ',
        mimeType: 'image/png'
      }
    ]
  },
  {
    id: '10',
    artist: 'Isabella Moreau',
    title: 'Symphony in Azure',
    description: 'Layered azure and ultramarine pigment glazes creating a sense of oceanic depth and serenity.',
    medium: 'Pigment and Acrylic on Raw Cotton',
    dimensions: '110 x 150 cm',
    rentalPriceCents: 19000,
    replacementValue: 135000,
    status: 'Available for Acquisition',
    localImagePath: 'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=1200&q=85',
    images: [
      {
        id: '10-front',
        fileKey: 'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=1200&q=85',
        variant: 'front',
        label: 'Frontal Museum View',
        mimeType: 'image/jpeg'
      },
      {
        id: '10-detail',
        fileKey: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=85',
        variant: 'detail',
        label: 'Ultramarine Glaze Depth',
        mimeType: 'image/jpeg'
      },
      {
        id: '10-angle',
        fileKey: 'https://images.unsplash.com/photo-1582561073898-0c675a898b9f?auto=format&fit=crop&w=1200&q=85',
        variant: 'angle',
        label: 'Museum Float Profile',
        mimeType: 'image/jpeg'
      },
      {
        id: '10-insitu',
        fileKey: '/assets/rooms/boardroom.png',
        variant: 'insitu',
        label: 'Executive Suite In-Situ',
        mimeType: 'image/png'
      }
    ]
  },
  {
    id: '11',
    artist: 'Tariq Al-Mansoor',
    title: 'Nomadic Geometry',
    description: 'Terracotta, sand textures, and geometric rhythmic forms evoking desert architectures and ancient caravans.',
    medium: 'Sand, Earth & Oil on Canvas',
    dimensions: '120 x 120 cm',
    rentalPriceCents: 20500,
    replacementValue: 145000,
    status: 'Available for Lease',
    localImagePath: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85',
    images: [
      {
        id: '11-front',
        fileKey: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85',
        variant: 'front',
        label: 'Frontal Museum View',
        mimeType: 'image/jpeg'
      },
      {
        id: '11-detail',
        fileKey: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=85',
        variant: 'detail',
        label: 'Terracotta & Sand Grain Relief',
        mimeType: 'image/jpeg'
      },
      {
        id: '11-angle',
        fileKey: 'https://images.unsplash.com/photo-1579541814924-49fef17c5be5?auto=format&fit=crop&w=1200&q=85',
        variant: 'angle',
        label: 'Raw Teakwood Bevel Angle',
        mimeType: 'image/jpeg'
      },
      {
        id: '11-insitu',
        fileKey: '/assets/rooms/living_room.png',
        variant: 'insitu',
        label: 'Lounge Salon In-Situ',
        mimeType: 'image/png'
      }
    ]
  },
  {
    id: '12',
    artist: 'Ananya Deshmukh',
    title: 'Monochromatic Silence',
    description: 'A study in stark contrasts, black gesso impasto, and subtle silver leaf reflections for boardroom environments.',
    medium: 'Black Gesso, Silver Leaf & Oil',
    dimensions: '140 x 140 cm',
    rentalPriceCents: 23000,
    replacementValue: 170000,
    status: 'Available for Lease',
    localImagePath: 'https://images.unsplash.com/photo-1582561073898-0c675a898b9f?auto=format&fit=crop&w=1200&q=85',
    images: [
      {
        id: '12-front',
        fileKey: 'https://images.unsplash.com/photo-1582561073898-0c675a898b9f?auto=format&fit=crop&w=1200&q=85',
        variant: 'front',
        label: 'Frontal Museum View',
        mimeType: 'image/jpeg'
      },
      {
        id: '12-detail',
        fileKey: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1200&q=85',
        variant: 'detail',
        label: 'Silver Leaf & Obsidian Texture',
        mimeType: 'image/jpeg'
      },
      {
        id: '12-angle',
        fileKey: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85',
        variant: 'angle',
        label: 'Charcoal Hardwood Profile',
        mimeType: 'image/jpeg'
      },
      {
        id: '12-insitu',
        fileKey: '/assets/rooms/boardroom.png',
        variant: 'insitu',
        label: 'Executive Boardroom In-Situ',
        mimeType: 'image/png'
      }
    ]
  }
];

// Fallback high-definition museum-grade painting URLs
export const FALLBACK_PAINTINGS = [
  'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1582561073898-0c675a898b9f?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1579541814924-49fef17c5be5?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1578301978018-3005759f48f7?auto=format&fit=crop&w=1200&q=85',
];

/**
 * Normalizes and sanitizes any artwork image path or key into a clean, loadable URL
 */
export function sanitizeArtworkImageUrl(rawUrl?: string, fallbackSeed = '1'): string {
  if (!rawUrl || typeof rawUrl !== 'string') {
    const seed = fallbackSeed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return FALLBACK_PAINTINGS[seed % FALLBACK_PAINTINGS.length];
  }

  const trimmed = rawUrl.trim();

  // Handle direct HTTP/HTTPS URLs
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // Handle local frontend assets
  if (trimmed.startsWith('/assets/')) {
    // If it points to missing /assets/artworks/, redirect to corresponding guaranteed painting
    if (trimmed.startsWith('/assets/artworks/')) {
      const seed = trimmed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return FALLBACK_PAINTINGS[seed % FALLBACK_PAINTINGS.length];
    }
    return trimmed;
  }

  // Handle backend upload paths
  if (trimmed.startsWith('/uploads/')) {
    return `${API_BASE_URL}${trimmed}`;
  }

  if (trimmed.startsWith('uploads/')) {
    return `${API_BASE_URL}/${trimmed}`;
  }

  // If simple filename or key
  if (trimmed.endsWith('.jpg') || trimmed.endsWith('.png') || trimmed.endsWith('.webp')) {
    return `${API_BASE_URL}/uploads/${trimmed}`;
  }

  return trimmed;
}

/**
 * Resolves the primary image URL for an artwork with guaranteed fallback
 */
export function getArtworkImagePath(artwork?: Partial<Artwork> | null): string {
  if (!artwork) {
    return FALLBACK_PAINTINGS[0];
  }

  // 1. If explicit localImagePath exists and is not a broken placeholder
  if (artwork.localImagePath && !artwork.localImagePath.includes('placeholder')) {
    return sanitizeArtworkImageUrl(artwork.localImagePath, artwork.id || artwork.title || '1');
  }

  // 2. If images array exists and has fileKey
  if (artwork.images && artwork.images.length > 0 && artwork.images[0].fileKey) {
    return sanitizeArtworkImageUrl(artwork.images[0].fileKey, artwork.id || artwork.title || '1');
  }

  // 3. Deterministic fallback matching artwork id or title
  const seed = (artwork.id || artwork.title || '1').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return FALLBACK_PAINTINGS[seed % FALLBACK_PAINTINGS.length];
}

/**
 * Returns a comprehensive, verified array of 4 perspective images (Front, Detail, Frame, In-Situ) for ANY artwork
 */
export function getArtworkImages(artwork: Artwork): ArtworkImageView[] {
  const seedNum = (artwork.id || artwork.title || '1').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const primaryUrl = getArtworkImagePath(artwork);

  // If artwork already has complete curated images, sanitize them
  if (artwork.images && artwork.images.length >= 2) {
    return artwork.images.map((img, idx) => ({
      ...img,
      fileKey: sanitizeArtworkImageUrl(img.fileKey, `${artwork.id}-${idx}`),
      label: img.label || (idx === 0 ? 'Frontal Museum View' : idx === 1 ? 'Archival Macro Detail' : idx === 2 ? 'Hardwood Frame Profile' : 'Spatial Room In-Situ')
    }));
  }

  // Otherwise, synthesize a rich 4-view multi-angle gallery set for this artwork
  const detailUrl = FALLBACK_PAINTINGS[(seedNum + 1) % FALLBACK_PAINTINGS.length];
  const angleUrl = FALLBACK_PAINTINGS[(seedNum + 2) % FALLBACK_PAINTINGS.length];
  const roomViews = ['/assets/rooms/boardroom.png', '/assets/rooms/living_room.png', '/assets/rooms/gallery_lounge.png'];
  const insituUrl = roomViews[seedNum % roomViews.length];

  return [
    {
      id: `${artwork.id}-front`,
      fileKey: primaryUrl,
      variant: 'front',
      label: 'Frontal Museum View',
      mimeType: 'image/jpeg',
      fallbackUrls: [FALLBACK_PAINTINGS[seedNum % FALLBACK_PAINTINGS.length]]
    },
    {
      id: `${artwork.id}-detail`,
      fileKey: detailUrl,
      variant: 'detail',
      label: 'Archival Impasto Detail',
      mimeType: 'image/jpeg',
      fallbackUrls: [FALLBACK_PAINTINGS[(seedNum + 3) % FALLBACK_PAINTINGS.length]]
    },
    {
      id: `${artwork.id}-angle`,
      fileKey: angleUrl,
      variant: 'angle',
      label: 'Hardwood Frame Profile',
      mimeType: 'image/jpeg',
      fallbackUrls: [FALLBACK_PAINTINGS[(seedNum + 4) % FALLBACK_PAINTINGS.length]]
    },
    {
      id: `${artwork.id}-insitu`,
      fileKey: insituUrl,
      variant: 'insitu',
      label: 'Spatial Setting In-Situ',
      mimeType: 'image/png',
      fallbackUrls: ['/assets/rooms/boardroom.png']
    }
  ];
}

// Module-level in-memory cache
let _inMemoryArtworksCache: ArtworksResponse | null = (() => {
  try {
    const saved = localStorage.getItem('kb_cached_artworks_v4');
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
    return fetchArtworks(1, 50);
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
    const raw = localStorage.getItem('kb_cached_artworks_v4');
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
  
  // 1. Preload local artworks and their views
  LOCAL_ARTWORKS.forEach(art => {
    _artworkMap.set(art.id, art);
    const views = getArtworkImages(art);
    views.forEach(v => {
      if (v.fileKey) {
        const img = new Image();
        img.src = v.fileKey;
      }
    });
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
    '/assets/protocol_01_spatial_mapping.jpg',
    '/assets/protocol_02_vault_accession.jpg',
    '/assets/protocol_03_archival_conservation.jpg',
    '/assets/protocol_04_laser_installation.jpg',
    '/assets/protocol_05_dynamic_rotations.jpg',
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
        data.items = data.items.map((art: Artwork) => ({
          ...art,
          localImagePath: getArtworkImagePath(art),
          images: getArtworkImages(art)
        }));

        data.items.forEach((a: Artwork) => _artworkMap.set(a.id, a));
        if (page === 1) {
          _inMemoryArtworksCache = data;
          try {
            localStorage.setItem('kb_cached_artworks_v4', JSON.stringify(data));
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
          const normalized: Artwork = {
            ...fresh,
            localImagePath: getArtworkImagePath(fresh),
            images: getArtworkImages(fresh)
          };
          _artworkMap.set(id, normalized);
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
      const normalized: Artwork = {
        ...data,
        localImagePath: getArtworkImagePath(data),
        images: getArtworkImages(data)
      };
      _artworkMap.set(id, normalized);
      return normalized;
    }
  } catch (error) {
    console.error('API fetch by ID failed:', error);
  }
  
  // Fallback to local data
  return LOCAL_ARTWORKS.find(a => a.id === id) || null;
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
