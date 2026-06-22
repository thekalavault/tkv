import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'motion/react';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import { getArtworkImagePath, getArtworkImageWithWatermark, formatPrice, fetchArtworks, Artwork } from '../services/artworkService';
import { determineTierFromValue } from '../lib/collectionsData';
import { ArtworkTierBadge } from '../components/ArtworkTierInfo';
import ChatBot from '../components/ChatBot';
import { SkeletonFeaturedCard } from '../components/SkeletonCard';

const SPACES_DATA = [
  {
    id: 1,
    title: "Executive Boardroom",
    subtitle: "CORPORATE INSTALLATION",
    description: "Foster authoritative environments with striking monochrome abstracts.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUUpGx4ETP0t0VlaA9m_2czNi6DRHPhwY7Dx1DDQHyHN9Wo9hGRbC_-LbTReM8mPCX4joMwgp6ihw62B2naEcpY0Oa0C8nxN9KTbyQenHyag-cEsXIJiLH0lQtlQWH6Qws6qgPMf18VA0fgGUEp-cTTYySol4_QM06UOCwHCJsxTGsD3w105rYVNkoOfYONO44N6FaBqxq3PzUUsWTjHp8haU1xt8c4ATtn1vIoYbh-3MQgXLI_WR11YykdOKfA6EMMpXDCwYv1UM"
  },
  {
    id: 2,
    title: "Private Penthouse",
    subtitle: "RESIDENTIAL CURATION",
    description: "Curate warmth through monumental sculptures and textured canvases.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA1T484GbqtKdQJCCaFbU1MEMToj0-9EydS548uHxMsQdxwId8stg4biMi59w6o6-RgS3HBp2LCIN4CLgXhwzMhSbTvWm3J3DLLfpR4jW6mD32WSXK0qhPzZs709nDZUnbUbYTyed8xs4r3msIbrQJdTugk8drkb7z5kCBr6N6UJ7ahInFlJ2E7J4P87yEChEgzWudmg5my6kziR8PNM-A7sBxFq4lJku5S8VdvcgvxoSQzWWqq1nX2nkrWgfcJYwhG72CEoDsMF1o"
  },
  {
    id: 3,
    title: "Grand Circulation",
    subtitle: "ARCHITECTURAL SCALE",
    description: "Scale and drama to define premium transit paths and grand lobbies.",
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=2000"
  }
];

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: "easeOut" }
  }
};

const heroVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const heroChildVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const TRUST_IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC_lfwtAzyFIfTNLKi9QYrnf3k36HGNX68Td0f2LzAhedS1CGwCA0Qx4zC2TZb9Es5XA46x6GONusZW875b8JbY_8DnV_pmOtfUYcxoKcQZgmFnPVXfHujEMFmAo-rpDbYD67TiIef5d8jrYzvCMay5rU_0sMXaYziUYXSTWV3bL1SbMyP-nZAn39AAF3L_PCyQM-EfBViMp_Ro4WcmP4L7qRrED4BIvCzTmGAX90CEt20qn9TtYso2bYbdtmkyPyiYz64780nE3FI",
  "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200"
];

const TESTIMONIALS_DATA = [
  {
    id: 1,
    client: "ITC Group",
    quote: "“The curation process was exceptionally smooth, and the quarterly artwork rotations have completely transformed our corporate headquarters. It fosters an inspiring, sophisticated atmosphere for both our clients and employees.”",
    image: "/assets/{65CF477C-9A48-4B93-947E-726F27A16B71}.png",
    location: "Executive Suites, New Delhi",
    project: "Corporate Workspace Curation"
  },
  {
    id: 2,
    client: "JLL Americas",
    quote: "“Kalavault's white-glove service and dynamic leasing model are exactly what modern commercial spaces need. The architectural-scale installations have given our properties a distinct, premium identity that wows stakeholders.”",
    image: "/assets/{699C6484-31E9-49BF-A8BC-426AFE5D5539}.png",
    location: "Regional HQ, Chicago",
    project: "Commercial Property Curation"
  },
  {
    id: 3,
    client: "Lucia Residences",
    quote: "“As a private collector, having access to such a diverse range of museum-grade pieces with the flexibility of a monthly subscription is a dream. The placement and framing are masterfully executed.”",
    image: "/assets/{E65E74D4-7D04-4B81-9700-81D0EE6CED29}.png",
    location: "Private Collection, Milan",
    project: "Residential Curation"
  },
  {
    id: 4,
    client: "Lucia Boutique Curation",
    quote: "“The transition between different thematic seasons keeps our boutique gallery space alive, responsive, and engaging. The curation is tailored perfectly to our color scheme and lighting design.”",
    image: "/assets/{F666B0B5-1E36-45E4-A191-D877D7AE1F29}.png",
    location: "Gallery Lounge, Florence",
    project: "Boutique Gallery Coordination"
  }
];

export default function LandingPage() {
  const navigate = useNavigate();
  // Premium Parallax Effect
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1500], [0, 600]);

  const [testimonials, setTestimonials] = useState(TESTIMONIALS_DATA);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [trustSlide, setTrustSlide] = useState(0);
  const [latestArtworks, setLatestArtworks] = useState<Artwork[]>([]);
  const [watermarkedImages, setWatermarkedImages] = useState<Record<string, string>>({});
  const [loadingArtworks, setLoadingArtworks] = useState(true);

  // Feedback Form State
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackCompany, setFeedbackCompany] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackQuote, setFeedbackQuote] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SPACES_DATA.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTrustSlide((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  // Load watermarked images for featured artworks
  useEffect(() => {
    const loadData = async () => {
      setLoadingArtworks(true);
      const data = await fetchArtworks(1, 4);
      setLatestArtworks(data.items);
      setLoadingArtworks(false);

      for (const art of data.items) {
        try {
          const watermarked = await getArtworkImageWithWatermark(art);
          setWatermarkedImages(prev => ({
            ...prev,
            [art.id]: watermarked
          }));
        } catch (error) {
          console.error(`Error watermarking artwork ${art.id}:`, error);
        }
      }
    };
    loadData();
  }, []);



  return (
    <div className="bg-paper-white text-primary font-body-md selection:bg-gallery-gold/30 min-h-screen">
      <ChatBot />
      <TopNavBar />

      { /* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0 w-full h-full scale-110">
          <img
            className="w-full h-full object-cover"
            alt="Welcoming luxury workspace with seating and art"
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2500&q=80"
          />
        </motion.div>
        {/* Gradient overlays to ensure premium text legibility over any structural lines */}
        <div className="absolute inset-0 bg-black/20 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/60"></div>

        <motion.div
          className="relative z-10 h-full flex flex-col justify-center items-center text-center px-margin-mobile md:px-margin-desktop text-paper-white max-w-[1800px] mx-auto"
          variants={heroVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={heroChildVariants} className="font-display-lg text-4xl md:text-5xl lg:text-7xl max-w-4xl mb-6 leading-[1.05] drop-shadow-lg text-paper-white">
            Illuminating the Corporate Landscape
          </motion.h1>
          <motion.p variants={heroChildVariants} className="font-headline-md italic text-paper-white/90 text-xl md:text-2xl mb-10 max-w-2xl drop-shadow-md leading-relaxed">
            Premium Art Leasing & Curation for High-Profile Workspaces
          </motion.p>
          <motion.div variants={heroChildVariants} className="flex flex-col md:flex-row gap-6 mt-2">
            <Link to="/subscriptions" className="bg-paper-white text-primary font-body-sm text-[12px] font-bold px-10 py-4 uppercase tracking-[0.15em] hover:bg-gallery-gold hover:text-paper-white transition-all duration-500 text-center shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]">Explore Programs</Link>
            <Link to="/inquire" className="border border-paper-white/50 text-paper-white font-body-sm text-[12px] font-bold px-10 py-4 uppercase tracking-[0.15em] hover:bg-paper-white hover:text-primary transition-all duration-500 backdrop-blur-md text-center hover:border-paper-white shadow-sm hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transform">Consult Curation</Link>
          </motion.div>
        </motion.div>
        <motion.div
          variants={heroChildVariants}
          initial="hidden"
          animate="visible"
          className="absolute bottom-12 left-margin-desktop hidden md:flex flex-col items-center gap-4 text-paper-white/60"
        >
          <span className="font-body-md text-[10px] font-bold tracking-[0.2em] transform -rotate-90 origin-bottom mb-12 uppercase">SCROLL</span>
          <div className="w-px h-16 bg-paper-white/30 relative overflow-hidden">
            <motion.div
              className="absolute top-0 w-full h-1/2 bg-paper-white"
              animate={{ y: [0, 64] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
          </div>
        </motion.div>
      </section>

      { /* Featured Artwork Grid */}
      <motion.section
        className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-[1600px] mx-auto"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 md:mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-label-caps text-[10px] text-gallery-gold uppercase tracking-[0.3em] block font-bold">
                Curated Selection
              </span>
              <div className="h-[1px] w-12 bg-gallery-gold/30" />
            </div>
            <h2 className="font-display-lg text-4xl md:text-5xl lg:text-6xl tracking-tight text-primary leading-tight">
              Latest <span className="italic font-light text-gallery-gold font-serif">Acquisitions</span>
            </h2>
          </div>
          <a className="font-label-caps text-[10px] uppercase tracking-[0.2em] border-b border-primary/20 pb-1.5 hover:border-gallery-gold hover:text-gallery-gold transition-all duration-300 font-bold" href="/collections">
            VIEW COLLECTION
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 md:auto-rows-[300px] gap-4 md:gap-6 grid-flow-row-dense">
          {loadingArtworks ? (
            <>
              <SkeletonFeaturedCard layoutClass="md:col-span-2 md:row-span-2" />
              <SkeletonFeaturedCard layoutClass="col-span-1 row-span-1" />
              <SkeletonFeaturedCard layoutClass="col-span-1 row-span-1" />
              <SkeletonFeaturedCard layoutClass="md:col-span-3 md:row-span-1" />
            </>
          ) : (
            latestArtworks.map((art, index) => {
              let layoutClass = "col-span-1 row-span-1";
              if (index === 0) layoutClass = "md:col-span-2 md:row-span-2";
              else if (index === 3) layoutClass = "md:col-span-3 md:row-span-1";

            const imageUrl = watermarkedImages[art.id] || getArtworkImagePath(art);
            const tierStr = determineTierFromValue(art.replacementValue);
            const priceStr = formatPrice(art.rentalPriceCents ? art.rentalPriceCents : Math.round((art.replacementValue || 15000) * 0.012));

            return (
              <div
                key={art.id}
                className={`group cursor-pointer relative overflow-hidden ${layoutClass} h-[350px] md:h-auto rounded-xl border border-outline/5 shadow-[0_8px_30px_rgba(0,0,0,0.015)] transition-all duration-500`}
                onClick={() => navigate('/artwork/' + art.id)}
              >
                {/* Image zoom on hover */}
                <img
                  className="w-full h-full object-cover origin-center group-hover:scale-105 transition-transform duration-[1200ms] ease-out"
                  alt={art.title}
                  src={imageUrl}
                />

                {/* Tiled watermark repeating overlay - fades out on hover detail overlay */}
                <div className="watermark-tiled opacity-80 group-hover:opacity-10 transition-opacity duration-500" />

                {/* Structured details display on hover */}
                <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-between p-6 text-paper-white z-20">
                  {/* Framing brackets simulating gallery mounting */}
                  <div className="absolute top-4 left-4 w-3.5 h-3.5 border-t border-l border-gallery-gold/60 transition-transform duration-500 scale-95 group-hover:scale-100" />
                  <div className="absolute top-4 right-4 w-3.5 h-3.5 border-t border-r border-gallery-gold/60 transition-transform duration-500 scale-95 group-hover:scale-100" />
                  <div className="absolute bottom-4 left-4 w-3.5 h-3.5 border-b border-l border-gallery-gold/60 transition-transform duration-500 scale-95 group-hover:scale-100" />
                  <div className="absolute bottom-4 right-4 w-3.5 h-3.5 border-b border-r border-gallery-gold/60 transition-transform duration-500 scale-95 group-hover:scale-100" />

                  {/* Header Row */}
                  <div className="flex justify-between items-center text-[10px] md:text-[11px] font-mono tracking-widest text-paper-white/60 border-b border-white/10 pb-3 uppercase">
                    <span>{art.dimensions || 'Variable'}</span>
                    <span className="text-gallery-gold font-bold">{tierStr.toUpperCase()} TIER</span>
                  </div>

                  {/* Center Content details */}
                  <div className="my-auto text-center px-4">
                    <h3 className="font-display-lg text-2xl md:text-3xl lg:text-4xl text-paper-white mb-2 leading-tight">
                      {art.title}
                    </h3>
                    <p className="font-label-caps text-[11px] md:text-[12px] text-gallery-gold tracking-widest uppercase mb-3 font-semibold">
                      {art.artist || 'Unknown Artist'}
                    </p>
                    <p className="text-[12px] md:text-[13px] text-paper-white/75 font-body-md line-clamp-3 leading-relaxed max-w-md mx-auto">
                      {art.medium} — {art.description}
                    </p>
                  </div>

                  {/* Footer Row */}
                  <div className="flex items-end justify-between pt-3 border-t border-white/10 text-[10px] md:text-[11px] font-mono tracking-widest">
                    <div className="flex flex-col text-left">
                      <span className="text-paper-white/40 text-[8.5px] md:text-[9.5px] uppercase tracking-widest block mb-0.5">Lease Cost</span>
                      <span className="text-gallery-gold font-bold text-sm md:text-base leading-none">{priceStr}</span>
                    </div>
                    
                    <span className="font-label-caps text-[10px] md:text-[11px] text-paper-white font-bold tracking-widest group-hover:text-gallery-gold transition-colors duration-300 flex items-center gap-1.5">
                      VIEW DETAILS
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </span>
                  </div>
                </div>
              </div>
            )
          }))}
        </div>
      </motion.section>



      {/* ── Merged Process + Method: The Journey ── */}
      <JourneySection />

      { /* Client Testimonials Section - Redesigned Premium Editorial Layout */ }
      <motion.section 
        className="py-section-gap px-margin-mobile md:px-margin-desktop bg-paper-white text-primary overflow-hidden relative border-y border-outline/5"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        style={{
          backgroundImage: 'radial-gradient(ellipse at top right, rgba(212, 175, 55, 0.02) 0%, transparent 70%)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 z-0 pointer-events-none" />
        
        <div className="max-w-[1440px] mx-auto relative z-10">
          <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between border-b border-primary/10 pb-8">
            <div>
              <p className="font-label-caps text-[10px] text-gallery-gold tracking-[0.3em] uppercase mb-4">// PORTFOLIO PLACEMENTS</p>
              <h2 className="font-headline-lg text-headline-lg text-primary leading-none">Client Reviews</h2>
            </div>
            <div className="mt-6 md:mt-0 font-label-caps text-[11px] text-primary/50 tracking-[0.2em] uppercase">
              SELECT INSTALLATIONS & EXHIBITIONS
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            {/* Left Column: Framed Image Showcase */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="border border-primary/10 p-3 bg-subtle-smoke/25 backdrop-blur-sm shadow-[0_30px_60px_-15px_rgba(0,0,0,0.06)] relative group rounded-sm max-w-md mx-auto lg:max-w-none">
                <div className="aspect-[3/4] w-full overflow-hidden bg-subtle-smoke relative rounded-[1px] border border-primary/5">
                  <AnimatePresence mode="popLayout">
                    <motion.img
                      key={trustSlide}
                      src={testimonials[trustSlide]?.image || "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=600"}
                      alt={`${testimonials[trustSlide]?.client} Installation`}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)]"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                  </AnimatePresence>
                  
                  <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md border border-primary/10 px-4 py-3 rounded-[2px] z-20 flex justify-between items-center text-[10px] tracking-widest font-label-caps text-primary shadow-sm">
                    <span className="text-primary/60 uppercase">CASE STUDY: 0{trustSlide + 1}</span>
                    <span className="text-gallery-gold font-bold">VERIFIED</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Testimonial Text */}
            <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col justify-between min-h-[400px]">
              <div className="space-y-6">
                <span className="font-label-caps text-[11px] text-gallery-gold tracking-[0.25em] uppercase block">
                  {testimonials[trustSlide]?.project}
                </span>
                
                <div className="w-16 h-px bg-gallery-gold/40 my-6" />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={trustSlide}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-8"
                  >
                    <blockquote className="font-quote italic text-2xl md:text-3xl lg:text-4xl text-primary leading-relaxed font-light tracking-wide">
                      {testimonials[trustSlide]?.quote}
                    </blockquote>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Editorial bottom navigation bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-12 mt-12 border-t border-primary/10 gap-6">
                {/* Custom Slide Number */}
                <div className="flex items-center gap-6">
                  <span className="font-quote italic text-2xl text-gallery-gold">
                    0{trustSlide + 1}
                  </span>
                  <div className="w-12 h-px bg-primary/20" />
                  <span className="font-quote italic text-sm text-primary/40">
                    0{testimonials.length}
                  </span>
                </div>
                {/* Dots */}
                <div className="flex gap-2.5">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setTrustSlide(index)}
                      className="h-1.5 rounded-full transition-all duration-500 cursor-pointer"
                      style={{
                        width: trustSlide === index ? '28px' : '6px',
                        background: trustSlide === index ? '#D4AF37' : 'rgba(0,0,0,0.15)'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ─── JOURNEY COMPONENT Restructure ─── */}
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {/* JOURNEY SECTION  — merged Process + Method */}
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {/* Code content continues in definitions below... */}


      {/* Trusted By — Premium Partner Band */}
      <TrustedByBand />

      { /* Footer */}
      { /* Artifact Spotlight: Spaces Carousel */}
      <motion.section
        className="w-full relative bg-subtle-smoke min-h-[80vh] flex items-center justify-center overflow-hidden py-32" id="spotlight"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="absolute inset-0 z-0 bg-matte-black">
          <AnimatePresence mode="popLayout">
            <motion.img
              key={currentSlide}
              src={SPACES_DATA[currentSlide].image}
              alt={SPACES_DATA[currentSlide].title}
              className="w-full h-full object-cover grayscale-[30%] opacity-30 mix-blend-luminosity"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.3, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </AnimatePresence>
        </div>

        <div className="relative z-20 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full grid grid-cols-1 md:grid-cols-12 gap-gutter items-center text-paper-white">

          <div className="md:col-span-5 active">
            <p className="font-label-caps text-label-caps text-gallery-gold tracking-[0.2em] mb-6 drop-shadow-sm uppercase">Artifact Spotlight</p>
            <h2 className="font-display-lg text-4xl lg:text-6xl mb-8 leading-[1.1] text-paper-white break-words drop-shadow-sm">
              Contextual Brilliance
            </h2>
            <p className="font-body-md text-paper-white/80 mb-12 max-w-md">
              Experience how masterfully curated pieces transform the atmospheric weight and architectural flow of high-profile environments.
            </p>

            <div className="flex gap-4">
              {SPACES_DATA.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-12 h-[2px] transition-all duration-300 ${currentSlide === index ? 'bg-gallery-gold' : 'bg-paper-white/30'}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="md:col-span-6 md:col-start-7 mt-16 md:mt-0 relative h-[400px] flex items-center">
            <div className="absolute w-full max-w-lg bg-surface/90 backdrop-blur-md border border-gallery-gold/30 p-8 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] text-primary">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="font-label-caps text-[10px] text-gallery-gold tracking-widest block mb-4 uppercase">
                    {SPACES_DATA[currentSlide].subtitle}
                  </span>
                  <h3 className="font-headline-md text-2xl md:text-3xl text-primary mb-4">
                    {SPACES_DATA[currentSlide].title}
                  </h3>
                  <p className="font-body-md text-on-surface-variant leading-relaxed text-sm">
                    {SPACES_DATA[currentSlide].description}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 pt-6 border-t border-primary/10 flex justify-between items-center select-none text-primary/45">
                <span className="font-label-caps text-[11px] uppercase tracking-wider">Curation Coming Soon</span>
              </div>
            </div>
          </div>

        </div>
      </motion.section>

      { /* Dynamic Curation Feedback & Review Form Section */ }
      <motion.section 
        className="py-24 px-margin-mobile md:px-margin-desktop bg-paper-white relative overflow-hidden border-t border-outline/10"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.03),transparent_50%)] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="font-label-caps text-[10px] text-gallery-gold tracking-[0.3em] uppercase block">// SHARE YOUR EXPERIENCE</span>
            <h2 className="font-headline-md text-3xl md:text-4xl text-primary font-medium tracking-tight">Leave a Curation Review</h2>
            <p className="font-body-sm text-sm text-on-surface-variant leading-relaxed">
              Have you worked with Kala Vault's curation team or experienced our collection in your space? Share your thoughts to help us keep refining our services.
            </p>
          </div>

          <div className="bg-white border border-gallery-gold/20 p-8 md:p-12 rounded-2xl shadow-[0_30px_70px_-15px_rgba(212,175,55,0.05)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-gallery-gold/5 to-transparent pointer-events-none" />
            
            {feedbackSuccess ? (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12 space-y-4"
              >
                <span className="material-symbols-outlined text-6xl text-gallery-gold animate-bounce">check_circle</span>
                <h4 className="font-headline-md text-2xl text-primary font-medium">Review Submitted Successfully</h4>
                <p className="font-body-sm text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
                   Thank you for your valuable feedback! Your submission has been registered and added to our client experiences slider.
                </p>
              </motion.div>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!feedbackQuote.trim()) return;
                  const newId = testimonials.length + 1;
                  const newReview = {
                    id: newId,
                    client: feedbackCompany.trim() || "Private Collector",
                    quote: `“${feedbackQuote.trim()}”`,
                    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=120",
                    location: feedbackName.trim() || "Anonymous Partner",
                    project: `${feedbackRating} Star Curation`
                  };
                  setTestimonials(prev => [...prev, newReview]);
                  setTrustSlide(testimonials.length); // Switch slide focus immediately to the new testimonial
                  setFeedbackSuccess(true);
                  setFeedbackName('');
                  setFeedbackCompany('');
                  setFeedbackQuote('');
                  setTimeout(() => setFeedbackSuccess(false), 5000);
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-label-caps text-[9px] uppercase tracking-[0.2em] text-primary/60 font-semibold">Your Name / Location</label>
                    <input 
                      type="text" 
                      value={feedbackName} 
                      onChange={(e) => setFeedbackName(e.target.value)} 
                      placeholder="Rahul Sharma, Delhi" 
                      className="bg-subtle-smoke/30 border border-gallery-gold/20 focus:border-gallery-gold focus:outline-none px-4 py-3 text-[13px] text-primary rounded-md transition-all placeholder:text-primary/30"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-caps text-[9px] uppercase tracking-[0.2em] text-primary/60 font-semibold">Company / Project Area</label>
                    <input 
                      type="text" 
                      value={feedbackCompany} 
                      onChange={(e) => setFeedbackCompany(e.target.value)} 
                      placeholder="ITC Maurya Lobby or Corporate HQ" 
                      className="bg-subtle-smoke/30 border border-gallery-gold/20 focus:border-gallery-gold focus:outline-none px-4 py-3 text-[13px] text-primary rounded-md transition-all placeholder:text-primary/30"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label-caps text-[9px] uppercase tracking-[0.2em] text-primary/60 font-semibold">Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedbackRating(star)}
                        className="focus:outline-none transition-all duration-300 transform hover:scale-110"
                      >
                        <span 
                          className={`material-symbols-outlined text-[24px] cursor-pointer ${
                            star <= feedbackRating ? 'text-gallery-gold fill-1' : 'text-primary/25'
                          }`}
                          style={{ fontVariationSettings: star <= feedbackRating ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          star
                        </span>
                      </button>
                    ))}
                    <span className="font-mono text-xs text-primary/50 ml-3">({feedbackRating} / 5 stars)</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label-caps text-[9px] uppercase tracking-[0.2em] text-primary/60 font-semibold">Your Review</label>
                  <textarea 
                    value={feedbackQuote} 
                    onChange={(e) => setFeedbackQuote(e.target.value)} 
                    placeholder="Describe your experience collaborating with our curators, the quality of our artwork, or how the subscription rotation has influenced your space..." 
                    className="bg-subtle-smoke/30 border border-gallery-gold/20 focus:border-gallery-gold focus:outline-none px-4 py-3 text-[13px] text-primary rounded-md h-32 resize-none transition-all placeholder:text-primary/30 leading-relaxed"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    className="w-full py-4 bg-primary border border-primary text-white hover:bg-gallery-gold hover:border-gallery-gold font-label-caps text-[10px] uppercase tracking-[0.25em] font-semibold transition-all duration-300 focus:outline-none rounded-md shadow-lg shadow-primary/10 hover:shadow-gallery-gold/20"
                  >
                    Submit Curation Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// JOURNEY SECTION  — merged Process + Method
// ─────────────────────────────────────────────────────────────────────────────
const JOURNEY_STEPS = [
  {
    num: '01',
    phase: 'Discover',
    icon: 'search',
    tag: 'Browse the Vault',
    title: 'Explore Thousands of Museum-Grade Pieces',
    body: 'Step inside our private digital vault — thousands of museum-quality originals, limited editions, and commissioned works. Our experts pre-curate selections matched to your space, aesthetic, and ambition.',
    detail: 'Browse by medium, dimension, mood, or let our curators surprise you with an editorial shortlist built around your brief.',
    accent: '#D4AF37',
    color: 'from-amber-950/40 to-stone-950/60',
    img: 'https://images.unsplash.com/photo-1578301978162-7aae4d755744?auto=format&fit=crop&q=80&w=1200',
  },
  {
    num: '02',
    phase: 'Consult',
    icon: 'chat_bubble',
    tag: 'Digital Consultation',
    title: 'A Curator Reviews Your Space',
    body: 'Our specialist curators review your floor plans, existing décor palette, and atmospheric intent to propose a cohesive visual narrative — bespoke to your architecture.',
    detail: 'Every consultation ends in a curated mood board, placement diagrams, and a lighting brief so you know exactly how each work lands.',
    accent: '#C9B99A',
    color: 'from-stone-900/50 to-zinc-950/60',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
  },
  {
    num: '03',
    phase: 'Subscribe',
    icon: 'calendar_today',
    tag: 'Choose Your Plan',
    title: 'Monthly Plans Built Around Your Lifestyle',
    body: 'Choose from our carefully designed subscription tiers — whether you want a single statement piece or a full gallery rotation for a corporate flagship.',
    detail: 'Flexible commitment levels. Pause, swap, or upgrade at any time. No hidden fees. Insurance and maintenance always included.',
    accent: '#A8C5A0',
    color: 'from-emerald-950/40 to-stone-950/60',
    img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1200',
  },
  {
    num: '04',
    phase: 'Install',
    icon: 'home_pin',
    tag: 'White-Glove Delivery',
    title: 'Precision Logistics, Zero Effort',
    body: 'Climate-controlled transport, museum-grade hanging systems, and certified interior technicians handle every detail of the installation — so you never touch a drill.',
    detail: 'Full setup in a single visit. Lighting calibration. Placement certification. Every piece documented and insured from our vault to your wall.',
    accent: '#9BB8D4',
    color: 'from-sky-950/40 to-stone-950/60',
    img: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1200',
  },
  {
    num: '05',
    phase: 'Rotate',
    icon: 'autorenew',
    tag: 'Asset Rotation',
    title: 'A Living Gallery That Never Gets Stale',
    body: 'Quarterly, bi-annual, or on-demand — your collection evolves. Our team arrives, removes the current works, and installs the next chapter of your curated story.',
    detail: 'Each rotation is a new editorial moment. We track provenance, handle storage, and keep your space perpetually inspiring.',
    accent: '#D4A0AF',
    color: 'from-rose-950/40 to-stone-950/60',
    img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=1200',
  },
];

function JourneySection() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-100px' });
  const step = JOURNEY_STEPS[active];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-16 md:py-24"
      style={{ background: '#0c0c0c' }}
    >
      {/* Floating ambient blob tied to active step color */}
      <motion.div
        key={active + '-blob'}
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none -z-10"
        style={{
          background: `radial-gradient(circle, ${step.accent}12 0%, transparent 65%)`,
          top: '50%', left: '50%',
          translateX: '-50%', translateY: '-50%',
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Fine grain texture */}
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.03\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
          backgroundSize: '128px',
        }}
      />

      <div className="relative z-10 max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column: Vertical Timeline & Header (5-Columns) */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full min-h-[460px]">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8" style={{ background: step.accent }} />
                <span className="font-label-caps text-[10px] uppercase tracking-[0.4em]" style={{ color: step.accent }}>The Process</span>
              </div>
              
              <h2 className="font-display-lg text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight mb-8">
                From Vault
                <span className="block font-headline-md italic font-light" style={{ color: step.accent }}>to Your Wall.</span>
              </h2>

              {/* Vertical Timeline navigation */}
              <div className="relative pl-6 flex flex-col gap-6">
                {/* Vertical Line track */}
                <div className="absolute left-[3px] top-2 bottom-2 w-[1px] bg-white/10" />
                
                {/* Active sliding indicator marker */}
                <motion.div
                  className="absolute left-[1px] w-[3px] h-6 rounded-full"
                  style={{ background: step.accent }}
                  animate={{ y: active * 48 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />

                {JOURNEY_STEPS.map((s, i) => (
                  <button
                    key={s.num}
                    onClick={() => setActive(i)}
                    className="flex items-center gap-4 text-left group transition-all duration-300 cursor-pointer h-6"
                  >
                    <span
                      className="font-mono text-[11px] md:text-[12px] font-bold tracking-wider transition-colors duration-300 w-5"
                      style={{ color: active === i ? step.accent : 'rgba(255,255,255,0.2)' }}
                    >
                      {s.num}
                    </span>
                    <span
                      className="font-label-caps text-[13px] md:text-[14px] uppercase tracking-[0.2em] font-semibold transition-colors duration-300 group-hover:text-white"
                      style={{ color: active === i ? '#fff' : 'rgba(255,255,255,0.35)' }}
                    >
                      {s.phase}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pagination / Controls at bottom */}
            <div className="flex items-center gap-4 mt-10">
              <button
                onClick={() => setActive(Math.max(0, active - 1))}
                disabled={active === 0}
                className="w-9 h-9 flex items-center justify-center border border-white/15 text-white/30 hover:border-white/40 hover:text-white disabled:opacity-10 transition-all duration-300 rounded-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              </button>
              <button
                onClick={() => setActive(Math.min(JOURNEY_STEPS.length - 1, active + 1))}
                disabled={active === JOURNEY_STEPS.length - 1}
                className="w-9 h-9 flex items-center justify-center border text-white/60 hover:text-white disabled:opacity-10 transition-all duration-300 rounded-lg cursor-pointer"
                style={{ borderColor: `${step.accent}30`, background: `${step.accent}10` }}
              >
                <span className="material-symbols-outlined text-[16px]" style={{ color: step.accent }}>arrow_forward</span>
              </button>
              <span className="font-mono text-[10px] text-white/30 tracking-widest ml-2 uppercase">
                Step {active + 1} of {JOURNEY_STEPS.length}
              </span>
            </div>
          </div>

          {/* Right Column: Symmetrical step panel display (7-Columns) */}
          <div className="lg:col-span-7 h-[460px] relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-stone-950">
            {/* Image backdrop container */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step.img}
                className="absolute inset-0 w-full h-full"
                initial={{ scale: 1.05, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.98, opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <img
                  src={step.img}
                  alt={step.phase}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/20" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Corner Framing accents for visual style */}
            <div className="absolute top-4 left-4 w-3.5 h-3.5 border-t border-l border-white/20 pointer-events-none" />
            <div className="absolute top-4 right-4 w-3.5 h-3.5 border-t border-r border-white/20 pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-3.5 h-3.5 border-b border-l border-white/20 pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-3.5 h-3.5 border-b border-r border-white/20 pointer-events-none" />

            {/* Floating Glassmorphic Details Card (positioned inside the panel) */}
            <div className="absolute bottom-6 left-6 right-6 p-6 md:p-8 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl flex flex-col justify-between min-h-[220px] z-20">
              <div>
                {/* Meta Row */}
                <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[10.5px] md:text-[11.5px] font-bold tracking-widest" style={{ color: step.accent }}>
                      PHASE {step.num}
                    </span>
                    <div className="w-[1px] h-3 bg-white/20" />
                    <span className="text-[10px] md:text-[10.5px] text-white/40 font-mono tracking-widest block uppercase font-medium">
                      {step.tag}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-base" style={{ color: step.accent }}>
                    {step.icon}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display-sm text-xl md:text-2xl text-white tracking-wide mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-[13px] md:text-[14px] text-white/80 font-body-md leading-relaxed mb-4">
                  {step.body}
                </p>
              </div>

              {/* Editorial Subquote */}
              <div className="border-l border-white/20 pl-4 py-0.5 mt-2">
                <p className="text-[11.5px] md:text-[12.5px] text-white/40 font-body-sm leading-relaxed italic">
                  {step.detail}
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TRUSTED BY — Real Clients Only
// ─────────────────────────────────────────────────────────────────────────────

// Only 3 real clients. Duplicated 6× for a full seamless marquee loop.
const REAL_PARTNERS = [
  { id: 'itc', label: 'ITC', sub: 'ITC Group' },
  { id: 'jll', label: 'JLL', sub: 'JLL' },
  { id: 'lucias', label: 'Lucias', sub: 'Lucias Café' },
];

function PartnerLogo({ id, label, sub }: { id: string; label: string; sub: string; key?: any; }) {
  return (
    <div className="px-16 py-8 flex flex-col items-center justify-center border-r border-white/5 cursor-default select-none group" style={{ minWidth: '220px' }}>
      {/* SVG wordmark per brand */}
      {id === 'itc' && (
        <svg viewBox="0 0 120 48" className="h-10 w-auto mb-2 transition-all duration-500" fill="#D4AF37">
          <text
            x="60" y="36"
            textAnchor="middle"
            fontFamily="'Playfair Display', serif"
            fontWeight="900"
            fontSize="30"
            letterSpacing="10"
            fill="#D4AF37"
          >ITC</text>
          <line x1="14" y1="42" x2="106" y2="42" stroke="#D4AF37" strokeWidth="1.5" opacity="0.5" />
        </svg>
      )}
      {id === 'jll' && (
        <svg viewBox="0 0 120 48" className="h-10 w-auto mb-2" fill="#D4AF37">
          <text
            x="60" y="38"
            textAnchor="middle"
            fontFamily="'Inter', sans-serif"
            fontWeight="800"
            fontSize="32"
            letterSpacing="4"
            fill="#D4AF37"
          >JLL</text>
        </svg>
      )}
      {id === 'lucias' && (
        <svg viewBox="0 0 160 48" className="h-10 w-auto mb-2" fill="#D4AF37">
          <text
            x="80" y="34"
            textAnchor="middle"
            fontFamily="'Playfair Display', serif"
            fontWeight="500"
            fontStyle="italic"
            fontSize="28"
            letterSpacing="3"
            fill="#D4AF37"
          >Lucias</text>
          <text
            x="80" y="46"
            textAnchor="middle"
            fontFamily="'Inter', sans-serif"
            fontWeight="400"
            fontSize="8"
            letterSpacing="4"
            fill="#D4AF37"
            opacity="0.5"
          >CAFÉ</text>
        </svg>
      )}
      <span className="font-label-caps text-[8px] uppercase tracking-[0.25em] text-white/20">{sub}</span>
    </div>
  );
}

function TrustedByBand() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  // Repeat 6× for seamless infinite scroll
  const marqueeItems = Array.from({ length: 6 }, () => REAL_PARTNERS).flat();

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: '#000000' }}
    >
      {/* Top gold gradient line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gallery-gold/50 to-transparent" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1400px] mx-auto px-8 md:px-16 pt-14 pb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-6 bg-gallery-gold" />
            <span className="font-label-caps text-[9px] uppercase tracking-[0.4em] text-gallery-gold">Our Clients</span>
          </div>
          <h2 className="font-display-lg text-3xl md:text-4xl text-white tracking-tight leading-tight">
            Trusted By<br />
            <span className="font-headline-md italic font-light text-gallery-gold">India's Finest.</span>
          </h2>
        </div>
        <p className="font-body-sm text-white/30 max-w-xs text-[13px] leading-relaxed">
          Three landmark institutions that chose Kala Vault to define the aesthetic soul of their spaces.
        </p>
      </motion.div>

      {/* Marquee */}
      <div className="relative overflow-hidden border-y border-white/5">
        <style>{`
          @keyframes kv-scroll {
            0%   { transform: translateX(0); }
            100% { transform: translateX(calc(-220px * 3 - 1px * 3)); }
          }
          .kv-scroll { animation: kv-scroll 18s linear infinite; }
          .kv-scroll:hover { animation-play-state: paused; }
        `}</style>
        <div className="kv-scroll flex w-max">
          {marqueeItems.map((p, i) => (
            <PartnerLogo key={i} id={p.id} label={p.label} sub={p.sub} />
          ))}
        </div>
      </div>

      {/* Bottom gold gradient line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gallery-gold/30 to-transparent" />
    </section>
  );
}
