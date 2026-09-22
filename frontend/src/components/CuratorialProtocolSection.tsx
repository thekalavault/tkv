import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';

interface ProtocolPillar {
  id: string;
  numeral: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  points: string[];
  img: string;
  badge: string;
}

const PROTOCOL_PILLARS: ProtocolPillar[] = [
  {
    id: 'cartography',
    numeral: 'I',
    category: 'Spatial Mapping',
    title: 'Spatial & Lux Cartography',
    subtitle: 'Volumetric audit & diurnal light analysis',
    description: 'Before installation, our curatorial architects conduct a forensic spatial scan of your interior geometry—evaluating ceiling heights, wall sightlines, and ambient lux exposure across morning and evening light cycles to ensure optimal ocular harmony.',
    points: [
      'Diurnal spectral lux & photometric UV preservation audit',
      'Sightline choreography connecting foyers, salons & executive suites',
      'Sub-millimeter laser-calibrated spatial balance mapping'
    ],
    img: '/assets/protocol_01_spatial_mapping.jpg',
    badge: '3D Laser Survey'
  },
  {
    id: 'accession',
    numeral: 'II',
    category: 'Vault Accession',
    title: 'Vault Accession & Provenance',
    subtitle: 'Institutional curation & masterwork registry',
    description: 'Unsealing private institutional reserves and authenticated master studios to curate a bespoke accession portfolio tailored specifically to your architectural aesthetic, corporate identity, and spatial prestige.',
    points: [
      'Forensic chain-of-custody documentation with lifetime authenticity',
      'Bespoke leatherbound accession dossier with artist monographs',
      '100% OPEX tax-deductible curatorial leasing with rent-to-own equity'
    ],
    img: '/assets/protocol_02_vault_accession.jpg',
    badge: 'Lifetime Provenance'
  },
  {
    id: 'conservation',
    numeral: 'III',
    category: 'Archival Conservation',
    title: 'Conservation & Tru-Vue Glazing',
    subtitle: 'Museum preservation & bespoke joinery',
    description: 'Every masterwork is preserved with 99.8% UV-protective Tru-Vue museum glass, 8-ply acid-free 100% cotton rag matting, and hand-finished solid hardwood profiles tailored to your interiors.',
    points: [
      'Tru-Vue anti-reflective museum glass eliminating glare & fading',
      'Hermetically sealed microclimate vapor barrier against humidity',
      'Hand-finished walnut, charred ash & 24K gold-leaf profiles'
    ],
    img: '/assets/protocol_03_archival_conservation.jpg',
    badge: '99.8% UV Glazing'
  },
  {
    id: 'installation',
    numeral: 'IV',
    category: 'Laser Installation',
    title: 'Laser-Calibrated Mounting',
    subtitle: 'Off-hours white-glove deployment',
    description: 'Executed quietly outside operational business hours by certified museum art handlers using dual-axis laser leveling and concealed heavy-duty architectural mounting hardware.',
    points: [
      'Concealed seismic French cleat systems with 150kg load rating',
      'Photometric museum spotlight calibration matching 3000K warmth',
      'Turnkey overnight execution ensuring zero business disruption'
    ],
    img: '/assets/protocol_04_laser_installation.jpg',
    badge: '150kg Anti-Theft Cleats'
  },
  {
    id: 'rotation',
    numeral: 'V',
    category: 'Dynamic Rotations',
    title: 'Dynamic Rotations & Care',
    subtitle: 'Perpetual gallery evolution & conservation',
    description: 'Maintain continuous visual vitality with scheduled collection rotations every 90 to 180 days, accompanied by regular on-site condition reports and digital cataloging.',
    points: [
      'Scheduled seasonal collection refreshes for perpetual novelty',
      'Regular on-site condition inspections & archival surface care',
      'Private collector portal with complete provenance & appraisal records'
    ],
    img: '/assets/protocol_05_dynamic_rotations.jpg',
    badge: 'Quarterly Refresh'
  }
];

export default function CuratorialProtocolSection() {
  const [activeIdx, setActiveIdx] = useState(0); // Default to Spatial Mapping
  const [isPaused, setIsPaused] = useState(false);
  const current = PROTOCOL_PILLARS[activeIdx];

  // Subtle auto-rotation when user is not interacting
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % PROTOCOL_PILLARS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % PROTOCOL_PILLARS.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + PROTOCOL_PILLARS.length) % PROTOCOL_PILLARS.length);
  };

  return (
    <section 
      className="bg-gradient-to-b from-[#38080E] via-[#4A0E17] to-[#2B050A] text-[#FAF6F0] py-14 md:py-20 px-4 sm:px-8 md:px-12 border-t border-[#C5A059]/30 select-none relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Subtle Classical Background Watermark Ornament */}
      <div className="absolute -right-32 -top-32 w-[550px] h-[550px] rounded-full border border-[#DFC07D]/10 pointer-events-none opacity-30 flex items-center justify-center">
        <div className="w-[420px] h-[420px] rounded-full border border-dashed border-[#DFC07D]/15" />
      </div>

      <div className="max-w-[1480px] mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#DFC07D]/25">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 mb-1.5">
              <span className="h-[1px] w-8 bg-[#DFC07D]" />
              <span className="font-cinzel text-[10.5px] uppercase tracking-[0.35em] text-[#DFC07D] font-semibold">
                White-Glove Methodology
              </span>
              <span className="h-[1px] w-8 bg-[#DFC07D]" />
            </div>
            
            <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl text-white font-semibold tracking-tight leading-tight">
              The Five Pillars of <span className="font-cormorant italic font-normal text-[#DFC07D]">Curatorial Protocol</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <p className="hidden lg:block text-xs sm:text-sm text-[#FAF6F0]/80 max-w-xs text-right font-cormorant italic text-base">
              Executed exclusively by certified museum conservators and art handlers.
            </p>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="w-9 h-9 rounded-full border border-[#DFC07D]/40 hover:border-[#DFC07D] bg-[#5E121D] hover:bg-[#DFC07D] text-[#FAF6F0] hover:text-[#241611] flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer"
                title="Previous Pillar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="w-9 h-9 rounded-full border border-[#DFC07D]/40 hover:border-[#DFC07D] bg-[#5E121D] hover:bg-[#DFC07D] text-[#FAF6F0] hover:text-[#241611] flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer"
                title="Next Pillar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────────────────
            TOP INTERACTIVE PILLAR SELECTOR TABS WITH ANIMATED GOLD INDICATOR
            ───────────────────────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 mb-6">
          {PROTOCOL_PILLARS.map((pillar, idx) => {
            const isActive = activeIdx === idx;
            return (
              <button
                key={pillar.id}
                onClick={() => setActiveIdx(idx)}
                className={`relative px-3.5 py-3 rounded-xl text-left border transition-all duration-300 cursor-pointer overflow-hidden group ${
                  isActive
                    ? 'bg-[#5E121D] border-[#DFC07D] shadow-[0_8px_25px_rgba(0,0,0,0.35)]'
                    : 'bg-[#3A070D]/70 border-[#DFC07D]/20 hover:border-[#DFC07D]/50 hover:bg-[#5E121D]/50'
                }`}
              >
                {/* Active Gold Top Highlight Bar */}
                {isActive && (
                  <motion.div
                    layoutId="activePillarTabRed"
                    className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#DFC07D] via-[#FFF3D6] to-[#C5A059]"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}

                <div className="flex items-center justify-between mb-1">
                  <span className={`font-cormorant italic font-bold text-xs ${isActive ? 'text-[#DFC07D]' : 'text-[#DFC07D]/70'}`}>
                    {pillar.numeral}
                  </span>
                  <span className="font-cinzel text-[9px] uppercase tracking-wider text-[#FAF6F0]/60 font-semibold">
                    {pillar.category}
                  </span>
                </div>

                <div className={`font-cinzel text-xs sm:text-[12.5px] font-semibold tracking-wide truncate ${isActive ? 'text-white' : 'text-[#FAF6F0]/90 group-hover:text-white'}`}>
                  {pillar.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* ─────────────────────────────────────────────────────────────────────────────
            MAIN ANIMATED STAGE SHOWCASE (EDITORIAL MONOGRAPH & FLOATING MUSEUM FRAME)
            ───────────────────────────────────────────────────────────────────────────── */}
        <div className="bg-[#38080E]/90 rounded-3xl border border-[#DFC07D]/35 shadow-[0_20px_50px_rgba(0,0,0,0.4)] p-6 sm:p-8 md:p-9 overflow-hidden relative backdrop-blur-sm">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column (7 cols): Editorial Prose with Smooth AnimatePresence */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="space-y-4"
                >
                  {/* Roman Numeral & Category */}
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-full bg-[#5E121D] border border-[#DFC07D]/50 flex items-center justify-center font-cormorant italic font-bold text-sm text-[#DFC07D] shadow-xs">
                      {current.numeral}
                    </span>
                    <span className="font-cinzel text-xs uppercase tracking-[0.25em] text-[#DFC07D] font-bold">
                      {current.category}
                    </span>
                    <span className="h-px w-10 bg-[#DFC07D]/30" />
                    <span className="font-cormorant italic text-xs text-[#FAF6F0]/70 font-semibold">
                      {current.badge}
                    </span>
                  </div>

                  {/* Title & Italic Subtitle */}
                  <div>
                    <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-white leading-tight mb-1">
                      {current.title}
                    </h3>
                    <p className="font-cormorant italic text-base sm:text-lg text-[#DFC07D] font-normal">
                      {current.subtitle}
                    </p>
                  </div>

                  {/* Curatorial Prose (Pure Cormorant Garamond Serif) */}
                  <p className="font-cormorant text-[16px] sm:text-[17.5px] text-[#FAF6F0]/90 leading-relaxed font-normal">
                    {current.description}
                  </p>

                  {/* Curatorial Benchmarks */}
                  <div className="pt-3.5 border-t border-[#DFC07D]/20 space-y-2">
                    {current.points.map((point, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2.5">
                        <span className="text-[#DFC07D] font-cinzel font-bold text-xs select-none shrink-0 mt-0.5">—</span>
                        <span className="font-cormorant text-[15px] sm:text-[16px] text-[#FAF6F0]/95 leading-snug italic font-normal">
                          {point}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Column (5 cols): Pure High-Resolution Photography */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/3.4] rounded-2xl overflow-hidden bg-[#1E0407] border border-[#DFC07D]/30 shadow-[0_15px_45px_rgba(0,0,0,0.5)] group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={current.img}
                    src={current.img}
                    alt={current.title}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </AnimatePresence>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
