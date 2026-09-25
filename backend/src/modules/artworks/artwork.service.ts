import crypto from 'crypto';
import { ArtworkRepository } from './artwork.repository';
import { ApiError } from '../../shared/errors/api-error';
import { CloudflareR2Service } from '../integrations/cloudflare-r2';
import { createArtworkSchema, createArtworkImageSchema, updateArtworkSchema } from './artwork.dto';
import { config } from '../../config';
import { prisma } from '../../shared/db/prisma';

const artworkRepository = new ArtworkRepository();
const r2Service = new CloudflareR2Service();

function mixArtworksByArtist<T extends { artist?: string | null; title?: string; replacementValue?: number }>(artworks: T[]): T[] {
  if (!artworks || artworks.length <= 2) return artworks;

  const isShagun = (a: T) => (a.artist || '').toLowerCase().includes('shagun');
  const isKash = (a: T) => {
    const art = (a.artist || '').toLowerCase();
    return art.includes('kassh') || art.includes('kash') || art.includes('kariyaa');
  };

  const getVal = (a: T) => a.replacementValue || 0;
  const getTitle = (a: T) => (a.title || '').toLowerCase();

  const shagun = artworks.filter(isShagun);
  shagun.sort((a, b) => {
    const wipA = getTitle(a).startsWith('wip');
    const wipB = getTitle(b).startsWith('wip');
    if (wipA && !wipB) return 1;
    if (!wipA && wipB) return -1;
    return getVal(b) - getVal(a);
  });

  const kash = artworks.filter(isKash);
  kash.sort((a, b) => {
    const untA = getTitle(a).includes('untitled');
    const untB = getTitle(b).includes('untitled');
    if (untA && !untB) return 1;
    if (!untA && untB) return -1;
    return getVal(b) - getVal(a);
  });

  const others = artworks.filter(a => !isShagun(a) && !isKash(a));
  others.sort((a, b) => getVal(b) - getVal(a));

  const buckets = [
    { name: 'Shagun Agarwal', items: [...shagun] },
    { name: 'Kasshiish Kariyaa', items: [...kash] },
    { name: 'Archival Collection', items: [...others] }
  ];

  const total = shagun.length + kash.length + others.length;
  const result: T[] = [];
  let lastArtist = '';
  let roundIndex = 0;

  for (let i = 0; i < total; i++) {
    const available = buckets.filter(b => b.items.length > 0);
    if (available.length === 0) break;

    const totalRemaining = available.reduce((acc, b) => acc + b.items.length, 0);
    const urgent = available.find(b => b.items.length >= Math.ceil(totalRemaining / 2) && b.name !== lastArtist);
    let chosenBucket = urgent || null;

    if (!chosenBucket) {
      for (let step = 0; step < buckets.length; step++) {
        const idx = (roundIndex + step) % buckets.length;
        const b = buckets[idx];
        if (b.items.length > 0 && b.name !== lastArtist) {
          chosenBucket = b;
          roundIndex = (idx + 1) % buckets.length;
          break;
        }
      }
    }

    if (!chosenBucket) {
      let candidates = available.filter(b => b.name !== lastArtist);
      if (candidates.length === 0) candidates = available;
      candidates.sort((a, b) => b.items.length - a.items.length);
      chosenBucket = candidates[0];
      roundIndex = (buckets.indexOf(chosenBucket) + 1) % buckets.length;
    }

    const item = chosenBucket.items.shift();
    if (item) {
      result.push(item);
      lastArtist = chosenBucket.name;
    }
  }

  return result;
}

export class ArtworkService {
  async listArtworks(query: Record<string, any>) {
    const page = Number(query.page ?? 1);
    const limit = query.limit === 'all'
      ? 1000
      : Math.min(Number(query.limit ?? 500), 1000);
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
          if (!img.fileKey) return img;
          if (img.fileKey.startsWith('http')) return img;

          const publicUrl = r2Service.getPublicAssetUrl(img.fileKey);
          if (publicUrl) return { ...img, fileKey: publicUrl };

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

    let finalItems = mappedItems;
    if (!query.search) {
      finalItems = mixArtworksByArtist(mappedItems);
    }

    return { page, limit, total, items: finalItems };
  }

  async getArtworkById(id: string) {
    const artwork = await artworkRepository.findArtworkById(id);
    if (!artwork) {
      throw new ApiError('Artwork not found', 404);
    }
    if (artwork.images) {
      artwork.images = await Promise.all(artwork.images.map(async (img: any) => {
        if (!img.fileKey) return img;
        if (img.fileKey.startsWith('http')) return img;

        const publicUrl = r2Service.getPublicAssetUrl(img.fileKey);
        if (publicUrl) return { ...img, fileKey: publicUrl };

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
          if (!img.fileKey) return img;
          if (img.fileKey.startsWith('http')) return img;

          const publicUrl = r2Service.getPublicAssetUrl(img.fileKey);
          if (publicUrl) return { ...img, fileKey: publicUrl };

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

    let finalSku = parsed.sku;
    if (!finalSku || !finalSku.trim()) {
      const count = await artworkRepository.countArtworks({});
      finalSku = `TKV-${String(count + 1).padStart(4, '0')}`;
    }

    return artworkRepository.createArtwork({
      sku: finalSku,
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

  async deleteArtwork(id: string) {
    const artwork = await artworkRepository.findArtworkById(id);
    if (!artwork) {
      throw new ApiError('Artwork not found', 404);
    }
    await artworkRepository.deleteArtwork(id);
    return true;
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

  async deleteArtworkImage(imageId: string) {
    const image = await artworkRepository.findArtworkImageById(imageId);
    if (!image) {
      throw new ApiError('Artwork image not found', 404);
    }
    await artworkRepository.deleteArtworkImage(imageId);
    return true;
  }

  async getArtworkImageById(imageId: string) {
    return artworkRepository.findArtworkImageById(imageId);
  }
}
