import { Artwork } from '../services/artworkService';
import { RHISHIKESH_JOSHI_ARTWORKS } from './rhishikeshArtworks';
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
    id: 'artist-rhishikesh-joshi',
    slug: 'rhishikesh-joshi',
    name: 'Rhishikesh Joshi',
    studioName: 'Sharv Art Studio',
    studioLocation: 'Vadgaonsheri, Pune, Maharashtra, India',
    title: 'Fine Art & Spatial Sculpture',
    tagline: 'Spatial Tactility & Raw Elemental Forms',
    quote: 'Moving beyond two-dimensional decoration, my pieces treat walls and pedestals as immersive textural topographies.',
    bio: 'I am a Pune-based visual artist and practicing interior designer with over a decade of studio research in material behavior. My spatial background informs an architectural treatment of surface texture, chiaroscuro lighting, and mass. Moving beyond two-dimensional decoration, my pieces treat walls and pedestals as immersive textural topographies.',
    experienceYears: '10+ Years',
    mediaList: ['Clay', 'Silicate Minerals', 'Paper Pulp', 'Resin & Metal Patinas'],
    primaryMediaSummary: 'Clay, Silicate, Pulp, Resin',
    portraitImage: '/assets/artworks/rhishikesh_joshi/rhishikesh-joshi-portrait.jpg',
    coverImage: '/assets/artworks/rhishikesh_joshi/sculpture-hero-bronze-head.jpg',
    accentArtworks: [
      '/assets/artworks/rhishikesh_joshi/the-primal-hunt-and-fauna.jpg',
      '/assets/artworks/rhishikesh_joshi/sculpture-hero-terracotta-profile.jpg',
      '/assets/artworks/rhishikesh_joshi/the-crowned-sage.jpg',
      '/assets/artworks/rhishikesh_joshi/ganesha-bas-relief.jpg'
    ],
    contact: {
      email: 'jr.interio@gmail.com',
      phone: '+91 9890289326',
      whatsapp: '919890289326',
      instagram: '@sharvartstudio',
      instagramQr: '/assets/artworks/rhishikesh_joshi/sharv-art-studio-instagram-qr.jpg',
      website: 'www.thekalavault.com'
    },
    stats: [
      { label: 'Studio Practice', value: '10+ Yrs', sublabel: 'Material Research' },
      { label: 'Core Media', value: '4+ Media', sublabel: 'Clay, Silicate, Pulp, Resin' },
      { label: 'Sharv Art Studio', value: 'Pune Based', sublabel: 'Maharashtra, India' },
      { label: 'Curated Catalog', value: '16 Works', sublabel: 'Reliefs & Monographs' }
    ],
    curatorialNote: 'Every sculpture in this portfolio represents an exploration of human emotion, material weathering, and timeless form. Works are available for private acquisitions, gallery curation, architectural commissions, and site-specific installations.',
    engagementPathways: [
      {
        title: 'Private Acquisitions',
        description: 'Available original works, limited series, and curated spatial monographs for discerning private collectors.'
      },
      {
        title: 'Bespoke Commissions',
        description: 'Site-specific architectural bas-reliefs, custom portrait busts, and monumental installations engineered for high-end residences and luxury lobbies.'
      },
      {
        title: 'Gallery & Museum Curation',
        description: 'Curatorial inquiries for solo exhibitions, institutional loans, and contemporary fine art showcases.'
      }
    ],
    thematicCurations: [
      {
        id: 'cave-painting-series',
        name: 'Cave Painting Series',
        badge: 'Featured Masterwork',
        description: 'Large-scale reliefs inspired by prehistoric rock shelters, archers, and archaic petroglyphs over undulating stone-textured substrates.'
      },
      {
        id: 'primal-relics',
        name: 'Primal Relics & Earthbound Memory',
        badge: 'Archaeological Relics',
        description: 'Artworks that feel like archaeological findings—touched by millennia of natural weathering, mineral erosion, and organic evolution.'
      },
      {
        id: 'architectural-physiognomies',
        name: 'Architectural Physiognomies & Inner States',
        badge: 'Psychological Casts',
        description: 'Character studies where facial architecture and weathered skin tones mirror internal human psychological weights.'
      },
      {
        id: 'intimate-monologues',
        name: 'Intimate Monologues & Micro-Studies',
        badge: 'Tactile Miniatures',
        description: 'Concentrated emotional snapshots scaled down to human touch, forcing an intimate up-close dialogue between the viewer and fleeting expressions.'
      }
    ],
    exhibitions: [
      {
        title: 'Asian Art Gallery',
        venue: 'Asian Art Gallery (Regional / Int\'l)',
        curatorialFocus: 'Curated showcase of contemporary Indian figurative sculpture and tactile mixed media.'
      },
      {
        title: 'Ceramic & Architectural Busts',
        venue: 'P. N. Gadgil (PNG) Gallery (Pune)',
        curatorialFocus: 'Group exhibition presenting ceramic busts, clay portraits, and architectural wall works.'
      },
      {
        title: 'Traditional Synthesis Feature',
        venue: 'Zapurza Museum (Khadakwasla, Pune)',
        curatorialFocus: 'Museum feature celebrating traditional artisanal methods synthesized with modern interior forms.'
      },
      {
        title: 'National Visual Art Showcase',
        venue: 'Kala Spandan Art Fair (Nehru Centre, Mumbai)',
        curatorialFocus: 'National visual art fair presenting medium-format bas-reliefs, stone silicates, and metal patinas.'
      },
      {
        title: '"Xpression" & "Emotions" Residency',
        venue: 'Malaka Spice Art Wall (Koregaon Park, Pune)',
        curatorialFocus: 'Solo artist residency exhibit highlighting the "Xpression" and "Emotions" sculptural bust series.'
      }
    ],
    philosophy: [
      {
        title: 'Material Alchemy',
        type: 'studio_practice',
        description: 'Combining traditional terracotta slip, lost-wax bronze casting, and hand-applied mineral patinas to achieve aged, weathered surfaces.'
      },
      {
        title: 'Tactile Sculpting Methods',
        type: 'studio_practice',
        description: 'Building physical tension from initial raw clay gestures through to oxidized metallic and silicate finishes.'
      },
      {
        title: 'Scale & Spatial Context',
        type: 'studio_practice',
        description: 'Designing works ranging from palm-scale micro-monologues to architectural bas-reliefs suited for residential and commercial environments.'
      },
      {
        title: 'Sculpture & Anatomy Masterclasses',
        type: 'pedagogy',
        description: 'Conducting intensive hands-on workshops focusing on facial anatomy, expressiveness, character studies, and pedestal mounting.'
      },
      {
        title: 'Patination & Surface Techniques',
        type: 'pedagogy',
        description: 'Mentoring artists and enthusiasts in natural mineral glazing, verdigris oxidation, and burnished metallic finishing methods.'
      },
      {
        title: 'Community & Academic Engagement',
        type: 'pedagogy',
        description: 'Fostering appreciation for contemporary Indian sculpture through interactive live sculpting sessions and institutional dialogue.'
      }
    ],
    featuredMasterworkId: 'tkv-rj-001',
    isFeatured: true
  },
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
  if (norm.includes('rhishikesh') || norm.includes('joshi') || norm.includes('sharv')) {
    base = [...RHISHIKESH_JOSHI_ARTWORKS];
  } else if (norm.includes('shagun')) {
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

