import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import { fetchArtworks, Artwork, getArtworkImagePath } from '../services/artworkService';
import { SkeletonArtworkCard } from '../components/SkeletonCard';

// ─── Animated counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2200;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const fadeUp = {
  hidden: { opacity: 0, y: 52 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
};

const STATS = [
  { value: 30, suffix: '+', label: 'Original Artworks' },
  { value: 50, suffix: '+', label: 'Installations' },
  { value: 100, suffix: '%', label: 'Client Satisfaction' },
];

const PILLARS = [
  {
    icon: 'person_search',
    title: 'Access to Knowledgeable Curators',
    desc: 'See curator-approved artworks in special collections released weekly, or work one-on-one with an art advisor to get personalised recommendations built around your brief.',
    accent: '#D4AF37',
    img: 'https://images.unsplash.com/photo-1578301978162-7aae4d755744?auto=format&fit=crop&q=80&w=900',
  },
  {
    icon: 'verified_user',
    title: 'Peace of Mind',
    desc: 'From curation and installation to maintenance and artwork rotation, we manage the entire process — so you enjoy a professionally curated programme without the operational burden.',
    accent: '#A8C5A0',
    img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=900',
  },
  {
    icon: 'star',
    title: 'Five-Star Service',
    desc: 'We pride ourselves on delivering world-class customer service to every client — corporations, hotels, developers, cafés, and commercial spaces alike.',
    accent: '#9BB8D4',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=900',
  },
];

// ─── Continuous Artwork Carousel ──────────────────────────────────────────────
function ArtworkCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const CARD_WIDTH = 380; // px — card width
  const GAP = 20;         // px — gap between cards
  const UNIT = CARD_WIDTH + GAP;
  const SPEED = 0.6; // px per frame

  // We animate via requestAnimationFrame for a perfectly smooth CSS-free scroll
  const posRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchArtworks(1, 8); // Fetch 8 artworks
      setArtworks(data.items);
      setLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    if (loading || artworks.length === 0) return;
    function animate() {
      posRef.current += SPEED;
      // Reset seamlessly when we've scrolled exactly one full set width
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
      <div className="flex gap-[20px] px-[20px] overflow-hidden select-none pb-4" style={{ cursor: 'default' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex-shrink-0" style={{ width: `${CARD_WIDTH}px` }}>
            <SkeletonArtworkCard className="mb-0 h-[440px]" />
            <div className="pt-4 pb-2">
              <div className="w-1/3 h-2 bg-stone-200/50 mb-2 animate-pulse" />
              <div className="w-2/3 h-4 bg-stone-200/50 mb-2 animate-pulse" />
              <div className="w-1/2 h-3 bg-stone-200/50 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (artworks.length === 0) return null;

  const CAROUSEL_ITEMS = [...artworks, ...artworks, ...artworks, ...artworks];

  return (
    <div className="relative overflow-hidden select-none" style={{ cursor: 'default' }}>
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #f5f3f0, transparent)' }} />
      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, #f5f3f0, transparent)' }} />

      <div
        ref={trackRef}
        className="flex will-change-transform"
        style={{ gap: `${GAP}px`, paddingLeft: '20px', paddingRight: '20px' }}
      >
        {CAROUSEL_ITEMS.map((art, i) => (
          <div
            key={`${art.id}-${i}`}
            className="group relative flex-shrink-0 overflow-hidden cursor-pointer"
            style={{ width: `${CARD_WIDTH}px` }}
            onClick={() => (window.location.href = `/artwork/${art.id}`)}
          >
            {/* Image */}
            <div className="relative overflow-hidden" style={{ height: '440px' }}>
              <img
                src={getArtworkImagePath(art)}
                alt={art.title}
                className="w-full h-full object-cover transition-transform duration-[1.8s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-108"
                draggable={false}
              />
              {/* Watermark tiled */}
              <div className="watermark-tiled transition-opacity duration-500 group-hover:opacity-0" />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-600" />
              {/* Hover info */}
              <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                <h3 className="font-headline-md text-xl text-paper-white mb-1 leading-tight">{art.title}</h3>
                <p className="font-label-caps text-[10px] text-gallery-gold uppercase tracking-[0.25em]">{art.artist || 'Unknown Artist'}</p>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-paper-white/20">
                  <span className="font-body-sm text-[12px] text-paper-white/80">{art.medium}</span>
                  <span className="font-label-caps text-[10px] text-paper-white/60">{art.dimensions || 'Variable'}</span>
                </div>
              </div>
            </div>
            {/* Below card info */}
            <div className="pt-4 pb-2">
              <p className="font-label-caps text-[9px] text-gallery-gold uppercase tracking-[0.25em] mb-1">{art.artist || 'Unknown Artist'}</p>
              <p className="font-headline-md text-[16px] text-primary leading-snug">{art.title}</p>
              <p className="font-body-sm text-[12px] text-on-surface-variant mt-1">{art.medium}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Manifesto() {
  const [activePillar, setActivePillar] = useState(0);
  const pillar = PILLARS[activePillar];

  const [reviews, setReviews] = useState([
    {
      client: "Corporate Client — Verified Partnership",
      quote: "Partnering with Kala Vault is like having an experienced curator by your side. We help businesses discover, rotate, and showcase artworks that elevate every space.",
      rating: 5
    }
  ]);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackCompany, setFeedbackCompany] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackQuote, setFeedbackQuote] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  useEffect(() => {
    const t = setInterval(() => setActivePillar(p => (p + 1) % PILLARS.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-paper-white text-primary font-body-md overflow-x-hidden min-h-screen selection:bg-gallery-gold/30">
      <TopNavBar />

      <main className="pt-[64px]">

        {/* ═══════════════════════════════════════════════════════════
            WHAT IS TKV — mission hero (no full-screen image)
        ═══════════════════════════════════════════════════════════ */}
        <section id="mission" className="pt-20 pb-0 bg-paper-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-8 md:px-16">

            {/* Top label row */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4 mb-12"
            >
              <div className="h-px w-10 bg-gallery-gold" />
              <span className="font-label-caps text-[10px] text-gallery-gold uppercase tracking-[0.4em]">Our Mission</span>
            </motion.div>

            {/* Large editorial layout: headline left, body right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch mb-20">
              {/* Left — mega headline */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-6 flex flex-col justify-center"
              >
                <h1 className="font-display-lg text-6xl md:text-7xl lg:text-[80px] text-primary leading-[1.0] tracking-tight">
                  What Is<br />
                  <span className="text-gallery-gold font-normal">The Kala</span><br />
                  <span className="font-light italic text-primary">Vault?</span>
                </h1>
              </motion.div>

              {/* Right — body + quote + buttons, divided by full height vertical line */}
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-6 border-l border-outline/10 pl-8 md:pl-12 flex flex-col justify-between py-2 space-y-8"
              >
                <p className="font-body-md text-[16px] text-on-surface-variant leading-[1.7]">
                  The Kala Vault provides curated artwork solutions for businesses through flexible rental, subscription, and acquisition programmes. We help corporations, hotels, developers, cafés, and commercial spaces discover and display original artworks that elevate their environments and create lasting impressions.
                </p>
                <div className="text-left">
                  <p className="font-display-sm italic text-xl md:text-2xl text-gallery-gold leading-relaxed">
                    "The process of art discovery has evolved to be more accessible, logical, and aesthetically pleasant than ever before."
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/subscriptions"
                    className="group inline-flex items-center justify-between bg-primary text-paper-white font-label-caps text-[11px] uppercase tracking-[0.2em] px-8 py-4 hover:bg-gallery-gold transition-all duration-500 font-bold min-w-[200px]"
                  >
                    <span>Explore Programmes</span>
                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </Link>
                  <Link
                    to="/inquire"
                    className="inline-flex items-center justify-center border border-outline-variant text-primary bg-white font-label-caps text-[11px] uppercase tracking-[0.2em] px-8 py-4 hover:border-gallery-gold hover:text-gallery-gold transition-all duration-400 font-bold min-w-[200px]"
                  >
                    Consult a Curator
                  </Link>
                </div>
              </motion.div>
            </div>


          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            STATS BAND
        ═══════════════════════════════════════════════════════════ */}
        <section className="bg-paper-white border-b border-t border-outline/10 mt-0">
          <div className="max-w-6xl mx-auto px-8 md:px-16 py-14 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-outline/10">
            {STATS.map((s, i) => (
              <div key={i} className="flex flex-col items-center justify-center py-10 md:py-8 text-center px-6 group cursor-default">
                <span className="font-display-lg text-4xl md:text-5xl text-primary leading-none mb-2 group-hover:text-gallery-gold transition-colors duration-500">
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                </span>
                <span className="font-label-caps text-[10px] text-gallery-gold/80 uppercase tracking-[0.28em]">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            ARTWORK CAROUSEL — continuous 3-up auto-scroll
        ═══════════════════════════════════════════════════════════ */}
        <section id="discover" className="py-24 md:py-32 bg-subtle-smoke overflow-hidden">
          <div className="max-w-7xl mx-auto px-8 md:px-16 mb-14">
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
              className="flex flex-col md:flex-row md:items-end justify-between gap-6"
            >
              <div>
                <p className="font-label-caps text-[10px] text-gallery-gold tracking-[0.35em] uppercase mb-5">Signature Art Collections</p>
                <h2 className="font-display-lg text-5xl md:text-6xl text-primary leading-[1.02] tracking-tight">
                  Our Artworks
                </h2>
              </div>
              <Link
                to="/collections"
                className="group inline-flex items-center gap-3 font-label-caps text-[11px] uppercase tracking-[0.28em] border-b border-primary/20 pb-1 hover:border-gallery-gold hover:text-gallery-gold transition-all duration-300 whitespace-nowrap self-end"
              >
                View Full Collection
                <span className="material-symbols-outlined text-[15px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            </motion.div>
          </div>

          {/* The continuous carousel — full width, no side padding */}
          <ArtworkCarousel />
        </section>

        {/* ═══════════════════════════════════════════════════════════
            WHY TKV — interactive pillar panel
        ═══════════════════════════════════════════════════════════ */}
        <section className="py-24 md:py-36 bg-paper-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-8 md:px-16">
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
              className="mb-14"
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="h-px w-8 bg-gallery-gold/50" />
                <p className="font-label-caps text-[10px] text-gallery-gold tracking-[0.35em] uppercase">Why TKV</p>
              </div>
              <h2 className="font-display-lg text-5xl md:text-6xl text-primary leading-[1.02] tracking-tight max-w-xl">
                How We're Different
              </h2>
            </motion.div>

            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
              className="grid grid-cols-1 lg:grid-cols-2 overflow-hidden border border-outline/10"
            >
              {/* Left: tabs */}
              <div className="flex flex-col divide-y divide-outline/10">
                {PILLARS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePillar(i)}
                    className={`group text-left p-8 md:p-10 transition-all duration-400 relative overflow-hidden ${activePillar === i ? 'bg-primary' : 'bg-paper-white hover:bg-subtle-smoke'
                      }`}
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-400"
                      style={{ background: activePillar === i ? p.accent : 'transparent' }}
                    />
                    <div className="flex items-start gap-5">
                      <span
                        className="material-symbols-outlined text-[22px] mt-0.5 flex-shrink-0 transition-colors duration-400"
                        style={{ color: activePillar === i ? p.accent : 'rgba(0,0,0,0.2)' }}
                      >
                        {p.icon}
                      </span>
                      <div>
                        <h3 className={`font-headline-md text-[17px] mb-2 leading-snug transition-colors duration-400 ${activePillar === i ? 'text-paper-white' : 'text-primary'}`}>
                          {p.title}
                        </h3>
                        <p className={`font-body-md text-[13px] leading-relaxed transition-colors duration-400 ${activePillar === i ? 'text-paper-white/60' : 'text-on-surface-variant'}`}>
                          {p.desc}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Right: image */}
              <div className="relative overflow-hidden h-[360px] lg:h-auto min-h-[360px]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activePillar}
                    src={pillar.img}
                    alt={pillar.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePillar + '-lbl'}
                    className="absolute bottom-7 left-7"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45 }}
                  >
                    <span className="font-label-caps text-[9px] uppercase tracking-[0.3em]" style={{ color: pillar.accent }}>
                      {pillar.title}
                    </span>
                  </motion.div>
                </AnimatePresence>
                <div className="absolute top-6 right-6 flex gap-1.5">
                  {PILLARS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActivePillar(i)}
                      className="rounded-full transition-all duration-400"
                      style={{
                        width: activePillar === i ? '22px' : '6px',
                        height: '6px',
                        background: activePillar === i ? pillar.accent : 'rgba(255,255,255,0.3)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            TRUSTPILOT QUOTE — dark full-bleed
        ═══════════════════════════════════════════════════════════ */}
        {/* ═══════════════════════════════════════════════════════════
            TRUSTPILOT QUOTE — dark full-bleed
        ═══════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden" style={{ background: '#0c0c0c' }}>
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 65%)' }}
          />
          <div className="relative z-10 py-32 md:py-44 px-8 md:px-16 max-w-5xl mx-auto text-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
              <div className="flex justify-center gap-1.5 mb-8">
                {Array.from({ length: reviews[activeReviewIndex]?.rating || 5 }).map((_, i) => (
                  <svg key={i} viewBox="0 0 20 20" fill="#D4AF37" className="w-5 h-5">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="font-label-caps text-[9px] text-gallery-gold uppercase tracking-[0.45em] mb-10">Client Feedback · Verified Review</p>
              
              <AnimatePresence mode="wait">
                {!showFeedbackForm && (
                  <motion.div
                    key={activeReviewIndex}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4 }}
                  >
                    <blockquote className="font-headline-md italic text-2xl md:text-3xl lg:text-[38px] text-paper-white/85 leading-[1.55] font-light max-w-4xl mx-auto mb-10">
                      "{reviews[activeReviewIndex]?.quote}"
                    </blockquote>
                    <div className="h-px w-10 bg-gallery-gold/30 mx-auto mb-6" />
                    <p className="font-label-caps text-[9px] text-paper-white/25 uppercase tracking-[0.35em]">{reviews[activeReviewIndex]?.client}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Expandable Form on Manifesto (Dark Themed) */}
              <AnimatePresence>
                {showFeedbackForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden bg-stone-950/60 border border-gallery-gold/20 p-8 rounded-lg max-w-xl mx-auto mt-8 text-left space-y-4 shadow-2xl backdrop-blur-md"
                  >
                    {feedbackSuccess ? (
                      <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center py-6 space-y-3"
                      >
                        <span className="material-symbols-outlined text-4xl text-gallery-gold animate-bounce">check_circle</span>
                        <h4 className="font-headline-md text-xl text-white font-medium">Thank You!</h4>
                        <p className="font-body-sm text-[13px] text-white/60 max-w-sm mx-auto leading-relaxed">
                           Your feedback has been registered and updated on the manifesto showcase.
                        </p>
                      </motion.div>
                    ) : (
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!feedbackQuote.trim()) return;
                          const newReview = {
                            client: `${feedbackName.trim()} · ${feedbackCompany.trim() || "Verified Partner"}`,
                            quote: feedbackQuote.trim(),
                            rating: feedbackRating
                          };
                          setReviews(prev => [...prev, newReview]);
                          setActiveReviewIndex(reviews.length); // switch index
                          setFeedbackSuccess(true);
                          setFeedbackName('');
                          setFeedbackCompany('');
                          setFeedbackQuote('');
                          setTimeout(() => setShowFeedbackForm(false), 3500);
                        }}
                        className="space-y-4"
                      >
                        <h4 className="font-headline-md text-lg text-white font-medium tracking-tight mb-2">Submit Your Manifesto Curation Review</h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="font-label-caps text-[9px] uppercase tracking-wider text-white/50">Your Name</label>
                            <input 
                              type="text" 
                              value={feedbackName} 
                              onChange={(e) => setFeedbackName(e.target.value)} 
                              placeholder="Rahul Sharma" 
                              className="bg-stone-900 border border-gallery-gold/20 focus:border-gallery-gold focus:outline-none px-3 py-2 text-[13px] text-white rounded-sm transition-all"
                              required
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="font-label-caps text-[9px] uppercase tracking-wider text-white/50">Role / Company</label>
                            <input 
                              type="text" 
                              value={feedbackCompany} 
                              onChange={(e) => setFeedbackCompany(e.target.value)} 
                              placeholder="Director, ITC Hotels" 
                              className="bg-stone-900 border border-gallery-gold/20 focus:border-gallery-gold focus:outline-none px-3 py-2 text-[13px] text-white rounded-sm transition-all"
                              required
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="font-label-caps text-[9px] uppercase tracking-wider text-white/50">Curation Experience Rating</label>
                          <div className="flex items-center gap-1.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setFeedbackRating(star)}
                                className="focus:outline-none"
                              >
                                <span 
                                  className={`material-symbols-outlined text-[20px] ${
                                    star <= feedbackRating ? 'text-gallery-gold fill-1' : 'text-white/20'
                                  }`}
                                  style={{ fontVariationSettings: star <= feedbackRating ? "'FILL' 1" : "'FILL' 0" }}
                                >
                                  star
                                </span>
                              </button>
                            ))}
                            <span className="font-mono text-[11px] text-white/30 ml-2">({feedbackRating} / 5)</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="font-label-caps text-[9px] uppercase tracking-wider text-white/50">Review Message</label>
                          <textarea 
                            value={feedbackQuote} 
                            onChange={(e) => setFeedbackQuote(e.target.value)} 
                            placeholder="Share your feedback on our art curation and architectural collections..." 
                            className="bg-stone-900 border border-gallery-gold/20 focus:border-gallery-gold focus:outline-none px-3 py-2 text-[13px] text-white rounded-sm h-20 resize-none transition-all"
                            required
                          />
                        </div>

                        <button 
                          type="submit" 
                          className="w-full py-3 bg-gallery-gold border border-gallery-gold text-primary hover:bg-white hover:border-white font-label-caps text-[10px] uppercase tracking-[0.25em] font-semibold transition-all duration-300 focus:outline-none"
                        >
                          Submit Review
                        </button>
                      </form>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Slider Dots & Toggle Button */}
              <div className="flex flex-col sm:flex-row justify-between items-center max-w-md mx-auto pt-10 gap-4">
                <div className="flex gap-2">
                  {reviews.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveReviewIndex(index)}
                      className="h-[2px] transition-all duration-500 cursor-pointer"
                      style={{ 
                        width: activeReviewIndex === index ? '40px' : '12px', 
                        background: activeReviewIndex === index ? '#D4AF37' : 'rgba(255,255,255,0.2)' 
                      }}
                    />
                  ))}
                </div>
                <button
                  onClick={() => {
                    setShowFeedbackForm(prev => !prev);
                    setFeedbackSuccess(false);
                  }}
                  className="inline-flex items-center gap-1.5 border border-gallery-gold/30 hover:border-gallery-gold/60 text-gallery-gold font-label-caps text-[9px] uppercase tracking-[0.2em] px-4 py-2 hover:bg-gallery-gold hover:text-black transition-all duration-500 rounded-sm"
                >
                  <span className="material-symbols-outlined text-[12px]">{showFeedbackForm ? "close" : "rate_review"}</span>
                  {showFeedbackForm ? "Close Form" : "Share Experience"}
                </button>
              </div>

            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            PHILOSOPHY STRIP
        ═══════════════════════════════════════════════════════════ */}
        <section className="bg-subtle-smoke border-y border-outline/10">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
            className="max-w-7xl mx-auto px-8 md:px-16 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-outline/10"
          >
            {[
              { label: 'Philosophy', text: 'Art is not decoration — it is the silent voice of your brand.' },
              { label: 'Approach', text: 'Every curation begins with the space, the people, and the story they wish to tell.' },
              { label: 'Promise', text: 'We remain your curatorial partner long after the first installation.' },
            ].map((item, i) => (
              <div key={i} className="p-10 md:p-14 group hover:bg-paper-white/70 transition-colors duration-400 cursor-default">
                <p className="font-label-caps text-[9px] text-gallery-gold uppercase tracking-[0.35em] mb-5">{item.label}</p>
                <p className="font-headline-md italic text-[17px] text-primary leading-[1.65]">{item.text}</p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            FINAL CTA — dark photo-backed
        ═══════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=2400"
              alt="Premium gallery space"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: 'rgba(18,14,10,0.88)' }} />
          </div>
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
            className="relative z-10 py-36 md:py-52 px-8 md:px-16 max-w-4xl mx-auto text-center flex flex-col items-center"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-8 bg-gallery-gold/40" />
              <p className="font-label-caps text-[10px] text-gallery-gold tracking-[0.4em] uppercase">Begin Your Journey</p>
              <div className="h-px w-8 bg-gallery-gold/40" />
            </div>
            <h2 className="font-display-lg text-5xl md:text-6xl lg:text-7xl text-paper-white mb-7 leading-[1.02] tracking-tight">
              Ready to Transform<br />
              <span className="font-headline-md italic font-light text-gallery-gold">Your Space?</span>
            </h2>
            <p className="font-body-md text-paper-white/55 text-[16px] leading-relaxed max-w-lg mb-14">
              Let The Kala Vault illuminate your environment with museum-quality artwork that inspires creativity, elevates your brand, and creates lasting impressions.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <Link
                to="/inquire"
                className="group inline-flex items-center gap-3 bg-gallery-gold text-primary font-label-caps text-[11px] uppercase tracking-[0.22em] px-12 py-4 hover:bg-paper-white transition-all duration-500"
              >
                Book a Consultation
                <span className="material-symbols-outlined text-[15px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
              <Link
                to="/collections"
                className="inline-flex items-center gap-2 border border-paper-white/25 text-paper-white font-label-caps text-[11px] uppercase tracking-[0.22em] px-12 py-4 hover:border-paper-white/60 hover:bg-paper-white/8 transition-all duration-500"
              >
                Browse Collection
              </Link>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
