import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { TkvMonogramSvg } from './KalaVaultLogo';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 4000);
  };

  return (
    <footer className="w-full bg-[#2A171D] text-[#FAF6F0] border-t border-[#C5A059]/40 mt-auto relative overflow-hidden select-none">
      
      {/* Top Gilded Accent Fillet */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C5A059] to-transparent opacity-90" />

      {/* Main Upper Container */}
      <div className="px-6 md:px-12 lg:px-16 pt-16 md:pt-20 pb-12 w-full max-w-[1600px] mx-auto relative z-10">
        
        {/* Top VIP Invitation Strip */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-12 mb-14 border-b border-[#FAF6F0]/10">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-md overflow-hidden border border-[#C5A059]/60 flex items-center justify-center shrink-0 shadow-md">
              <img src="/assets/logo.jpeg" alt="The Kala Vault" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-brand text-[17px] sm:text-[19px] uppercase tracking-[0.14em] font-bold text-[#FAF6F0] block leading-none">
                THE KALA VAULT
              </span>
            </div>
          </div>

          <div className="w-full lg:w-auto min-w-[320px] sm:min-w-[420px]">
            <AnimatePresence mode="wait">
              {subscribed ? (
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="px-5 py-2.5 bg-[#4A0E17] border border-[#C5A059]/60 flex items-center gap-2.5 text-xs text-[#DFC07D]"
                >
                  <span className="font-mono text-xs text-[#C5A059]">[CONFIRMED]</span>
                  <span className="font-cinzel font-bold">Dossier Access Confirmed</span>
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 w-full">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter corporate or private email" 
                    required
                    className="flex-1 bg-black/40 border border-[#C5A059]/35 focus:border-[#C5A059] px-4 py-2.5 text-xs text-[#FAF6F0] outline-none placeholder:text-[#FAF6F0]/40 font-sans transition-colors"
                  />
                  <button 
                    type="submit"
                    className="bg-[#4A0E17] hover:bg-[#58111A] text-[#FAF6F0] border border-[#C5A059]/50 text-[11px] py-2.5 px-6 font-cinzel uppercase tracking-[0.18em] font-bold cursor-pointer transition-colors"
                  >
                    JOIN
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 4-Column Directory Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-8 lg:gap-12 pb-10">
          
          {/* Column 1: MAIN */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-cinzel text-[11.5px] tracking-[0.25em] text-[#FAF6F0] uppercase font-bold border-b border-[#C5A059]/30 pb-2">
              MAIN
            </h4>
            <ul className="space-y-3 text-[13.5px] font-sans text-[#FAF6F0]/85 font-light">
              <li>
                <Link to="/" className="hover:text-[#DFC07D] transition-colors inline-block border-b border-transparent hover:border-[#DFC07D] pb-0.5">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-[#DFC07D] transition-colors inline-block border-b border-transparent hover:border-[#DFC07D] pb-0.5">
                  The Vault Collection
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[#DFC07D] transition-colors inline-block border-b border-transparent hover:border-[#DFC07D] pb-0.5">
                  Curatorial Protocol
                </Link>
              </li>
              <li>
                <Link to="/subscriptions" className="hover:text-[#DFC07D] transition-colors inline-block border-b border-transparent hover:border-[#DFC07D] pb-0.5">
                  Corporate Suites
                </Link>
              </li>
              <li>
                <Link to="/manifesto" className="hover:text-[#DFC07D] transition-colors inline-block border-b border-transparent hover:border-[#DFC07D] pb-0.5">
                  The Manifesto
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: CURATION & LEASING */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-cinzel text-[11.5px] tracking-[0.25em] text-[#FAF6F0] uppercase font-bold border-b border-[#C5A059]/30 pb-2">
              CURATION &amp; LEASING
            </h4>
            <ul className="space-y-3 text-[13.5px] font-sans text-[#FAF6F0]/85 font-light">
              <li>
                <Link to="/subscriptions" className="hover:text-[#DFC07D] transition-colors inline-block border-b border-transparent hover:border-[#DFC07D] pb-0.5">
                  Rotational Leasing Policy
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-[#DFC07D] transition-colors inline-block border-b border-transparent hover:border-[#DFC07D] pb-0.5">
                  Active Portfolio Cart
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-[#DFC07D] transition-colors inline-block border-b border-transparent hover:border-[#DFC07D] pb-0.5">
                  Saved Works Dossier
                </Link>
              </li>
              <li>
                <Link to="/signin" className="hover:text-[#DFC07D] transition-colors inline-block border-b border-transparent hover:border-[#DFC07D] pb-0.5">
                  Client Portal Account
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#DFC07D] transition-colors inline-block border-b border-transparent hover:border-[#DFC07D] pb-0.5">
                  Provenance &amp; Archival Certification
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: GET IN TOUCH */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-cinzel text-[11.5px] tracking-[0.25em] text-[#FAF6F0] uppercase font-bold border-b border-[#C5A059]/30 pb-2">
              GET IN TOUCH
            </h4>
            <ul className="space-y-3 text-[13.5px] font-sans text-[#FAF6F0]/85 font-light">
              <li>
                <Link to="/inquire" className="hover:text-[#DFC07D] transition-colors inline-block border-b border-transparent hover:border-[#DFC07D] pb-0.5">
                  Request Space Consultation
                </Link>
              </li>
              <li>
                <Link to="/inquire" className="hover:text-[#DFC07D] transition-colors inline-block border-b border-transparent hover:border-[#DFC07D] pb-0.5">
                  Artist Representation Application
                </Link>
              </li>
              <li>
                <a href="mailto:admin@thekalavault.com" className="hover:text-[#DFC07D] transition-colors inline-block font-mono text-[13px]">
                  admin@thekalavault.com
                </a>
              </li>
              <li>
                <a href="tel:+918855828748" className="hover:text-[#DFC07D] transition-colors inline-block font-mono text-[13px]">
                  +91 88558 28748
                </a>
              </li>
              <li className="text-[12px] text-[#FAF6F0]/65 pt-0.5 leading-relaxed">
                Unit 309, Tower A, SAS Tower, Sector 38, Gurugram, Haryana, India
              </li>
            </ul>
          </div>

          {/* Column 4: BACKGROUND / INSTITUTIONAL STATEMENT */}
          <div className="col-span-2 md:col-span-4 lg:col-span-4 space-y-4">
            <h4 className="font-cinzel text-[11.5px] tracking-[0.25em] text-[#FAF6F0] uppercase font-bold border-b border-[#C5A059]/30 pb-2">
              BACKGROUND
            </h4>
            <p className="text-[13px] text-[#FAF6F0]/85 leading-relaxed font-sans font-light">
              The Kala Vault is India's premier fine art leasing authority specializing in museum-grade original masterworks and dynamic quarterly rotational programmes.
            </p>
            <p className="text-[13px] text-[#FAF6F0]/75 leading-relaxed font-sans font-light pt-0.5">
              Through strategic institutional partnerships with master painters and master framers across the globe, we provide bespoke spatial curation and white-glove installation to flagship enterprises and private estates.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2 text-[#DFC07D]">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-7 h-7 bg-white/5 hover:bg-[#4A0E17] hover:text-[#FAF6F0] border border-[#C5A059]/30 flex items-center justify-center transition-colors text-xs font-mono"
                aria-label="Instagram"
              >
                IG
              </a>
              <a 
                href="https://pinterest.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-7 h-7 bg-white/5 hover:bg-[#4A0E17] hover:text-[#FAF6F0] border border-[#C5A059]/30 flex items-center justify-center transition-colors text-xs font-mono"
                aria-label="Pinterest"
              >
                PI
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-7 h-7 bg-white/5 hover:bg-[#4A0E17] hover:text-[#FAF6F0] border border-[#C5A059]/30 flex items-center justify-center transition-colors text-xs font-mono"
                aria-label="LinkedIn"
              >
                LI
              </a>
            </div>
          </div>

        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          SHOWSTOPPER MONUMENTAL BRAND TYPOGRAPHY (End-to-End with exact 0.5cm gap)
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="w-full overflow-hidden leading-none select-none pointer-events-none px-[0.5cm] -mb-1 sm:-mb-2 md:-mb-3 flex justify-center">
        <svg 
          viewBox="0 0 1650 165" 
          className="w-full h-auto block select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <text
            x="50%"
            y="146"
            textAnchor="middle"
            fill="#FAF6F0"
            textLength="1640"
            lengthAdjust="spacing"
            style={{
              fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif",
              fontWeight: 900,
              fontSize: '164px'
            }}
          >
            THE KALA VAULT
          </text>
        </svg>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          CONTRASTING ALABASTER SUB-FOOTER BAR
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="w-full bg-[#FAF6F0] text-[#1E1412] px-6 md:px-12 lg:px-16 py-4 border-t border-[#C5A059]/40 relative z-20">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-sans">
          
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[#4A0E17] font-bold">[TKV]</span>
            <p className="text-[#1E1412]/80">
              © {new Date().getFullYear()} The Kala Vault. All Rights Reserved.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[#1E1412]/80 font-medium">
            <Link to="/privacy" className="hover:text-[#4A0E17] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-[#4A0E17] transition-colors">
              Terms of Provenance
            </Link>
            <Link to="/inquire" className="hover:text-[#4A0E17] transition-colors">
              Curatorial Concierge
            </Link>
          </div>

        </div>
      </div>

    </footer>
  );
}
