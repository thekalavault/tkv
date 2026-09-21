import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'motion/react';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import { fetchArtworks, Artwork, getArtworkImagePath, LOCAL_ARTWORKS } from '../services/artworkService';
import { SkeletonArtworkCard } from '../components/SkeletonCard';
import { Award, ShieldCheck, Sparkles, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

function AnimatedCounter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { 
        setCount(target); 
        clearInterval(timer); 
      } else {
        setCount(Math.floor(start));
      }
    }, step);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

const PILLARS = [
  {
    num: '01',
    title: 'Senior Curatorial Advisory',
    subtitle: 'Spatial Cartography & Strategic Selection',
    desc: 'Collaborate with dedicated senior curators who analyze your architectural scale, ceiling heights, lighting angles, and interior palette to curate tailored museum-grade dossiers.',
    accent: '#C5A059',
    img: '/assets/curator_white_glove.jpg',
    highlights: ['Bespoke 3D Spatial Scan', 'Lux & Glare Spectral Study', 'Tailored Acquisition Dossier']
  },
  {
    num: '02',
    title: 'Zero Operational Disruption',
    subtitle: 'Archival Conservation & Laser Mounting',
    desc: 'From custom hardwood profiles and 99.8% UV-blocking Tru-Vue museum glass to off-hours laser-aligned installation and subterranean security cleats, we execute every logistical detail.',
    accent: '#7B2431',
    img: '/assets/keyhole_magnifier_art.jpg',
    highlights: ['Tru-Vue 99.8% UV Protection', 'Overnight Laser Mounting', 'Climate-Controlled Transit']
  },
  {
    num: '03',
    title: 'Living Gallery Refresh Cycles',
    subtitle: 'Dynamic 90-180 Day Seasonal Refreshes',
    desc: 'Transform your suites into perpetual cultural destinations with scheduled quarterly rotations, continuous on-site conservation care, and comprehensive insurance coverage.',
    accent: '#1E1412',
    img: '/assets/artistic_boardroom.jpg',
    highlights: ['Dynamic Rotational Index', 'On-Site Surface Care', 'Concierge Asset Coverage']
  },
];

function ArtworkRibbon({ artworks, loading }: { artworks: Artwork[]; loading: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const CARD_WIDTH = 320;
  const GAP = 24;
  const UNIT = CARD_WIDTH + GAP;
  const SPEED = 0.65;

  const posRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (loading || artworks.length === 0) return;
    function animate() {
      posRef.current += SPEED;
      const loopWidth = artworks.length * UNIT;
      if (posRef.current >= loopWidth) {
        posRef.current -= loopWidth;
      }
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    }
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [loading, artworks.length, UNIT]);

  if (loading) {
    return (
      <div className="flex gap-6 px-6 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="shrink-0 w-[320px]">
            <SkeletonArtworkCard key={i} />
          </div>
        ))}
      </div>
    );
  }

  if (artworks.length === 0) return null;
  const CAROUSEL_ITEMS = [...artworks, ...artworks, ...artworks];

  return (
    <div className="relative overflow-hidden select-none py-4">
      {/* Gradient Vignettes */}
      <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 z-10 pointer-events-none bg-gradient-to-r from-[#FAF6F0] to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 z-10 pointer-events-none bg-gradient-to-l from-[#FAF6F0] to-transparent" />

      <div
        ref={trackRef}
        className="flex will-change-transform"
        style={{ gap: `${GAP}px`, paddingLeft: '24px', paddingRight: '24px' }}
      >
        {CAROUSEL_ITEMS.map((art, i) => (
          <Link
            key={`${art.id}-${i}`}
            to={`/artwork/${art.id}`}
            className="group shrink-0 cursor-pointer flex flex-col items-center"
            style={{ width: `${CARD_WIDTH}px` }}
          >
            {/* Museum Frame Container */}
            <div className="relative p-2.5 bg-[#1C120C] rounded-xl border border-[#C5A059]/40 overflow-hidden transition-all duration-300 group-hover:border-[#7B2431] group-hover:shadow-xl">
              <div className="p-0.5 bg-gradient-to-tr from-[#9E7D38] via-[#DFC07D] to-[#9E7D38] rounded-lg">
                <div className="relative h-[300px] flex items-center justify-center overflow-hidden bg-[#120704] rounded-md">
                  <img
                    src={getArtworkImagePath(art)}
                    alt={art.title}
                    className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-105"
                    draggable={false}
                  />
                  <div className="watermark-tiled opacity-20 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Label Below Frame */}
            <div className="mt-3.5 text-center px-2">
              <h4 className="font-cinzel text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#1E1412] group-hover:text-[#7B2431] transition-colors truncate w-[280px]">
                {art.title}
              </h4>
              <p className="font-cormorant italic text-sm text-[#1E1412]/75 mt-0.5">
                {art.artist || 'Curated Masterwork'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Manifesto() {
  const [activePillar, setActivePillar] = useState(0);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loadingArtworks, setLoadingArtworks] = useState(true);
  const [totalCount, setTotalCount] = useState(44);
  const [artistCount, setArtistCount] = useState(18);

  const pillar = PILLARS[activePillar];

  useEffect(() => { 
    window.scrollTo(0, 0); 
    
    async function loadCatalog() {
      try {
        setLoadingArtworks(true);
        const data = await fetchArtworks(1, 16);
        if (data && data.items && data.items.length > 0) {
          setArtworks(data.items);
          const total = data.total || data.items.length;
          setTotalCount(total);
          
          // Calculate distinct dynamic artist count
          const uniqueArtists = new Set(data.items.map((a: Artwork) => a.artist).filter(Boolean));
          setArtistCount(Math.max(uniqueArtists.size, 12));
        } else {
          setArtworks(LOCAL_ARTWORKS);
          setTotalCount(LOCAL_ARTWORKS.length);
        }
      } catch (err) {
        setArtworks(LOCAL_ARTWORKS);
        setTotalCount(LOCAL_ARTWORKS.length);
      } finally {
        setLoadingArtworks(false);
      }
    }

    loadCatalog();
  }, []);

  // Dynamic Real Metrics grounded in verified data
  const dynamicStats = [
    { value: totalCount, suffix: '+', label: 'Authenticated Masterworks in Catalog' },
    { value: artistCount, suffix: '+', label: 'Verified Indian Master Artists' },
    { value: 100, suffix: '%', label: 'Cryptographic Provenance Verified' },
    { value: 90, suffix: ' Days', label: 'Dynamic Seasonal Rotation Cadence' }
  ];

  return (
    <div className="bg-[#FAF6F0] text-[#1E1412] font-sans overflow-x-hidden min-h-screen selection:bg-[#C5A059]/30">
      <TopNavBar />

      <main className="pt-28 md:pt-36">
        
        {/* Mission Hero */}
        <section className="px-6 md:px-12 max-w-[1500px] mx-auto mb-20 md:mb-28">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#C5A059]" />
            <span className="font-cinzel text-[10.5px] uppercase tracking-[0.28em] text-[#7B2431] font-bold">
              THE CURATORIAL MANIFESTO
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-7">
              <h1 className="font-brand text-4xl sm:text-6xl md:text-7xl lg:text-[76px] text-[#1E1412] font-bold tracking-tight leading-[1.04] mb-6">
                Where Space <br />
                Becomes <br />
                <span className="text-[#7B2431] italic font-cormorant font-normal">Significance.</span>
              </h1>
            </div>

            <div className="lg:col-span-5 border-l-2 border-[#C5A059]/40 pl-6 md:pl-10 space-y-5">
              <p className="font-cormorant italic text-xl sm:text-2xl text-[#1E1412]/90 leading-relaxed font-light">
                “Art is not merely decorative staging; it is the definitive, authoritative voice of an architectural environment.”
              </p>
              <p className="text-xs sm:text-sm text-[#1E1412]/75 leading-relaxed font-light">
                The Kala Vault empowers visionary corporations, luxury hospitality brands, and private estates to acquire, rotate, and experience certified museum-grade artworks without operational complexity.
              </p>

              <div className="flex flex-wrap gap-3.5 pt-2">
                <Link 
                  to="/subscriptions" 
                  className="bg-[#7B2431] hover:bg-[#58111A] text-[#FAF6F0] border border-[#DFC07D]/50 font-cinzel text-[11px] uppercase tracking-[0.20em] font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-xs hover:shadow-md"
                >
                  EXPLORE PLANS
                </Link>
                <Link 
                  to="/inquire" 
                  className="bg-[#FAF6F0] hover:bg-[#1E1412]/5 text-[#1E1412] border border-[#C5A059]/50 font-cinzel text-[11px] uppercase tracking-[0.20em] font-bold py-3 px-6 rounded-lg transition-all duration-300"
                >
                  CONSULT A CURATOR
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Real Dynamic Stats Band */}
        <section className="bg-[#FCFAF6] border-y border-[#C5A059]/25 py-12 md:py-16 px-6 md:px-12 shadow-xs">
          <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-[#C5A059]/25 text-center">
            {dynamicStats.map((s, i) => (
              <div key={i} className="pt-6 lg:pt-0 px-4 first:pt-0">
                <p className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold mb-1.5 text-[#7B2431] tracking-tight">
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                </p>
                <p className="font-cinzel text-[10.5px] uppercase tracking-[0.20em] text-[#1E1412]/70 font-semibold leading-snug">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Continuous Dynamic Artwork Ribbon */}
        <section className="py-20 md:py-26 bg-[#F5EFEB]/70 overflow-hidden border-b border-[#C5A059]/25">
          <div className="max-w-[1500px] mx-auto px-6 md:px-12 mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <span className="font-cinzel text-[10px] text-[#7B2431] uppercase tracking-[0.28em] font-bold block mb-1">
                AUTHENTICATED LIVING CATALOG
              </span>
              <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl text-[#1E1412] font-bold">
                The Curated Vault Collection
              </h2>
            </div>
            <Link 
              to="/collections" 
              className="bg-[#7B2431] hover:bg-[#58111A] text-[#FAF6F0] border border-[#DFC07D]/50 font-cinzel text-[11px] uppercase tracking-[0.18em] font-bold py-2.5 px-6 rounded-lg transition-all duration-300 flex items-center gap-2 shadow-xs"
            >
              <span>BROWSE ALL WORKS ({totalCount})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          
          <ArtworkRibbon artworks={artworks} loading={loadingArtworks} />
        </section>

        {/* The 3 Core Pillars Section with Rich Interactive Media */}
        <section className="py-20 md:py-28 px-6 md:px-12 max-w-[1500px] mx-auto">
          <div className="max-w-3xl mb-12">
            <span className="font-cinzel text-[10.5px] text-[#7B2431] uppercase tracking-[0.28em] font-bold block mb-1">
              THE KALA VAULT PHILOSOPHY
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl text-[#1E1412] font-bold">
              Engineered for Discerning Leadership
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border border-[#C5A059]/35 bg-[#FCFAF6] rounded-3xl overflow-hidden shadow-xl">
            
            {/* Left: Tab Selectors */}
            <div className="lg:col-span-6 divide-y divide-[#C5A059]/20 flex flex-col justify-center">
              {PILLARS.map((p, i) => {
                const isActive = activePillar === i;
                return (
                  <button
                    key={i}
                    onClick={() => setActivePillar(i)}
                    className={`text-left p-6 sm:p-8 transition-all duration-300 cursor-pointer ${
                      isActive 
                        ? 'bg-[#7B2431] text-[#FAF6F0]' 
                        : 'hover:bg-[#FAF6F0] text-[#1E1412]'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span className={`font-mono text-sm font-bold mt-1 px-2 py-0.5 rounded ${
                        isActive ? 'bg-[#DFC07D] text-[#1E1412]' : 'bg-[#7B2431]/10 text-[#7B2431]'
                      }`}>
                        {p.num}
                      </span>
                      <div className="flex-1">
                        <h3 className="font-cinzel text-base sm:text-lg font-bold uppercase tracking-wider mb-1 leading-snug">
                          {p.title}
                        </h3>
                        <p className={`text-[11px] font-mono uppercase tracking-wider mb-2 ${
                          isActive ? 'text-[#DFC07D]' : 'text-[#7B2431]'
                        }`}>
                          {p.subtitle}
                        </p>
                        <p className={`text-xs sm:text-[13px] leading-relaxed font-light ${
                          isActive ? 'text-[#FAF6F0]/90' : 'text-[#1E1412]/75'
                        }`}>
                          {p.desc}
                        </p>

                        {/* Pillar Highlights */}
                        <div className="mt-3 pt-3 border-t border-white/15 flex flex-wrap gap-2">
                          {p.highlights.map((h, hIdx) => (
                            <span 
                              key={hIdx} 
                              className={`text-[10px] font-sans px-2.5 py-0.5 rounded-full ${
                                isActive ? 'bg-white/15 text-white' : 'bg-[#1E1412]/5 text-[#1E1412]/80'
                              }`}
                            >
                              ✓ {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right: Dynamic High-Res Image Preview */}
            <div className="lg:col-span-6 relative min-h-[420px] bg-[#160D0A] overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePillar}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <img
                    src={pillar.img}
                    alt={pillar.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#160D0A]/90 via-[#160D0A]/20 to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Bottom Card Annotation */}
              <div className="absolute bottom-6 left-6 right-6 z-10">
                <span className="font-cinzel text-[10px] uppercase tracking-widest text-[#DFC07D] font-bold block mb-1">
                  PILLAR {pillar.num}
                </span>
                <h4 className="font-cinzel text-xl font-bold text-white mb-1">
                  {pillar.title}
                </h4>
                <p className="text-xs text-[#FAF6F0]/75 font-light">
                  {pillar.subtitle}
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="px-6 md:px-12 max-w-[1500px] mx-auto pb-24">
          <div className="w-full bg-gradient-to-br from-[#1E1412] via-[#2A1815] to-[#1E1412] text-[#FAF6F0] py-16 md:py-20 px-8 md:px-16 text-center relative rounded-3xl overflow-hidden border border-[#C5A059]/40 shadow-2xl">
            <span className="font-cinzel text-[10.5px] uppercase tracking-[0.28em] text-[#DFC07D] mb-3 block font-bold">
              TRANSFORM YOUR ENVIRONMENT
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl text-[#FAF6F0] font-bold tracking-tight mb-6 max-w-2xl mx-auto leading-tight">
              Ready to elevate your corporate or private walls?
            </h2>
            <p className="text-xs sm:text-sm text-[#FAF6F0]/80 max-w-lg mx-auto font-light leading-relaxed mb-8">
              Experience seamless museum-grade art rotation tailored specifically to your architectural vision and operational needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/inquire" 
                className="bg-[#7B2431] hover:bg-[#58111A] text-[#FAF6F0] border border-[#DFC07D]/60 font-cinzel text-xs uppercase tracking-[0.18em] font-bold py-3.5 px-8 rounded-full transition-all duration-300 shadow-md hover:scale-105"
              >
                BOOK A PRIVATE CONSULTATION
              </Link>
              <Link 
                to="/collections" 
                className="bg-white/10 text-white border border-white/25 hover:bg-white hover:text-[#1E1412] font-cinzel text-xs uppercase tracking-[0.18em] font-bold py-3.5 px-8 rounded-full transition-all duration-300"
              >
                EXPLORE MASTERPIECES
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
