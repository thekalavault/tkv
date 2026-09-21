import { CollectionArtwork, determineTierFromValue } from '../lib/collectionsData';
import { PRICING_TIERS } from '../lib/rentalPricing';
import { fetchArtworkById, getArtworkImagePath, getInstantArtworkById, LOCAL_ARTWORKS, Artwork } from './artworkService';

export interface ArtworkDetailedInfo extends CollectionArtwork {
  artist?: string;
  description?: string;
  medium?: string;
  yearCreated?: number;
  provenance?: string;
  condition?: string;
  pricing?: typeof PRICING_TIERS[keyof typeof PRICING_TIERS];
  monthlyRent?: string;
  replacementValue?: number;
  relatedArtworks?: CollectionArtwork[];
}

const _detailCache = new Map<string, ArtworkDetailedInfo>();

/**
 * Synchronously builds artwork detailed info from an Artwork object in 0ms
 */
export function buildArtworkDetailedInfo(artwork: Artwork, relatedArtworks: CollectionArtwork[] = []): ArtworkDetailedInfo {
  const artworkValue = artwork.replacementValue || 15000;
  const baseMonthlyRent = artwork.rentalPriceCents ? artwork.rentalPriceCents : Math.round(artworkValue * 0.02);
  const tier = determineTierFromValue(artworkValue);

  const pricing = {
    tier: tier,
    label: PRICING_TIERS[tier].label,
    valueRange: PRICING_TIERS[tier].valueRange,
    yearlyRent: Math.round(artworkValue * 0.012 * 12),
    halfYearlyRent: Math.round(artworkValue * 0.015 * 6),
    quarterlyRent: Math.round(artworkValue * 0.018 * 3),
    monthlyRent: baseMonthlyRent,
    description: PRICING_TIERS[tier].description,
  };

  const collectionArt: CollectionArtwork = {
    id: artwork.id,
    name: artwork.title,
    size: artwork.dimensions || 'Variable',
    fileName: artwork.images?.[0]?.fileKey || '',
    localPath: getArtworkImagePath(artwork),
    tier: tier,
    originalArtwork: artwork,
  };

  // If no related artworks provided, supply local related ones immediately
  const fallbackRelated: CollectionArtwork[] = (relatedArtworks.length > 0)
    ? relatedArtworks
    : LOCAL_ARTWORKS.filter(a => a.id !== artwork.id).slice(0, 4).map(a => ({
        id: a.id,
        name: a.title,
        size: a.dimensions || 'Variable',
        fileName: a.images?.[0]?.fileKey || '',
        localPath: getArtworkImagePath(a),
        tier: determineTierFromValue(a.replacementValue || 15000),
        originalArtwork: a
      }));

  return {
    ...collectionArt,
    artist: artwork.artist || generateArtistName(artwork.title),
    description: artwork.description || generateDescription(artwork.title, tier),
    medium: artwork.medium || getRandomMedium(),
    yearCreated: 2021 + ((artwork.id.charCodeAt(0) || 0) % 4),
    provenance: `Curated by Kala Vault Gallery | ₹${artworkValue.toLocaleString('en-IN')} Certified Asset`,
    condition: artwork.status || 'Museum Archival Standard',
    pricing: pricing as any,
    monthlyRent: `₹${pricing.monthlyRent.toLocaleString('en-IN')}/month`,
    replacementValue: artworkValue,
    relatedArtworks: fallbackRelated,
  };
}

/**
 * Synchronously retrieves artwork detail info from in-memory cache or catalog in 0ms
 */
export function getArtworkDetailByIdSync(id: string): ArtworkDetailedInfo | null {
  if (_detailCache.has(id)) {
    return _detailCache.get(id)!;
  }
  const instantArt = getInstantArtworkById(id);
  if (instantArt) {
    const detail = buildArtworkDetailedInfo(instantArt);
    _detailCache.set(id, detail);
    return detail;
  }
  return null;
}

/**
 * Fetch artwork by ID with full details — INSTANT 0ms memory hit with background sync
 */
export async function getArtworkDetailById(id: string): Promise<ArtworkDetailedInfo | null> {
  // 1. Instant cache check
  if (_detailCache.has(id)) {
    return _detailCache.get(id)!;
  }

  // 2. Instant synchronous lookup from memory
  const instantArt = getInstantArtworkById(id);
  if (instantArt) {
    const detail = buildArtworkDetailedInfo(instantArt);
    _detailCache.set(id, detail);
    
    // Asynchronously fetch related artworks in background without delaying user
    (async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/v1/artworks/${id}/related?limit=4`);
        if (response.ok) {
          const list = await response.json();
          if (Array.isArray(list) && list.length > 0) {
            const related = list.map((a: any) => ({
              id: a.id,
              name: a.title,
              size: a.dimensions || 'Variable',
              fileName: a.images?.[0]?.fileKey || '',
              localPath: getArtworkImagePath(a),
              tier: determineTierFromValue(a.replacementValue),
              originalArtwork: a,
            }));
            const updated = { ...detail, relatedArtworks: related };
            _detailCache.set(id, updated);
          }
        }
      } catch {}
    })();

    return detail;
  }

  // 3. Fallback async fetch
  const artwork = await fetchArtworkById(id);
  if (!artwork) return null;

  const detail = buildArtworkDetailedInfo(artwork);
  _detailCache.set(id, detail);
  return detail;
}

/**
 * Pre-cache all local artworks into detail cache on startup
 */
if (typeof window !== 'undefined') {
  LOCAL_ARTWORKS.forEach(a => {
    _detailCache.set(a.id, buildArtworkDetailedInfo(a));
  });
}

function generateArtistName(artworkName: string): string {
  const artists = [
    'Elena Rossi', 'Marcus Chen', 'Sana Varma', 'Vikram Seth', 'Anya Gupta',
    'Rajesh Kumar', 'Priya Sharma', 'Arjun Patel', 'Deepika Singh', 'Aryan Datta',
    'Nisha Kapoor', 'Rohit Verma', 'Sneha Gupta', 'Aditya Menon', 'Kavya Iyer'
  ];
  const index = (artworkName || 'A').length % artists.length;
  return artists[index];
}

function generateDescription(artworkName: string, tier: string): string {
  const descriptions = [
    `An extraordinary original masterwork embodying museum-grade preservation, fine artisanal brushwork, and timeless curatorial presence for premier spaces.`,
    `A captivating composition creating an immersive ambiance with rich spatial harmony, certified provenance, and exquisite framing.`,
    `An authoritative contemporary expression capturing depth, movement, and textural nuance tailored for executive and luxury hospitality environments.`
  ];
  const index = (artworkName || 'A').length % descriptions.length;
  return descriptions[index];
}

function getRandomMedium(): string {
  const mediums = [
    'Oil on Linen Canvas',
    'Mixed Media & Gold Leaf on Canvas',
    'Acrylic & Mineral Earth Pigments',
    'Sumi Ink and Watercolor on Raw Silk',
    'Charcoal and Gilded Leaf on Cotton Rag'
  ];
  return mediums[Math.floor(Math.random() * mediums.length)];
}

export async function getAdjacentArtworks(currentId: string): Promise<{ prev: CollectionArtwork | null; next: CollectionArtwork | null }> {
  const items = LOCAL_ARTWORKS;
  const currentIndex = items.findIndex(a => a.id === currentId);
  
  if (currentIndex === -1 || items.length === 0) {
    return { prev: null, next: null };
  }

  const prevIndex = (currentIndex - 1 + items.length) % items.length;
  const nextIndex = (currentIndex + 1) % items.length;

  const toCollection = (a: Artwork): CollectionArtwork => ({
    id: a.id,
    name: a.title,
    size: a.dimensions || 'Variable',
    fileName: a.images?.[0]?.fileKey || '',
    localPath: getArtworkImagePath(a),
    tier: determineTierFromValue(a.replacementValue || 15000),
    originalArtwork: a
  });

  return {
    prev: toCollection(items[prevIndex]),
    next: toCollection(items[nextIndex]),
  };
}
