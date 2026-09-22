import { Request, Response } from 'express';
import { AuthRequest } from '../../shared/middleware/auth.middleware';
import { paymentService } from './payment.service';

export class PaymentController {
  /**
   * Get public Razorpay key configuration
   */
  async getKey(req: Request, res: Response) {
    const keyData = paymentService.getPublicKey();
    res.json({
      success: true,
      data: keyData,
    });
  }

  /**
   * Create Razorpay Order
   */
  async createOrder(req: AuthRequest, res: Response) {
    const {
      amount,
      currency,
      receipt,
      notes,
      customerEmail,
      customerName,
      cartItemIds,
    } = req.body;

    const order = await paymentService.createOrder({
      amount: Number(amount),
      currency,
      receipt,
      notes,
      userId: req.user?.id,
      customerEmail: customerEmail || req.user?.email,
      customerName,
      cartItemIds,
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  }

  /**
   * Verify Razorpay Payment Signature
   */
  async verifyPayment(req: AuthRequest, res: Response) {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      metadata,
    } = req.body;

    const result = await paymentService.verifyPayment({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      userId: req.user?.id,
      metadata,
    });

    res.json({
      success: true,
      data: result,
    });
  }

  /**
   * Razorpay Webhook
   */
  async handleWebhook(req: Request, res: Response) {
    const signature = (req.headers['x-razorpay-signature'] as string) || '';
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

    const result = await paymentService.processWebhook(rawBody, signature);
    res.json(result);
  }
}

export const paymentController = new PaymentController();
