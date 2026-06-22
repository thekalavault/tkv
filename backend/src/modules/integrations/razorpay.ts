import Razorpay from 'razorpay';

export const razorpayClient = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export class RazorpayService {
  async createSubscription(payload: Record<string, unknown>) {
    return razorpayClient.subscriptions.create(payload as any);
  }

  async fetchInvoice(invoiceId: string) {
    return razorpayClient.invoices.fetch(invoiceId);
  }
}
