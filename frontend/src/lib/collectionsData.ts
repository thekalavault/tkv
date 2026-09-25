import { Artwork, getArtworkImagePath } from '../services/artworkService';

export interface CollectionArtwork {
  id: string;
  name: string;
  artist?: string;
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

export function buildCollectionsFromData(artworks: Artwork[]): {
  collections: Collection[];
  allArtworks: CollectionArtwork[];
  stats: any;
} {
  const mixedArtworks = mixArtworksByArtist(artworks);
  const allArtworks: CollectionArtwork[] = mixedArtworks.map((art) => {
    const tier = determineTierFromValue(art.replacementValue);
    return {
      id: art.id,
      name: art.title,
      artist: art.artist || undefined,
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
      artworks: mixArtworksByArtist(allArtworks.filter(a => a.tier === 'small')),
      get count() { return this.artworks.length; }
    },
    {
      id: 'medium-format',
      name: 'Medium Format',
      description: 'Standard gallery-sized pieces for living rooms, executive offices, and meeting rooms.',
      artworks: mixArtworksByArtist(allArtworks.filter(a => a.tier === 'medium')),
      get count() { return this.artworks.length; }
    },
    {
      id: 'large-format',
      name: 'Large Format',
      description: 'Statement pieces for conference rooms, corporate atriums, and gallery spaces.',
      artworks: mixArtworksByArtist(allArtworks.filter(a => a.tier === 'large')),
      get count() { return this.artworks.length; }
    },
    {
      id: 'extra-large-format',
      name: 'Architectural Scale',
      description: 'Large-format installations for headquarters, atriums, and landmark spaces.',
      artworks: mixArtworksByArtist(allArtworks.filter(a => a.tier === 'extra-large')),
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
