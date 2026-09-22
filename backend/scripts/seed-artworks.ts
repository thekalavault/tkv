import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const LOCAL_ARTWORKS = [
  {
    title: 'Heritage Rhythms',
    artist: 'Anya Gupta',
    description: 'A vibrant contemporary masterwork using saturated cinnabar reds, raw ochre, and earthy mineral pigments.',
    medium: 'Acrylic and Earth Pigments',
    dimensions: '100 x 100 cm',
    rentalPriceCents: 13000,
    replacementValue: 85000,
    status: 'available',
    category: 'painting',
    localImagePath: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85',
  },
  {
    title: 'Zen Garden I',
    artist: 'Kaito Tanaka',
    description: 'A serene minimalist sumi ink study of botanical balance and Japanese garden aesthetics.',
    medium: 'Sumi Ink on Washi Paper',
    dimensions: '60 x 80 cm',
    rentalPriceCents: 11000,
    replacementValue: 70000,
    status: 'available',
    category: 'painting',
    localImagePath: 'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=1200&q=85',
  },
  {
    title: 'Imperial Noir',
    artist: 'Elena Rostova',
    description: 'A monumental dark textural canvas layered with raw obsidian pigments, charcoal dust, and burnished bronze accents.',
    medium: 'Charcoal, Obsidian & Bronze Dust on Canvas',
    dimensions: '150 x 120 cm',
    rentalPriceCents: 19500,
    replacementValue: 140000,
    status: 'available',
    category: 'mixed_media',
    localImagePath: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=85',
  },
  {
    title: 'Elysian Horizon',
    artist: 'Julian Sterling',
    description: 'A luminous chromatic exploration inspired by the golden hour along the Amalfi coast.',
    medium: 'Oil on Belgian Linen',
    dimensions: '120 x 90 cm',
    rentalPriceCents: 16500,
    replacementValue: 115000,
    status: 'available',
    category: 'painting',
    localImagePath: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85',
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
