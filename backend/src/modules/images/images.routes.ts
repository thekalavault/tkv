import { Router } from 'express';
import { ImagesController } from './images.controller';

const router = Router();
const controller = new ImagesController();

router.get('/optimize', (req, res) => controller.optimizeImage(req, res));

export default router;
