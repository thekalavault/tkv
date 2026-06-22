import { Router } from 'express';
import { SupportController } from './support.controller';
import { asyncHandler } from '../../shared/utils/async-handler';

const router = Router();
const controller = new SupportController();

router.post('/inquiries', asyncHandler((req, res) => controller.submitInquiry(req, res)));

export { router as supportRouter };
