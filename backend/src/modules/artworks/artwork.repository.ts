import { prisma } from '../../shared/db/prisma';

export class ArtworkRepository {
  async findArtworks(where: Record<string, any>, skip: number, take: number) {
    return prisma.artwork.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: { images: true, warehouse: true },
    });
  }

  async countArtworks(where: Record<string, any>) {
    return prisma.artwork.count({ where });
  }

  async findArtworkById(id: string) {
    return prisma.artwork.findUnique({
      where: { id },
      include: { images: true, warehouse: true },
    });
  }

  async createArtwork(data: any) {
    return prisma.artwork.create({ data });
  }

  async updateArtwork(id: string, data: any) {
    return prisma.artwork.update({ where: { id }, data });
  }

  async createArtworkImage(data: {
    artworkId: string;
    fileKey: string;
    variant: string;
    mimeType: string;
    width?: number;
    height?: number;
    order: number;
  }) {
    return prisma.artworkImage.create({ data });
  }

  async findArtworkImageById(imageId: string) {
    return prisma.artworkImage.findUnique({ where: { id: imageId } });
  }

  async deleteArtwork(id: string) {
    await prisma.artworkImage.deleteMany({ where: { artworkId: id } });
    return prisma.artwork.delete({ where: { id } });
  }

  async deleteArtworkImage(imageId: string) {
    return prisma.artworkImage.delete({ where: { id: imageId } });
  }

  async findAdjacentArtworks(currentId: string) {
    const current = await prisma.artwork.findUnique({ where: { id: currentId } });
    if (!current) return { prev: null, next: null };
    
    const prev = await prisma.artwork.findFirst({
      where: { createdAt: { gt: current.createdAt } },
      orderBy: { createdAt: 'asc' },
      select: { id: true }
    });
    
    const next = await prisma.artwork.findFirst({
      where: { createdAt: { lt: current.createdAt } },
      orderBy: { createdAt: 'desc' },
      select: { id: true }
    });
    
    return { prev, next };
  }

  async findRelatedArtworks(currentId: string, limit: number) {
    const current = await prisma.artwork.findUnique({ where: { id: currentId } });
    if (!current) return [];

    return prisma.artwork.findMany({
      where: { 
        id: { not: currentId },
        category: current.category
      },
      take: limit,
      include: { images: true }
    });
  }
}
