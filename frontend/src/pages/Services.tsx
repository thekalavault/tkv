import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useEffect } from 'react';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import WhiteGloveProtocolSection from '../components/WhiteGloveProtocolSection';
import { 
  ArrowRight, 
  Clock, 
  Layers, 
  Award, 
  Compass, 
  Eye, 
  Box, 
  Calendar,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export default function Services() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const curatorialSteps = [
    {
      step: '01',
      title: 'Cartography & Spatial Mapping',
      desc: 'Precision 3D spatial scan, lux exposure analysis across light cycles, and wall elevation studies.',
      image: '/assets/protocol_01_cartography.jpg'
    },
    {
      step: '02',
      title: 'Accession & Provenance',
      desc: 'Curated accession dossier unsealing private institutional works with cryptographic authenticity.',
      image: '/assets/protocol_02_accession.jpg'
    },
    {
      step: '03',
      title: 'Conservation & Framing',
      desc: 'Tru-Vue 99.8% UV-protective museum glass, 8-ply acid-free matboards, and custom hardwood profiles.',
      image: '/assets/protocol_03_conservation.jpg'
    },
    {
      step: '04',
      title: 'Laser Installation',
      desc: 'Off-hours white-glove mounting with heavy-duty subterranean cleats and spot luminaire calibration.',
      image: '/assets/protocol_04_installation.jpg'
    },
    {
      step: '05',
      title: 'Quarterly Rotation',
      desc: 'Dynamic seasonal refreshes every 90 to 180 days with continuous on-site conservation care.',
      image: '/assets/protocol_05_rotation.jpg'
    }
  ];

  return (
    <div className="bg-[#FAF6F0] text-[#1E1412] font-sans selection:bg-[#C5A059]/30 min-h-screen flex flex-col">
      <TopNavBar />

      <main className="pt-28 md:pt-32 pb-24 flex-grow">
        
        {/* Header Intro */}
        <section className="px-6 md:px-12 max-w-[1440px] mx-auto mb-16 md:mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#C5A059]" />
              <span className="font-cinzel text-[10.5px] uppercase tracking-[0.28em] text-[#7B2431] font-bold">
                OUR SERVICES
              </span>
              <div className="h-px w-8 bg-[#C5A059]" />
            </div>

            <h1 className="font-brand text-4xl sm:text-5xl md:text-6xl font-bold text-[#1E1412] tracking-tight mb-5 leading-[1.12]">
              A World of Art, <br />
              <span className="text-[#7B2431] italic font-cormorant font-normal">Tailored to You.</span>
            </h1>

            <p className="text-sm sm:text-base text-[#1E1412]/75 max-w-2xl mx-auto leading-relaxed font-light">
              Transform your hospitality or corporate environment into a living gallery with museum-grade acquisitions, dynamic seasonal rotations, and spatial advisory.
            </p>
          </motion.div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            1. THREE CORE PILLARS (Modern Magazine Spreads with Interactive Process Animations)
            ───────────────────────────────────────────────────────────────────────────── */}
        <section className="px-6 md:px-12 max-w-[1440px] mx-auto mb-28 space-y-24 md:space-y-32">
          
          {/* Service 01: Direct Buying (Permanent Masterwork Acquisition) */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center"
          >
            {/* Visual with Holographic Provenance Animation */}
            <div className="lg:col-span-7">
              <div className="relative rounded-3xl overflow-hidden bg-[#160E0B] border-2 border-[#C5A059]/40 shadow-[0_20px_60px_rgba(0,0,0,0.18)] group">
                <img
                  src="/assets/curator_white_glove.jpg"
                  alt="Direct Buying and Verified Provenance Masterworks"
                  className="w-full aspect-[16/11] object-cover transition-transform duration-700 group-hover:scale-105 brightness-[0.96] contrast-[1.04]"
                />
                
                {/* Floating Interactive Holographic Provenance HUD */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-[#160D0A]/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#DFC07D]/40 text-[#DFC07D] shadow-xl flex items-center gap-3">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                    className="w-8 h-8 rounded-full border border-dashed border-[#DFC07D] flex items-center justify-center shrink-0"
                  >
                    <Award className="w-4 h-4 text-[#DFC07D]" />
                  </motion.div>
                  <div>
                    <span className="font-cinzel text-[10px] font-bold uppercase tracking-wider block text-white">
                      Verified Provenance
                    </span>
                    <span className="text-[9px] font-mono text-[#DFC07D]/90 block">
                      Forensic Certificate • Lifetime Custody
                    </span>
                  </div>
                </div>

                {/* Bottom Floating Spec Bar */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-[#160D0A]/92 backdrop-blur-lg p-3.5 sm:p-4 rounded-2xl border border-[#DFC07D]/30 shadow-2xl flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#DFC07D] animate-ping" />
                    <div>
                      <span className="font-cinzel text-[11px] font-bold uppercase tracking-wider block text-[#DFC07D]">
                        Private Estate Accession
                      </span>
                      <span className="text-[10px] text-white/70 font-light">
                        100% Guaranteed Physical & Legal Authenticity
                      </span>
                    </div>
                  </div>
                  <span className="hidden sm:inline-block font-mono text-[10.5px] bg-white/10 px-2.5 py-1 rounded-md text-[#DFC07D] border border-white/10">
                    MUSEUM GRADE
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 px-2 text-[11px] font-mono text-[#1E1412]/50">
                <span>PERMANENT HERITAGE ACQUISITION</span>
                <span>AUTHENTICITY GUARANTEED</span>
              </div>
            </div>

            {/* Text & Deliverables */}
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7B2431]/10 border border-[#7B2431]/20 text-[#7B2431] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7B2431]" />
                <span className="font-cinzel text-[10.5px] uppercase tracking-[0.24em] font-bold">
                  PERMANENT ACQUISITION
                </span>
              </div>

              <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#1E1412] tracking-tight mb-4 leading-[1.15]">
                Direct Buying
              </h2>

              <p className="text-sm sm:text-base text-[#1E1412]/80 font-light leading-relaxed mb-6">
                Build an enduring legacy with museum-grade original masterworks. Unseal private collections and acclaimed contemporary creators with comprehensive physical provenance dossiers and institutional valuations.
              </p>

              <div className="space-y-3 mb-8 border-y border-[#C5A059]/25 py-5">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/60 border border-[#C5A059]/20 hover:border-[#7B2431]/40 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-[#7B2431]/10 flex items-center justify-center text-[#7B2431] shrink-0 mt-0.5">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-cinzel text-xs font-bold text-[#1E1412]">Archival Provenance Dossier</h4>
                    <p className="text-xs text-[#1E1412]/65 font-light">Full verifiable chain of custody, artist certificates, and condition audit reports.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/60 border border-[#C5A059]/20 hover:border-[#7B2431]/40 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-[#7B2431]/10 flex items-center justify-center text-[#7B2431] shrink-0 mt-0.5">
                    <Box className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-cinzel text-xs font-bold text-[#1E1412]">Secondary Market Access</h4>
                    <p className="text-xs text-[#1E1412]/65 font-light">Private brokering of rare secondary market originals and institutional releases.</p>
                  </div>
                </div>
              </div>

              <Link
                to="/inquire?service=direct-buying"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#7B2431] hover:bg-[#8F2C3C] text-[#FAF6F0] font-cinzel text-xs uppercase tracking-[0.18em] font-bold shadow-md hover:shadow-lg transition-all group"
              >
                <span>Inquire Masterworks</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Service 02: Smart Subscriptions (Rotational Living Gallery) */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center"
          >
            {/* Text & Deliverables */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7B2431]/10 border border-[#7B2431]/20 text-[#7B2431] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7B2431]" />
                <span className="font-cinzel text-[10.5px] uppercase tracking-[0.24em] text-[#7B2431] font-bold">
                  ROTATIONAL LEASING
                </span>
              </div>

              <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#1E1412] tracking-tight mb-4 leading-[1.15]">
                Smart Subscriptions
              </h2>

              <p className="text-sm sm:text-base text-[#1E1412]/80 font-light leading-relaxed mb-6">
                Keep your architectural walls perpetually vibrant with tailored art rotations. Experience seasonal gallery refreshes with 100% OPEX tax flexibility and built-in rent-to-own equity credits.
              </p>

              <div className="space-y-3 mb-8 border-y border-[#C5A059]/25 py-5">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/60 border border-[#C5A059]/20 hover:border-[#7B2431]/40 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-[#7B2431]/10 flex items-center justify-center text-[#7B2431] shrink-0 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-cinzel text-xs font-bold text-[#1E1412]">90–180 Day Seasonal Refreshes</h4>
                    <p className="text-xs text-[#1E1412]/65 font-light">Regular curated swaps to ensure recurring clients and guests experience a dynamic space.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/60 border border-[#C5A059]/20 hover:border-[#7B2431]/40 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-[#7B2431]/10 flex items-center justify-center text-[#7B2431] shrink-0 mt-0.5">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-cinzel text-xs font-bold text-[#1E1412]">Rent-to-Own Equity Accumulation</h4>
                    <p className="text-xs text-[#1E1412]/65 font-light">Apply 100% of rental payments directly toward permanent acquisition of your favorite works.</p>
                  </div>
                </div>
              </div>

              <Link
                to="/subscriptions"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#7B2431] hover:bg-[#8F2C3C] text-[#FAF6F0] font-cinzel text-xs uppercase tracking-[0.18em] font-bold shadow-md hover:shadow-lg transition-all group"
              >
                <span>Explore Subscription Plans</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Visual with Animated 4-Season Rotation HUD */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              <div className="relative rounded-3xl overflow-hidden bg-[#160E0B] border-2 border-[#C5A059]/40 shadow-[0_20px_60px_rgba(0,0,0,0.18)] group">
                <img
                  src="/assets/dining_bistro_art.jpg"
                  alt="Smart Subscriptions and Rotational Art Installation in Luxury Hospitality"
                  className="w-full aspect-[16/11] object-cover transition-transform duration-700 group-hover:scale-105 brightness-[0.96] contrast-[1.04]"
                />

                {/* Interactive Dynamic 4-Season Cycle Indicator */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-[#160D0A]/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#DFC07D]/40 text-[#DFC07D] shadow-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#DFC07D]" style={{ animationDuration: '6s' }} />
                    <span className="font-cinzel text-[10px] font-bold uppercase tracking-wider text-white">
                      Seasonal Cadence
                    </span>
                  </div>
                  <span className="text-[9.5px] font-mono text-[#DFC07D]">
                    Every 90 Days • Complete Rotation
                  </span>
                </div>

                {/* Animated Rotational Seasonal Pill Track */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-[#160D0A]/92 backdrop-blur-lg p-3 sm:p-4 rounded-2xl border border-[#DFC07D]/30 shadow-2xl text-white">
                  <div className="flex items-center justify-between text-[10px] font-cinzel font-bold tracking-wider text-[#DFC07D] mb-2">
                    <span>LIVING GALLERY CYCLE</span>
                    <span className="text-white/70 font-mono">100% OPEX FLEXIBILITY</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-center">
                    <div className="py-1 px-1.5 rounded-lg bg-[#DFC07D]/20 border border-[#DFC07D]/40 text-[9px] sm:text-[10px] font-mono text-[#DFC07D] font-bold">
                      Q1 Spring
                    </div>
                    <div className="py-1 px-1.5 rounded-lg bg-white/10 text-[9px] sm:text-[10px] font-mono text-white/80">
                      Q2 Summer
                    </div>
                    <div className="py-1 px-1.5 rounded-lg bg-white/10 text-[9px] sm:text-[10px] font-mono text-white/80">
                      Q3 Autumn
                    </div>
                    <div className="py-1 px-1.5 rounded-lg bg-white/10 text-[9px] sm:text-[10px] font-mono text-white/80">
                      Q4 Winter
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 px-2 text-[11px] font-mono text-[#1E1412]/50">
                <span>ROTATIONAL ART INSTALLATION</span>
                <span>ZERO CAPEX • 100% OPEX</span>
              </div>
            </div>
          </motion.div>

          {/* Service 03: Expert Curation (3D Spatial Architecture & Lux Balancing) */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center"
          >
            {/* Visual with 3D Spatial Laser Sightline Scanner HUD */}
            <div className="lg:col-span-7">
              <div className="relative rounded-3xl overflow-hidden bg-[#160E0B] border-2 border-[#C5A059]/40 shadow-[0_20px_60px_rgba(0,0,0,0.18)] group">
                <img
                  src="/assets/corporate_boardroom_art.jpg"
                  alt="Expert Curation and Executive Boardroom Spatial Planning"
                  className="w-full aspect-[16/11] object-cover transition-transform duration-700 group-hover:scale-105 brightness-[0.96] contrast-[1.04]"
                />

                {/* Animated Laser Crosshair Scanning Overlay */}
                <motion.div 
                  animate={{ y: [0, 90, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute left-8 right-8 top-12 h-[1.5px] bg-gradient-to-r from-transparent via-[#DFC07D] to-transparent shadow-[0_0_12px_#DFC07D] pointer-events-none"
                />

                {/* Floating Spatial Dimensions Badge */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-[#160D0A]/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#DFC07D]/40 text-[#DFC07D] shadow-xl flex items-center gap-2.5">
                  <Compass className="w-4 h-4 text-[#DFC07D]" />
                  <div>
                    <span className="font-cinzel text-[10px] font-bold uppercase tracking-wider block text-white">
                      3D Spatial Sightlines
                    </span>
                    <span className="text-[9px] font-mono text-[#DFC07D]/90 block">
                      ±0.5mm Laser Calibration • Lux Audit
                    </span>
                  </div>
                </div>

                {/* Bottom Architectural Matrix Bar */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-[#160D0A]/92 backdrop-blur-lg p-3 sm:p-4 rounded-2xl border border-[#DFC07D]/30 shadow-2xl flex items-center justify-between text-white">
                  <div className="grid grid-cols-3 gap-3 w-full text-center">
                    <div className="border-r border-white/15 pr-2">
                      <span className="text-[9px] font-mono text-white/60 block uppercase">Mounting Accuracy</span>
                      <span className="font-cinzel text-xs font-bold text-[#DFC07D]">±0.5mm Laser</span>
                    </div>
                    <div className="border-r border-white/15 pr-2">
                      <span className="text-[9px] font-mono text-white/60 block uppercase">True Light Index</span>
                      <span className="font-cinzel text-xs font-bold text-[#DFC07D]">3000K Lux</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-white/60 block uppercase">Anchor Rating</span>
                      <span className="font-cinzel text-xs font-bold text-[#DFC07D]">150kg Seismic</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 px-2 text-[11px] font-mono text-[#1E1412]/50">
                <span>3D WALL ELEVATION & SIGHTLINE STUDIES</span>
                <span>ARCHITECTURAL CURATORIAL ADVISORY</span>
              </div>
            </div>

            {/* Text & Deliverables */}
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7B2431]/10 border border-[#7B2431]/20 text-[#7B2431] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7B2431]" />
                <span className="font-cinzel text-[10.5px] uppercase tracking-[0.24em] text-[#7B2431] font-bold">
                  SPATIAL ARCHITECTURE
                </span>
              </div>

              <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#1E1412] tracking-tight mb-4 leading-[1.15]">
                Expert Curation
              </h2>

              <p className="text-sm sm:text-base text-[#1E1412]/80 font-light leading-relaxed mb-6">
                Our institutional consultants design the perfect visual harmony for your architectural layout, calculating natural lighting angles, ceiling elevations, and brand identity alignment.
              </p>

              <div className="space-y-3 mb-8 border-y border-[#C5A059]/25 py-5">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/60 border border-[#C5A059]/20 hover:border-[#7B2431]/40 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-[#7B2431]/10 flex items-center justify-center text-[#7B2431] shrink-0 mt-0.5">
                    <Compass className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-cinzel text-xs font-bold text-[#1E1412]">High-Fidelity 3D Wall Renderings</h4>
                    <p className="text-xs text-[#1E1412]/65 font-light">Pre-visualize exact scale, frame profiles, and shadow fall in your true interior lighting.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/60 border border-[#C5A059]/20 hover:border-[#7B2431]/40 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-[#7B2431]/10 flex items-center justify-center text-[#7B2431] shrink-0 mt-0.5">
                    <Eye className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-cinzel text-xs font-bold text-[#1E1412]">Custom Curatorial Narratives</h4>
                    <p className="text-xs text-[#1E1412]/65 font-light">Art collections curated to articulate your corporate vision, prestige, and cultural heritage.</p>
                  </div>
                </div>
              </div>

              <Link
                to="/inquire?service=curation"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#7B2431] hover:bg-[#8F2C3C] text-[#FAF6F0] font-cinzel text-xs uppercase tracking-[0.18em] font-bold shadow-md hover:shadow-lg transition-all group"
              >
                <span>Request Spatial Curation Brief</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            2. THE 4-STAGE CURATORIAL PROTOCOL JOURNEY
            ───────────────────────────────────────────────────────────────────────────── */}
        <section className="px-6 md:px-12 max-w-[1500px] mx-auto mb-28">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="font-cinzel text-[10.5px] uppercase tracking-[0.28em] text-[#7B2431] font-bold block mb-1">
              THE CURATORIAL PROTOCOL
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl text-[#1E1412] font-bold tracking-tight">
              From Space Audit to Living Gallery
            </h2>
            <p className="text-xs sm:text-sm text-[#1E1412]/70 mt-2 font-light">
              Our seamless turnkey onboarding engineered to eliminate operational friction and deliver immediate spatial prestige.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5 relative">
            {curatorialSteps.map((step, idx) => {
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                  className="bg-[#FCFAF6] rounded-2xl overflow-hidden border border-[#C5A059]/35 flex flex-col justify-between shadow-2xs hover:border-[#7B2431] hover:shadow-lg transition-all duration-300 group"
                >
                  <div>
                    {/* Archival Illustration Header */}
                    <div className="aspect-[16/10] w-full overflow-hidden relative bg-[#1E1412]">
                      <img 
                        src={step.image} 
                        alt={step.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>

                    <div className="p-4 sm:p-5">
                      <h3 className="font-cinzel text-sm sm:text-base font-bold text-[#1E1412] mb-2 group-hover:text-[#7B2431] transition-colors leading-snug">
                        {step.title}
                      </h3>
                      
                      <p className="text-[11.5px] sm:text-xs text-[#1E1412]/75 leading-relaxed font-light">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-[#C5A059]/20 flex items-center justify-between text-[10px] font-cinzel font-bold text-[#7B2431] tracking-wider uppercase">
                    <span>Explore Stage</span>
                    <span className="text-[#C5A059] group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            3. WHITE-GLOVE SUPPORT PROTOCOL
            ───────────────────────────────────────────────────────────────────────────── */}
        <WhiteGloveProtocolSection />

        {/* ─────────────────────────────────────────────────────────────────────────────
            4. THE CURATION REFRESH CADENCES
            ───────────────────────────────────────────────────────────────────────────── */}
        <section className="px-6 md:px-12 max-w-[1500px] mx-auto mb-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-cinzel text-[10.5px] uppercase tracking-[0.28em] text-[#7B2431] font-bold block mb-1">
              SUBSCRIPTION CADENCE
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl text-[#1E1412] font-bold tracking-tight">
              Art That Stays Fresh
            </h2>
            <p className="text-xs sm:text-sm text-[#1E1412]/70 mt-2 font-light">
              Maintain an engaging, perpetually evolving corporate atmosphere tailored to your business calendar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FCFAF6] rounded-2xl p-8 border border-[#C5A059]/35 shadow-xs hover:border-[#7B2431] transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold text-[#7B2431] bg-[#7B2431]/10 px-3 py-1 rounded-md">
                  90 DAYS
                </span>
                <Clock className="w-5 h-5 text-[#7B2431]" />
              </div>
              <h3 className="font-cinzel text-xl font-bold text-[#1E1412] mb-2">
                Seasonal Energy
              </h3>
              <p className="text-xs text-[#1E1412]/75 leading-relaxed font-light">
                Quarterly art rotations that refresh your space with the rhythm of the seasons, giving guests a new gallery experience on every return visit.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#7B2431] via-[#5C1622] to-[#420B15] text-white rounded-2xl p-8 border-2 border-[#DFC07D] shadow-md scale-[1.02]">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold text-[#DFC07D] bg-white/10 px-3 py-1 rounded-md">
                  6 MONTHS • INSTITUTIONAL
                </span>
                <Layers className="w-5 h-5 text-[#DFC07D]" />
              </div>
              <h3 className="font-cinzel text-xl font-bold text-white mb-2">
                Balanced Change
              </h3>
              <p className="text-xs text-white/85 leading-relaxed font-light">
                Half-yearly refresh options for a measured, thoughtful evolution of your collection and brand narrative.
              </p>
            </div>

            <div className="bg-[#FCFAF6] rounded-2xl p-8 border border-[#C5A059]/35 shadow-xs hover:border-[#7B2431] transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold text-[#7B2431] bg-[#7B2431]/10 px-3 py-1 rounded-md">
                  ANNUAL
                </span>
                <Sparkles className="w-5 h-5 text-[#7B2431]" />
              </div>
              <h3 className="font-cinzel text-xl font-bold text-[#1E1412] mb-2">
                Annual Updates
              </h3>
              <p className="text-xs text-[#1E1412]/75 leading-relaxed font-light">
                Yearly curation themes that align with your brand's evolving narrative, corporate milestones, and interior redesigns.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/inquire"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#7B2431] hover:bg-[#8F2C3C] text-white font-cinzel text-xs uppercase tracking-[0.2em] font-bold shadow-md hover:shadow-lg transition-all"
            >
              <span>Schedule Curatorial Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
