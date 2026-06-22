import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const LOCAL_ARTWORKS = [
  {
    title: 'The Gaze of Silence',
    artist: 'Elena Rossi',
    description: 'A vertical contemporary portrait with bold, expressionistic brushstrokes.',
    medium: 'Oil on Canvas',
    dimensions: '120 x 150 cm',
    rentalPriceCents: 15000,
    replacementValue: 1500000,
    status: 'available',
    category: 'painting',
    localImagePath: '/assets/artworks/gaze-of-silence.jpg',
  },
  {
    title: 'Urban Tectonic II',
    artist: 'Marcus Chen',
    description: 'A square minimalist abstract composition featuring geometric shapes.',
    medium: 'Mixed Media, Charcoal & Ash',
    dimensions: '100 x 100 cm',
    rentalPriceCents: 18500,
    replacementValue: 1850000,
    status: 'available',
    category: 'mixed_media',
    localImagePath: '/assets/artworks/urban-tectonic.jpg',
  },
  {
    title: 'Monsoon Whispers',
    artist: 'Sana Varma',
    description: 'A vertical atmospheric landscape painting showing a misty morning.',
    medium: 'Watercolor & Ink on Raw Silk',
    dimensions: '90 x 120 cm',
    rentalPriceCents: 21000,
    replacementValue: 2100000,
    status: 'available',
    category: 'painting',
    localImagePath: '/assets/artworks/monsoon-whispers.jpg',
  },
  {
    title: 'Celestial Flow',
    artist: 'Vikram Seth',
    description: 'A sophisticated abstract work featuring complex layers of metallic gold leaf.',
    medium: 'Gold Leaf and Indigo Ink on Canvas',
    dimensions: '140 x 180 cm',
    rentalPriceCents: 24000,
    replacementValue: 2400000,
    status: 'rented',
    category: 'painting',
    localImagePath: '/assets/artworks/celestial-flow.jpg',
  },
];

async function seed() {
  console.log('Seeding artworks...');
  for (const art of LOCAL_ARTWORKS) {
    const created = await prisma.artwork.create({
      data: {
        sku: 'ART-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        title: art.title,
        artist: art.artist,
        description: art.description,
        medium: art.medium,
        dimensions: art.dimensions,
        category: art.category as any,
        rentalPriceCents: art.rentalPriceCents,
        replacementValue: art.replacementValue,
        status: art.status as any,
        images: {
          create: [
            {
              fileKey: art.localImagePath,
              variant: 'original',
              mimeType: 'image/jpeg'
            }
          ]
        }
      }
    });
    console.log('Created:', created.title);
  }
  console.log('Done seeding artworks.');
}

seed().catch(console.error).finally(() => prisma.$disconnect());
