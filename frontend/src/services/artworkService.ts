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

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Local artworks data - for development/demo
const LOCAL_ARTWORKS: Artwork[] = [
  {
    id: '1',
    artist: 'Elena Rossi',
    title: 'The Gaze of Silence',
    description: 'A vertical contemporary portrait with bold, expressionistic brushstrokes.',
    medium: 'Oil on Canvas',
    dimensions: '120 x 150 cm',
    rentalPriceCents: 15000,
    status: 'Available for Lease',
    localImagePath: '/assets/artworks/gaze-of-silence.jpg',
  },
  {
    id: '2',
    artist: 'Marcus Chen',
    title: 'Urban Tectonic II',
    description: 'A square minimalist abstract composition featuring geometric shapes.',
    medium: 'Mixed Media, Charcoal & Ash',
    dimensions: '100 x 100 cm',
    rentalPriceCents: 18500,
    status: 'Available for Acquisition',
    localImagePath: '/assets/artworks/urban-tectonic.jpg',
  },
  {
    id: '3',
    artist: 'Sana Varma',
    title: 'Monsoon Whispers',
    description: 'A vertical atmospheric landscape painting showing a misty morning.',
    medium: 'Watercolor & Ink on Raw Silk',
    dimensions: '90 x 120 cm',
    rentalPriceCents: 21000,
    status: 'Available for Lease',
    localImagePath: '/assets/artworks/monsoon-whispers.jpg',
  },
  {
    id: '4',
    artist: 'Vikram Seth',
    title: 'Celestial Flow',
    description: 'A sophisticated abstract work featuring complex layers of metallic gold leaf.',
    medium: 'Gold Leaf and Indigo Ink on Canvas',
    dimensions: '140 x 180 cm',
    rentalPriceCents: 24000,
    status: 'Acquired',
    localImagePath: '/assets/artworks/celestial-flow.jpg',
  },
  {
    id: '5',
    artist: 'Anya Gupta',
    title: 'Heritage Rhythms',
    description: 'A vibrant contemporary artwork using saturated reds and earthy browns.',
    medium: 'Acrylic and Earth Pigments',
    dimensions: '100 x 100 cm',
    rentalPriceCents: 13000,
    status: 'Available for Lease',
    localImagePath: '/assets/artworks/heritage-rhythms.jpg',
  },
  {
    id: '6',
    artist: 'Kaito Tanaka',
    title: 'Zen Garden I',
    description: 'A serene minimalist line drawing of a floral arrangement.',
    medium: 'Sumi Ink on Washi Paper',
    dimensions: '60 x 80 cm',
    rentalPriceCents: 11000,
    status: 'Available for Acquisition',
    localImagePath: '/assets/artworks/zen-garden.jpg',
  },
];

export async function fetchArtworks(page = 1, limit = 24): Promise<ArtworksResponse> {
  try {
    const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';
    const response = await fetch(`${API_BASE_URL}/api/v1/artworks?page=${page}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (response.ok) {
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        return data;
      }
      // Fallback to local data if API returns empty
      return {
        page,
        limit,
        total: LOCAL_ARTWORKS.length,
        items: LOCAL_ARTWORKS,
      };
    } else {
      console.warn('API fetch failed with status:', response.status);
    }
  } catch (error) {
    console.error('API fetch failed:', error);
  }

  return {
    page,
    limit,
    total: LOCAL_ARTWORKS.length,
    items: LOCAL_ARTWORKS,
  };
}

export async function fetchArtworkById(id: string): Promise<Artwork | null> {
  try {
    const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';
    const response = await fetch(`${API_BASE_URL}/api/v1/artworks/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (response.ok) {
      const data = await response.json();
      if (data) return data;
    }
  } catch (error) {
    console.error('API fetch by ID failed:', error);
  }
  
  // Fallback to local data
  return LOCAL_ARTWORKS.find(a => a.id === id) || null;
}

export function getArtworkImagePath(artwork: Artwork): string {
  // Try to get from API images first (presigned URLs)
  if (artwork.images?.[0]?.fileKey) {
    // If it's a relative local upload, resolve to full API URL
    if (artwork.images[0].fileKey.startsWith('/uploads/')) {
      return `${API_BASE_URL}${artwork.images[0].fileKey}`;
    }
    return artwork.images[0].fileKey;
  }

  // Fallback to local image path
  if (artwork.localImagePath) {
    return artwork.localImagePath;
  }

  return '';
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
