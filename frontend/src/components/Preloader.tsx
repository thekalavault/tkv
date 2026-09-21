import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { preloadAllCatalogAssets } from '../services/artworkService';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'intro' | 'loading' | 'flying' | 'finished'>('intro');

  useEffect(() => {
    // Preload all catalog images, room mockups, and artwork metadata into RAM/GPU cache
    preloadAllCatalogAssets();

    // 1. Initial logo spin entrance
    const introTimer = setTimeout(() => {
      setStage('loading');
    }, 200);

    const startTime = Date.now();
    const duration = 1800; // 1.8s duration for majestic loading

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        // Trigger the flight to navbar logo position
        setStage('flying');
        setTimeout(() => {
          setStage('finished');
          onComplete();
        }, 950); // Flight transition time
      }
    };

    const animFrame = requestAnimationFrame(updateProgress);

    return () => {
      clearTimeout(introTimer);
      cancelAnimationFrame(animFrame);
    };
  }, [onComplete]);

  if (stage === 'finished') return null;

  const isFlying = stage === 'flying';

  return (
    <AnimatePresence>
      <motion.div
        key="preloader-overlay"
        initial={{ opacity: 1 }}
        animate={{ opacity: isFlying ? [1, 1, 0] : 1 }}
        transition={{ duration: 0.95, times: [0, 0.7, 1] }}
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#120507] text-[#FCFAF6] select-none overflow-hidden"
        style={{ perspective: 1200 }}
      >
        {/* Background Velvet Ambiance & Gilded Rays */}
        <motion.div 
          className="absolute inset-0 pointer-events-none overflow-hidden"
          animate={isFlying ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Deep Crimson Ambient Bloom */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-gradient-to-tr from-[#8B1528]/60 via-[#580D1A]/50 to-transparent rounded-full blur-[160px]" 
          />
          {/* Creamy Vanilla Center Illumination */}
          <motion.div 
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-gradient-to-br from-[#DFC07D]/35 via-[#F5E4B8]/20 to-transparent rounded-full blur-[120px]" 
          />
          {/* Geometric Compass Golden Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full border border-[#DFC07D]/15 border-dashed pointer-events-none"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full border border-[#DFC07D]/20 pointer-events-none"
          />
          {/* Gentle Floating Golden Embers / Dust */}
          <div className="absolute inset-0 bg-[radial-gradient(#DFC07D_1.2px,transparent_1.2px)] [background-size:28px_28px] opacity-25" />
        </motion.div>

        {/* 
          Curtains splitting seamlessly on flight 
        */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-1/2 bg-[#120507] z-20 pointer-events-none"
          animate={isFlying ? { y: '-100%', opacity: 0.95 } : { y: 0, opacity: 1 }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
        />
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#120507] z-20 pointer-events-none"
          animate={isFlying ? { y: '100%', opacity: 0.95 } : { y: 0, opacity: 1 }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
        />

        {/* ─────────────────────────────────────────────────────────────────────────────
            ANIMATED 3D SPINNING LOGO & FLIGHT TO NAVBAR
            ───────────────────────────────────────────────────────────────────────────── */}
        <motion.div
          className="fixed z-40 flex items-center gap-3 cursor-default"
          initial={{
            top: '50%',
            left: '50%',
            x: '-50%',
            y: '-50%',
            scale: 1
          }}
          animate={
            isFlying
              ? {
                  // Flight coordinates targeting TopNavBar exact brand position
                  top: '20px',
                  left: 'max(24px, calc((100vw - 1360px)/2 + 32px))',
                  x: '0%',
                  y: '0%',
                  scale: 0.52,
                  transition: {
                    duration: 0.85,
                    ease: [0.16, 1, 0.3, 1]
                  }
                }
              : {
                  top: '50%',
                  left: '50%',
                  x: '-50%',
                  y: '-50%',
                  scale: 1
                }
          }
        >
          {/* Logo Medallion Container with 3D Spin & Radiant Sheen */}
          <motion.div
            initial={{ rotateY: 180, scale: 0.7, opacity: 0 }}
            animate={
              isFlying
                ? {
                    rotateY: 720,
                    rotateZ: [0, -10, 0],
                    scale: 1,
                    opacity: 1
                  }
                : {
                    rotateY: [180, 0, 0],
                    scale: 1,
                    opacity: 1
                  }
            }
            transition={{
              duration: isFlying ? 0.85 : 0.9,
              ease: [0.16, 1, 0.3, 1]
            }}
            style={{ transformStyle: 'preserve-3d' }}
            className="relative p-2 sm:p-2.5 rounded-2xl bg-gradient-to-br from-[#DFC07D] via-[#9E7D38] to-[#580D1A] shadow-[0_15px_50px_rgba(139,21,40,0.85)] border border-[#F5E4B8]/80 group"
          >
            {/* Spinning Golden Pulse Halo around Medallion */}
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.08, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-1.5 rounded-2xl border border-[#DFC07D]/50 border-dashed pointer-events-none"
            />

            {/* Inner Brand Artwork */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#240A0F] border border-[#DFC07D]/90 flex items-center justify-center shadow-inner relative">
              <img 
                src="/assets/logo.jpeg" 
                alt="The Kala Vault" 
                className="w-full h-full object-cover"
              />
              {/* Shimmer light flare passing across image */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none"
              />
            </div>

            {/* Corner Jewel Glints */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#F5E4B8] rotate-45 shadow-[0_0_10px_#F5E4B8]" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-[#F5E4B8] rotate-45 shadow-[0_0_10px_#F5E4B8]" />
          </motion.div>

          {/* Brand Name Typography flying together into Header position */}
          <div className="flex flex-col text-left">
            <motion.h1 
              animate={isFlying ? { color: '#1E1412', scale: 0.85 } : { color: '#FCFAF6', scale: 1 }}
              transition={{ duration: 0.7 }}
              className="font-copperplate text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-[0.22em] drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)] leading-tight whitespace-nowrap"
            >
              THE KALA VAULT
            </motion.h1>
            
            {/* Tagline fades during flight */}
            <motion.p 
              animate={isFlying ? { opacity: 0, height: 0 } : { opacity: 1, height: 'auto' }}
              transition={{ duration: 0.35 }}
              className="font-cormorant italic text-lg sm:text-xl text-[#DFC07D]/95 font-light tracking-wide mt-1 overflow-hidden"
            >
              Curating Joy. Inspiring Spaces.
            </motion.p>
          </div>
        </motion.div>

        {/* ─────────────────────────────────────────────────────────────────────────────
            PROGRESS BAR & SYSTEM STATUS (Fades gracefully as flight begins)
            ───────────────────────────────────────────────────────────────────────────── */}
        <motion.div
          animate={isFlying ? { opacity: 0, scale: 0.8, y: 30 } : { opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute bottom-20 z-30 flex flex-col items-center justify-center text-center px-6 max-w-xs w-full"
        >
          {/* Minimalist Gilded Progress Bar */}
          <div className="w-full mb-3">
            <div className="h-[2.5px] w-full bg-[#FCFAF6]/10 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full bg-gradient-to-r from-[#8B1528] via-[#DFC07D] to-[#FCFAF6] shadow-[0_0_14px_rgba(223,192,125,0.9)]"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>
          </div>

          {/* Archival Status Counter */}
          <div className="text-[10.5px] font-mono tracking-[0.25em] text-[#DFC07D]/90 uppercase font-semibold flex items-center gap-2">
            <motion.span 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-[#DFC07D]" 
            />
            <span>{progress === 100 ? 'ACCESS GRANTED • UNVEILING' : `ARCHIVAL VAULT • ${progress}%`}</span>
          </div>
        </motion.div>

      </motion.div>
    </AnimatePresence>
  );
}
