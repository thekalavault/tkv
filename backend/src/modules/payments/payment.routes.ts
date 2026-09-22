import { Router } from 'express';
import { paymentController } from './payment.controller';
import { optionalAuthGuard } from '../../shared/middleware/auth.middleware';

const router = Router();

// Public endpoint to retrieve current Razorpay Key ID
router.get('/key', (req, res) => paymentController.getKey(req, res));

// Order creation endpoint (supports logged-in users & guest collectors)
router.post('/create-order', optionalAuthGuard, (req, res) => paymentController.createOrder(req, res));

// Payment signature verification endpoint
router.post('/verify', optionalAuthGuard, (req, res) => paymentController.verifyPayment(req, res));

// Razorpay Webhook endpoint
router.post('/webhook', (req, res) => paymentController.handleWebhook(req, res));

export default router;
