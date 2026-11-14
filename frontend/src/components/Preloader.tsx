import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { preloadAllCatalogAssets } from '../services/artworkService';

interface PreloaderProps {
  onComplete: () => void;
}

type AnimationStep = 'tkv' | 'expand_horizontal' | 'morph_vertical' | 'poster_reveal' | 'exit' | 'finished';

/**
 * Deep Imperial Dark Red Flowing Velvet Cloth Component
 * Undulating luxury textile banner in rich bordeaux & midnight wine tones spanning end-to-end
 * across the warm peach canvas, providing dramatic contrast and tactile organic drape motion.
 */
const FlowingDarkRedVelvetCloth: React.FC<{ isVerticalStack: boolean; isExiting: boolean }> = ({
  isVerticalStack,
  isExiting,
}) => {
  return (
    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none w-screen overflow-hidden z-0 flex items-center justify-center">
      {/* Dynamic Animated Height Container that billows smoothly between horizontal & vertical phases */}
      <motion.div
        animate={{
          height: isVerticalStack ? 510 : 270,
          opacity: isExiting ? 0 : 1,
          scaleY: isVerticalStack ? [1, 1.035, 1] : [1, 1.045, 1],
        }}
        transition={{
          height: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
          scaleY: { duration: 6, repeat: Infinity, ease: 'easeInOut' }
        }}
        className="relative w-full overflow-visible flex items-center justify-center"
      >
        {/* Soft Ambient Deep Wine Shadow Diffusing onto the Warm Peach Canvas */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[340px] bg-[#3B060F]/22 rounded-full blur-[90px] pointer-events-none -z-10" />

        {/* SVG Deep Dark Red Wavy Fabric with Dramatic Organic Undulations */}
        <svg
          className="w-full h-full min-w-[1360px] overflow-visible"
          viewBox="0 0 1600 520"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Rich Imperial Dark Red Velvet Gradient */}
            <linearGradient id="darkRedClothGrad" x1="0%" y1="15%" x2="100%" y2="85%">
              <stop offset="0%" stopColor="#140104" />
              <stop offset="12%" stopColor="#250308" />
              <stop offset="28%" stopColor="#3D060F" />
              <stop offset="50%" stopColor="#580A16" />
              <stop offset="70%" stopColor="#3A050E" />
              <stop offset="88%" stopColor="#200206" />
              <stop offset="100%" stopColor="#100103" />
            </linearGradient>

            {/* Deepest Fold Cavity Gradient */}
            <linearGradient id="darkRedShadowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0B0002" />
              <stop offset="35%" stopColor="#1C0206" />
              <stop offset="70%" stopColor="#260309" />
              <stop offset="100%" stopColor="#0A0002" />
            </linearGradient>

            {/* Velvet Sheen Crest (Subtle deep crimson highlight across curves) */}
            <linearGradient id="darkRedSheenGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6E0E1C" stopOpacity="0" />
              <stop offset="25%" stopColor="#7E1220" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#9C1A2B" stopOpacity="0.45" />
              <stop offset="75%" stopColor="#7E1220" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#6E0E1C" stopOpacity="0" />
            </linearGradient>

            {/* Tactile Woven Fabric Filter */}
            <filter id="darkRedTextureFilter" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.045 0.09" numOctaves="3" result="noise" />
              <feColorMatrix
                type="matrix"
                values="0.33 0.33 0.33 0 0
                        0.33 0.33 0.33 0 0
                        0.33 0.33 0.33 0 0
                        0    0    0    0.20 0"
                result="texture"
              />
              <feComposite in="SourceGraphic" in2="texture" operator="arithmetic" k1="0" k2="1" k3="0.15" k4="0" />
            </filter>

            {/* Natural Velvet Drop Shadow onto Peach Background */}
            <filter id="darkRedClothShadow" x="-5%" y="-10%" width="110%" height="135%">
              <feDropShadow dx="0" dy="18" stdDeviation="24" floodColor="#180104" floodOpacity="0.32" />
              <feDropShadow dx="0" dy="5" stdDeviation="8" floodColor="#100103" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* LAYER 1: Deep Underlay Wave Folds */}
          <motion.path
            d="M 0 150 Q 220 50 480 170 T 960 120 T 1600 180 L 1600 460 Q 1320 500 980 420 T 460 480 T 0 400 Z"
            fill="url(#darkRedShadowGrad)"
            opacity={0.92}
            animate={{
              d: [
                "M 0 150 Q 220 50 480 170 T 960 120 T 1600 180 L 1600 460 Q 1320 500 980 420 T 460 480 T 0 400 Z",
                "M 0 180 Q 260 100 520 140 T 1020 160 T 1600 140 L 1600 430 Q 1280 460 940 440 T 440 440 T 0 430 Z",
                "M 0 150 Q 220 50 480 170 T 960 120 T 1600 180 L 1600 460 Q 1320 500 980 420 T 460 480 T 0 400 Z",
              ]
            }}
            transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* LAYER 2: Main Extra-Flowy Dark Red Cloth Body */}
          <g filter="url(#darkRedClothShadow)">
            <motion.path
              d="M 0 120 Q 300 220 640 90 T 1180 160 T 1600 80 L 1600 400 Q 1240 490 880 380 T 320 450 T 0 350 Z"
              fill="url(#darkRedClothGrad)"
              filter="url(#darkRedTextureFilter)"
              animate={{
                d: [
                  "M 0 120 Q 300 220 640 90 T 1180 160 T 1600 80 L 1600 400 Q 1240 490 880 380 T 320 450 T 0 350 Z",
                  "M 0 90 Q 340 140 680 130 T 1240 100 T 1600 120 L 1600 360 Q 1290 440 930 410 T 380 390 T 0 380 Z",
                  "M 0 140 Q 280 200 600 110 T 1140 180 T 1600 90 L 1600 420 Q 1220 480 860 360 T 300 440 T 0 340 Z",
                  "M 0 120 Q 300 220 640 90 T 1180 160 T 1600 80 L 1600 400 Q 1240 490 880 380 T 320 450 T 0 350 Z",
                ]
              }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />
          </g>

          {/* LAYER 3: Internal Flowing Folds & Drapery Crests */}
          <motion.path
            d="M 0 180 Q 380 280 780 180 T 1600 170"
            stroke="url(#darkRedSheenGrad)"
            strokeWidth="38"
            strokeLinecap="round"
            opacity={0.4}
            animate={{
              d: [
                "M 0 180 Q 380 280 780 180 T 1600 170",
                "M 0 160 Q 420 220 830 200 T 1600 190",
                "M 0 180 Q 380 280 780 180 T 1600 170",
              ]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.path
            d="M 0 320 Q 480 400 960 300 T 1600 330"
            stroke="url(#darkRedShadowGrad)"
            strokeWidth="26"
            opacity={0.5}
            animate={{
              d: [
                "M 0 320 Q 480 400 960 300 T 1600 330",
                "M 0 300 Q 510 360 1010 330 T 1600 310",
                "M 0 320 Q 480 400 960 300 T 1600 330",
              ]
            }}
            transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Organic Velvet Light Sweep across the dark drapery */}
          <motion.rect
            x="-500"
            y="0"
            width="380"
            height="520"
            fill="url(#darkRedSheenGrad)"
            opacity={0.25}
            animate={{ x: ['-450px', '1800px'] }}
            transition={{ duration: 4, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
            transform="skewX(-22)"
          />
        </svg>
      </motion.div>
    </div>
  );
};

export default function Preloader({ onComplete }: PreloaderProps) {
  const [step, setStep] = useState<AnimationStep>('tkv');
  const [progress, setProgress] = useState(0);

  const handleFinishImmediately = () => {
    setStep('exit');
    setTimeout(() => {
      setStep('finished');
      onComplete();
    }, 700);
  };

  useEffect(() => {
    preloadAllCatalogAssets();

    // 5-Second Luxury Calibrated Choreography:
    // 0ms - 1200ms: Phase 1: "T · K · V" monogram on dark red velvet cloth against peach canvas
    // 1200ms - 2600ms: Phase 2: Smooth horizontal expansion to "THE KALA VAULT" along the flowing cloth
    // 2600ms - 3900ms: Phase 3: Morphing smoothly into the vertical 3-tiered poster stack
    // 3900ms - 5000ms: Phase 4: Full poster glory unveiled with arches, "AN ARTFUL WORLD IS OPENING", & "Curating Joy."
    // 5000ms: Smooth portal exit welcoming guest into the gallery
    const t1 = setTimeout(() => setStep('expand_horizontal'), 1200);
    const t2 = setTimeout(() => setStep('morph_vertical'), 2600);
    const t3 = setTimeout(() => setStep('poster_reveal'), 3900);

    const startTime = Date.now();
    const duration = 5000;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        setStep('exit');
        setTimeout(() => {
          setStep('finished');
          onComplete();
        }, 850);
      }
    };

    const animFrame = requestAnimationFrame(updateProgress);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      cancelAnimationFrame(animFrame);
    };
  }, [onComplete]);

  if (step === 'finished') return null;

  const isExiting = step === 'exit';
  const isPosterMode = step === 'morph_vertical' || step === 'poster_reveal' || step === 'exit';
  const isHorizontalExpanded = step === 'expand_horizontal';

  return (
    <AnimatePresence>
      <motion.div
        key="preloader-overlay"
        initial={{ opacity: 1 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
        // Warm, elegant peach parchment background (#F7EDE2) with dark red accents
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#F7EDE2] select-none overflow-hidden"
      >
        {/* Soft Warm Peach Radial Illumination */}
        <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#C5A059_0.8px,transparent_0.8px)] [background-size:28px_28px]" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,#FFF8F2_35%,#F4E4D5_100%)] opacity-90" />

        {/* ─────────────────────────────────────────────────────────────────────────────
            OUTER POSTER BORDER FRAME WITH CRISP DARK RED LINES
            ───────────────────────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: isExiting ? 0 : 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-3 sm:inset-6 md:inset-8 border border-[#580F1D]/25 pointer-events-none z-20"
        >
          {/* Bottom solid burgundy line matching user image */}
          <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#580F1D]" />
          {/* Delicate inner hairline */}
          <div className="absolute inset-1 sm:inset-2 border border-[#580F1D]/15" />
        </motion.div>

        {/* ─────────────────────────────────────────────────────────────────────────────
            CONCENTRIC ARCHITECTURAL ARCHES (PORTAL GRAPHIC FROM USER IMAGE)
            ───────────────────────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isPosterMode ? 0.85 : 0.35 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
        >
          <svg
            className="w-full max-w-[820px] h-[780px] sm:h-[840px] text-[#580F1D] opacity-75"
            viewBox="0 0 800 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outermost Arch */}
            <path
              d="M 120 740 L 120 400 A 280 280 0 0 1 680 400 L 680 740"
              stroke="currentColor"
              strokeWidth="0.8"
              strokeOpacity="0.25"
            />
            {/* Middle Arch */}
            <path
              d="M 160 740 L 160 400 A 240 240 0 0 1 640 400 L 640 740"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeOpacity="0.38"
            />
            {/* Inner Radiating Arch */}
            <path
              d="M 210 740 L 210 400 A 190 190 0 0 1 590 400 L 590 740"
              stroke="currentColor"
              strokeWidth="0.75"
              strokeOpacity="0.3"
            />
            {/* Innermost Delicate Arch */}
            <path
              d="M 260 740 L 260 400 A 140 140 0 0 1 540 400 L 540 740"
              stroke="currentColor"
              strokeWidth="0.6"
              strokeOpacity="0.2"
              strokeDasharray="4 4"
            />
            {/* Baseline Guide Rule */}
            <line x1="80" y1="740" x2="720" y2="740" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.35" />
          </svg>

          {/* Floating Atmospheric Sparkles (matching image) */}
          <div className="absolute top-[28%] left-[22%] w-1.5 h-1.5 rounded-full bg-[#580F1D]/40" />
          <div className="absolute top-[34%] right-[24%] w-1.5 h-1.5 rounded-full bg-[#580F1D]/35" />
          <div className="absolute top-[42%] left-[18%] w-1 h-1 rounded-full bg-[#580F1D]/30" />
          <div className="absolute top-[48%] right-[19%] w-1.5 h-1.5 rounded-full bg-[#580F1D]/45" />
        </motion.div>

        {/* ─────────────────────────────────────────────────────────────────────────────
            DARK RED FLOWING VELVET CLOTH (END-TO-END BEHIND TEXT ACROSS PEACH CANVAS)
            Requested: "can u make that cloth thing dark reddd"
            ───────────────────────────────────────────────────────────────────────────── */}
        <FlowingDarkRedVelvetCloth isVerticalStack={isPosterMode} isExiting={isExiting} />

        {/* ─────────────────────────────────────────────────────────────────────────────
            MAIN CENTERPIECE CARD & TEXT ON TOP OF DARK RED CLOTH
            Sculptural Luminous Ivory Typography with Deep Bordeaux 3D Bevel Shadows
            ───────────────────────────────────────────────────────────────────────────── */}
        <div className="relative z-30 flex flex-col items-center justify-center max-w-5xl px-3 sm:px-6 text-center pointer-events-none">

          {/* 1. BRAND LOGO MEDALLION */}
          <motion.div
            initial={{ scale: 0.75, opacity: 0, y: -12 }}
            animate={
              isExiting
                ? {
                    scale: 0.45,
                    opacity: 0,
                    y: -140,
                    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] }
                  }
                : {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                  }
            }
            className="mb-3 sm:mb-4 relative"
          >
            <div className="relative p-1.5 rounded-xl bg-[#FAF6F0] border border-[#C5A059]/70 shadow-[0_12px_35px_rgba(88,15,29,0.22)]">
              <img
                src="/assets/logo.jpeg"
                alt="The Kala Vault Seal"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover shadow-xs"
              />
            </div>
          </motion.div>

          {/* 2. TOP BANNER: "AN ARTFUL WORLD IS OPENING" */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{
              opacity: isPosterMode ? 1 : 0.75,
              y: 0
            }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center mb-2 sm:mb-3"
          >
            <p className="font-outfit text-[11px] sm:text-[13px] md:text-[14px] font-semibold tracking-[0.28em] sm:tracking-[0.35em] uppercase text-[#580F1D]">
              AN ARTFUL WORLD IS OPENING
            </p>
            {/* Small center horizontal bar */}
            <div className="w-10 sm:w-12 h-[2px] bg-[#580F1D] mt-2 sm:mt-2.5 opacity-85" />
          </motion.div>

          {/* ─────────────────────────────────────────────────────────────────────────
              3. CORE MORPHING TYPOGRAPHY ON TOP OF DARK RED CLOTH:
                 - Step 1: "T · K · V" (horizontal monogram)
                 - Step 2: "THE  KALA  VAULT" (smooth horizontal expansion)
                 - Step 3: Stacked Vertically into poster typography (THE / KALA / VAULT)
                 - Sculptural Luminous Ivory Lettering with Multi-Layered Bordeaux 3D Bevel Shadow
                   (Zero cuts, ultra-crisp, maximum legibility on dark red cloth!)
              ───────────────────────────────────────────────────────────────────────── */}
          <div className="relative flex flex-col items-center justify-center my-1 sm:my-2 w-full max-w-4xl overflow-visible">
            
            <motion.div
              layout
              transition={{
                layout: { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
              }}
              className={`flex overflow-visible ${
                isPosterMode 
                  ? 'flex-col items-center gap-0 leading-[0.88] sm:leading-[0.85]' 
                  : 'flex-row items-baseline justify-center gap-2.5 sm:gap-6 md:gap-8 leading-none px-2 sm:px-4'
              }`}
            >
              {/* WORD 1: "THE" */}
              <motion.div
                layout
                className="overflow-visible flex items-baseline justify-center"
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="cloth-sculpted-char font-syne font-black text-[clamp(2.5rem,7vw,5.5rem)] sm:text-7xl md:text-8xl tracking-tight uppercase">
                  T
                </span>

                <AnimatePresence>
                  {(isHorizontalExpanded || isPosterMode) && (
                    <motion.span
                      initial={{ width: 0, opacity: 0, x: -14 }}
                      animate={{ width: 'auto', opacity: 1, x: 0 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                      className="cloth-sculpted-char font-syne font-black text-[clamp(2.5rem,7vw,5.5rem)] sm:text-7xl md:text-8xl tracking-tight uppercase inline-block whitespace-nowrap overflow-visible"
                    >
                      HE
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* WORD 2: "KALA" */}
              <motion.div
                layout
                className="overflow-visible flex items-baseline justify-center"
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="cloth-sculpted-char font-syne font-black text-[clamp(2.5rem,7vw,5.5rem)] sm:text-7xl md:text-8xl tracking-tight uppercase">
                  K
                </span>

                <AnimatePresence>
                  {(isHorizontalExpanded || isPosterMode) && (
                    <motion.span
                      initial={{ width: 0, opacity: 0, x: -14 }}
                      animate={{ width: 'auto', opacity: 1, x: 0 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      className="cloth-sculpted-char font-syne font-black text-[clamp(2.5rem,7vw,5.5rem)] sm:text-7xl md:text-8xl tracking-tight uppercase inline-block whitespace-nowrap overflow-visible"
                    >
                      ALA
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* WORD 3: "VAULT" */}
              <motion.div
                layout
                className="overflow-visible flex items-baseline justify-center pr-2"
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="cloth-sculpted-char font-syne font-black text-[clamp(2.5rem,7vw,5.5rem)] sm:text-7xl md:text-8xl tracking-tight uppercase">
                  V
                </span>

                <AnimatePresence>
                  {(isHorizontalExpanded || isPosterMode) && (
                    <motion.span
                      initial={{ width: 0, opacity: 0, x: -14 }}
                      animate={{ width: 'auto', opacity: 1, x: 0 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                      className="cloth-sculpted-char font-syne font-black text-[clamp(2.5rem,7vw,5.5rem)] sm:text-7xl md:text-8xl tracking-tight uppercase inline-block whitespace-nowrap overflow-visible"
                    >
                      AULT
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>

            {/* Micro-label during initial 'TKV' phase */}
            {step === 'tkv' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="mt-3 text-[10px] sm:text-[11px] font-mono tracking-[0.3em] uppercase text-[#FFFDF9]/90 drop-shadow-md"
              >
                TKV ARCHIVAL MONOGRAM
              </motion.div>
            )}
          </div>

          {/* 4. SUBTITLE & TAGLINE (From image: "Curating Joy." & "INSPIRING SPACES") */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{
              opacity: isPosterMode ? 1 : 0,
              y: isPosterMode ? 0 : 15
            }}
            transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center mt-3 sm:mt-5"
          >
            {/* Elegant italic script */}
            <h2 className="font-cormorant italic text-3xl sm:text-4xl md:text-[42px] font-normal text-[#580F1D] tracking-normal leading-tight">
              Curating Joy.
            </h2>

            {/* Spaced small caps tagline */}
            <p className="font-outfit text-[11px] sm:text-[13px] font-semibold uppercase tracking-[0.32em] text-[#580F1D]/90 mt-1">
              INSPIRING SPACES
            </p>

            {/* Delicate horizontal divider with centered diamond (matching user image) */}
            <div className="flex items-center gap-3 w-40 sm:w-52 mt-3 sm:mt-4 opacity-80">
              <div className="h-[1px] flex-1 bg-[#580F1D]" />
              <div className="w-2 h-2 rotate-45 bg-[#580F1D]" />
              <div className="h-[1px] flex-1 bg-[#580F1D]" />
            </div>
          </motion.div>

        </div>

        {/* ─────────────────────────────────────────────────────────────────────────────
            MINIMALIST PROGRESS INDICATOR AT BOTTOM (CALIBRATED TO 5 SECONDS)
            ───────────────────────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isExiting ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-6 sm:bottom-8 z-30 flex flex-col items-center justify-center text-center px-6 max-w-xs w-full pointer-events-none"
        >
          {/* Subtle Progress Bar */}
          <div className="w-48 sm:w-56 h-[2.5px] bg-[#580F1D]/18 rounded-full overflow-hidden mb-2">
            <motion.div
              className="h-full bg-gradient-to-r from-[#580F1D] via-[#8A1628] to-[#C5A059] shadow-[0_0_8px_rgba(88,15,29,0.5)]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>

          <div className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-[#580F1D]/85 uppercase font-semibold">
            {progress === 100 ? 'ENTERING GALLERY • WELCOME' : `COLLECTION ARCHIVE • ${progress}%`}
          </div>
        </motion.div>

        {/* ─────────────────────────────────────────────────────────────────────────────
            DISCREET "SKIP / ENTER NOW →" CONTROL (UX BEST PRACTICE)
            ───────────────────────────────────────────────────────────────────────────── */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isExiting ? 0 : 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          onClick={handleFinishImmediately}
          className="absolute bottom-5 right-5 sm:bottom-7 sm:right-7 z-40 group flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-[#580F1D]/30 bg-[#F7EDE2]/90 backdrop-blur-md text-[#580F1D] hover:border-[#580F1D] hover:bg-[#580F1D] hover:text-[#FAF6F0] transition-all duration-300 pointer-events-auto cursor-pointer shadow-xs"
          title="Enter Gallery Directly"
        >
          <span className="font-outfit text-[9.5px] sm:text-[10.5px] font-semibold tracking-[0.22em] uppercase">
            Skip
          </span>
          <span className="text-xs group-hover:translate-x-0.5 transition-transform duration-200">
            →
          </span>
        </motion.button>

        {/* Pure, crisp, sculptural 3D typography without any gold cuts or distortions */}
        <style>{`
          .cloth-sculpted-char {
            color: #FFFFFF;
            /* Multi-layered dark bordeaux depth so white text jumps out vividly on the dark red velvet */
            text-shadow: 
              0 1px 3px rgba(255, 255, 255, 0.45),
              2px 3px 0px #45060E,
              4px 6px 0px #240206,
              6px 9px 20px rgba(10, 1, 3, 0.85);
            line-height: 0.88;
            filter: drop-shadow(0 4px 14px rgba(0, 0, 0, 0.45));
          }
        `}</style>

      </motion.div>
    </AnimatePresence>
  );
}
