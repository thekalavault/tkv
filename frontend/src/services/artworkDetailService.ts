import { CollectionArtwork, determineTierFromValue } from '../lib/collectionsData';
import { PRICING_TIERS } from '../lib/rentalPricing';
import { fetchArtworkById, getArtworkImagePath, fetchArtworks } from './artworkService';

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

/**
 * Fetch artwork by ID with full details from the API
 */
export async function getArtworkDetailById(id: string): Promise<ArtworkDetailedInfo | null> {
  const artwork = await fetchArtworkById(id);
  
  if (!artwork) return null;

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

  // Fetch related artworks (this could be optimized on the backend, doing it here for simplicity)
  let relatedArtworks: CollectionArtwork[] = [];
  try {
    const list = await fetchArtworks(1, 20);
    relatedArtworks = list.items
      .filter(a => a.id !== artwork.id && determineTierFromValue(a.replacementValue) === tier)
      .slice(0, 4)
      .map(a => ({
        id: a.id,
        name: a.title,
        size: a.dimensions || 'Variable',
        fileName: a.images?.[0]?.fileKey || '',
        localPath: getArtworkImagePath(a),
        tier: determineTierFromValue(a.replacementValue),
        originalArtwork: a,
      }));
  } catch (err) {
    console.error('Failed to fetch related artworks', err);
  }

  // Generate details based on backend data
  const details: ArtworkDetailedInfo = {
    ...collectionArt,
    artist: artwork.artist || generateArtistName(artwork.title),
    description: artwork.description || generateDescription(artwork.title, tier),
    medium: artwork.medium || getRandomMedium(),
    yearCreated: 2020 + Math.floor(Math.random() * 4),
    provenance: `Curated by Kalavault Gallery | ₹${artworkValue.toLocaleString('en-IN')} acquisition value`,
    condition: artwork.status || 'Excellent',
    pricing: pricing as any,
    monthlyRent: `₹${pricing.monthlyRent.toLocaleString('en-IN')}/month`,
    replacementValue: artworkValue,
    relatedArtworks: relatedArtworks,
  };

  return details;
}

/**
 * Generate artist name based on artwork
 */
function generateArtistName(artworkName: string): string {
  const artists = [
    'Elena Rossi', 'Marcus Chen', 'Sana Varma', 'Vikram Seth', 'Anya Gupta',
    'Rajesh Kumar', 'Priya Sharma', 'Arjun Patel', 'Deepika Singh', 'Aryan Datta',
    'Nisha Kapoor', 'Rohit Verma', 'Sneha Gupta', 'Aditya Menon', 'Kavya Iyer'
  ];
  
  // Use artwork name length as seed for consistent artist assignment
  const index = artworkName.length % artists.length;
  return artists[index];
}

/**
 * Generate artwork description
 */
function generateDescription(name: string, tier: string): string {
  const descriptions: Record<string, string[]> = {
    'small': [
      'An intimate contemporary work exploring personal narratives through bold, expressive brushstrokes.',
      'A delicate composition that invites quiet reflection through carefully composed forms.',
      'A minimalist statement piece that challenges traditional perspectives through color and form.',
    ],
    'medium': [
      'A sophisticated abstract exploration of movement and light, perfect for corporate spaces.',
      'A curated work that bridges traditional and contemporary artistic sensibilities.',
      'A striking composition designed for gallery walls and executive environments.',
    ],
    'large': [
      'A monumental piece commanding attention through its scale and intricate layering of materials.',
      'An ambitious work that transforms architectural spaces with its bold presence.',
      'A gallery-scale statement establishing new conversations around contemporary art.',
    ],
    'extra-large': [
      'An architectural installation designed for landmark spaces and institutional settings.',
      'A transformative work that redefines how we experience contemporary art at scale.',
      'A masterwork commanding iconic spaces with its unprecedented visual impact.',
    ],
  };

  const tierDescriptions = descriptions[tier] || descriptions['medium'];
  const index = name.charCodeAt(0) % tierDescriptions.length;
  return tierDescriptions[index];
}

/**
 * Get random medium
 */
function getRandomMedium(): string {
  const mediums = [
    'Oil on Canvas',
    'Mixed Media, Charcoal & Ash',
    'Watercolor & Ink on Raw Silk',
    'Gold Leaf and Indigo Ink on Canvas',
    'Acrylic & Graphite on Linen',
    'Pigment & Resin on Wood',
    'Digital Print on Museum Board',
    'Textile & Found Objects',
  ];
  return mediums[Math.floor(Math.random() * mediums.length)];
}

/**
 * Get next and previous artworks for navigation
 * Now async to query the list if needed
 */
export async function getAdjacentArtworks(currentId: string) {
  try {
    const list = await fetchArtworks(1, 100);
    const currentIndex = list.items.findIndex(art => art.id === currentId);
    if (currentIndex === -1) return { prev: null, next: null };

    return {
      prev: currentIndex > 0 ? { id: list.items[currentIndex - 1].id } : null,
      next: currentIndex < list.items.length - 1 ? { id: list.items[currentIndex + 1].id } : null,
    };
  } catch (err) {
    return { prev: null, next: null };
  }
}
