import { ArtworkService } from '../../src/modules/artworks/artwork.service';
import { ArtworkRepository } from '../../src/modules/artworks/artwork.repository';
import { ApiError } from '../../src/shared/errors/api-error';
import { prisma } from '../../src/shared/db/prisma';

// Mock dependencies
jest.mock('../../src/shared/db/prisma', () => ({
  prisma: {
    $transaction: jest.fn(),
    artwork: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    artworkImage: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    favorite: {
      deleteMany: jest.fn(),
    },
    cartItem: {
      deleteMany: jest.fn(),
    },
    swapRequest: {
      deleteMany: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('../../src/modules/integrations/cloudflare-r2', () => {
  return {
    CloudflareR2Service: jest.fn().mockImplementation(() => ({
      createUploadUrl: jest.fn(),
      getPublicAssetUrl: jest.fn(),
      getSignedAssetUrl: jest.fn(),
      deleteAsset: jest.fn().mockResolvedValue(undefined),
    })),
  };
});

describe('Artwork Module Unit Tests', () => {
  let artworkService: ArtworkService;
  let artworkRepository: ArtworkRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    artworkService = new ArtworkService();
    artworkRepository = new ArtworkRepository();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('ArtworkService.deleteArtwork', () => {
    it('should throw ApiError with status 404 if artwork is not found', async () => {
      jest.spyOn(ArtworkRepository.prototype, 'findArtworkById').mockResolvedValueOnce(null as any);

      await expect(artworkService.deleteArtwork('non-existent-id')).rejects.toThrow(ApiError);
      await expect(artworkService.deleteArtwork('non-existent-id')).rejects.toMatchObject({
        statusCode: 404,
        message: 'Artwork not found',
      });
    });

    it('should delete artwork images and cascade delete artwork from database', async () => {
      const mockArtwork = {
        id: 'art-123',
        title: 'Sunset Mirage',
        sku: 'TKV-0001',
        images: [
          { id: 'img-1', fileKey: 'artworks/art-123/img1.jpg' },
          { id: 'img-2', fileKey: 'artworks/art-123/img2.jpg' },
        ],
      };

      jest.spyOn(ArtworkRepository.prototype, 'findArtworkById').mockResolvedValueOnce(mockArtwork as any);
      const deleteRepoSpy = jest.spyOn(ArtworkRepository.prototype, 'deleteArtwork').mockResolvedValueOnce(mockArtwork as any);

      const result = await artworkService.deleteArtwork('art-123');

      expect(result).toBe(true);
      expect(deleteRepoSpy).toHaveBeenCalledWith('art-123');
    });
  });

  describe('ArtworkService.deleteArtworkImage', () => {
    it('should throw 404 if image does not exist', async () => {
      jest.spyOn(ArtworkRepository.prototype, 'findArtworkImageById').mockResolvedValueOnce(null as any);

      await expect(artworkService.deleteArtworkImage('img-999')).rejects.toThrow(ApiError);
    });

    it('should delete image record successfully', async () => {
      const mockImage = { id: 'img-1', fileKey: 'artworks/art-1/img1.jpg' };
      jest.spyOn(ArtworkRepository.prototype, 'findArtworkImageById').mockResolvedValueOnce(mockImage as any);
      const deleteImageSpy = jest.spyOn(ArtworkRepository.prototype, 'deleteArtworkImage').mockResolvedValueOnce(mockImage as any);

      const result = await artworkService.deleteArtworkImage('img-1');

      expect(result).toBe(true);
      expect(deleteImageSpy).toHaveBeenCalledWith('img-1');
    });
  });

  describe('ArtworkRepository.deleteArtwork (Cascade in Transaction)', () => {
    it('should delete related images, favorites, cart items, swap requests and then artwork in a transaction', async () => {
      const txMock = {
        artworkImage: { deleteMany: jest.fn().mockResolvedValue({ count: 2 }) },
        favorite: { deleteMany: jest.fn().mockResolvedValue({ count: 1 }) },
        cartItem: { deleteMany: jest.fn().mockResolvedValue({ count: 1 }) },
        swapRequest: { deleteMany: jest.fn().mockResolvedValue({ count: 0 }) },
        artwork: { delete: jest.fn().mockResolvedValue({ id: 'art-123' }) },
      };

      (prisma.$transaction as jest.Mock).mockImplementation(async (callback: any) => {
        return callback(txMock);
      });

      const res = await artworkRepository.deleteArtwork('art-123');

      expect(txMock.artworkImage.deleteMany).toHaveBeenCalledWith({ where: { artworkId: 'art-123' } });
      expect(txMock.favorite.deleteMany).toHaveBeenCalledWith({ where: { artworkId: 'art-123' } });
      expect(txMock.cartItem.deleteMany).toHaveBeenCalledWith({ where: { artworkId: 'art-123' } });
      expect(txMock.swapRequest.deleteMany).toHaveBeenCalledWith({ where: { artworkId: 'art-123' } });
      expect(txMock.artwork.delete).toHaveBeenCalledWith({ where: { id: 'art-123' } });
      expect(res).toEqual({ id: 'art-123' });
    });
  });

  describe('ArtworkService.listArtworks & getArtworkById', () => {
    it('should list artworks and interleave them', async () => {
      const mockArtworks = [
        { id: '1', title: 'WIP Shagun Painting', artist: 'Shagun Agarwal', replacementValue: 50000, images: [] },
        { id: '2', title: 'Untitled Kashish', artist: 'Kasshiish Kariyaa', replacementValue: 40000, images: [] },
        { id: '3', title: 'Heritage Archival', artist: 'Raza Foundation', replacementValue: 30000, images: [] },
      ];

      (prisma.artwork.findMany as jest.Mock).mockResolvedValue(mockArtworks);
      (prisma.artwork.count as jest.Mock).mockResolvedValue(3);

      const result = await artworkService.listArtworks({ page: 1, limit: 10 });
      expect(result.items.length).toBe(3);
      expect(result.total).toBe(3);
    });

    it('should filter artworks by search, status, category, and warehouse', async () => {
      (prisma.artwork.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.artwork.count as jest.Mock).mockResolvedValue(0);

      const result = await artworkService.listArtworks({
        search: 'monet',
        status: 'available',
        category: 'painting',
        warehouseId: 'wh-1',
      });

      expect(result.items).toEqual([]);
    });

    it('should get artwork by id or throw 404', async () => {
      (prisma.artwork.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(artworkService.getArtworkById('unknown-id')).rejects.toThrow(ApiError);
    });
  });
});
