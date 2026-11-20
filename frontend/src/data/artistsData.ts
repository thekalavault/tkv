import { Artwork } from '../services/artworkService';
import { SHAGUN_AGARWAL_ARTWORKS } from './shagunArtworks';
import { KASSHIISH_KARIYAA_ARTWORKS } from './kashishArtworks';

export interface ExhibitionMilestone {
  title: string;
  venue: string;
  curatorialFocus: string;
  location?: string;
}

export interface StudioPhilosophyPillar {
  title: string;
  description: string;
  type: 'studio_practice' | 'pedagogy';
}

export interface ArtistProfile {
  id: string;
  slug: string;
  name: string;
  studioName?: string;
  studioLocation?: string;
  title: string;
  tagline: string;
  quote: string;
  bio: string;
  experienceYears: string;
  mediaList: string[];
  primaryMediaSummary: string;
  portraitImage: string;
  coverImage: string;
  accentArtworks: string[];
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    instagram: string;
    instagramQr?: string;
    website?: string;
  };
  stats: {
    label: string;
    value: string;
    sublabel?: string;
  }[];
  curatorialNote: string;
  engagementPathways: {
    title: string;
    description: string;
  }[];
  thematicCurations: {
    id: string;
    name: string;
    description: string;
    badge?: string;
  }[];
  exhibitions: ExhibitionMilestone[];
  philosophy: StudioPhilosophyPillar[];
  featuredMasterworkId: string;
  isFeatured?: boolean;
}

export const ARTISTS_DATABASE: ArtistProfile[] = [
  {
    id: 'artist-shagun-agarwal',
    slug: 'shagun-agarwal',
    name: 'Shagun Agarwal',
    studioName: 'Shagun\'s Mind Studio',
    studioLocation: 'Mumbai / Pune, India',
    title: 'Neuronal Abstraction & Conceptual Canvas',
    tagline: 'Depths of the Human Psyche & Synaptic Color',
    quote: 'Translating neuronal connections, visceral emotions, and inner psychological topographies into bold textural pigments.',
    bio: 'Shagun Agarwal is an artist, psychologist, copywriter, and podcast host exploring the depths of the human psyche, visceral forms, neuronal connections, and emotional landscapes through bold textural media.',
    experienceYears: '8+ Years',
    mediaList: ['Acrylic on Canvas', 'Mixed Media', 'Textural Pigments'],
    primaryMediaSummary: 'Acrylic, Mixed Media, Canvas',
    portraitImage: '/assets/artworks/shagun_agarwal/TKV-SA-001_cosmic-glow-original.jpeg',
    coverImage: '/assets/artworks/shagun_agarwal/TKV-SA-001_cosmic-glow-original.jpeg',
    accentArtworks: [
      '/assets/artworks/shagun_agarwal/TKV-SA-001_cosmic-glow-original.jpeg',
      '/assets/artworks/shagun_agarwal/TKV-SA-002_neuronal-synthesis-original.jpeg'
    ],
    contact: {
      email: 'contact@shagunsmind.com',
      phone: '+91 9800000000',
      whatsapp: '919800000000',
      instagram: '@shagunsmind',
      website: 'www.shagunsmind.com'
    },
    stats: [
      { label: 'Verified Catalog', value: '45 Works', sublabel: 'Canvases & Mixed Media' },
      { label: 'Signature Focus', value: 'Psychology', sublabel: 'Neuronal Topographies' },
      { label: 'Exhibitions', value: 'Multi-City', sublabel: 'Private & Corporate' }
    ],
    curatorialNote: 'Explorations in cerebral pathways, synapses, and internal human emotional fields available for corporate leasing and collectors.',
    engagementPathways: [
      {
        title: 'Corporate Leasing',
        description: 'Elevate boardrooms and modern workspaces with thought-provoking cerebral canvases.'
      },
      {
        title: 'Original Acquisitions',
        description: 'Acquire original verified paintings directly from the artist portfolio.'
      }
    ],
    thematicCurations: [
      {
        id: 'neuronal-landscapes',
        name: 'Neuronal Landscapes & Synaptic Glow',
        badge: 'Abstract Canvas',
        description: 'Vivid conceptual explorations of cerebral pathways and emotional resonance.'
      }
    ],
    exhibitions: [
      {
        title: 'Contemporary Mind & Canvas',
        venue: 'Mumbai Modern Art Gallery',
        curatorialFocus: 'Focus on psychological abstract expressionism and layered canvas.'
      }
    ],
    philosophy: [
      {
        title: 'Psychological Synthesis',
        type: 'studio_practice',
        description: 'Translating mental states and introspective thought loops into raw visual energy.'
      }
    ],
    featuredMasterworkId: '51e7dab0-9b20-4805-92d2-1a9079be7196',
    isFeatured: false
  },
  {
    id: 'artist-kasshiish-kariyaa',
    slug: 'kasshiish-kariyaa',
    name: 'Kasshiish Kariyaa',
    studioName: 'Kasshiish Kariyaa Studio',
    studioLocation: 'Mumbai, India',
    title: 'Heritage Mysticism & Fine Watercolor',
    tagline: 'Sacred Iconography & Lyrical Watercolor',
    quote: 'Connecting timeless spiritual archetypes with ethereal watercolors on archival handmade paper.',
    bio: 'Kasshiish Kariyaa is an acclaimed contemporary Indian artist renowned for luminous watercolor abstractions on handmade paper and monumental sacred figurative masterpieces inspired by ancient heritage.',
    experienceYears: '12+ Years',
    mediaList: ['Archival Handmade Paper', 'Watercolour', 'Acrylic on Canvas'],
    primaryMediaSummary: 'Watercolour, Handmade Paper, Acrylic',
    portraitImage: '/assets/artworks/kasshiish_kariyaa/TKV-KK-003_padmapani-bodhisattva.jpg',
    coverImage: '/assets/artworks/kasshiish_kariyaa/TKV-KK-003_padmapani-bodhisattva.jpg',
    accentArtworks: [
      '/assets/artworks/kasshiish_kariyaa/TKV-KK-003_padmapani-bodhisattva.jpg',
      '/assets/artworks/kasshiish_kariyaa/TKV-KK-001_harmony-in-ochre-untitled.jpg'
    ],
    contact: {
      email: 'advisory@thekalavault.com',
      phone: '+91 9800000000',
      whatsapp: '919800000000',
      instagram: '@kasshiishkariyaa',
      website: 'www.thekalavault.com'
    },
    stats: [
      { label: 'Advisory Catalog', value: '20 Works', sublabel: 'Sacred & Watercolors' },
      { label: 'Medium', value: 'Handmade Paper', sublabel: 'Lyrical Pigments' },
      { label: 'Heritage Focus', value: 'Spiritual', sublabel: 'Ajanta & Iconography' }
    ],
    curatorialNote: 'Luminous artworks on archival handmade paper and monumental spiritual paintings reflecting ancient grace and meditative calm.',
    engagementPathways: [
      {
        title: 'Sacred Commissions',
        description: 'Large-scale sacred spiritual paintings for high-end interiors, meditation sanctuaries, and corporate atriums.'
      },
      {
        title: 'Archival Acquisitions',
        description: 'Rare original watercolor abstractions on artisanal textured paper.'
      }
    ],
    thematicCurations: [
      {
        id: 'sacred-heritage',
        name: 'Sacred Heritage & Bodhisattva Studies',
        badge: 'Sacred Art',
        description: 'Monumental spiritual works capturing meditative poise and timeless Indian heritage.'
      }
    ],
    exhibitions: [
      {
        title: 'Lyrical Horizons',
        venue: 'National Gallery Showcase',
        curatorialFocus: 'Archival paper works and fluid mineral watercolors.'
      }
    ],
    philosophy: [
      {
        title: 'Archival Sensitivity',
        type: 'studio_practice',
        description: 'Harnessing the organic deckled edges and tooth of handmade paper with water-borne earth pigments.'
      }
    ],
    featuredMasterworkId: 'tkv-kk-003',
    isFeatured: false
  }
];

const STORAGE_KEY = 'kalavault_artists_profiles';

export function getAllArtists(): ArtistProfile[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored artists:', e);
    }
  }
  return [...ARTISTS_DATABASE];
}

export function getArtistBySlug(slug: string): ArtistProfile | undefined {
  const norm = (slug || '').toLowerCase().trim();
  const list = getAllArtists();
  return list.find(a => 
    a.slug.toLowerCase() === norm || 
    a.name.toLowerCase().replace(/\s+/g, '-') === norm ||
    norm.includes(a.slug.toLowerCase())
  );
}

export function saveArtistProfile(profile: ArtistProfile): ArtistProfile[] {
  const list = getAllArtists();
  const existingIdx = list.findIndex(a => a.id === profile.id || a.slug === profile.slug);
  
  let updatedList: ArtistProfile[];
  if (existingIdx >= 0) {
    updatedList = [...list];
    updatedList[existingIdx] = { ...list[existingIdx], ...profile };
  } else {
    updatedList = [...list, profile];
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      window.dispatchEvent(new CustomEvent('kalavault_artists_updated', { detail: profile }));
    } catch (e) {
      console.error('Failed to save artist to localStorage:', e);
    }
  }

  return updatedList;
}

export function deleteArtistProfile(artistId: string): ArtistProfile[] {
  const list = getAllArtists();
  const updatedList = list.filter(a => a.id !== artistId);
  
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      window.dispatchEvent(new CustomEvent('kalavault_artists_updated'));
    } catch (e) {
      console.error('Failed to delete artist from localStorage:', e);
    }
  }

  return updatedList;
}

export function resetArtistsToDefault(): ArtistProfile[] {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('kalavault_artists_updated'));
  }
  return [...ARTISTS_DATABASE];
}

export function getArtworksForArtist(artistNameOrSlug: string, customPool?: Artwork[]): Artwork[] {
  const norm = (artistNameOrSlug || '').toLowerCase().trim();
  
  // Base collection for known artists
  let base: Artwork[] = [];
  if (norm.includes('shagun')) {
    base = [...SHAGUN_AGARWAL_ARTWORKS];
  } else if (norm.includes('kash') || norm.includes('kariyaa')) {
    base = [...KASSHIISH_KARIYAA_ARTWORKS];
  }

  // If customPool is provided, search it as well for mapped artworks
  if (customPool && Array.isArray(customPool)) {
    const additional = customPool.filter(a => {
      const art = (a.artist || '').toLowerCase().trim();
      return art && (art === norm || norm.includes(art) || art.includes(norm));
    });
    const map = new Map<string, Artwork>();
    base.forEach(a => map.set(a.id, a));
    additional.forEach(a => map.set(a.id, a));
    return Array.from(map.values());
  }

  return base;
}

