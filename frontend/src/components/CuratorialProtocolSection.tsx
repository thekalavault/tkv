import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, 
  ChevronLeft, 
  ArrowRight, 
  Compass, 
  ShieldCheck, 
  Sparkles, 
  Hammer, 
  RefreshCw,
  CheckCircle2,
  Pause,
  Play
} from 'lucide-react';

interface ProtocolStage {
  id: string;
  shortName: string;
  category: string;
  title: string;
  lead: string;
  keyPoints: string[];
  metrics: { label: string; value: string }[];
  img: string;
  iconType: 'compass' | 'shield' | 'sparkles' | 'hammer' | 'refresh';
}

const PROTOCOL_STAGES: ProtocolStage[] = [
  {
    id: 'cartography',
    shortName: 'Spatial Mapping',
    category: 'Spatial & Lux Mapping',
    title: 'Precision 3D Spatial & Lux Analysis',
    lead: 'Precision architectural spatial audit analyzing ceiling elevations, wall sightlines, and ambient lux exposure across morning and evening light cycles.',
    keyPoints: [
      'Volumetric 3D spatial scan with ±0.5mm mounting precision',
      'Spectral lux analysis protecting delicate pigments from UV glare',
      'Curatorial sightline strategy connecting atriums, boardrooms & salons'
    ],
    metrics: [
      { label: 'Spatial Precision', value: '±0.5mm Laser' },
      { label: 'Light Audit', value: 'Spectral Lux' },
      { label: 'Turnaround', value: '24 Hours' }
    ],
    img: '/assets/spatial_transformation_bg.jpg',
    iconType: 'compass'
  },
  {
    id: 'accession',
    shortName: 'Vault Accession',
    category: 'Vault Accession & Provenance',
    title: 'Curated Access to Institutional Masterworks',
    lead: 'Unsealing private institutional vaults and certified contemporary artist studios to curate a bespoke collection tailored to your spatial prestige.',
    keyPoints: [
      'Forensic chain-of-custody documentation and lifetime authenticity',
      'Bespoke accession dossier with high-res artist plates',
      '100% OPEX tax-deductible leasing and rent-to-own equity'
    ],
    metrics: [
      { label: 'Authenticity', value: '100% Lifetime' },
      { label: 'Private Catalog', value: '44+ Masterworks' },
      { label: 'Tax Advisory', value: '100% OPEX' }
    ],
    img: '/assets/curator_white_glove.jpg',
    iconType: 'shield'
  },
  {
    id: 'conservation',
    shortName: 'Conservation',
    category: 'Museum Conservation & Framing',
    title: 'Archival Conservation & Tru-Vue Glazing',
    lead: 'Every accession is preserved with 99.8% UV-blocking Tru-Vue museum glass, 8-ply acid-free cotton mats, and hand-rubbed sustainable hardwood frames.',
    keyPoints: [
      'Tru-Vue 99.8% UV-protective crystal clear anti-reflective glass',
      'Hermetic microclimate vapor seals against humidity fluctuations',
      'Hand-finished teak, charred ash, and 24K gold-accent profiles'
    ],
    metrics: [
      { label: 'UV Rejection', value: '99.8% Tru-Vue' },
      { label: 'Matting', value: 'Acid-Free Rag' },
      { label: 'Standard', value: 'ISO-9706' }
    ],
    img: '/assets/keyhole_magnifier_art.jpg',
    iconType: 'sparkles'
  },
  {
    id: 'installation',
    shortName: 'Laser Mounting',
    category: 'Laser-Calibrated Mounting',
    title: 'Zero-Disruption White-Glove Mounting',
    lead: 'Executed outside standard operational hours by certified art handlers using dual-axis laser leveling and 150kg subterranean anti-theft cleats.',
    keyPoints: [
      'Concealed heavy-duty French cleats with 150kg seismic capacity',
      'Directional 3000K museum spot luminaire calibration',
      'Overnight turnkey handover with official condition reports'
    ],
    metrics: [
      { label: 'Mounting Anchor', value: '150kg Cleats' },
      { label: 'Alignment', value: '< 0.5mm Laser' },
      { label: 'Execution', value: 'Off-Hours Zero' }
    ],
    img: '/assets/corporate_boardroom_art.jpg',
    iconType: 'hammer'
  },
  {
    id: 'rotation',
    shortName: 'Quarterly Refresh',
    category: 'Living Gallery Rotation',
    title: 'Dynamic Rotations & Continuous Care',
    lead: 'Curated collection rotations every 90 to 180 days with regular on-site inspections, microclimate checks, and digital client vault management.',
    keyPoints: [
      'Quarterly seasonal swaps keeping public environments perpetually fresh',
      'Continuous on-site conservation care, dusting, and frame maintenance',
      'Private digital client portal tracking provenance history & rotation schedules'
    ],
    metrics: [
      { label: 'Refresh Cadence', value: '90–180 Days' },
      { label: 'Audit Matrix', value: '48-Point Check' },
      { label: 'Client Portal', value: '24/7 Access' }
    ],
    img: '/assets/dining_bistro_art.jpg',
    iconType: 'refresh'
  }
];

const AUTOPLAY_INTERVAL = 5000; // 5 seconds per step

function AnimatedStageIcon({ type, isActive }: { type: ProtocolStage['iconType']; isActive: boolean }) {
  if (type === 'compass') {
    return (
      <motion.div
        animate={isActive ? { rotate: [-24, 24, -12, 12, 0] } : { rotate: 0 }}
        transition={isActive ? { repeat: Infinity, duration: 2.8, ease: 'easeInOut' } : { duration: 0.3 }}
        className="inline-flex items-center justify-center"
      >
        <Compass className={`w-4 h-4 ${isActive ? 'text-[#DFC07D]' : 'text-[#7B2431]/80'}`} />
      </motion.div>
    );
  }
  if (type === 'shield') {
    return (
      <motion.div
        animate={isActive ? { scale: [1, 1.18, 1], filter: ['drop-shadow(0 0 0px #DFC07D)', 'drop-shadow(0 0 4px #DFC07D)', 'drop-shadow(0 0 0px #DFC07D)'] } : { scale: 1 }}
        transition={isActive ? { repeat: Infinity, duration: 2.2, ease: 'easeInOut' } : { duration: 0.3 }}
        className="inline-flex items-center justify-center"
      >
        <ShieldCheck className={`w-4 h-4 ${isActive ? 'text-[#DFC07D]' : 'text-[#7B2431]/80'}`} />
      </motion.div>
    );
  }
  if (type === 'sparkles') {
    return (
      <motion.div
        animate={isActive ? { rotate: [0, 15, -15, 0], scale: [0.95, 1.2, 0.95] } : { rotate: 0, scale: 1 }}
        transition={isActive ? { repeat: Infinity, duration: 2.4, ease: 'easeInOut' } : { duration: 0.3 }}
        className="inline-flex items-center justify-center"
      >
        <Sparkles className={`w-4 h-4 ${isActive ? 'text-[#DFC07D]' : 'text-[#7B2431]/80'}`} />
      </motion.div>
    );
  }
  if (type === 'hammer') {
    return (
      <motion.div
        animate={isActive ? { rotate: [0, -22, 6, 0] } : { rotate: 0 }}
        transition={isActive ? { repeat: Infinity, duration: 1.8, ease: 'easeInOut' } : { duration: 0.3 }}
        className="inline-flex items-center justify-center"
      >
        <Hammer className={`w-4 h-4 ${isActive ? 'text-[#DFC07D]' : 'text-[#7B2431]/80'}`} />
      </motion.div>
    );
  }
  // Refresh
  return (
    <motion.div
      animate={isActive ? { rotate: 360 } : { rotate: 0 }}
      transition={isActive ? { repeat: Infinity, duration: 3, ease: 'linear' } : { duration: 0.3 }}
      className="inline-flex items-center justify-center"
    >
      <RefreshCw className={`w-4 h-4 ${isActive ? 'text-[#DFC07D]' : 'text-[#7B2431]/80'}`} />
    </motion.div>
  );
}

export default function CuratorialProtocolSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const stage = PROTOCOL_STAGES[activeIdx];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance to next step every 5 seconds (paused when hovered)
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % PROTOCOL_STAGES.length);
    }, AUTOPLAY_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, activeIdx]);

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % PROTOCOL_STAGES.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + PROTOCOL_STAGES.length) % PROTOCOL_STAGES.length);
  };

  return (
    <section 
      className="bg-[#FAF6F0] text-[#1E1412] py-16 md:py-22 px-4 sm:px-8 md:px-12 border-t border-[#C5A059]/25 relative overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      
      <div className="max-w-[1440px] mx-auto relative z-10">
        
        {/* Header with Auto-play indicator */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-5 border-b border-[#C5A059]/30">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#7B2431]" />
              <span className="font-cinzel text-[10.5px] uppercase tracking-[0.28em] text-[#7B2431] font-bold">
                CURATORIAL PROTOCOL
              </span>
            </div>
            <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl text-[#1E1412] font-bold tracking-tight">
              Curatorial <span className="font-cormorant italic font-normal text-[#7B2431]">Protocol</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* 5s Auto-play status pill */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FCFAF6] border border-[#C5A059]/35 text-[#1E1412]/80 hover:text-[#7B2431] hover:border-[#7B2431] text-[11px] font-mono transition-all cursor-pointer shadow-2xs"
              title={isPaused ? "Resume auto-play" : "Pause auto-play (5s)"}
            >
              {isPaused ? (
                <>
                  <Play className="w-3 h-3 text-[#7B2431]" />
                  <span>Paused</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#7B2431] animate-ping" />
                  <span>Auto-advancing (5s)</span>
                </>
              )}
            </button>

            {/* Navigation Arrow Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                className="w-8 h-8 rounded-full border border-[#C5A059]/40 hover:border-[#7B2431] hover:bg-[#7B2431] hover:text-white flex items-center justify-center text-[#1E1412] transition-all duration-300 cursor-pointer"
                title="Previous Stage"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-8 h-8 rounded-full border border-[#C5A059]/40 hover:border-[#7B2431] hover:bg-[#7B2431] hover:text-white flex items-center justify-center text-[#1E1412] transition-all duration-300 cursor-pointer"
                title="Next Stage"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Minimal Horizontal Node Bar with Animated Symbols and 5s Progress Bar */}
        <div className="mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5 relative">
            {PROTOCOL_STAGES.map((s, idx) => {
              const isActive = activeIdx === idx;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`relative px-3 py-3.5 sm:py-4 rounded-xl transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center border overflow-hidden group ${
                    isActive
                      ? 'bg-[#1E1412] text-white border-[#DFC07D] shadow-lg scale-[1.01]'
                      : 'bg-[#FCFAF6] text-[#1E1412] border-[#C5A059]/30 hover:border-[#7B2431] hover:bg-white shadow-2xs'
                  }`}
                >
                  {/* Animated Stage Icon */}
                  <div className="mb-2">
                    <AnimatedStageIcon type={s.iconType} isActive={isActive} />
                  </div>

                  {/* Clean Stage Label (NO NUMBER BADGES) */}
                  <span className={`font-cinzel text-[11px] sm:text-xs font-bold uppercase tracking-wider truncate max-w-full ${
                    isActive ? 'text-[#DFC07D]' : 'text-[#1E1412]'
                  }`}>
                    {s.shortName}
                  </span>

                  {/* 5-Second Linear Progress Bar on Active Node */}
                  {isActive && !isPaused && (
                    <motion.div
                      key={`progress-${activeIdx}`}
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 5, ease: 'linear' }}
                      className="absolute bottom-0 left-0 h-[3px] bg-[#DFC07D]"
                    />
                  )}
                  {isActive && isPaused && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#DFC07D]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Clean Editorial Showcase Card (Image is 100% clean, no text or overlay boxes) */}
        <div className="bg-[#FCFAF6] rounded-3xl border border-[#C5A059]/35 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[440px]">
            
            {/* Left Visual Column: 100% Clean Authentic Photography */}
            <div className="lg:col-span-5 relative min-h-[280px] sm:min-h-[340px] lg:min-h-full bg-[#140D0A] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={stage.img}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="absolute inset-0"
                >
                  <img 
                    src={stage.img} 
                    alt={stage.category}
                    className="w-full h-full object-cover brightness-[0.92] contrast-[1.04] transition-transform duration-700 hover:scale-105" 
                  />
                  {/* Subtle Framing Glow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Information Column */}
            <div className="lg:col-span-7 p-6 sm:p-8 md:p-9 flex flex-col justify-between bg-[#FCFAF6] border-t lg:border-t-0 lg:border-l border-[#C5A059]/25">
              
              <div>
                {/* Category Pill with Animated Icon */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7B2431]/10 border border-[#7B2431]/20 text-[#7B2431] font-cinzel text-[10.5px] font-bold uppercase tracking-[0.2em] mb-3">
                  <AnimatedStageIcon type={stage.iconType} isActive={true} />
                  <span>{stage.category}</span>
                </div>

                <h3 className="font-cinzel text-xl sm:text-2xl md:text-3xl font-bold text-[#1E1412] tracking-tight mb-2.5 leading-snug">
                  {stage.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-[#1E1412]/80 font-light leading-relaxed mb-5">
                  {stage.lead}
                </p>

                {/* 3 Crisp Deliverable Highlights */}
                <div className="space-y-2 mb-6">
                  {stage.keyPoints.map((point, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#FAF6F0] border border-[#C5A059]/25">
                      <CheckCircle2 className="w-4 h-4 text-[#7B2431] shrink-0 mt-0.5" />
                      <span className="text-xs text-[#1E1412]/85 font-light leading-relaxed">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Metrics Bar */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-[#FAF6F0] rounded-xl border border-[#C5A059]/30">
                  {stage.metrics.map((m, idx) => (
                    <div key={idx} className="border-r border-[#C5A059]/25 last:border-r-0 pr-1 text-center">
                      <p className="text-[9px] font-mono text-[#1E1412]/60 uppercase tracking-wider">{m.label}</p>
                      <p className="text-xs font-bold font-cinzel text-[#7B2431] truncate mt-0.5">{m.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Link */}
              <div className="pt-4 mt-6 border-t border-[#C5A059]/20 flex items-center justify-between">
                <Link
                  to="/services"
                  className="font-cinzel text-xs uppercase tracking-[0.18em] font-bold text-[#7B2431] hover:text-[#58111A] flex items-center gap-2 group transition-colors"
                >
                  <span>Explore Full Protocol Framework</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <div className="flex gap-1.5">
                  {PROTOCOL_STAGES.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => setActiveIdx(dotIdx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        activeIdx === dotIdx ? 'w-6 bg-[#7B2431]' : 'w-2 bg-[#C5A059]/40 hover:bg-[#7B2431]/50'
                      }`}
                      aria-label={`Go to stage ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>

    </section>
  );
}
