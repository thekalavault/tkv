import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import { initiateRazorpayCheckout } from '../services/paymentService';
import { PaymentSuccessModal } from '../components/PaymentSuccessModal';
import RobustArtworkImage from '../components/RobustArtworkImage';

export default function Cart() {
  const { items: cartItems, total: cartTotal, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successDetails, setSuccessDetails] = useState<{
    paymentId: string;
    orderId: string;
    amount: number;
    receipt?: string;
  } | null>(null);

  const handleProceedToAcquisition = async () => {
    if (cartItems.length === 0 || cartTotal <= 0) return;

    setIsProcessing(true);
    setErrorMessage(null);

    await initiateRazorpayCheckout({
      amount: cartTotal,
      description: `Acquisition of ${cartItems.length} curated artwork(s) - The Kala Vault`,
      notes: {
        itemCount: String(cartItems.length),
        itemNames: cartItems.map(i => i.name).slice(0, 3).join(', '),
      },
      customerName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : undefined,
      customerEmail: user?.email,
      onSuccess: async (paymentData) => {
        setIsProcessing(false);
        setSuccessDetails(paymentData);
        await clearCart();
      },
      onError: (err) => {
        setIsProcessing(false);
        setErrorMessage(err);
      },
      onDismiss: () => {
        setIsProcessing(false);
      },
    });
  };

  return (
    <div className="bg-[#FAF6F0] text-[#1E1412] min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#C5A059]/30 pt-[100px] md:pt-[130px]">
      <TopNavBar />
      
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 md:px-12 py-12 md:py-16">
        <div>
          <section className="space-y-3 mb-12 border-b border-[#C5A059]/25 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[10.5px] tracking-[0.35em] font-cinzel text-[#4A0E17] uppercase block font-bold">
                Acquisition Portfolio
              </span>
              <h1 className="font-cinzel text-3xl md:text-5xl tracking-tight text-[#1E1412] font-semibold">
                Curated Selection Cart
              </h1>
            </div>
            {cartItems.length > 0 && (
              <p className="text-xs font-cinzel font-bold text-[#1E1412]/60 uppercase tracking-wider">
                {cartItems.length} {cartItems.length === 1 ? 'Masterwork' : 'Masterworks'} Reserved
              </p>
            )}
          </section>

          {errorMessage && (
            <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-red-600">error</span>
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-xs font-cinzel uppercase tracking-wider text-red-600 font-bold hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {cartItems.length === 0 ? (
            <div className="bg-[#FAF6F0] p-16 md:p-24 rounded-3xl border border-[#C5A059]/30 text-center shadow-sm max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-full border border-[#C5A059]/40 bg-[#F5EFEB] flex items-center justify-center mx-auto mb-6 text-[#4A0E17]">
                <span className="material-symbols-outlined text-[30px]">shopping_bag</span>
              </div>
              <h2 className="font-cinzel text-2xl md:text-3xl text-[#1E1412] mb-3 font-semibold">
                Your Acquisition Portfolio is Empty
              </h2>
              <p className="text-sm text-[#1E1412]/70 mb-8 max-w-md mx-auto font-body-md">
                Explore our curatorial vault of museum-grade original masterworks and dynamic rotation collections.
              </p>
              <Link to="/collections" className="pill-button pill-button-bordeaux text-xs">
                Browse Gallery Vault
                <span className="material-symbols-outlined text-[15px] text-[#DFC07D]">arrow_forward</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
              {/* Table / List */}
              <div className="lg:col-span-2 bg-[#FAF6F0] rounded-3xl border border-[#C5A059]/30 p-6 md:p-8 shadow-[0_10px_40px_rgba(74,14,23,0.04)] overflow-hidden">
                <div className="divide-y divide-[#C5A059]/20">
                  {cartItems.map((item) => (
                    <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group">
                      <div className="flex items-center gap-5">
                        {item.imageUrl && (
                          <div className="w-24 h-24 rounded-2xl bg-[#241611] overflow-hidden border border-[#3D251C] shrink-0 relative shadow-inner p-1">
                            <RobustArtworkImage 
                              src={item.imageUrl}
                              seed={item.artworkId}
                              alt={item.name} 
                              className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-105" 
                            />
                          </div>
                        )}
                        <div>
                          <span className="text-[9px] uppercase tracking-[0.25em] font-cinzel px-2.5 py-0.5 rounded-full bg-[#4A0E17]/10 text-[#4A0E17] border border-[#4A0E17]/20 inline-block mb-1.5 font-bold">
                            {item.type.replace('_', ' ')}
                          </span>
                          <h3 className="font-cinzel text-xl md:text-2xl text-[#1E1412] font-semibold leading-snug group-hover:text-[#4A0E17] transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-xs font-sans text-[#1E1412]/55 mt-1">
                            Verified Provenance &amp; Certificate Included
                          </p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-4 sm:pt-0 border-t sm:border-t-0 border-[#C5A059]/15">
                        <p className="font-cinzel text-2xl text-[#1E1412] font-bold">
                          ₹{item.price.toLocaleString('en-IN')}
                        </p>
                        <button 
                          onClick={() => removeFromCart(item.id)} 
                          className="text-[#1E1412]/40 hover:text-[#4A0E17] transition-colors cursor-pointer p-2 rounded-full hover:bg-[#4A0E17]/10 flex items-center gap-1 text-xs" 
                          title="Remove from Cart"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                          <span className="sm:hidden font-sans">Remove</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-[#FAF6F0] p-8 rounded-3xl border border-[#C5A059]/35 shadow-[0_10px_40px_rgba(74,14,23,0.06)] sticky top-[140px]">
                <span className="text-[10px] uppercase tracking-[0.3em] font-cinzel text-[#4A0E17] mb-2 block font-bold">
                  Transaction Summary
                </span>
                <h4 className="font-cinzel text-2xl text-[#1E1412] font-semibold mb-6 pb-4 border-b border-[#C5A059]/20">
                  Valuation Total
                </h4>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#1E1412]/70">Subtotal</span>
                    <span className="text-[#1E1412] font-mono font-medium">₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#1E1412]/70">White-Glove Delivery</span>
                    <span className="text-[#C5A059] font-cinzel text-xs uppercase tracking-wider font-bold">Complimentary</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pb-4 border-b border-[#C5A059]/20">
                    <span className="text-[#1E1412]/70">Curatorial Insurance &amp; Tax</span>
                    <span className="text-[#1E1412]/60 text-xs font-mono">Calculated at Checkout</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2">
                    <span className="text-xs uppercase tracking-[0.2em] font-cinzel text-[#1E1412]/70 font-bold">Total Valuation</span>
                    <span className="font-cinzel text-3xl text-[#1E1412] font-bold">₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button 
                  onClick={handleProceedToAcquisition}
                  disabled={isProcessing}
                  className="w-full pill-button pill-button-bordeaux justify-center shadow-xl text-xs tracking-[0.2em] uppercase py-4 mb-4 disabled:opacity-60 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#DFC07D]">
                    {isProcessing ? 'hourglass_top' : 'verified_user'}
                  </span>
                  {isProcessing ? 'Initializing Escrow Gateway...' : 'Proceed to Secure Acquisition'}
                </button>

                <p className="text-[11px] font-sans text-[#1E1412]/50 text-center flex items-center justify-center gap-1.5 font-medium">
                  <span className="material-symbols-outlined text-[13px] text-[#C5A059]">lock</span>
                  Encrypted 256-Bit Escrow &amp; Advisory Protection
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Success Modal */}
      <PaymentSuccessModal
        isOpen={Boolean(successDetails)}
        onClose={() => setSuccessDetails(null)}
        details={successDetails}
      />
    </div>
  );
}

