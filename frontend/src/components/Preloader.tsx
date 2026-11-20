import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { preloadAndWarmCatalog } from '../services/artworkService';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [targetFlight, setTargetFlight] = useState<{ x: number; y: number; scale: number }>({
    x: 0,
    y: 0,
    scale: 0.42,
  });

  const logoRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);

  // Compute exact coordinates of header logo for the flight animation
  const calculateTargetFlight = () => {
    if (!logoRef.current) return;
    const currentRect = logoRef.current.getBoundingClientRect();
    const currentCenterX = currentRect.left + currentRect.width / 2;
    const currentCenterY = currentRect.top + currentRect.height / 2;

    const targetEl =
      document.querySelector('header img[alt="The Kala Vault Logo"]') ||
      document.querySelector('header img') ||
      document.querySelector('nav img');

    if (targetEl) {
      const targetRect = targetEl.getBoundingClientRect();
      const targetCenterX = targetRect.left + targetRect.width / 2;
      const targetCenterY = targetRect.top + targetRect.height / 2;
      setTargetFlight({
        x: targetCenterX - currentCenterX,
        y: targetCenterY - currentCenterY,
        scale: targetRect.width / currentRect.width,
      });
    } else {
      // Responsive fallback if target element rect is pending in DOM
      const isDesktop = window.innerWidth >= 1024;
      const targetLeft = isDesktop
        ? Math.max(48, (window.innerWidth - 1360) / 2 + 48)
        : 32;
      const targetTop = isDesktop ? 28 : 22;
      const targetSize = isDesktop ? 40 : 36;

      setTargetFlight({
        x: targetLeft - currentCenterX + targetSize / 2,
        y: targetTop - currentCenterY + targetSize / 2,
        scale: targetSize / currentRect.width,
      });
    }
  };

  useEffect(() => {
    // Precalculate flight target on mount and window resize
    calculateTargetFlight();
    window.addEventListener('resize', calculateTargetFlight);

    let assetsLoaded = false;
    let minTimeElapsed = false;
    let currentPct = 0;
    const startTime = Date.now();
    const minDuration = 2200; // 2.2s pace to appreciate the artwork animation

    // 1. Preload catalog & decode images into browser memory
    preloadAndWarmCatalog((actualPct) => {
      currentPct = Math.max(currentPct, actualPct);
      if (actualPct >= 100) {
        assetsLoaded = true;
      }
    }).then(() => {
      assetsLoaded = true;
    }).catch(() => {
      assetsLoaded = true;
    });

    // 2. Smooth requestAnimationFrame progress updater
    let frameId: number;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const timePct = Math.min(100, Math.floor((elapsed / minDuration) * 100));

      if (elapsed >= minDuration) {
        minTimeElapsed = true;
      }

      // Smooth visual progress that combines asset preload status & animation pace
      const displayPct = Math.min(
        100,
        assetsLoaded && minTimeElapsed
          ? 100
          : Math.max(timePct, Math.floor(currentPct * 0.95))
      );

      setProgress(displayPct);

      // Complete only when BOTH minimum aesthetic time has elapsed AND assets are ready
      // (or max timeout of 4.2s to prevent indefinite stall on slow networks)
      if ((assetsLoaded && minTimeElapsed) || elapsed >= 4200) {
        setProgress(100);
        triggerReveal();
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', calculateTargetFlight);
    };
  }, []);

  const triggerReveal = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    calculateTargetFlight();
    setIsRevealing(true);

    // After logo flight & aperture expansion, hand off to live website
    setTimeout(() => {
      setIsFinished(true);
      onComplete();
    }, 850);
  };

  const handleSkip = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    calculateTargetFlight();
    setIsRevealing(true);
    setTimeout(() => {
      setIsFinished(true);
      onComplete();
    }, 450);
  };

  if (isFinished) return null;

  // Real-time responsive aperture expansion during loading
  const apertureWidthVw = isRevealing ? 100 : Math.min(88, 74 + progress * 0.12);
  const apertureHeightVh = isRevealing ? 100 : Math.min(62, 48 + progress * 0.1);

  return (
    <AnimatePresence>
      <motion.div
        key="this-is-norway-inspired-preloader"
        initial={{ opacity: 1 }}
        animate={{ opacity: isRevealing ? [1, 1, 0] : 1 }}
        transition={{ duration: 0.85, times: [0, 0.75, 1], ease: [0.76, 0, 0.24, 1] }}
        className="fixed inset-0 z-[99999] flex items-center justify-center select-none overflow-hidden bg-[#FAF6F0]"
      >
        {/* ─────────────────────────────────────────────────────────────────────────────
            MINIMALIST LUXURY CANVAS BACKGROUND (Clean Warm Linen & Subtle Ambient Aura)
            All perimeter clutter removed.
            ───────────────────────────────────────────────────────────────────────────── */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Subtle Warm Linen Radial Bloom */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#FFFDF8_25%,#FAF6F0_70%,#F3ECE2_100%)] opacity-95" />

          {/* Deep Velvet Bordeaux Ambient Aura behind center stage */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.12, 0.2, 0.12] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] bg-[radial-gradient(circle_at_center,#4A0E17_0%,transparent_65%)] rounded-full blur-[90px]"
          />
        </div>

        {/* ─────────────────────────────────────────────────────────────────────────────
            LAYER 1: FILLED HEADING (Sits BEHIND the central aperture window)
            When the aperture is smaller than the letters, the outer letters
            are rendered in solid imperial velvet bordeaux against the warm cream canvas.
            ───────────────────────────────────────────────────────────────────────────── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 px-4">
          <motion.div
            animate={
              isRevealing
                ? { scale: 0.98, opacity: 0, y: 15 }
                : { scale: 1, opacity: 1, y: 0 }
            }
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="flex flex-col items-center text-center"
          >
            {/* Spacer matching the Logo Medallion size & margin */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 mb-4 sm:mb-6 shrink-0" />

            {/* Monumental Display Title (Solid Filled Layer) */}
            <h1 className="font-cinzel text-[clamp(2.1rem,7.4vw,7.6rem)] font-black tracking-[0.16em] uppercase text-[#4A0E17] leading-none select-none whitespace-nowrap">
              THE KALA VAULT
            </h1>

            {/* Curatorial Subhead (Solid Filled Layer) */}
            <p className="font-cormorant italic text-[clamp(1rem,2.2vw,2.1rem)] tracking-[0.26em] uppercase text-[#7B2431]/85 mt-3 sm:mt-5 select-none whitespace-nowrap">
              Curating Joy • Inspiring Spaces
            </p>
          </motion.div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────────────────
            LAYER 2: CENTRAL APERTURE WINDOW ("This Is Norway" Signature Cutout)
            Contains the high-resolution museum gallery hero visual with Ken-Burns motion,
            surrounded by expanding letterbox framing and 1px gold hairline borders.
            ───────────────────────────────────────────────────────────────────────────── */}
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <motion.div
            animate={{
              width: `${apertureWidthVw}vw`,
              height: `${apertureHeightVh}vh`,
              borderRadius: isRevealing ? '0px' : '3px',
            }}
            transition={{
              duration: isRevealing ? 0.8 : 0.2,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="relative overflow-hidden border border-[#C5A059]/45 shadow-[0_28px_85px_rgba(46,7,13,0.22)]"
          >
            {/* High-Resolution Museum Gallery Hero Imagery */}
            <motion.img
              src="/assets/museum_gallery_hero.jpg"
              alt="Museum Gallery Archive"
              animate={{
                scale: isRevealing ? 1.15 : [1.03, 1.1],
              }}
              transition={{
                duration: isRevealing ? 0.85 : 3.8,
                ease: 'easeOut',
              }}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />

            {/* Fine Art Scrim: Contrast Toning & Warm Velvet Hue */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E1412]/75 via-[#1E1412]/30 to-[#1E1412]/60 pointer-events-none" />
            <div className="absolute inset-0 bg-[#4A0E17]/20 mix-blend-multiply pointer-events-none" />

            {/* Subtle Gilded Edge Sheen */}
            <div className="absolute inset-0 border border-[#C5A059]/30 pointer-events-none" />

            {/* Classical Framing Corner Brackets */}
            <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-[#C5A059] opacity-85" />
            <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-[#C5A059] opacity-85" />
            <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 border-[#C5A059] opacity-85" />
            <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-[#C5A059] opacity-85" />

            {/* ─────────────────────────────────────────────────────────────────────────
                OUTLINE HEADING (Nested INSIDE the Aperture Window)
                Positioned in a w-screen h-screen container centered on the exact same
                viewport coordinates. Because the aperture has overflow:hidden, this
                transparent-fill, stroke-outlined text is clipped exactly to the window!
                ───────────────────────────────────────────────────────────────────────── */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-screen flex flex-col items-center justify-center pointer-events-none px-4">
              <motion.div
                animate={
                  isRevealing
                    ? { scale: 0.98, opacity: 0, y: 15 }
                    : { scale: 1, opacity: 1, y: 0 }
                }
                transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                className="flex flex-col items-center text-center"
              >
                {/* Spacer matching the Logo Medallion */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 mb-4 sm:mb-6 shrink-0" />

                {/* Outlined Title (Transparent fill, Crisp 1.5px Cream Outline) */}
                <h1
                  style={{
                    WebkitTextStroke: '1.5px #FAF6F0',
                    color: 'transparent',
                    textShadow: '0 4px 20px rgba(0,0,0,0.6)',
                  }}
                  className="font-cinzel text-[clamp(2.1rem,7.4vw,7.6rem)] font-black tracking-[0.16em] uppercase leading-none select-none whitespace-nowrap"
                >
                  THE KALA VAULT
                </h1>

                {/* Outlined Subhead */}
                <p
                  style={{
                    WebkitTextStroke: '0.8px rgba(250, 246, 240, 0.9)',
                    color: 'rgba(250, 246, 240, 0.95)',
                    textShadow: '0 2px 12px rgba(0,0,0,0.7)',
                  }}
                  className="font-cormorant italic text-[clamp(1rem,2.2vw,2.1rem)] tracking-[0.26em] uppercase mt-3 sm:mt-5 select-none whitespace-nowrap"
                >
                  Curating Joy • Inspiring Spaces
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────────────────
            LAYER 3: CENTERPIECE BRAND LOGO MEDALLION & CINEMATIC FLIGHT TO HEADER
            Positioned in center stage, then on reveal gracefully glides & scales
            directly to the live navbar header logo coordinates!
            ───────────────────────────────────────────────────────────────────────────── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30 px-4">
          <div className="flex flex-col items-center text-center">
            {/* The Authentic Brand Medallion */}
            <motion.div
              ref={logoRef}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={
                isRevealing
                  ? {
                      x: targetFlight.x,
                      y: targetFlight.y,
                      scale: targetFlight.scale,
                      opacity: 1,
                      transition: { duration: 0.82, ease: [0.16, 1, 0.3, 1] },
                    }
                  : {
                      x: 0,
                      y: 0,
                      scale: 1,
                      opacity: 1,
                      transition: { duration: 0.6, ease: 'easeOut' },
                    }
              }
              className="w-20 h-20 sm:w-24 sm:h-24 mb-4 sm:mb-6 relative shrink-0"
            >
              {/* Pulsing Gilded Halo */}
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-2.5 rounded-2xl border border-[#C5A059]/40 border-dashed pointer-events-none"
              />

              {/* Framed Gold-Bevel Enclosure */}
              <div className="relative w-full h-full p-1 rounded-2xl bg-gradient-to-tr from-[#7B2431] via-[#C5A059] to-[#FAF6F0] shadow-[0_16px_40px_rgba(74,14,23,0.25)]">
                <div className="w-full h-full rounded-xl overflow-hidden bg-[#FAF6F0] border border-[#C5A059]/60 flex items-center justify-center relative shadow-inner">
                  <img
                    src="/assets/logo.jpeg"
                    alt="The Kala Vault"
                    className="w-full h-full object-cover"
                  />
                  {/* Diagonal Specular Sheen Passage */}
                  <motion.div
                    initial={{ x: '-120%' }}
                    animate={{ x: '220%' }}
                    transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none"
                  />
                </div>
              </div>
            </motion.div>

            {/* Invisible structural spacer keeping center-point identical */}
            <div className="opacity-0 pointer-events-none select-none flex flex-col items-center">
              <h1 className="font-cinzel text-[clamp(2.1rem,7.4vw,7.6rem)] font-black tracking-[0.16em] uppercase leading-none whitespace-nowrap">
                THE KALA VAULT
              </h1>
              <p className="font-cormorant italic text-[clamp(1rem,2.2vw,2.1rem)] tracking-[0.26em] uppercase mt-3 sm:mt-5 whitespace-nowrap">
                Curating Joy • Inspiring Spaces
              </p>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────────────────
            MINIMALIST CORNER LOADING BAR (Faithfully matching user's reference image)
            Positioned in bottom-right corner, showing sleek pill track + "loading..."
            All bottom-center bar clutter and side elements removed.
            ───────────────────────────────────────────────────────────────────────────── */}
        <motion.div
          animate={isRevealing ? { opacity: 0, y: 15 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          onClick={handleSkip}
          className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 flex flex-col items-center cursor-pointer pointer-events-auto"
          title="Click to enter"
        >
          {/* Rounded Pill Track with Vibrant Gradient Fill */}
          <div className="w-36 sm:w-44 h-3.5 sm:h-4 rounded-full p-[2px] border-[1.5px] border-[#1E1412]/60 sm:border-[#1E1412]/75 bg-[#FAF6F0]/85 shadow-xs flex items-center overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#FFB703] via-[#FB8500] to-[#E63946] shadow-[0_0_8px_rgba(251,133,0,0.4)]"
              style={{ width: `${Math.max(6, progress)}%` }}
              transition={{ ease: 'easeOut', duration: 0.2 }}
            />
          </div>

          {/* Clean "loading..." typography underneath */}
          <span className="font-sans text-[11px] sm:text-[12px] text-[#1E1412]/80 tracking-wide mt-1.5 select-none lowercase">
            loading...
          </span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
