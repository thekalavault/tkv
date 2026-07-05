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
}
