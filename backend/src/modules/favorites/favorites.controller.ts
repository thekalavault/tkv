import { Request, Response } from 'express';
import { prisma } from '../../shared/db/prisma';
import { ApiError } from '../../shared/errors/api-error';
import { AuthRequest } from '../../shared/middleware/auth.middleware';

export class FavoritesController {
  async getFavorites(req: AuthRequest, res: Response) {
    if (!req.user) throw new ApiError('Unauthorized', 401);
    
    const items = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      include: {
        artwork: {
          include: { images: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(items);
  }

  async addFavorite(req: AuthRequest, res: Response) {
    if (!req.user) throw new ApiError('Unauthorized', 401);
    
    const { artworkId } = req.body;
    if (!artworkId) throw new ApiError('Missing artworkId', 400);

    // Ensure it doesn't already exist to prevent unique constraint error
    const existing = await prisma.favorite.findUnique({
      where: { userId_artworkId: { userId: req.user.id, artworkId } }
    });
    
    if (existing) {
      return res.status(200).json(existing);
    }

    const item = await prisma.favorite.create({
      data: {
        userId: req.user.id,
        artworkId
      }
    });

    res.status(201).json(item);
  }

  async removeFavorite(req: AuthRequest, res: Response) {
    if (!req.user) throw new ApiError('Unauthorized', 401);
    
    const { id } = req.params; // this is the artworkId
    
    await prisma.favorite.deleteMany({
      where: { 
        userId: req.user.id,
        artworkId: id 
      }
    });

    res.status(204).send();
  }
}
