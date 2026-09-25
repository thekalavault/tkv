import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

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
    <footer className="w-full bg-[#1F1116] text-[#FAF6F0] border-t border-[#C5A059]/40 mt-auto relative overflow-hidden select-none">
      
      {/* Top Gilded Accent Fillet */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C5A059] to-transparent opacity-90" />

      {/* Main Container */}
      <div className="px-6 md:px-12 lg:px-16 pt-16 md:pt-20 pb-12 w-full max-w-[1600px] mx-auto relative z-10">
        
        {/* Top VIP Invitation Strip */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-12 mb-14 border-b border-[#FAF6F0]/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#C5A059]/60 flex items-center justify-center shrink-0 shadow-lg bg-black/40">
              <img src="/assets/logo.jpeg" alt="The Kala Vault" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-brand text-[18px] sm:text-[21px] uppercase tracking-[0.14em] font-bold text-[#FAF6F0] block leading-none">
                THE KALA VAULT
              </span>
              <span className="font-cinzel text-[9.5px] uppercase tracking-[0.28em] text-[#C5A059] block mt-1.5 font-semibold">
                FINE ART ROTATIONAL LEASING &amp; ACQUISITION
              </span>
            </div>
          </div>

          <div className="w-full lg:w-auto min-w-[320px] sm:min-w-[440px]">
            <AnimatePresence mode="wait">
              {subscribed ? (
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="px-6 py-3 bg-[#4A0E17] border border-[#C5A059]/60 flex items-center gap-3 text-xs text-[#DFC07D] rounded-sm"
                >
                  <span className="font-mono text-xs text-[#C5A059]">[CONFIRMED]</span>
                  <span className="font-cinzel font-bold">Curatorial Dossier Access Granted</span>
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 w-full">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter private or institutional email" 
                    required
                    className="flex-1 bg-black/40 border border-[#C5A059]/35 focus:border-[#C5A059] px-4 py-3 text-xs text-[#FAF6F0] outline-none placeholder:text-[#FAF6F0]/40 font-sans transition-colors rounded-sm"
                  />
                  <button 
                    type="submit"
                    className="bg-[#4A0E17] hover:bg-[#5C131E] text-[#FAF6F0] border border-[#C5A059]/60 text-[11px] py-3 px-7 font-cinzel uppercase tracking-[0.2em] font-bold cursor-pointer transition-all duration-300 shadow-md hover:shadow-[0_0_15px_rgba(197,160,89,0.3)] shrink-0 rounded-sm"
                  >
                    SUBSCRIBE
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 4-Column Balanced Directory Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12">
          
          {/* Column 1: DIRECTORY */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-cinzel text-[11px] tracking-[0.28em] text-[#C5A059] uppercase font-bold border-b border-[#C5A059]/30 pb-2">
              NAVIGATION
            </h4>
            <ul className="space-y-2.5 text-[13.5px] font-sans text-[#FAF6F0]/80 font-light">
              <li>
                <Link to="/" className="hover:text-[#DFC07D] transition-colors inline-block hover:translate-x-1 duration-200">
                  Home Exhibition
                </Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-[#DFC07D] transition-colors inline-block hover:translate-x-1 duration-200">
                  The Vault Catalog
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[#DFC07D] transition-colors inline-block hover:translate-x-1 duration-200">
                  Curatorial Protocol
                </Link>
              </li>
              <li>
                <Link to="/subscriptions" className="hover:text-[#DFC07D] transition-colors inline-block hover:translate-x-1 duration-200">
                  Corporate Suites
                </Link>
              </li>
              <li>
                <Link to="/manifesto" className="hover:text-[#DFC07D] transition-colors inline-block hover:translate-x-1 duration-200">
                  The Manifesto
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: CURATION & LEASING */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-cinzel text-[11px] tracking-[0.28em] text-[#C5A059] uppercase font-bold border-b border-[#C5A059]/30 pb-2">
              LEASING &amp; ADVISORY
            </h4>
            <ul className="space-y-2.5 text-[13.5px] font-sans text-[#FAF6F0]/80 font-light">
              <li>
                <Link to="/subscriptions" className="hover:text-[#DFC07D] transition-colors inline-block hover:translate-x-1 duration-200">
                  Rotational Leasing Framework
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-[#DFC07D] transition-colors inline-block hover:translate-x-1 duration-200">
                  Selected Works Dossier
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-[#DFC07D] transition-colors inline-block hover:translate-x-1 duration-200">
                  Curated Wishlist
                </Link>
              </li>
              <li>
                <Link to="/signin" className="hover:text-[#DFC07D] transition-colors inline-block hover:translate-x-1 duration-200">
                  Private Patron Portal
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#DFC07D] transition-colors inline-block hover:translate-x-1 duration-200">
                  Provenance &amp; Archival Integrity
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: CURATORIAL CONCIERGE (Elegant Luxury Contact Bars) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-cinzel text-[11px] tracking-[0.28em] text-[#C5A059] uppercase font-bold border-b border-[#C5A059]/30 pb-2">
              CURATORIAL CONCIERGE
            </h4>
            
            <div className="space-y-2.5 pt-1">
              {/* WhatsApp Direct Line */}
              <a 
                href="https://wa.me/918855828748?text=Hello%20The%20Kala%20Vault%2C%20I%20would%20like%20to%20inquire%20about%20your%20fine%20art%20collection." 
                target="_blank" 
                rel="noreferrer"
                className="group flex items-center justify-between p-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-[#C5A059]/30 hover:border-[#25D366]/80 transition-all duration-300"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#128C7E]/25 border border-[#25D366]/40 flex items-center justify-center shrink-0 group-hover:bg-[#25D366] text-[#25D366] group-hover:text-white transition-all duration-300">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.974.531 1.83.811 2.802.812h.005c3.18 0 5.767-2.586 5.768-5.766 0-1.54-.6-2.988-1.69-4.078-1.09-1.09-2.538-1.69-4.089-1.72zm3.376 8.21c-.14.394-.813.729-1.127.777-.314.048-.714.07-1.157-.074-.28-.09-.64-.208-1.107-.412-1.954-.852-3.219-2.827-3.316-2.958-.098-.13-.795-1.056-.795-2.01 0-.955.5-1.425.68-1.621.18-.196.393-.245.524-.245.131 0 .262.001.377.007.121.006.284-.046.444.337.164.393.557 1.36.607 1.458.049.098.082.213.016.344-.065.13-.098.213-.196.328-.098.115-.207.256-.296.344-.098.098-.201.205-.086.402.115.197.511.844 1.096 1.366.753.671 1.388.878 1.585.976.197.098.312.082.427-.049.115-.131.492-.573.623-.77.131-.197.262-.164.443-.098.18.066 1.147.541 1.344.64.197.098.328.147.377.23.049.082.049.475-.091.869z"/>
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.176L2 22l4.981-1.309A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.05c-1.616 0-3.13-.48-4.407-1.306l-.316-.205-2.973.78.793-2.898-.225-.357A8.006 8.006 0 014 12c0-4.411 3.589-8.05 8-8.05s8 3.639 8 8.05-3.589 8.05-8 8.05z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-cinzel text-[10px] uppercase tracking-wider text-[#DFC07D] font-bold">WHATSAPP ADVISORY</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                    </div>
                    <p className="font-mono text-[13.5px] text-[#FAF6F0] font-semibold">
                      +91 88558 28748
                    </p>
                  </div>
                </div>
                <span className="font-cinzel text-[10.5px] text-[#DFC07D] tracking-wider uppercase font-semibold opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  Chat →
                </span>
              </a>

              {/* Instagram Official */}
              <a 
                href="https://www.instagram.com/the.kala.vault" 
                target="_blank" 
                rel="noreferrer"
                className="group flex items-center justify-between p-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-[#C5A059]/30 hover:border-[#E1306C]/80 transition-all duration-300"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#E1306C]/20 border border-[#E1306C]/40 flex items-center justify-center shrink-0 group-hover:bg-[#E1306C] text-[#E1306C] group-hover:text-white transition-all duration-300">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="font-cinzel text-[10px] uppercase tracking-wider text-[#DFC07D] font-bold block">OFFICIAL INSTAGRAM</span>
                    <p className="font-sans text-[13.5px] text-[#FAF6F0] font-medium">
                      @the.kala.vault
                    </p>
                  </div>
                </div>
                <span className="font-cinzel text-[10.5px] text-[#DFC07D] tracking-wider uppercase font-semibold opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  Follow →
                </span>
              </a>

              {/* Direct Telephone */}
              <a 
                href="tel:+918855828748" 
                className="group flex items-center justify-between p-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-[#C5A059]/30 hover:border-[#DFC07D]/80 transition-all duration-300"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center shrink-0 group-hover:bg-[#C5A059] text-[#DFC07D] group-hover:text-[#1E1412] transition-all duration-300">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.053 15.053 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1.01A11.36 11.36 0 018.57 3.9c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.52c0-.55-.45-1-.99-1z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="font-cinzel text-[10px] uppercase tracking-wider text-[#DFC07D] font-bold block">DIRECT TELEPHONE</span>
                    <p className="font-mono text-[13.5px] text-[#FAF6F0] font-semibold">
                      +91 88558 28748
                    </p>
                  </div>
                </div>
                <span className="font-cinzel text-[10.5px] text-[#DFC07D] tracking-wider uppercase font-semibold opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  Call →
                </span>
              </a>

              {/* Email Desk */}
              <a 
                href="mailto:admin@thekalavault.com" 
                className="group flex items-center justify-between p-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-[#C5A059]/30 hover:border-[#007AFF]/80 transition-all duration-300"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#007AFF]/20 border border-[#007AFF]/40 flex items-center justify-center shrink-0 group-hover:bg-[#007AFF] text-[#007AFF] group-hover:text-white transition-all duration-300">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="font-cinzel text-[10px] uppercase tracking-wider text-[#DFC07D] font-bold block">CURATORIAL INBOX</span>
                    <p className="font-mono text-[13.5px] text-[#FAF6F0] font-medium">
                      admin@thekalavault.com
                    </p>
                  </div>
                </div>
                <span className="font-cinzel text-[10.5px] text-[#DFC07D] tracking-wider uppercase font-semibold opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  Write →
                </span>
              </a>
            </div>
          </div>

          {/* Column 4: INSTITUTIONAL BACKGROUND & ADDRESS */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-cinzel text-[11px] tracking-[0.28em] text-[#C5A059] uppercase font-bold border-b border-[#C5A059]/30 pb-2">
              ABOUT THE VAULT
            </h4>
            <p className="text-[13px] text-[#FAF6F0]/80 leading-relaxed font-sans font-light">
              The Kala Vault is India's premier fine art rotational authority specializing in museum-grade original masterworks and dynamic quarterly rotational programmes for flagship enterprises and private estates.
            </p>
            
            <div className="pt-2 border-t border-[#C5A059]/20 space-y-2">
              <span className="font-cinzel text-[10px] uppercase tracking-widest text-[#DFC07D] font-bold block">
                FLAGSHIP SALON &amp; VAULT
              </span>
              <p className="text-[12.5px] text-[#FAF6F0]/70 leading-relaxed font-sans">
                Unit 309, Tower A, SAS Tower, Sector 38, Gurugram, Haryana, India
              </p>
            </div>

            {/* Refined Gilded Mini-Icons for Quick Access */}
            <div className="pt-2 flex items-center gap-2.5">
              <a 
                href="https://www.instagram.com/the.kala.vault" 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-full border border-[#C5A059]/40 bg-white/[0.04] hover:bg-[#C5A059] text-[#DFC07D] hover:text-[#1F1116] flex items-center justify-center transition-all duration-300"
                aria-label="Instagram"
                title="Follow @the.kala.vault on Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              <a 
                href="https://wa.me/918855828748?text=Hello%20The%20Kala%20Vault%2C%20I%20would%20like%20to%20inquire%20about%20your%20fine%20art%20collection." 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-full border border-[#C5A059]/40 bg-white/[0.04] hover:bg-[#25D366] text-[#DFC07D] hover:text-white flex items-center justify-center transition-all duration-300"
                aria-label="WhatsApp"
                title="Message on WhatsApp: +91 88558 28748"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.974.531 1.83.811 2.802.812h.005c3.18 0 5.767-2.586 5.768-5.766 0-1.54-.6-2.988-1.69-4.078-1.09-1.09-2.538-1.69-4.089-1.72zm3.376 8.21c-.14.394-.813.729-1.127.777-.314.048-.714.07-1.157-.074-.28-.09-.64-.208-1.107-.412-1.954-.852-3.219-2.827-3.316-2.958-.098-.13-.795-1.056-.795-2.01 0-.955.5-1.425.68-1.621.18-.196.393-.245.524-.245.131 0 .262.001.377.007.121.006.284-.046.444.337.164.393.557 1.36.607 1.458.049.098.082.213.016.344-.065.13-.098.213-.196.328-.098.115-.207.256-.296.344-.098.098-.201.205-.086.402.115.197.511.844 1.096 1.366.753.671 1.388.878 1.585.976.197.098.312.082.427-.049.115-.131.492-.573.623-.77.131-.197.262-.164.443-.098.18.066 1.147.541 1.344.64.197.098.328.147.377.23.049.082.049.475-.091.869z"/>
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.176L2 22l4.981-1.309A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.05c-1.616 0-3.13-.48-4.407-1.306l-.316-.205-2.973.78.793-2.898-.225-.357A8.006 8.006 0 014 12c0-4.411 3.589-8.05 8-8.05s8 3.639 8 8.05-3.589 8.05-8 8.05z"/>
                </svg>
              </a>

              <a 
                href="tel:+918855828748" 
                className="w-9 h-9 rounded-full border border-[#C5A059]/40 bg-white/[0.04] hover:bg-[#C5A059] text-[#DFC07D] hover:text-[#1F1116] flex items-center justify-center transition-all duration-300"
                aria-label="Phone"
                title="Call Concierge: +91 88558 28748"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.053 15.053 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1.01A11.36 11.36 0 018.57 3.9c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.52c0-.55-.45-1-.99-1z"/>
                </svg>
              </a>

              <a 
                href="mailto:admin@thekalavault.com" 
                className="w-9 h-9 rounded-full border border-[#C5A059]/40 bg-white/[0.04] hover:bg-[#C5A059] text-[#DFC07D] hover:text-[#1F1116] flex items-center justify-center transition-all duration-300"
                aria-label="Email"
                title="Email Concierge: admin@thekalavault.com"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
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
