import { auth } from '../lib/firebase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

declare global {
  interface Window {
    Razorpay: any;
  }
}

/**
 * Dynamically load Razorpay checkout script
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay SDK');
      resolve(false);
    };

    document.body.appendChild(script);
  });
};

export interface CheckoutOptions {
  amount: number; // in INR
  description?: string;
  artworkId?: string;
  notes?: Record<string, string>;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  onSuccess: (paymentData: {
    paymentId: string;
    orderId: string;
    amount: number;
    receipt?: string;
  }) => void;
  onError?: (errorMsg: string) => void;
  onDismiss?: () => void;
}

/**
 * Trigger full end-to-end Razorpay acquisition checkout
 */
export const initiateRazorpayCheckout = async (options: CheckoutOptions) => {
  const {
    amount,
    description = 'Fine Art Acquisition & Vault Services',
    notes = {},
    customerName,
    customerEmail,
    customerPhone,
    onSuccess,
    onError = (err) => console.error(err),
    onDismiss = () => {},
  } = options;

  try {
    // 1. Ensure Razorpay script is loaded
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      onError('Unable to load payment gateway. Please check your internet connection.');
      return;
    }

    // 2. Prepare authentication token if logged in
    const token = await auth.currentUser?.getIdToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // 3. Create Razorpay order on backend
    const createOrderRes = await fetch(`${API_BASE_URL}/api/v1/payments/create-order`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        amount,
        currency: 'INR',
        notes: {
          ...notes,
          platform: 'The Kala Vault Web',
        },
        customerEmail: customerEmail || auth.currentUser?.email || '',
        customerName: customerName || auth.currentUser?.displayName || '',
      }),
    });

    if (!createOrderRes.ok) {
      const errData = await createOrderRes.json().catch(() => ({}));
      throw new Error(errData.message || 'Failed to initialize payment transaction.');
    }

    const { data: orderData } = await createOrderRes.json();
    const { orderId, amount: amountInPaise, currency, keyId, isSimulated } = orderData;

    // In dev simulated mode (when keys are placeholders)
    if (isSimulated || !window.Razorpay) {
      console.warn('Using simulation fallback for payment checkout');
      const simulatedPaymentId = `pay_sim_${Date.now()}`;
      
      // Verify simulated transaction
      const verifyRes = await fetch(`${API_BASE_URL}/api/v1/payments/verify`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          razorpayOrderId: orderId,
          razorpayPaymentId: simulatedPaymentId,
          razorpaySignature: 'simulated_dev_signature',
          metadata: { amount, description, notes },
        }),
      });

      if (verifyRes.ok) {
        onSuccess({
          paymentId: simulatedPaymentId,
          orderId,
          amount,
          receipt: orderData.receipt,
        });
      } else {
        onError('Payment verification failed.');
      }
      return;
    }

    // 4. Configure Razorpay Standard Checkout options
    const rzpOptions = {
      key: keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      amount: amountInPaise,
      currency: currency || 'INR',
      name: 'The Kala Vault',
      description: description,
      order_id: orderId,
      image: 'https://thekalavault.com/favicon.ico',
      prefill: {
        name: customerName || auth.currentUser?.displayName || '',
        email: customerEmail || auth.currentUser?.email || '',
        contact: customerPhone || '',
      },
      theme: {
        color: '#4A0E17', // Bordeaux signature brand color
        backdrop_color: 'rgba(30, 20, 18, 0.75)',
      },
      modal: {
        ondismiss: () => {
          onDismiss();
        },
        escape: true,
        backdropclose: false,
      },
      handler: async (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) => {
        try {
          // 5. Verify cryptographic signature on backend
          const verifyRes = await fetch(`${API_BASE_URL}/api/v1/payments/verify`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              metadata: {
                amount,
                description,
                notes,
              },
            }),
          });

          if (!verifyRes.ok) {
            const errData = await verifyRes.json().catch(() => ({}));
            throw new Error(errData.message || 'Signature verification failed.');
          }

          onSuccess({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            amount,
            receipt: orderData.receipt,
          });
        } catch (verifyErr: any) {
          onError(verifyErr.message || 'Payment signature verification failed.');
        }
      },
    };

    const rzp = new window.Razorpay(rzpOptions);
    rzp.on('payment.failed', (response: any) => {
      console.error('Razorpay payment failed:', response.error);
      onError(response.error?.description || 'Payment could not be completed.');
    });
    rzp.open();
  } catch (err: any) {
    console.error('Razorpay initiation error:', err);
    onError(err.message || 'Payment initiation error.');
  }
};
