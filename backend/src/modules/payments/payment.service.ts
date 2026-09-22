import crypto from 'crypto';
import Razorpay from 'razorpay';
import { config } from '../../config';
import { prisma } from '../../shared/db/prisma';
import { logger } from '../../shared/logger/logger';
import { ApiError } from '../../shared/errors/api-error';

// Initialize Razorpay SDK instance
const getRazorpayInstance = () => {
  const keyId = config.razorpayKeyId || process.env.RAZORPAY_KEY_ID;
  const keySecret = config.razorpayKeySecret || process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret || keyId === 'your_razorpay_key_id' || keyId === 'placeholder') {
    return null;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

export interface CreateOrderParams {
  amount: number; // in INR (Rupees)
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
  userId?: string;
  customerEmail?: string;
  customerName?: string;
  cartItemIds?: string[];
}

export interface VerifyPaymentParams {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export class PaymentService {
  /**
   * Get public Razorpay Key ID for client SDK initialization
   */
  getPublicKey(): { keyId: string; isConfigured: boolean } {
    const keyId = config.razorpayKeyId || process.env.RAZORPAY_KEY_ID || '';
    const isConfigured = Boolean(
      keyId && keyId !== 'your_razorpay_key_id' && keyId !== 'placeholder'
    );
    return {
      keyId: isConfigured ? keyId : 'rzp_test_placeholder',
      isConfigured,
    };
  }

  /**
   * Create Razorpay Order
   */
  async createOrder(params: CreateOrderParams) {
    const {
      amount,
      currency = 'INR',
      receipt = `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      notes = {},
      userId,
      customerEmail,
      customerName,
    } = params;

    if (!amount || amount <= 0) {
      throw new ApiError('Invalid payment amount. Amount must be greater than zero.', 400);
    }

    const amountInPaise = Math.round(amount * 100);
    const rzp = getRazorpayInstance();

    if (!rzp) {
      logger.warn('Razorpay keys not configured or using placeholders. Simulating order creation for development.');
      // Return a simulated order for local dev / preview
      const simulatedOrderId = `order_sim_${Date.now()}`;
      return {
        orderId: simulatedOrderId,
        amount: amountInPaise,
        currency,
        receipt,
        keyId: 'rzp_test_placeholder',
        isSimulated: true,
      };
    }

    try {
      const options = {
        amount: amountInPaise,
        currency,
        receipt,
        notes: {
          ...notes,
          userId: userId || 'guest',
          customerEmail: customerEmail || '',
          customerName: customerName || '',
        },
      };

      const order = await rzp.orders.create(options);
      logger.info({ orderId: order.id, amount: order.amount }, 'Razorpay order created successfully');

      // Log activity
      if (userId) {
        try {
          await prisma.activityLog.create({
            data: {
              userId,
              eventType: 'PAYMENT_ORDER_CREATED',
              resourceType: 'RazorpayOrder',
              resourceId: order.id,
              metadata: {
                amount,
                currency,
                receipt,
              },
            },
          });
        } catch (e) {
          logger.warn({ error: e }, 'Failed to record activity log for order creation');
        }
      }

      return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        keyId: config.razorpayKeyId || process.env.RAZORPAY_KEY_ID,
        isSimulated: false,
      };
    } catch (err: any) {
      logger.error({ error: err }, 'Failed to create Razorpay order');
      throw new ApiError(
        err.error?.description || err.message || 'Failed to create payment order with Razorpay',
        500
      );
    }
  }

  /**
   * Verify Razorpay Payment Signature
   */
  async verifyPayment(params: VerifyPaymentParams) {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, userId, metadata = {} } = params;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      throw new ApiError('Missing payment verification parameters (order_id, payment_id, or signature)', 400);
    }

    const keySecret = config.razorpayKeySecret || process.env.RAZORPAY_KEY_SECRET;

    // Handle simulation bypass in development when keys aren't set
    if (!keySecret || keySecret === 'your_razorpay_key_secret' || razorpayOrderId.startsWith('order_sim_')) {
      logger.info('Verifying simulated payment order in development mode');
      await this.fulfillPaymentSuccess({
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        userId,
        metadata,
      });
      return {
        success: true,
        message: 'Simulated payment verified successfully',
        paymentId: razorpayPaymentId,
        orderId: razorpayOrderId,
      };
    }

    // Cryptographic HMAC SHA256 Signature Verification
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body)
      .digest('hex');

    const isAuthentic = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(razorpaySignature)
    );

    if (!isAuthentic) {
      logger.error(
        { razorpayOrderId, razorpayPaymentId },
        'Payment signature verification failed: invalid signature'
      );
      throw new ApiError('Invalid payment signature. Verification failed.', 400);
    }

    logger.info({ razorpayOrderId, razorpayPaymentId }, 'Razorpay payment signature verified successfully');

    // Fulfill post-payment operations
    await this.fulfillPaymentSuccess({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      userId,
      metadata,
    });

    return {
      success: true,
      message: 'Payment verified and processed successfully',
      paymentId: razorpayPaymentId,
      orderId: razorpayOrderId,
    };
  }

  /**
   * Post-payment fulfillment (clearing user cart, logging activity, creating notifications)
   */
  private async fulfillPaymentSuccess(details: {
    orderId: string;
    paymentId: string;
    userId?: string;
    metadata?: Record<string, any>;
  }) {
    const { orderId, paymentId, userId, metadata = {} } = details;

    try {
      if (userId) {
        // Clear user cart upon successful purchase
        await prisma.cartItem.deleteMany({
          where: { userId },
        });

        // Create success notification
        await prisma.notification.create({
          data: {
            userId,
            type: 'acquisition_confirmed' as any,
            category: 'vault' as any,
            payload: {
              title: 'Acquisition Confirmed',
              message: `Your fine art acquisition (Ref: ${paymentId}) has been successfully processed into white-glove escrow.`,
              orderId,
              paymentId,
              ...metadata,
            },
          },
        });

        // Record Activity Log
        await prisma.activityLog.create({
          data: {
            userId,
            eventType: 'PAYMENT_VERIFIED_SUCCESS',
            resourceType: 'Payment',
            resourceId: paymentId,
            metadata: {
              orderId,
              paymentId,
              ...metadata,
            },
          },
        });
      }
    } catch (err: any) {
      logger.error({ error: err }, 'Error during payment fulfillment side-effects');
      // Do not re-throw here to prevent failing a legitimate verified payment response
    }
  }

  /**
   * Handle incoming Razorpay Webhooks
   */
  async processWebhook(rawBody: string, signature: string) {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || config.razorpayKeySecret || '';

    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        throw new ApiError('Invalid webhook signature', 400);
      }
    }

    const event = JSON.parse(rawBody);
    logger.info({ event: event.event }, 'Received Razorpay webhook event');

    switch (event.event) {
      case 'payment.captured': {
        const payment = event.payload.payment.entity;
        logger.info({ paymentId: payment.id, amount: payment.amount }, 'Razorpay payment captured via webhook');
        break;
      }
      case 'payment.failed': {
        const payment = event.payload.payment.entity;
        logger.warn({ paymentId: payment.id, reason: payment.error_description }, 'Razorpay payment failed');
        break;
      }
      case 'order.paid': {
        const order = event.payload.order.entity;
        logger.info({ orderId: order.id }, 'Razorpay order marked paid via webhook');
        break;
      }
      default:
        logger.debug({ event: event.event }, 'Unhandled Razorpay webhook event');
    }

    return { received: true };
  }
}

export const paymentService = new PaymentService();
