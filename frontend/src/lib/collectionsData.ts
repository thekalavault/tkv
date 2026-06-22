import { Artwork, getArtworkImagePath } from '../services/artworkService';

export interface CollectionArtwork {
  id: string;
  name: string;
  size: string; // mapping to dimensions or descriptive size
  fileName: string;
  localPath: string; // The resolved secure URL or local fallback
  tier: 'small' | 'medium' | 'large' | 'extra-large';
  originalArtwork: Artwork;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  count: number;
  artworks: CollectionArtwork[];
  imageExample?: string;
}

/**
 * Categorize artworks based on their replacement value.
 * Adjust these thresholds as needed for your business logic.
 */
export function determineTierFromValue(value?: number): 'small' | 'medium' | 'large' | 'extra-large' {
  if (!value) return 'medium'; // Default fallback
  if (value >= 80000) return 'extra-large';
  if (value >= 50000) return 'large';
  if (value >= 30000) return 'medium';
  return 'small';
}

export function buildCollectionsFromData(artworks: Artwork[]): {
  collections: Collection[];
  allArtworks: CollectionArtwork[];
  stats: any;
} {
  const allArtworks: CollectionArtwork[] = artworks.map((art) => {
    const tier = determineTierFromValue(art.replacementValue);
    return {
      id: art.id,
      name: art.title,
      size: art.dimensions || 'Variable',
      fileName: art.images?.[0]?.fileKey || '',
      localPath: getArtworkImagePath(art),
      tier,
      originalArtwork: art,
    };
  });

  const collections: Collection[] = [
    {
      id: 'small-format',
      name: 'Small Format',
      description: 'Compact artworks for personal spaces, home offices, and intimate settings.',
      artworks: allArtworks.filter(a => a.tier === 'small'),
      get count() { return this.artworks.length; }
    },
    {
      id: 'medium-format',
      name: 'Medium Format',
      description: 'Standard gallery-sized pieces for living rooms, executive offices, and meeting rooms.',
      artworks: allArtworks.filter(a => a.tier === 'medium'),
      get count() { return this.artworks.length; }
    },
    {
      id: 'large-format',
      name: 'Large Format',
      description: 'Statement pieces for conference rooms, corporate atriums, and gallery spaces.',
      artworks: allArtworks.filter(a => a.tier === 'large'),
      get count() { return this.artworks.length; }
    },
    {
      id: 'extra-large-format',
      name: 'Architectural Scale',
      description: 'Large-format installations for headquarters, atriums, and landmark spaces.',
      artworks: allArtworks.filter(a => a.tier === 'extra-large'),
      get count() { return this.artworks.length; }
    }
  ];

  const stats = {
    total: allArtworks.length,
    collections: collections.length,
    byTier: {
      small: collections[0].count,
      medium: collections[1].count,
      large: collections[2].count,
      'extra-large': collections[3].count,
    }
  };

  return { collections, allArtworks, stats };
}
