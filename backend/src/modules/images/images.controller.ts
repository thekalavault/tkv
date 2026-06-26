import { Request, Response } from 'express';
import sharp from 'sharp';
import axios from 'axios';
import { ApiError } from '../../shared/errors/api-error';

export class ImagesController {
  async optimizeImage(req: Request, res: Response) {
    try {
      const { url, w, q } = req.query;
      
      if (!url || typeof url !== 'string') {
        throw new ApiError('Missing url parameter', 400);
      }

      const width = w ? parseInt(w as string) : undefined;
      const quality = q ? parseInt(q as string) : 80;

      // Ensure the URL is valid and relative to the backend or absolute
      let targetUrl = url;
      if (targetUrl.startsWith('/')) {
         targetUrl = `http://localhost:${process.env.PORT || 4000}${targetUrl}`;
      }

      // Fetch the image
      const imageResponse = await axios.get(targetUrl, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(imageResponse.data, 'binary');

      // Process with sharp
      let pipeline = sharp(imageBuffer);

      if (width) {
        pipeline = pipeline.resize({ width, withoutEnlargement: true });
      }

      const optimizedBuffer = await pipeline
        .webp({ quality })
        .toBuffer();

      res.set('Content-Type', 'image/webp');
      res.set('Cache-Control', 'public, max-age=31536000, immutable');
      res.send(optimizedBuffer);
    } catch (err) {
      console.error('Image optimization error:', err);
      res.status(500).json({ error: 'Failed to optimize image' });
    }
  }
}
