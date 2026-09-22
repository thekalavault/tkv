import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ShieldCheck, Download, ArrowRight, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: {
    paymentId: string;
    orderId: string;
    amount: number;
    receipt?: string;
  } | null;
}

export const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({
  isOpen,
  onClose,
  details,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !details) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(details.paymentId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#1E1412]/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative w-full max-w-lg bg-[#FAF6F0] rounded-3xl border border-[#C5A059]/40 shadow-[0_25px_70px_rgba(74,14,23,0.35)] overflow-hidden z-10"
        >
          {/* Header Banner */}
          <div className="bg-[#4A0E17] px-8 py-7 text-center relative">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#DFC07D] to-transparent" />
            
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#36080F] border border-[#DFC07D]/40 flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-8 h-8 text-[#DFC07D]" />
            </div>

            <span className="text-[10px] uppercase font-cinzel tracking-[0.3em] text-[#DFC07D] font-bold block mb-1">
              Escrow Secured • Acquisition Confirmed
            </span>
            <h3 className="font-cinzel text-2xl text-[#FAF6F0] font-bold">
              Provenance Registered
            </h3>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.2em] font-cinzel text-[#1E1412]/60 font-semibold mb-1">
                Valuation Settled via Razorpay
              </p>
              <div className="font-cinzel text-3xl sm:text-4xl text-[#1E1412] font-bold">
                ₹{details.amount.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Receipt Summary Grid */}
            <div className="bg-white/80 rounded-2xl p-4 border border-[#C5A059]/25 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-cinzel text-[#1E1412]/60">Payment ID</span>
                <button
                  onClick={handleCopyId}
                  className="flex items-center gap-1.5 font-mono text-xs text-[#4A0E17] font-semibold hover:text-[#C5A059] transition-colors"
                  title="Copy payment ID"
                >
                  {details.paymentId}
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-cinzel text-[#1E1412]/60">Order Reference</span>
                <span className="font-mono text-xs text-[#1E1412]/80">{details.orderId}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-cinzel text-[#1E1412]/60">Custody Status</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" /> Transferred to Vault
                </span>
              </div>
            </div>

            {/* White-Glove Dispatch Notice */}
            <div className="bg-[#4A0E17]/5 rounded-2xl p-4 border border-[#4A0E17]/15">
              <h4 className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#4A0E17] mb-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#C5A059]">local_shipping</span>
                White-Glove Protocol Activated
              </h4>
              <p className="text-xs text-[#1E1412]/75 leading-relaxed font-sans">
                Our Senior Registrar is preparing your museum-grade transit documents and Certificate of Authenticity. You will receive an advisory dispatch dossier shortly.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <Link
                to="/collections"
                onClick={onClose}
                className="w-full pill-button pill-button-bordeaux justify-center shadow-lg text-xs tracking-[0.2em] uppercase py-3.5"
              >
                <span>Return to Gallery Vault</span>
                <ArrowRight className="w-4 h-4 text-[#DFC07D]" />
              </Link>
              
              <button
                onClick={onClose}
                className="w-full text-center text-xs uppercase tracking-widest font-cinzel text-[#1E1412]/60 hover:text-[#4A0E17] transition-colors py-2 font-bold"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
