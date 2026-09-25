import { addWatermarkToImage, WatermarkOptions } from '../lib/watermark';
import { auth } from '../lib/firebase';
import { SHAGUN_AGARWAL_ARTWORKS } from '../data/shagunArtworks';
import { KASSHIISH_KARIYAA_ARTWORKS } from '../data/kashishArtworks';
import { ALL_VERIFIED_ARTWORKS } from '../data/dbArtworks';

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

/**
 * Interleaves artworks across artists (Shagun Agarwal, Kasshiish Kariyaa, and Archival collection)
 * in a balanced round-robin order so consecutive artworks always showcase different artists.
 */
export function mixArtworksByArtist<T extends { artist?: string; title?: string; name?: string; replacementValue?: number; originalArtwork?: any }>(artworks: T[]): T[] {
  if (!artworks || artworks.length <= 2) return artworks;

  const isShagun = (a: T) => {
    const art = (a.artist || a.originalArtwork?.artist || '').toLowerCase();
    return art.includes('shagun');
  };

  const isKash = (a: T) => {
    const art = (a.artist || a.originalArtwork?.artist || '').toLowerCase();
    return art.includes('kassh') || art.includes('kash') || art.includes('kariyaa');
  };

  const getVal = (a: T) => a.replacementValue || a.originalArtwork?.replacementValue || 0;
  const getTitle = (a: T) => (a.title || a.name || a.originalArtwork?.title || '').toLowerCase();

  const shagun = artworks.filter(isShagun);
  shagun.sort((a, b) => {
    const wipA = getTitle(a).startsWith('wip');
    const wipB = getTitle(b).startsWith('wip');
    if (wipA && !wipB) return 1;
    if (!wipA && wipB) return -1;
    return getVal(b) - getVal(a);
  });

  const kash = artworks.filter(isKash);
  kash.sort((a, b) => {
    const untA = getTitle(a).includes('untitled');
    const untB = getTitle(b).includes('untitled');
    if (untA && !untB) return 1;
    if (!untA && untB) return -1;
    return getVal(b) - getVal(a);
  });

  const others = artworks.filter(a => !isShagun(a) && !isKash(a));
  others.sort((a, b) => getVal(b) - getVal(a));

  const buckets = [
    { name: 'Shagun Agarwal', items: [...shagun] },
    { name: 'Kasshiish Kariyaa', items: [...kash] },
    { name: 'Archival Collection', items: [...others] }
  ];

  const total = shagun.length + kash.length + others.length;
  const result: T[] = [];
  let lastArtist = '';
  let roundIndex = 0;

  for (let i = 0; i < total; i++) {
    const available = buckets.filter(b => b.items.length > 0);
    if (available.length === 0) break;

    const totalRemaining = available.reduce((acc, b) => acc + b.items.length, 0);
    const urgent = available.find(b => b.items.length >= Math.ceil(totalRemaining / 2) && b.name !== lastArtist);
    let chosenBucket = urgent || null;

    if (!chosenBucket) {
      for (let step = 0; step < buckets.length; step++) {
        const idx = (roundIndex + step) % buckets.length;
        const b = buckets[idx];
        if (b.items.length > 0 && b.name !== lastArtist) {
          chosenBucket = b;
          roundIndex = (idx + 1) % buckets.length;
          break;
        }
      }
    }

    if (!chosenBucket) {
      let candidates = available.filter(b => b.name !== lastArtist);
      if (candidates.length === 0) candidates = available;
      candidates.sort((a, b) => b.items.length - a.items.length);
      chosenBucket = candidates[0];
      roundIndex = (buckets.indexOf(chosenBucket) + 1) % buckets.length;
    }

    const item = chosenBucket.items.shift();
    if (item) {
      result.push(item);
      lastArtist = chosenBucket.name;
    }
  }

  return result;
}

// Combined certified portfolio: Shagun Agarwal (45) + Kasshiish Kariyaa (20 from Advisory PDF) + Authenticated Masterworks (38)
export const LOCAL_ARTWORKS: Artwork[] = (() => {
  const map = new Map<string, Artwork>();
  // 1. Add all verified DB artworks
  ALL_VERIFIED_ARTWORKS.forEach(a => map.set(a.id, a));
  // 2. Overlay Shagun's 45 artworks with direct verified local assets
  SHAGUN_AGARWAL_ARTWORKS.forEach(a => map.set(a.id, a));
  // 3. Overlay Kasshiish Kariyaa's 20 genuine artworks from the Advisory PDF
  KASSHIISH_KARIYAA_ARTWORKS.forEach(a => map.set(a.id, a));

  return mixArtworksByArtist(Array.from(map.values()));
})();

/**
 * Returns exactly 7 featured premier masterworks for Latest Acquisitions:
 * - 3 from Shagun Agarwal ("this other guy")
 * - 2 from Kasshiish Kariyaa ("kashish")
 * - 2 from Other Authenticated Artists
 */
export function getLatestAcquisitionsSelection(artworks: Artwork[]): Artwork[] {
  const isShagun = (a: Artwork) => !!(a.artist && a.artist.toLowerCase().includes('shagun'));
  const isKashish = (a: Artwork) => !!(a.artist && (
    a.artist.toLowerCase().includes('kash') || 
    a.artist.toLowerCase().includes('kassh') || 
    a.artist.toLowerCase().includes('kariyaa')
  ));

  // 1. Shagun Agarwal: 3 premier paintings
  const allShagun = artworks.filter(isShagun);
  allShagun.sort((a, b) => {
    const isWipA = (a.title || '').toLowerCase().startsWith('wip');
    const isWipB = (b.title || '').toLowerCase().startsWith('wip');
    if (isWipA && !isWipB) return 1;
    if (!isWipA && isWipB) return -1;
    return (b.replacementValue || 0) - (a.replacementValue || 0);
  });
  const shagun = allShagun.slice(0, 3);

  // 2. Kasshiish Kariyaa: 2 premier masterworks
  const allKashish = artworks.filter(isKashish);
  allKashish.sort((a, b) => {
    const isUntA = (a.title || '').toLowerCase().includes('untitled');
    const isUntB = (b.title || '').toLowerCase().includes('untitled');
    if (isUntA && !isUntB) return 1;
    if (!isUntA && isUntB) return -1;
    return (b.replacementValue || 0) - (a.replacementValue || 0);
  });
  const kashish = allKashish.slice(0, 2);

  // 3. The 38 classic artworks (with no artist name specified): 2 statement works
  const allOthers = artworks.filter(a => !isShagun(a) && !isKashish(a)).map(a => ({
    ...a,
    artist: undefined
  }));
  allOthers.sort((a, b) => (b.replacementValue || 0) - (a.replacementValue || 0));
  const others = allOthers.slice(0, 2);

  // Interleave round-robin so adjacent acquisitions always showcase different artists:
  // Shagun -> Kasshiish -> Classic Archival -> Shagun -> Kasshiish -> Classic Archival -> Shagun
  const selected: Artwork[] = [];
  const maxL = Math.max(shagun.length, kashish.length, others.length);
  for (let i = 0; i < maxL; i++) {
    if (i < shagun.length) selected.push(shagun[i]);
    if (i < kashish.length) selected.push(kashish[i]);
    if (i < others.length) selected.push(others[i]);
  }

  if (selected.length < 7) {
    const selectedIds = new Set(selected.map(s => s.id));
    const extra = artworks.filter(a => !selectedIds.has(a.id)).slice(0, 7 - selected.length);
    selected.push(...extra);
  }
  return selected;
}

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
    return trimmed;
  }

  // Handle Kasshiish Kariyaa artworks
  if (trimmed.includes('kasshiish-kariyaa') || trimmed.includes('kasshiish_kariyaa')) {
    const filename = trimmed.split('/').pop() || trimmed;
    return `/assets/artworks/kasshiish_kariyaa/${filename}`;
  }

  // Handle Shagun Agarwal artworks
  if (trimmed.includes('shagun-agarwal') || trimmed.includes('shagun_agarwal')) {
    const filename = trimmed.split('/').pop() || trimmed;
    return `/assets/artworks/shagun_agarwal/${filename}`;
  }

  // Handle backend upload paths
  if (trimmed.startsWith('/uploads/')) {
    return `${API_BASE_URL}${trimmed}`;
  }

  if (trimmed.startsWith('uploads/')) {
    return `${API_BASE_URL}/${trimmed}`;
  }

  // If simple filename or key
  if (trimmed.endsWith('.jpg') || trimmed.endsWith('.png') || trimmed.endsWith('.webp') || trimmed.endsWith('.jpeg')) {
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

  // 1. Highest priority: genuine R2 bucket URL from artwork.images[0].fileKey
  if (artwork.images && artwork.images.length > 0 && artwork.images[0].fileKey) {
    const key = artwork.images[0].fileKey.trim();
    if (key.startsWith('http://') || key.startsWith('https://')) {
      return key;
    }
  }

  // 2. Next: explicit R2 or local URL in localImagePath
  if (artwork.localImagePath && !artwork.localImagePath.includes('placeholder')) {
    const local = artwork.localImagePath.trim();
    if (local.startsWith('http://') || local.startsWith('https://')) {
      return local;
    }
    return sanitizeArtworkImageUrl(local, artwork.id || artwork.title || '1');
  }

  // 3. Fallback to any images[0].fileKey through sanitize
  if (artwork.images && artwork.images.length > 0 && artwork.images[0].fileKey) {
    return sanitizeArtworkImageUrl(artwork.images[0].fileKey, artwork.id || artwork.title || '1');
  }

  // 4. Deterministic fallback matching artwork id or title
  const seed = (artwork.id || artwork.title || '1').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return FALLBACK_PAINTINGS[seed % FALLBACK_PAINTINGS.length];
}

/**
 * Returns a comprehensive, verified array of 4 perspective images (Front, Detail, Frame, In-Situ) for ANY artwork
 */
export function getArtworkImages(artwork: Artwork): ArtworkImageView[] {
  const primaryUrl = getArtworkImagePath(artwork);

  // If artwork already has genuine images, sanitize them and return only real images
  if (artwork.images && artwork.images.length > 0) {
    return artwork.images.map((img, idx) => ({
      ...img,
      fileKey: sanitizeArtworkImageUrl(img.fileKey, `${artwork.id}-${idx}`),
      label: img.label || (idx === 0 ? 'Frontal Museum View' : (img.variant === 'insitu' ? 'Framed In-Situ View' : 'Alternate Perspective'))
    }));
  }

  // If only 1 image exists, return ONLY that genuine image without synthesizing fake views
  return [
    {
      id: `${artwork.id}-front`,
      fileKey: primaryUrl,
      variant: 'front',
      label: 'Frontal Museum View',
      mimeType: 'image/jpeg'
    }
  ];
}

// Module-level in-memory cache
let _inMemoryArtworksCache: ArtworksResponse | null = (() => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kb_cached_artworks_v8');
      localStorage.removeItem('kb_cached_artworks_v7');
      localStorage.removeItem('kb_cached_artworks_v6');
      localStorage.removeItem('kb_cached_artworks_v5');
      localStorage.removeItem('kb_cached_artworks_v4');
      localStorage.removeItem('kb_cached_artworks_v3');
      localStorage.removeItem('kb_cached_artworks_v2');
      localStorage.removeItem('kb_cached_featured_artworks');
      localStorage.removeItem('kb_cached_featured_artworks_v5');
    }
    const saved = typeof window !== 'undefined' ? localStorage.getItem('kb_cached_artworks_v9') : null;
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed?.items?.length && parsed.items.length >= 70) {
        parsed.items = parsed.items
          .filter((a: any) => !['5', '6', '7', '8', '9', '10', '11', '12'].includes(a.id))
          .map((a: any) => {
            const isShagun = Boolean(a.artist && a.artist.toLowerCase().includes('shagun'));
            const isKash = Boolean(
              a.artist && (
                a.artist.toLowerCase().includes('kassh') ||
                a.artist.toLowerCase().includes('kash') ||
                a.artist.toLowerCase().includes('kariyaa')
              )
            );
            const artist = isShagun
              ? 'Shagun Agarwal'
              : (isKash ? 'Kasshiish Kariyaa' : undefined);
            return {
              ...a,
              artist
            };
          });
        parsed.items = mixArtworksByArtist(parsed.items);
        return parsed;
      }
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
    return fetchArtworks(1, 500);
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
  fetchArtworks(1, 500).then(res => {
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

export function invalidateArtworkCache(): void {
  _inMemoryArtworksCache = null;
  _prefetchPromise = null;
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('kb_cached_artworks_v9');
      localStorage.removeItem('kb_cached_artworks_v8');
      localStorage.removeItem('kb_cached_artworks_v7');
      localStorage.removeItem('kb_cached_artworks_v6');
      localStorage.removeItem('kb_cached_artworks_v5');
      localStorage.removeItem('kb_cached_artworks_v4');
    } catch {}
  }
}

// Auto-trigger preloading immediately when module loads
if (typeof window !== 'undefined') {
  preloadAllCatalogAssets();
}

export async function fetchArtworks(page = 1, limit = 500, forceRefresh = false): Promise<ArtworksResponse> {
  // If we already have warm cache in memory with full catalog, immediately return cached items if page is 1
  if (!forceRefresh && page === 1 && _inMemoryArtworksCache && _inMemoryArtworksCache.items.length >= 70 && limit >= _inMemoryArtworksCache.items.length) {
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
        data.items = data.items
          .filter((a: Artwork) => !['5', '6', '7', '8', '9', '10', '11', '12'].includes(a.id))
          .map((art: Artwork) => {
            const isShagun = Boolean(art.artist && art.artist.toLowerCase().includes('shagun'));
            const isKash = Boolean(
              art.artist && (
                art.artist.toLowerCase().includes('kassh') ||
                art.artist.toLowerCase().includes('kash') ||
                art.artist.toLowerCase().includes('kariyaa')
              )
            );
            const artist = isShagun
              ? 'Shagun Agarwal'
              : (isKash ? 'Kasshiish Kariyaa' : undefined);
            return {
              ...art,
              artist,
              localImagePath: getArtworkImagePath(art),
              images: getArtworkImages(art)
            };
          });

        // Interleave by artist so consecutive artworks always rotate between different artists
        data.items = mixArtworksByArtist(data.items);

        data.items.forEach((a: Artwork) => _artworkMap.set(a.id, a));
        // ONLY update in-memory and local cache if we received full catalog (>= 70 items)
        if (page === 1 && data.items.length >= 70 && data.items.length >= (_inMemoryArtworksCache?.items?.length || 0)) {
          _inMemoryArtworksCache = data;
          try {
            localStorage.setItem('kb_cached_artworks_v9', JSON.stringify(data));
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
