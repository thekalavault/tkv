import { Request, Response } from 'express';
import { AuthRequest } from '../../shared/middleware/auth.middleware';
import { ArtworkService } from './artwork.service';

const artworkService = new ArtworkService();

export class ArtworkController {

  async list(req: Request, res: Response) {
    const result = await artworkService.listArtworks(req.query);
    res.json(result);
  }

  async myCollection(req: AuthRequest, res: Response) {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const result = await artworkService.listMyCollection(req.user.id);
    res.json(result);
  }

  async getById(req: Request, res: Response) {
    const artwork = await artworkService.getArtworkById(req.params.id);
    res.json(artwork);
  }

  async create(req: Request, res: Response) {
    const artwork = await artworkService.createArtwork(req.body);
    res.status(201).json(artwork);
  }

  async update(req: Request, res: Response) {
    const artwork = await artworkService.updateArtwork(req.params.id, req.body);
    res.json(artwork);
  }

  async delete(req: Request, res: Response) {
    await artworkService.deleteArtwork(req.params.id);
    res.status(204).send();
  }

  async generateUploadUrl(req: Request, res: Response) {
    const url = await artworkService.createImageUploadUrl(req.params.id, req.body);
    res.json(url);
  }

  async getImageUrl(req: Request, res: Response) {
    const url = await artworkService.getSignedImageUrl(req.params.imageId);
    res.json(url);
  }

  async deleteImage(req: Request, res: Response) {
    await artworkService.deleteArtworkImage(req.params.imageId);
    res.status(204).send();
  }

  async getArtworkImageById(imageId: string) {
    return artworkService.getArtworkImageById(imageId);
  }
}
