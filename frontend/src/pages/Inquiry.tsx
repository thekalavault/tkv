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
    <div className="bg-paper-white text-primary font-body-lg min-h-screen selection:bg-gallery-gold/30 flex flex-col pt-[100px] md:pt-[140px]">
      
      <TopNavBar />

      <main className="flex-1 w-full max-w-[800px] mx-auto px-8 md:px-16 pb-32 mb-auto shrink-0 flex flex-col justify-center">
        
        <AnimatePresence mode="wait">
          {formState === 'success' ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 border border-outline/10 bg-subtle-smoke flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full border border-gallery-gold flex items-center justify-center mb-8">
                 <span className="material-symbols-outlined text-[32px] text-gallery-gold">check</span>
              </div>
              <h2 className="font-display-lg text-4xl mb-4 text-primary">Inquiry Received</h2>
              <p className="font-body-md text-on-surface-variant max-w-md mx-auto leading-relaxed mb-8">
                Your inquiry has been mapped to contact@thekalavault.com. A Kala Vault curator will review your request and contact you within 24 hours to schedule a private consultation.
              </p>
              <Link to="/" className="border border-outline/20 text-primary py-4 px-8 font-label-caps text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-subtle-smoke">
                 Return to Vault
              </Link>
            </motion.div>
          ) : (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full"
            >
              <div className="text-center mb-16">
                <span className="font-label-caps text-[10px] uppercase tracking-[0.3em] text-gallery-gold mb-6 block">Private Consultation</span>
                <h1 className="font-display-lg text-4xl md:text-6xl text-primary tracking-tight mb-6">Curate Your Environment</h1>
                <p className="font-headline-md italic text-on-surface-variant text-xl md:text-2xl max-w-2xl mx-auto">
                  Connect with our advisory team to discuss leasing portfolios, permanent acquisitions, or bespoke architectural installations.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 md:p-12 border border-outline/5 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="font-label-caps text-[10px] uppercase tracking-[0.2em] text-primary/60">Full Name</label>
                    <input 
                      required 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="border-b border-outline/20 py-3 bg-transparent font-body-md text-primary outline-none focus:border-gallery-gold transition-colors" 
                      placeholder="Jane Doe" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-caps text-[10px] uppercase tracking-[0.2em] text-primary/60">Corporate Entity / Organization</label>
                    <input 
                      type="text" 
                      value={entity}
                      onChange={(e) => setEntity(e.target.value)}
                      className="border-b border-outline/20 py-3 bg-transparent font-body-md text-primary outline-none focus:border-gallery-gold transition-colors" 
                      placeholder="Acme Corp" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="font-label-caps text-[10px] uppercase tracking-[0.2em] text-primary/60">Professional Email</label>
                    <input 
                      required 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-b border-outline/20 py-3 bg-transparent font-body-md text-primary outline-none focus:border-gallery-gold transition-colors" 
                      placeholder="jane@acme.com" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-caps text-[10px] uppercase tracking-[0.2em] text-primary/60">Phone Number (Optional)</label>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="border-b border-outline/20 py-3 bg-transparent font-body-md text-primary outline-none focus:border-gallery-gold transition-colors" 
                      placeholder="+91 98765 43210" 
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label-caps text-[10px] uppercase tracking-[0.2em] text-primary/60">Inquiry Type</label>
                  <div className="relative">
                    <select 
                      required 
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      className="w-full border-b border-outline/20 py-3 bg-transparent font-body-md text-primary outline-none focus:border-gallery-gold transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select an area of interest</option>
                      <option value="corporate-leasing">Corporate Portfolio Leasing (Subscriptions)</option>
                      <option value="direct-acquisition">Direct Acquisition of Artwork</option>
                      <option value="architectural-scale">Architectural Scale Commission</option>
                      <option value="general">General Advisory</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-primary/50 text-[20px]">expand_more</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label-caps text-[10px] uppercase tracking-[0.2em] text-primary/60">Message / Context</label>
                  <textarea 
                    required 
                    rows={4} 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="border border-outline/20 p-4 bg-transparent font-body-md text-primary outline-none focus:border-gallery-gold transition-colors resize-none mt-2" 
                    placeholder="Tell us about your space, aesthetic preferences, or specific pieces of interest..."
                  ></textarea>
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={formState === 'submitting'}
                    className="bg-primary text-paper-white py-4 px-10 font-label-caps text-[11px] uppercase tracking-[0.2em] transition-all hover:bg-black/80 rounded-sm shadow-xl flex items-center gap-3 disabled:opacity-70 disabled:cursor-wait"
                  >
                     {formState === 'submitting' ? 'Submitting...' : 'Submit Inquiry'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
