import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function remove() {
  const titles = ['Celestial Flow', 'Monsoon Whispers', 'Urban Tectonic II', 'The Gaze of Silence'];
  
  const artworks = await prisma.artwork.findMany({
    where: { title: { in: titles } }
  });
  
  const ids = artworks.map(a => a.id);
  
  if (ids.length > 0) {
    await prisma.artworkImage.deleteMany({
      where: { artworkId: { in: ids } }
    });
    
    const result = await prisma.artwork.deleteMany({
      where: { id: { in: ids } }
    });
    console.log('Deleted ' + result.count + ' artworks');
  } else {
    console.log('No artworks found to delete');
  }
}
remove().catch(console.error).finally(() => prisma.$disconnect());
