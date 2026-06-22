import crypto from 'crypto';
import { ArtworkRepository } from './artwork.repository';
import { ApiError } from '../../shared/errors/api-error';
import { CloudflareR2Service } from '../integrations/cloudflare-r2';
import { createArtworkSchema, createArtworkImageSchema, updateArtworkSchema } from './artwork.dto';
import { config } from '../../config';
import { prisma } from '../../shared/db/prisma';

const artworkRepository = new ArtworkRepository();
const r2Service = new CloudflareR2Service();

export class ArtworkService {
  async listArtworks(query: Record<string, any>) {
    const page = Number(query.page ?? 1);
    const limit = Math.min(Number(query.limit ?? 24), 50);
    const skip = (page - 1) * limit;
    const where: Record<string, any> = {};

    if (query.status) where.status = query.status;
    if (query.category) where.category = query.category;
    if (query.warehouseId) where.warehouseId = query.warehouseId;
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { artist: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      artworkRepository.findArtworks(where, skip, limit),
      artworkRepository.countArtworks(where),
    ]);

    const mappedItems = await Promise.all(items.map(async (artwork: any) => {
      if (artwork.images) {
        artwork.images = await Promise.all(artwork.images.map(async (img: any) => {
          if (img.fileKey.startsWith('http')) {
            return img;
          }
          if (!config.cloudflareR2AccountId || config.cloudflareR2AccountId === 'placeholder') {
            return { ...img, fileKey: `/uploads/${img.fileKey}` };
          }
          try {
            const url = await r2Service.getSignedAssetUrl(img.fileKey);
            return { ...img, fileKey: url };
          } catch (err) {
            return { ...img, fileKey: `/uploads/${img.fileKey}` };
          }
        }));
      }
      return artwork;
    }));

    return { page, limit, total, items: mappedItems };
  }

  async getArtworkById(id: string) {
    const artwork = await artworkRepository.findArtworkById(id);
    if (!artwork) {
      throw new ApiError('Artwork not found', 404);
    }
    if (artwork.images) {
      artwork.images = await Promise.all(artwork.images.map(async (img: any) => {
        if (img.fileKey.startsWith('http')) {
          return img;
        }
        if (!config.cloudflareR2AccountId || config.cloudflareR2AccountId === 'placeholder') {
          return { ...img, fileKey: `/uploads/${img.fileKey}` };
        }
        try {
          const url = await r2Service.getSignedAssetUrl(img.fileKey);
          return { ...img, fileKey: url };
        } catch (err) {
          return { ...img, fileKey: `/uploads/${img.fileKey}` };
        }
      }));
    }
    return artwork;
  }

  async listMyCollection(userId: string) {
    const items = await prisma.artwork.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
      include: { images: true }
    });

    return Promise.all(items.map(async (artwork: any) => {
      if (artwork.images) {
        artwork.images = await Promise.all(artwork.images.map(async (img: any) => {
          if (img.fileKey.startsWith('http')) return img;
          if (!config.cloudflareR2AccountId || config.cloudflareR2AccountId === 'placeholder') {
            return { ...img, fileKey: `/uploads/${img.fileKey}` };
          }
          try {
            const url = await r2Service.getSignedAssetUrl(img.fileKey);
            return { ...img, fileKey: url };
          } catch (err) {
            return { ...img, fileKey: `/uploads/${img.fileKey}` };
          }
        }));
      }
      return artwork;
    }));
  }

  async createArtwork(data: Record<string, any>) {
    const parsed = createArtworkSchema.parse(data);
    let ownerId = undefined;
    if (parsed.ownerEmail) {
      const user = await prisma.user.findUnique({ where: { email: parsed.ownerEmail } });
      if (!user) throw new ApiError('Owner email not found', 404);
      ownerId = user.id;
    }
    return artworkRepository.createArtwork({
      sku: parsed.sku,
      title: parsed.title,
      description: parsed.description,
      artist: parsed.artist,
      style: parsed.style,
      medium: parsed.medium,
      yearCreated: parsed.yearCreated,
      dimensions: parsed.dimensions,
      category: parsed.category,
      warehouseId: parsed.warehouseId,
      ownerId,
      rentalPriceCents: parsed.rentalPriceCents,
      replacementValue: parsed.replacementValue,
      metadata: parsed.metadata || {},
    });
  }

  async updateArtwork(id: string, data: Record<string, any>) {
    const parsed = updateArtworkSchema.parse(data);
    const updateData: Record<string, any> = {};
    const allowedKeys = [
      'sku', 'title', 'description', 'artist', 'style', 'medium', 
      'yearCreated', 'dimensions', 'category', 'status', 
      'rentalPriceCents', 'replacementValue', 'warehouseId', 'metadata'
    ];
    for (const key of allowedKeys) {
      if (parsed[key as keyof typeof parsed] !== undefined) {
        updateData[key] = parsed[key as keyof typeof parsed];
      }
    }

    if (parsed.ownerEmail !== undefined) {
      if (parsed.ownerEmail === '') {
        updateData.ownerId = null;
      } else {
        const user = await prisma.user.findUnique({ where: { email: parsed.ownerEmail } });
        if (!user) throw new ApiError('Owner email not found', 404);
        updateData.ownerId = user.id;
      }
    }

    return artworkRepository.updateArtwork(id, updateData);
  }

  async createImageUploadUrl(artworkId: string, body: Record<string, any>) {
    const artwork = await artworkRepository.findArtworkById(artworkId);
    if (!artwork) {
      throw new ApiError('Artwork not found', 404);
    }

    const parsed = createArtworkImageSchema.parse(body);
    const imageId = crypto.randomUUID();
    const extension = parsed.mimeType.split('/')[1] ?? 'jpg';
    const fileKey = `artworks/${artworkId}/${imageId}.${extension}`;

    const imageRecord = await artworkRepository.createArtworkImage({
      artworkId,
      fileKey,
      variant: parsed.variant,
      mimeType: parsed.mimeType,
      width: parsed.width,
      height: parsed.height,
      order: parsed.order,
    });

    let uploadUrl = '';
    if (!config.cloudflareR2AccountId || config.cloudflareR2AccountId === 'placeholder') {
      uploadUrl = `/api/v1/artworks/${artworkId}/images/${imageRecord.id}/upload-mock`;
    } else {
      try {
        uploadUrl = await r2Service.createUploadUrl(fileKey, parsed.mimeType);
      } catch (err) {
        uploadUrl = `/api/v1/artworks/${artworkId}/images/${imageRecord.id}/upload-mock`;
      }
    }

    return {
      image: {
        id: imageRecord.id,
        fileKey: imageRecord.fileKey,
        variant: imageRecord.variant,
      },
      uploadUrl,
    };
  }

  async getSignedImageUrl(imageId: string) {
    const image = await artworkRepository.findArtworkImageById(imageId);
    if (!image) {
      throw new ApiError('Artwork image not found', 404);
    }

    if (!config.cloudflareR2AccountId || config.cloudflareR2AccountId === 'placeholder') {
      return { url: `/uploads/${image.fileKey}`, mimeType: image.mimeType, variant: image.variant };
    }

    try {
      const url = await r2Service.getSignedAssetUrl(image.fileKey);
      return { url, mimeType: image.mimeType, variant: image.variant };
    } catch (err) {
      return { url: `/uploads/${image.fileKey}`, mimeType: image.mimeType, variant: image.variant };
    }
  }

  async getArtworkImageById(imageId: string) {
    return artworkRepository.findArtworkImageById(imageId);
  }
}
