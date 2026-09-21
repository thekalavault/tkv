import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';

export default function Inquiry() {
  const [searchParams] = useSearchParams();
  const artworkName = searchParams.get('artwork');
  const artworkArtist = searchParams.get('artist');
  
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [message, setMessage] = useState('');
  const [interest, setInterest] = useState('');
  const [fullName, setFullName] = useState('');
  const [entity, setEntity] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 ');

  useEffect(() => {
    if (artworkName) {
      setMessage(`I am interested in inquiring about "${artworkName}"${artworkArtist ? ` by ${artworkArtist}` : ''}. Please provide more details on leasing portfolios and acquisitions.`);
      setInterest('corporate-leasing');
    }
  }, [artworkName, artworkArtist]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/api/v1/support/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          entity,
          interest,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit inquiry');
      }

      setFormState('success');
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('There was an issue submitting your inquiry. Please try again.');
      setFormState('idle');
    }
  };

  return (
    <div className="bg-[#FAF6F0] text-[#1E1412] font-body-md min-h-screen selection:bg-[#C5A059]/30 flex flex-col pt-[100px] md:pt-[130px]">
      <TopNavBar />

      <main className="flex-1 w-full max-w-[1560px] mx-auto px-6 md:px-12 lg:px-16 pb-28">
        <AnimatePresence mode="wait">
          {formState === 'success' ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto text-center py-20 px-8 border border-[#C5A059]/40 bg-[#FAF6F0] flex flex-col items-center mt-10"
            >
              <span className="text-[10px] uppercase tracking-[0.3em] font-cinzel text-[#4A0E17] mb-3 font-bold">[DOSSIER DISPATCHED]</span>
              <h2 className="font-cinzel text-4xl md:text-5xl mb-4 text-[#1E1412] tracking-tight font-semibold">Inquiry Received</h2>
              <p className="text-sm md:text-base text-[#1E1412]/75 max-w-lg mx-auto leading-relaxed mb-10 font-body-md font-light">
                Your dossier has been routed to our senior curatorial committee. A principal advisor will contact you with custom spatial previews and portfolio availability.
              </p>
              <Link to="/collections" className="bg-[#4A0E17] hover:bg-[#58111A] text-[#FAF6F0] border border-[#C5A059]/40 font-cinzel text-xs uppercase tracking-[0.2em] font-bold py-3.5 px-8 transition-colors">
                Return to Gallery Archive
              </Link>
            </motion.div>
          ) : (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start pt-6"
            >
              {/* LEFT SEGMENT: Editorial Brief & Advisory Context */}
              <div className="lg:col-span-4 xl:col-span-4 space-y-8 lg:sticky lg:top-36">
                <div>
                  <div className="inline-flex items-center gap-2.5 px-3 py-1 bg-[#F5EFEB] border border-[#C5A059]/40 mb-4">
                    <span className="w-1.5 h-1.5 bg-[#4A0E17]" />
                    <span className="font-cinzel text-[10px] uppercase tracking-[0.25em] font-bold text-[#4A0E17]">
                      CURATORIAL ADVISORY
                    </span>
                  </div>

                  <h1 className="font-cinzel text-3xl sm:text-4xl lg:text-[42px] text-[#1E1412] tracking-tight leading-[1.1] mb-4 font-semibold">
                    Curate Your <br />
                    <span className="italic font-cormorant font-normal text-[#4A0E17]">
                      Spatial Atmosphere.
                    </span>
                  </h1>

                  <p className="text-sm text-[#1E1412]/75 leading-relaxed font-body-md font-light">
                    Engage our curatorial advisory for institutional leasing portfolios, museum acquisitions, or bespoke architectural scale installations.
                  </p>
                </div>

                {/* Direct Hotline */}
                <div className="space-y-3 pt-6 border-t border-[#C5A059]/25 text-xs text-[#1E1412]/80 font-sans">
                  <div>
                    <span className="font-cinzel text-[10px] uppercase tracking-[0.2em] text-[#C5A059] block font-bold mb-1">
                      Direct Advisory Hotline
                    </span>
                    <a href="tel:+918855828748" className="hover:text-[#4A0E17] font-mono transition-colors font-semibold text-sm">
                      +91 88558 28748
                    </a>
                  </div>
                  <div>
                    <span className="font-cinzel text-[10px] uppercase tracking-[0.2em] text-[#C5A059] block font-bold mb-1">
                      Curatorial Directorate
                    </span>
                    <a href="mailto:admin@thekalavault.com" className="hover:text-[#4A0E17] font-mono transition-colors font-semibold text-sm">
                      admin@thekalavault.com
                    </a>
                  </div>
                </div>
              </div>

              {/* RIGHT SEGMENT: Form */}
              <div className="lg:col-span-8 xl:col-span-8 bg-[#FAF6F0] p-8 sm:p-12 border border-[#C5A059]/35">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-cinzel text-xs font-bold text-[#1E1412] tracking-wider uppercase block">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Vikramaditya Singhania"
                        className="w-full px-4 py-3 bg-[#F5EFEB] border border-[#C5A059]/30 text-xs text-[#1E1412] placeholder:text-[#1E1412]/40 focus:border-[#4A0E17] outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="font-cinzel text-xs font-bold text-[#1E1412] tracking-wider uppercase block">
                        Organization / Estate
                      </label>
                      <input
                        type="text"
                        value={entity}
                        onChange={(e) => setEntity(e.target.value)}
                        placeholder="e.g. Taj Group or Private Residence"
                        className="w-full px-4 py-3 bg-[#F5EFEB] border border-[#C5A059]/30 text-xs text-[#1E1412] placeholder:text-[#1E1412]/40 focus:border-[#4A0E17] outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-cinzel text-xs font-bold text-[#1E1412] tracking-wider uppercase block">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. vikram@singhania.com"
                        className="w-full px-4 py-3 bg-[#F5EFEB] border border-[#C5A059]/30 text-xs text-[#1E1412] placeholder:text-[#1E1412]/40 focus:border-[#4A0E17] outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="font-cinzel text-xs font-bold text-[#1E1412] tracking-wider uppercase block">
                        Contact Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 bg-[#F5EFEB] border border-[#C5A059]/30 text-xs text-[#1E1412] placeholder:text-[#1E1412]/40 focus:border-[#4A0E17] outline-none transition-colors font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="font-cinzel text-xs font-bold text-[#1E1412] tracking-wider uppercase block">
                      Program Focus
                    </label>
                    <select
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      className="w-full px-4 py-3 bg-[#F5EFEB] border border-[#C5A059]/30 text-xs text-[#1E1412] focus:border-[#4A0E17] outline-none font-cinzel font-semibold cursor-pointer"
                    >
                      <option value="">Select Curatorial Scope</option>
                      <option value="corporate-leasing">Corporate Headquarters Leasing (20+ works)</option>
                      <option value="residential-curation">Private Estate &amp; Villa Curation</option>
                      <option value="hospitality-rotations">Luxury Hotel &amp; Resort Rotations</option>
                      <option value="direct-acquisition">Permanent Museum Piece Acquisition</option>
                      <option value="bespoke-commission">Architectural Scale Commission</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="font-cinzel text-xs font-bold text-[#1E1412] tracking-wider uppercase block">
                      Curatorial Brief / Specific Requirements
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your space dimensions, lighting conditions, preferred styles (Monochrome, Abstract, Contemporary), or specific artwork titles..."
                      className="w-full px-4 py-3 bg-[#F5EFEB] border border-[#C5A059]/30 text-xs text-[#1E1412] placeholder:text-[#1E1412]/40 focus:border-[#4A0E17] outline-none transition-colors resize-none leading-relaxed"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={formState === 'submitting'}
                      className="bg-[#4A0E17] hover:bg-[#58111A] text-[#FAF6F0] border border-[#C5A059]/40 text-xs w-full py-4 uppercase tracking-widest font-cinzel font-bold cursor-pointer transition-colors"
                    >
                      {formState === 'submitting' ? 'DISPATCHING DOSSIER...' : 'SUBMIT CURATORIAL INQUIRY'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
