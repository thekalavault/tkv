import { getR2ImageUrl } from './lib/r2';
import { classifyArtwork, formatRentalPrice } from './lib/rentalPricing';

/**
 * Artwork data with replacement values for rental pricing calculation
 * Replacement value determines the rental tier and monthly cost
 */
const ARTWORK_DATA = [
  {
    id: "1",
    artist: "Elena Rossi",
    title: "Imperial Noir",
    image: "/assets/artworks/(15k)ImperialNoir.jpeg",
    medium: "Oil on Canvas",
    dimensions: "120 x 150 cm",
    availability: "Available for Lease",
    description: "A commanding contemporary composition featuring deep textured blacks, subtle ivory notes, and metallic gold accents.",
    replacementValue: 18000, // Small tier
  },
  {
    id: "2",
    artist: "Marcus Chen",
    title: "Burnished Waters",
    image: "/assets/artworks/(20k)BurnishedWaters.jpeg",
    medium: "Mixed Media, Charcoal & Ash",
    dimensions: "100 x 100 cm",
    availability: "Available for Lease",
    description: "An expressive landscape capturing the shimmering reflection of sunbeams on water, utilizing warm bronze tones.",
    replacementValue: 35000, // Medium tier
  },
  {
    id: "3",
    artist: "Sana Varma",
    title: "Divine Majesty",
    image: "/assets/artworks/(35k)DivineMajesty.png",
    medium: "Watercolor & Ink on Raw Silk",
    dimensions: "90 x 120 cm",
    availability: "Available for Lease",
    description: "A stunning large-scale study of power and serenity, blending traditional ink techniques with bold modern geometry.",
    replacementValue: 65000, // Large tier
  },
  {
    id: "4",
    artist: "Vikram Seth",
    title: "Ganges Ghats",
    image: "/assets/artworks/(50k)GangesGhats.jpeg",
    medium: "Gold Leaf and Indigo Ink on Canvas",
    dimensions: "140 x 180 cm",
    availability: "Available for Lease",
    description: "An monumental architectural scale painting of the sacred Ghats at sunrise, presenting deep ochre and golden hues.",
    replacementValue: 90000, // Extra-Large tier
  }
];

/**
 * Classifies all artworks with pricing information
 * Each artwork gets assigned a tier based on replacement value and monthly rental rate
 */
export const LATEST_ACQUISITIONS = ARTWORK_DATA.map(artwork => {
  const classified = classifyArtwork(artwork);
  return {
    ...classified,
    price: formatRentalPrice(classified.monthlyRent, 'monthly'),
  } as any;
});
