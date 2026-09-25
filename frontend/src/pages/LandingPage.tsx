import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import CuratorialProtocolSection from '../components/CuratorialProtocolSection';
import MuseumArtworkCarousel from '../components/MuseumArtworkCarousel';
import TrustedPreviousWorksSection from '../components/TrustedPreviousWorksSection';
import { TkvMonogramSvg } from '../components/KalaVaultLogo';
import { getArtworkImagePath, fetchArtworks, Artwork, LOCAL_ARTWORKS, getLatestAcquisitionsSelection } from '../services/artworkService';
import { 
  ArrowRight, 
  Sparkles, 
  RefreshCw, 
  ShieldCheck, 
  Crown,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Star
} from 'lucide-react';

const TESTIMONIALS_DATA = [
  {
    id: 1,
    badge: "ITC Welcom Project",
    client: "ITC Welcom Hotels & Resorts",
    location: "Grand Lobby Installation & Executive Suites, New Delhi",
    project: "HOTELS & HOSPITALITY",
    quote: "The monumental jaali architectural installation in our grand lobby and the curated guest suite masterworks have completely redefined our arrival experience. The depth of craftsmanship, rich textural resonance, and authentic regional storytelling leave an indelible impression on our guests.",
    image: "/assets/projects/itc_welcom_lobby.jpg"
  },
  {
    id: 2,
    badge: "JLL Corporate Office",
    client: "JLL Commercial Workspaces",
    location: "Regional Executive Headquarters, Pune",
    project: "CORPORATES & WORKSPACES",
    quote: "The authoritative 'Seven Stallions' boardroom masterwork and bespoke architectural mural brought unmatched gravitas, energy, and leadership focus to our executive floor. Kala Vault's white-glove staging was seamless, prompt, and completely elevated our workspace aesthetic.",
    image: "/assets/projects/jll_office_pune.jpg"
  },
  {
    id: 3,
    badge: "Lucia Restaurant Project",
    client: "Lucia Restaurant & Bar",
    location: "Fine Dining Atelier, Mumbai",
    project: "CAFÉS & FINE DINING",
    quote: "The 'Moods of Lucia' contemporary portraiture triptych established the exact sultry, sophisticated dining ambience our culinary salon required. Having access to authenticated museum-quality original art with rotation flexibility has transformed our dining identity.",
    image: "/assets/projects/lucia_restaurant.jpg"
  },
  {
    id: 4,
    badge: "Luxury Residence, Pune",
    client: "Private Residential Estate",
    location: "Koregaon Park Estate, Pune",
    project: "BUILDERS & MODEL RESIDENCES",
    quote: "The bespoke 3D sculpted Shreenathji fiber relief installation is the sacred and artistic centerpiece of our entrance foyer. The craftsmanship, spiritual serenity, and museum-grade tactile finish capture natural and ambient light magnificently.",
    image: "/assets/projects/residence_shreenathji.jpg"
  }
];

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

export default function LandingPage() {
  const navigate = useNavigate();

  const [testimonials, setTestimonials] = useState(TESTIMONIALS_DATA);
  const [trustSlide, setTrustSlide] = useState(0);
  const [totalCatalogCount, setTotalCatalogCount] = useState<number>(() => LOCAL_ARTWORKS.length);
  const [latestArtworks, setLatestArtworks] = useState<Artwork[]>(() => {
    return getLatestAcquisitionsSelection(LOCAL_ARTWORKS);
  });
  const [loadingArtworks, setLoadingArtworks] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTrustSlide((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchArtworks(1, 500);
        if (data && data.items && data.items.length > 0) {
          const clean = data.items.filter((a: Artwork) => !['5', '6', '7', '8', '9', '10', '11', '12'].includes(a.id));
          setTotalCatalogCount(data.total || clean.length);

          // Curated Selection: 3 Shagun Agarwal + 2 Kasshiish Kariyaa + 2 Other Masterworks
          const curatedSelection = getLatestAcquisitionsSelection(clean);
          setLatestArtworks(curatedSelection);
        }
      } catch (err) {
        console.error('Failed to load featured artworks:', err);
      } finally {
        setLoadingArtworks(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="bg-[#FAF6F0] text-[#1E1412] font-sans selection:bg-[#C5A059]/30 min-h-screen">
      <TopNavBar />

      {/* ─────────────────────────────────────────────────────────────────────────────
          1. FULL-BLEED GRAND MUSEUM GALLERY HERO
          ───────────────────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] md:min-h-[98vh] w-full overflow-hidden flex flex-col justify-center items-center bg-[#18110E] text-white">
        
        {/* Full-Bleed Grand Museum Gallery Backdrop with Framed Masterworks */}
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
          <motion.img
            src="/assets/museum_gallery_hero.jpg"
            alt="Spacious Art Museum Gallery"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full object-cover filter brightness-[0.72] contrast-[1.05]"
          />

          {/* Gentle Cinema Vignette for Crystal Clear Contrast */}
          <div className="absolute inset-0 bg-black/30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/55 pointer-events-none" />
        </div>

        {/* Centerpiece: Monumental Pure Bold White Typography & Explore Collection Action */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 md:px-12 text-center py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            {/* Monumental Headline */}
            <h1 className="font-cinzel text-5xl sm:text-7xl md:text-8xl lg:text-[88px] font-black text-white tracking-tight leading-[1.04] drop-shadow-[0_8px_40px_rgba(0,0,0,0.95)] mb-4">
              CURATING JOY. <br />
              <span className="font-cormorant italic font-normal text-white drop-shadow-[0_4px_25px_rgba(0,0,0,0.85)]">
                Inspiring Spaces.
              </span>
            </h1>

            {/* Pure Classy Catchy Single Sentence */}
            <p className="font-cormorant italic text-xl sm:text-2xl md:text-[26px] text-white/95 font-light max-w-2xl mx-auto leading-relaxed drop-shadow-[0_4px_25px_rgba(0,0,0,0.85)] mb-8">
              Museum-grade fine art acquisitions &amp; dynamic seasonal rotations tailored to premier environments.
            </p>

            {/* Compact, Refined Luxury Action Button */}
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.7 }}
            >
              <Link
                to="/collections"
                className="px-7 sm:px-8 py-3 rounded-full bg-[#FAF6F0] hover:bg-white text-[#1E1412] font-cinzel text-[11px] sm:text-xs uppercase tracking-[0.20em] font-bold shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.7)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2.5 border border-[#C5A059]/40"
              >
                <span>DISCOVER THE COLLECTION</span>
                <span className="text-sm font-normal">→</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          2. TRUSTED BY: Landmark Partners & Previous Works
          ───────────────────────────────────────────────────────────────────────────── */}
      <TrustedPreviousWorksSection />

      {/* ─────────────────────────────────────────────────────────────────────────────
          3. FEATURED ARTWORKS: Horizontal Gallery Ribbon
          ───────────────────────────────────────────────────────────────────────────── */}
      <motion.section
        className="py-14 md:py-18 px-6 md:px-12 w-full bg-[#F5EFEB] border-b border-[#C5A059]/25 select-none overflow-hidden relative"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        <div className="max-w-[1500px] mx-auto">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 pb-4 border-b border-[#C5A059]/30">
            <div>
              <span className="font-cinzel text-[10.5px] text-[#7B2431] uppercase tracking-[0.24em] font-bold block mb-1">
                AUTHENTICATED MASTERWORKS • LATEST ACQUISITIONS
              </span>
              <h2 className="font-brand text-3xl sm:text-4xl text-[#1E1412] font-bold">
                Latest <span className="font-cormorant italic font-normal text-[#7B2431]">Acquisitions</span>
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <Link 
                to="/collections" 
                className="font-cinzel text-xs uppercase tracking-[0.18em] font-bold text-[#7B2431] hover:text-[#8F2C3C] flex items-center gap-1.5 transition-colors"
              >
                <span>View Full Catalog ({totalCatalogCount || 103}+)</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          
          {/* Museum-Grade Framed Paintings Carousel in Original Format */}
          <MuseumArtworkCarousel 
            artworks={latestArtworks} 
            loading={loadingArtworks} 
          />

        </div>
      </motion.section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          4. THE CURATORIAL PROTOCOL
          ───────────────────────────────────────────────────────────────────────────── */}
      <CuratorialProtocolSection />

      {/* ─────────────────────────────────────────────────────────────────────────────
          5. STRATEGIC SUBSCRIPTION PACKAGES
          ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-[#FCFAF6] border-y border-[#C5A059]/25 relative select-none">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="font-cinzel text-[10.5px] uppercase tracking-[0.26em] text-[#7B2431] font-bold block mb-1">
              SUBSCRIPTION PACKAGES
            </span>
            <h2 className="font-brand text-3xl sm:text-5xl text-[#1E1412] font-bold">
              Structured <span className="font-cormorant italic font-normal text-[#7B2431]">Leasing Tiers</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#1E1412]/75 mt-2 font-light">
              Flexible 90-day seasonal rotations, curated for spaces from 2,000 to 50,000+ sq. ft.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            {/* Standard Collection */}
            <motion.div 
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="bg-[#FAF6F0] rounded-2xl p-8 border border-[#C5A059]/40 flex flex-col justify-between shadow-xs hover:border-[#7B2431] hover:shadow-xl transition-all"
            >
              <div>
                <span className="font-cinzel text-[10px] uppercase tracking-[0.2em] font-bold text-[#7B2431] block mb-1">
                  STARTER TIER
                </span>
                <h3 className="font-brand text-2xl font-bold text-[#1E1412] mb-2">
                  The Standard Collection
                </h3>
                <div className="pb-4 mb-4 border-b border-[#C5A059]/20">
                  <span className="font-brand text-3xl sm:text-4xl font-bold text-[#1E1412]">₹79,999</span>
                  <span className="text-xs text-[#1E1412]/60 block font-sans mt-0.5">/ Monthly Subscription</span>
                </div>
                <p className="text-xs text-[#1E1412]/75 leading-relaxed mb-6 font-light">
                  A lovely start for boutique hotels, cozy cafés, and specialized workspaces.
                </p>
                <ul className="space-y-3 text-xs text-[#1E1412]/85 mb-8 font-light">
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#7B2431] shrink-0" /> 20 Curated Artworks</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#7B2431] shrink-0" /> 2 Large Centerpieces</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#7B2431] shrink-0" /> 8 Medium Statements &amp; 10 Accents</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#7B2431] shrink-0" /> White-Glove Installation Included</li>
                </ul>
              </div>
              <Link 
                to="/subscriptions" 
                className="w-full py-3.5 rounded-xl bg-[#7B2431] hover:bg-[#8F2C3C] text-[#FAF6F0] font-cinzel text-xs uppercase tracking-[0.18em] font-bold text-center transition-all duration-300 shadow-md hover:scale-[1.02]"
              >
                VIEW PLAN DETAILS
              </Link>
            </motion.div>

            {/* Premium Collection */}
            <motion.div 
              whileHover={{ y: -8, scale: 1.04 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-b from-[#7B2431] via-[#5C1622] to-[#420B15] text-[#FAF6F0] rounded-2xl p-8 border-2 border-[#DFC07D] flex flex-col justify-between shadow-2xl scale-[1.02] relative"
            >
              <div className="absolute top-0 right-0 bg-gradient-to-r from-[#DFC07D] via-[#FFF3D6] to-[#C5A059] text-[#241611] font-cinzel text-[9.5px] uppercase tracking-[0.24em] font-bold px-4 py-1.5 rounded-bl-xl shadow-md">
                MOST POPULAR
              </div>
              <div>
                <span className="font-cinzel text-[10px] uppercase tracking-[0.2em] font-bold text-[#DFC07D] block mb-1">
                  PREMIUM TIER
                </span>
                <h3 className="font-brand text-2xl font-bold text-white mb-2">
                  The Premium Collection
                </h3>
                <div className="pb-4 mb-4 border-b border-white/20">
                  <span className="font-brand text-3xl sm:text-4xl font-bold text-[#DFC07D]">₹1,59,999</span>
                  <span className="text-xs text-white/70 block font-sans mt-0.5">/ Monthly Subscription</span>
                </div>
                <p className="text-xs text-[#FAF6F0]/85 leading-relaxed mb-6 font-light">
                  Designed for mid-sized enterprises and luxury hospitality wanting complete artistic transformation.
                </p>
                <ul className="space-y-3 text-xs text-white/90 mb-8 font-light">
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#DFC07D] shrink-0" /> 50 Diverse Pieces including Sculptures</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#DFC07D] shrink-0" /> 8 Large, 15 Medium &amp; 15 Small Pieces</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#DFC07D] shrink-0" /> 12 Desk &amp; Shelf Decorative Arts</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#DFC07D] shrink-0" /> 90-Day Seasonal Refresh Swaps</li>
                </ul>
              </div>
              <Link 
                to="/subscriptions" 
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#DFC07D] to-[#C5A059] hover:from-[#FFF3D6] hover:to-[#DFC07D] text-[#241611] font-cinzel text-xs uppercase tracking-[0.18em] font-bold text-center transition-all duration-300 shadow-lg hover:scale-[1.02]"
              >
                VIEW PLAN DETAILS
              </Link>
            </motion.div>

            {/* Signature Experience */}
            <motion.div 
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="bg-[#FAF6F0] rounded-2xl p-8 border border-[#C5A059]/40 flex flex-col justify-between shadow-xs hover:border-[#7B2431] hover:shadow-xl transition-all"
            >
              <div>
                <span className="font-cinzel text-[10px] uppercase tracking-[0.2em] font-bold text-[#7B2431] block mb-1">
                  ELITE SERVICE
                </span>
                <h3 className="font-brand text-2xl font-bold text-[#1E1412] mb-2">
                  The Signature Experience
                </h3>
                <div className="pb-4 mb-4 border-b border-[#C5A059]/20">
                  <span className="font-brand text-3xl sm:text-4xl font-bold text-[#1E1412]">₹3,00,000+</span>
                  <span className="text-xs text-[#1E1412]/60 block font-sans mt-0.5">/ Bespoke On-Demand</span>
                </div>
                <p className="text-xs text-[#1E1412]/75 leading-relaxed mb-6 font-light">
                  For large corporations and grand hotels seeking a fully personalized artistic identity.
                </p>
                <ul className="space-y-3 text-xs text-[#1E1412]/85 mb-8 font-light">
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#7B2431] shrink-0" /> Rare One-of-a-Kind Originals</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#7B2431] shrink-0" /> Unlimited Scaled Portfolio Allocation</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#7B2431] shrink-0" /> Free Installation, Delivery &amp; Rent-to-Own</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#7B2431] shrink-0" /> 24/7 Dedicated Senior Art Curator</li>
                </ul>
              </div>
              <Link 
                to="/subscriptions" 
                className="w-full py-3.5 rounded-xl bg-[#7B2431] hover:bg-[#8F2C3C] text-[#FAF6F0] font-cinzel text-xs uppercase tracking-[0.18em] font-bold text-center transition-all duration-300 shadow-md hover:scale-[1.02]"
              >
                VIEW PLAN DETAILS
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          7. VERIFIED CLIENT PLACEMENTS & REVIEWS (Sweet, Simple, 5-Stars & Original Photos)
          ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-[#FAF6F0] border-t border-[#C5A059]/25 select-none">
        <div className="max-w-[1360px] mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            {/* Left Column: Authentic Client Installation Image */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden bg-[#F5EFEB] border border-[#C5A059]/35 shadow-xl aspect-[4/4.8] group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={trustSlide}
                    src={testimonials[trustSlide]?.image}
                    alt={testimonials[trustSlide]?.client}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45 }}
                  />
                </AnimatePresence>

                {/* Project Tag Overlay Badge */}
                <div className="absolute top-4 left-4 bg-[#4A0E17]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C5A059]/40 shadow-lg">
                  <span className="font-cinzel text-[10px] uppercase tracking-wider text-[#FAF6F0] font-semibold">
                    {testimonials[trustSlide]?.badge || testimonials[trustSlide]?.project}
                  </span>
                </div>
              </div>

              {/* Verified Placement Photo Thumbnails */}
              <div className="grid grid-cols-4 gap-2.5 mt-3.5">
                {testimonials.map((t, idx) => (
                  <button
                    key={t.id}
                    onClick={() => setTrustSlide(idx)}
                    className={`relative rounded-xl overflow-hidden aspect-[4/3] border transition-all cursor-pointer ${
                      trustSlide === idx 
                        ? 'border-[#4A0E17] ring-2 ring-[#4A0E17]/50 shadow-md scale-102 opacity-100' 
                        : 'border-[#C5A059]/30 opacity-60 hover:opacity-100 hover:border-[#C5A059]'
                    }`}
                    aria-label={`View ${t.badge}`}
                  >
                    <img 
                      src={t.image} 
                      alt={t.badge} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Review Details & 5-Star Endorsement */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                {/* Category Header */}
                <span className="font-cinzel text-xs text-[#C5A059] uppercase tracking-[0.25em] font-bold block mb-2">
                  {testimonials[trustSlide]?.project || "CLIENT INSTALLATION"}
                </span>
                <div className="w-12 h-[1.5px] bg-[#C5A059]/50 mb-6" />

                {/* Constant 5-Star Rating */}
                <div className="flex items-center gap-1.5 text-[#C5A059] mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#C5A059] text-[#C5A059]" />
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={trustSlide}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-6"
                  >
                    {/* Cormorant Italic Quote */}
                    <blockquote className="font-cormorant italic text-2xl sm:text-3xl md:text-[34px] text-[#1E1412] leading-[1.38] font-normal">
                      “{testimonials[trustSlide]?.quote}”
                    </blockquote>
                    
                    {/* Client & Location */}
                    <div>
                      <p className="font-cinzel text-sm sm:text-base font-bold tracking-wider text-[#7B2431] uppercase">
                        {testimonials[trustSlide]?.client}
                      </p>
                      <p className="text-xs text-[#1E1412]/60 font-light mt-0.5">
                        {testimonials[trustSlide]?.location}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Slide Counter & Navigation Controls */}
              <div className="flex items-center justify-between pt-8 mt-10 border-t border-[#C5A059]/20">
                <div className="flex items-center gap-3">
                  <span className="font-cormorant italic text-2xl text-[#C5A059] font-bold">
                    0{trustSlide + 1}
                  </span>
                  <div className="w-10 h-[1px] bg-[#C5A059]/40" />
                  <span className="font-cormorant italic text-base text-[#1E1412]/40">
                    0{testimonials.length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTrustSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                    className="p-2.5 rounded-full border border-[#C5A059]/40 hover:bg-[#C5A059]/15 text-[#7B2431] transition-all cursor-pointer"
                    aria-label="Previous review"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setTrustSlide((prev) => (prev + 1) % testimonials.length)}
                    className="p-2.5 rounded-full border border-[#C5A059]/40 hover:bg-[#C5A059]/15 text-[#7B2431] transition-all cursor-pointer"
                    aria-label="Next review"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          9. BESPOKE SPATIAL CONSULTATION BANNER (Deck Reference Page)
          ───────────────────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[520px] md:min-h-[580px] w-full flex items-center justify-center py-20 md:py-28 px-6 md:px-12 bg-[#120806] text-white overflow-hidden border-y border-[#DFC07D]/50 select-none">
        
        {/* Full-Bleed 3D Spatial Mapping Interior Backdrop */}
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
          <img 
            src="/assets/spatial_transformation_bg.jpg" 
            alt="Bespoke Spatial Consultation 3D Mapping" 
            className="w-full h-full object-cover filter brightness-[0.72] contrast-[1.08] scale-102"
          />
          {/* Cinema Contrast Overlays */}
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#100705] via-transparent to-[#100705]/80 pointer-events-none" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#100705]/50 to-[#100705]/90 pointer-events-none" />
        </div>

        {/* Content Box */}
        <div className="max-w-[1300px] mx-auto text-center relative z-10 my-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Top Gilded Tag */}
            <span className="font-cinzel text-[11px] sm:text-xs uppercase tracking-[0.32em] font-bold text-[#DFC07D] block mb-4 drop-shadow-md">
              BESPOKE SPATIAL CONSULTATION
            </span>

            {/* Monumental Headline */}
            <h2 className="font-cinzel text-3xl sm:text-5xl md:text-6xl lg:text-[68px] font-black mb-5 leading-[1.06] text-white tracking-tight drop-shadow-[0_8px_40px_rgba(0,0,0,0.98)]">
              BEGIN YOUR SPATIAL TRANSFORMATION
            </h2>

            {/* Elegant Subtitle */}
            <p className="font-cormorant italic text-lg sm:text-2xl md:text-3xl text-white/95 max-w-3xl mx-auto mb-10 leading-relaxed font-light drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
              Schedule a confidential 3D spatial mapping session with our principal curatorial team.
            </p>

            {/* Two Action Buttons Matching Reference */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <Link 
                to="/inquire" 
                className="px-9 sm:px-11 py-3.5 sm:py-4 rounded-full bg-[#DFC07D] hover:bg-[#F5E4B8] text-[#1E1412] font-cinzel text-xs uppercase tracking-[0.20em] font-bold transition-all duration-300 shadow-[0_10px_35px_rgba(0,0,0,0.6)] hover:scale-105 active:scale-95"
              >
                REQUEST CURATION BRIEF
              </Link>
              <Link 
                to="/collections" 
                className="px-9 sm:px-11 py-3.5 sm:py-4 rounded-full bg-[#120805]/75 hover:bg-[#120805]/95 text-[#FCFAF6] border border-[#DFC07D]/80 hover:border-[#DFC07D] font-cinzel text-xs uppercase tracking-[0.20em] font-bold transition-all duration-300 backdrop-blur-md shadow-[0_10px_35px_rgba(0,0,0,0.6)] hover:scale-105 active:scale-95"
              >
                BROWSE MASTERWORKS
              </Link>
            </div>
          </motion.div>
        </div>

      </section>

      <Footer />
    </div>
  );
}

