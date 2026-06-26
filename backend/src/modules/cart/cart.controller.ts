import { Request, Response } from 'express';
import { prisma } from '../../shared/db/prisma';
import { ApiError } from '../../shared/errors/api-error';
import { AuthRequest } from '../../shared/middleware/auth.middleware';

export class CartController {
  async getCart(req: AuthRequest, res: Response) {
    if (!req.user) throw new ApiError('Unauthorized', 401);
    
    const items = await prisma.cartItem.findMany({
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

  async addToCart(req: AuthRequest, res: Response) {
    if (!req.user) throw new ApiError('Unauthorized', 401);
    
    const { artworkId, type, priceCents } = req.body;
    if (!artworkId || !type || priceCents === undefined) {
      throw new ApiError('Missing required fields', 400);
    }

    const item = await prisma.cartItem.create({
      data: {
        userId: req.user.id,
        artworkId,
        type,
        priceCents
      }
    });

    res.status(201).json(item);
  }

  async removeFromCart(req: AuthRequest, res: Response) {
    if (!req.user) throw new ApiError('Unauthorized', 401);
    
    const { id } = req.params;
    
    const existing = await prisma.cartItem.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.user.id) {
      throw new ApiError('Not found or unauthorized', 404);
    }

    await prisma.cartItem.delete({ where: { id } });
    res.status(204).send();
  }

  async clearCart(req: AuthRequest, res: Response) {
    if (!req.user) throw new ApiError('Unauthorized', 401);
    
    await prisma.cartItem.deleteMany({
      where: { userId: req.user.id }
    });

    res.status(204).send();
  }
}
