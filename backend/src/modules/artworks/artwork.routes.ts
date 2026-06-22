import express, { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { authGuard, roleGuard } from '../../shared/middleware/auth.middleware';
import { ArtworkController } from './artwork.controller';
import { asyncHandler } from '../../shared/utils/async-handler';

const router = Router();
const controller = new ArtworkController();

router.get('/', asyncHandler((req, res) => controller.list(req, res)));
router.get('/my-collection', authGuard, asyncHandler((req, res) => controller.myCollection(req, res)));
router.get('/:id', asyncHandler((req, res) => controller.getById(req, res)));
router.post('/', authGuard, roleGuard(['admin', 'operations']), asyncHandler((req, res) => controller.create(req, res)));
router.put('/:id', authGuard, roleGuard(['admin', 'operations']), asyncHandler((req, res) => controller.update(req, res)));
router.post('/:id/images', authGuard, roleGuard(['admin', 'operations']), asyncHandler((req, res) => controller.generateUploadUrl(req, res)));
router.get('/:id/images/:imageId/url', authGuard, asyncHandler((req, res) => controller.getImageUrl(req, res)));

// Mock file upload endpoint
router.post('/:id/images/:imageId/upload-mock',
  authGuard,
  roleGuard(['admin', 'operations']),
  express.raw({ type: '*/*', limit: '10mb' }),
  asyncHandler(async (req, res) => {
    const { id, imageId } = req.params;
    const buffer = req.body;

    const image = await controller.getArtworkImageById(imageId);
    if (!image) {
      return res.status(404).json({ error: 'Image record not found' });
    }

    const targetPath = path.join(__dirname, '../../../../uploads', image.fileKey);
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, buffer);

    res.json({ success: true, fileKey: image.fileKey });
  })
);

export { router as artworkRouter };
