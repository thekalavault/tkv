import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import WhiteGloveProtocolSection from '../components/WhiteGloveProtocolSection';
import { 
  ArrowRight, 
  Clock, 
  Layers, 
  Award, 
  Compass, 
  Sparkles,
  ShieldCheck,
  Building2,
  CheckCircle2
} from 'lucide-react';

export default function Services() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const protocolStages = [
    {
      numeral: 'I',
      category: 'Spatial Mapping',
      title: 'Spatial & Lux Cartography',
      desc: 'Forensic 3D spatial scan, wall elevation sightline analysis, and photometric lux exposure audit.',
      image: '/assets/protocol_01_spatial_mapping.jpg'
    },
    {
      numeral: 'II',
      category: 'Vault Accession',
      title: 'Vault Accession & Provenance',
      desc: 'Curated accession portfolio unsealing private institutional masterworks with lifetime authenticity.',
      image: '/assets/protocol_02_vault_accession.jpg'
    },
    {
      numeral: 'III',
      category: 'Conservation',
      title: 'Archival Conservation & Framing',
      desc: 'Tru-Vue 99.8% UV-protective museum glass, 8-ply acid-free cotton mats, and bespoke hardwood profiles.',
      image: '/assets/protocol_03_archival_conservation.jpg'
    },
    {
      numeral: 'IV',
      category: 'Installation',
      title: 'Laser-Calibrated Mounting',
      desc: 'Off-hours white-glove deployment with heavy-duty seismic French cleats and true spot luminaire calibration.',
      image: '/assets/protocol_04_laser_installation.jpg'
    },
    {
      numeral: 'V',
      category: 'Rotations & Care',
      title: 'Dynamic Rotations & Vault Care',
      desc: 'Scheduled seasonal collection refreshes every 90 to 180 days with regular on-site conservator reports.',
      image: '/assets/protocol_05_dynamic_rotations.jpg'
    }
  ];

  return (
    <div className="bg-[#FAF6F0] text-[#1E1412] font-sans selection:bg-[#C5A059]/30 min-h-screen flex flex-col">
      <TopNavBar />

      <main className="pt-28 md:pt-36 pb-24 flex-grow select-none">
        
        {/* ─────────────────────────────────────────────────────────────────────────────
            HEADER INTRO (PURE EDITORIAL LUXURY)
            ───────────────────────────────────────────────────────────────────────────── */}
        <section className="px-6 md:px-12 max-w-[1480px] mx-auto mb-20 md:mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-3 mb-3">
              <span className="h-[1px] w-8 bg-[#C5A059]" />
              <span className="font-cinzel text-[11px] uppercase tracking-[0.35em] text-[#4A0E17] font-semibold">
                CURATORIAL ADVISORY & SERVICES
              </span>
              <span className="h-[1px] w-8 bg-[#C5A059]" />
            </div>

            <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-semibold text-[#1E1412] tracking-tight mb-5 leading-[1.12]">
              A World of Art, <br />
              <span className="text-[#4A0E17] italic font-cormorant font-normal">Curated for Your Space.</span>
            </h1>

            <p className="font-cormorant text-lg sm:text-xl text-[#1E1412]/80 max-w-2xl mx-auto leading-relaxed font-normal">
              Transform your hospitality, enterprise, or private residential interiors into an authoritative living gallery through permanent acquisitions, rotational leasing, and spatial architecture.
            </p>
          </motion.div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            1. THREE CORE CURATORIAL SERVICES (GRAND EDITORIAL SPREAD)
            ───────────────────────────────────────────────────────────────────────────── */}
        <section className="px-6 md:px-12 max-w-[1480px] mx-auto mb-28 space-y-24 md:space-y-32">
          
          {/* Service 01: Direct Masterwork Acquisition */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center"
          >
            {/* Visual Frame */}
            <div className="lg:col-span-7">
              <div className="relative rounded-3xl overflow-hidden bg-[#160E0B] border border-[#C5A059]/40 shadow-[0_20px_50px_rgba(74,14,23,0.08)] group">
                <img
                  src="/assets/protocol_02_vault_accession.jpg"
                  alt="Direct Buying and Verified Provenance Masterworks"
                  className="w-full aspect-[16/11] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Subtle Provenance Stamp */}
                <div className="absolute top-5 left-5 bg-[#FAF6F0]/90 backdrop-blur-md px-4 py-2 rounded-full border border-[#C5A059]/40 shadow-md flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#4A0E17]" />
                  <span className="font-cinzel text-[10px] font-bold uppercase tracking-wider text-[#4A0E17]">
                    Lifetime Provenance Guarantee
                  </span>
                </div>
              </div>
            </div>

            {/* Text & Deliverables */}
            <div className="lg:col-span-5">
              <span className="font-cinzel text-[10.5px] uppercase tracking-[0.25em] text-[#C5A059] font-bold block mb-2">
                PERMANENT ACCESSION
              </span>

              <h2 className="font-cinzel text-3xl sm:text-4xl font-semibold text-[#1E1412] tracking-tight mb-3 leading-tight">
                Direct Masterwork Acquisition
              </h2>

              <p className="font-cormorant italic text-lg text-[#4A0E17] font-normal mb-4">
                Curating enduring legacy collections for institutional and private portfolios.
              </p>

              <p className="font-cormorant text-[16px] text-[#1E1412]/85 leading-relaxed font-normal mb-6">
                Build a permanent collection of museum-grade original masterworks. We facilitate direct accession from private estates, certified contemporary masters, and secondary market registries accompanied by complete provenance dossiers.
              </p>

              <div className="space-y-2.5 mb-8 border-t border-[#C5A059]/25 pt-4">
                <div className="flex items-start gap-3">
                  <span className="text-[#C5A059] font-cinzel font-bold text-xs select-none mt-0.5">—</span>
                  <span className="font-cormorant text-[15px] text-[#1E1412]/85 italic font-normal">
                    Forensic chain-of-custody documentation &amp; condition audit reports
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#C5A059] font-cinzel font-bold text-xs select-none mt-0.5">—</span>
                  <span className="font-cormorant text-[15px] text-[#1E1412]/85 italic font-normal">
                    Private brokerage of secondary market masterworks &amp; limited editions
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#C5A059] font-cinzel font-bold text-xs select-none mt-0.5">—</span>
                  <span className="font-cormorant text-[15px] text-[#1E1412]/85 italic font-normal">
                    White-glove courier delivery with insured museum-grade escrow transit
                  </span>
                </div>
              </div>

              <Link
                to="/collections"
                className="pill-button pill-button-bordeaux text-xs py-3.5 px-6 shadow-md"
              >
                <span>Browse Curated Vault</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#DFC07D]" />
              </Link>
            </div>
          </motion.div>

          {/* Service 02: Rotational Living Gallery Subscriptions */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center"
          >
            {/* Text & Deliverables */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <span className="font-cinzel text-[10.5px] uppercase tracking-[0.25em] text-[#C5A059] font-bold block mb-2">
                ROTATIONAL LEASING
              </span>

              <h2 className="font-cinzel text-3xl sm:text-4xl font-semibold text-[#1E1412] tracking-tight mb-3 leading-tight">
                Living Gallery Subscriptions
              </h2>

              <p className="font-cormorant italic text-lg text-[#4A0E17] font-normal mb-4">
                Dynamic seasonal collection rotations with zero operational friction.
              </p>

              <p className="font-cormorant text-[16px] text-[#1E1412]/85 leading-relaxed font-normal mb-6">
                Keep your architectural walls perpetually vibrant. Our subscription suites provide regular 90 to 180-day art rotations, comprehensive on-site maintenance, 100% OPEX tax deductibility, and built-in rent-to-own equity credits.
              </p>

              <div className="space-y-2.5 mb-8 border-t border-[#C5A059]/25 pt-4">
                <div className="flex items-start gap-3">
                  <span className="text-[#C5A059] font-cinzel font-bold text-xs select-none mt-0.5">—</span>
                  <span className="font-cormorant text-[15px] text-[#1E1412]/85 italic font-normal">
                    Scheduled 90–180 day seasonal gallery rotations tailored to your calendar
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#C5A059] font-cinzel font-bold text-xs select-none mt-0.5">—</span>
                  <span className="font-cormorant text-[15px] text-[#1E1412]/85 italic font-normal">
                    100% of rental payments credited toward rent-to-own permanent equity
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#C5A059] font-cinzel font-bold text-xs select-none mt-0.5">—</span>
                  <span className="font-cormorant text-[15px] text-[#1E1412]/85 italic font-normal">
                    Full concierge damage protection, transit insurance &amp; routine care
                  </span>
                </div>
              </div>

              <Link
                to="/subscriptions"
                className="pill-button pill-button-bordeaux text-xs py-3.5 px-6 shadow-md"
              >
                <span>Explore Subscription Suites</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#DFC07D]" />
              </Link>
            </div>

            {/* Visual Frame */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              <div className="relative rounded-3xl overflow-hidden bg-[#160E0B] border border-[#C5A059]/40 shadow-[0_20px_50px_rgba(74,14,23,0.08)] group">
                <img
                  src="/assets/protocol_05_dynamic_rotations.jpg"
                  alt="Rotational Art Subscriptions in Luxury Penthouse Lounge"
                  className="w-full aspect-[16/11] object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute top-5 right-5 bg-[#FAF6F0]/90 backdrop-blur-md px-4 py-2 rounded-full border border-[#C5A059]/40 shadow-md flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#4A0E17]" />
                  <span className="font-cinzel text-[10px] font-bold uppercase tracking-wider text-[#4A0E17]">
                    90–180 Day Cadence
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Service 03: Architectural & Spatial Curation */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center"
          >
            {/* Visual Frame */}
            <div className="lg:col-span-7">
              <div className="relative rounded-3xl overflow-hidden bg-[#160E0B] border border-[#C5A059]/40 shadow-[0_20px_50px_rgba(74,14,23,0.08)] group">
                <img
                  src="/assets/protocol_01_spatial_mapping.jpg"
                  alt="Expert Curation and Executive Boardroom Spatial Planning"
                  className="w-full aspect-[16/11] object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute top-5 left-5 bg-[#FAF6F0]/90 backdrop-blur-md px-4 py-2 rounded-full border border-[#C5A059]/40 shadow-md flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#4A0E17]" />
                  <span className="font-cinzel text-[10px] font-bold uppercase tracking-wider text-[#4A0E17]">
                    ±0.5mm Laser Calibration
                  </span>
                </div>
              </div>
            </div>

            {/* Text & Deliverables */}
            <div className="lg:col-span-5">
              <span className="font-cinzel text-[10.5px] uppercase tracking-[0.25em] text-[#C5A059] font-bold block mb-2">
                SPATIAL ARCHITECTURE
              </span>

              <h2 className="font-cinzel text-3xl sm:text-4xl font-semibold text-[#1E1412] tracking-tight mb-3 leading-tight">
                Architectural Curation
              </h2>

              <p className="font-cormorant italic text-lg text-[#4A0E17] font-normal mb-4">
                Precision spatial audits harmonizing art with architectural sightlines.
              </p>

              <p className="font-cormorant text-[16px] text-[#1E1412]/85 leading-relaxed font-normal mb-6">
                Our architectural art consultants evaluate room volume, daylight angles, ceiling sightlines, and interior finishes to curate a bespoke collection narrative that amplifies your spatial prestige.
              </p>

              <div className="space-y-2.5 mb-8 border-t border-[#C5A059]/25 pt-4">
                <div className="flex items-start gap-3">
                  <span className="text-[#C5A059] font-cinzel font-bold text-xs select-none mt-0.5">—</span>
                  <span className="font-cormorant text-[15px] text-[#1E1412]/85 italic font-normal">
                    High-fidelity 3D spatial simulation &amp; natural lux light audit
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#C5A059] font-cinzel font-bold text-xs select-none mt-0.5">—</span>
                  <span className="font-cormorant text-[15px] text-[#1E1412]/85 italic font-normal">
                    Custom curatorial narrative reflecting corporate heritage &amp; design identity
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#C5A059] font-cinzel font-bold text-xs select-none mt-0.5">—</span>
                  <span className="font-cormorant text-[15px] text-[#1E1412]/85 italic font-normal">
                    Turnkey mounting specifications for certified off-hours installation
                  </span>
                </div>
              </div>

              <Link
                to="/inquire?service=curation"
                className="pill-button pill-button-bordeaux text-xs py-3.5 px-6 shadow-md"
              >
                <span>Request Spatial Brief</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#DFC07D]" />
              </Link>
            </div>
          </motion.div>

        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            2. THE 5-STAGE PROTOCOL JOURNEY (SIMULTANEOUS LUXURY CARDS IN REGAL RED)
            ───────────────────────────────────────────────────────────────────────────── */}
        <section className="px-4 sm:px-6 md:px-12 max-w-[1500px] mx-auto mb-20 md:mb-24 select-none">
          <div className="bg-gradient-to-b from-[#38080E] via-[#4A0E17] to-[#2B050A] rounded-3xl p-6 sm:p-10 md:p-12 border border-[#DFC07D]/35 shadow-[0_20px_50px_rgba(74,14,23,0.25)] relative overflow-hidden">
            
            {/* Subtle Watermark */}
            <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full border border-[#DFC07D]/10 pointer-events-none" />
            
            <div className="text-center max-w-2xl mx-auto mb-10 relative z-10">
              <span className="font-cinzel text-[10.5px] uppercase tracking-[0.28em] text-[#DFC07D] font-bold block mb-1">
                THE CURATORIAL PROTOCOL
              </span>
              <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl text-white font-semibold tracking-tight">
                From Spatial Audit to Living Gallery
              </h2>
              <p className="font-cormorant italic text-base sm:text-lg text-[#FAF6F0]/85 mt-2 font-normal">
                A forensic, white-glove onboarding engineered to eliminate operational friction and deliver immediate spatial prestige.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 relative z-10">
              {protocolStages.map((stage) => (
                <motion.div 
                  key={stage.numeral}
                  whileHover={{ y: -5 }}
                  className="bg-[#5E121D]/80 hover:bg-[#6D1623] rounded-2xl overflow-hidden border border-[#DFC07D]/25 p-4 sm:p-5 flex flex-col justify-between shadow-md hover:border-[#DFC07D]/80 hover:shadow-xl transition-all duration-300 group"
                >
                  <div>
                    <div className="aspect-[4/3] w-full rounded-xl overflow-hidden relative bg-[#1E0407] mb-3.5 border border-[#DFC07D]/25 shadow-inner">
                      <img 
                        src={stage.image} 
                        alt={stage.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-[#38080E]/90 backdrop-blur-sm border border-[#DFC07D]/50 flex items-center justify-center">
                        <span className="font-cormorant italic font-bold text-xs text-[#DFC07D]">
                          {stage.numeral}
                        </span>
                      </div>
                    </div>

                    <span className="font-cinzel text-[9.5px] uppercase tracking-wider text-[#DFC07D] font-bold block mb-1">
                      {stage.category}
                    </span>

                    <h3 className="font-cinzel text-[14.5px] sm:text-[15px] font-semibold text-white group-hover:text-[#DFC07D] transition-colors leading-snug mb-2">
                      {stage.title}
                    </h3>
                    
                    <p className="font-cormorant text-[13.5px] text-[#FAF6F0]/85 leading-relaxed font-normal">
                      {stage.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            3. WHITE-GLOVE SUPPORT PROTOCOL
            ───────────────────────────────────────────────────────────────────────────── */}
        <WhiteGloveProtocolSection />

        {/* ─────────────────────────────────────────────────────────────────────────────
            4. SUBSCRIPTION CADENCE & ROTATION CYCLES
            ───────────────────────────────────────────────────────────────────────────── */}
        <section className="px-6 md:px-12 max-w-[1480px] mx-auto mb-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-cinzel text-[10.5px] uppercase tracking-[0.28em] text-[#4A0E17] font-bold block mb-1">
              ROTATIONAL LIFECYCLES
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl text-[#1E1412] font-semibold tracking-tight">
              Curated Rotational Cadences
            </h2>
            <p className="font-cormorant italic text-base sm:text-lg text-[#1E1412]/75 mt-2 font-normal">
              Maintain an engaging, perpetually evolving corporate atmosphere tailored to your business calendar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FCFAF6] rounded-3xl p-8 border border-[#C5A059]/35 shadow-xs hover:border-[#4A0E17] transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="font-cinzel text-xs font-bold text-[#4A0E17] bg-[#4A0E17]/10 px-3 py-1 rounded-md">
                  QUARTERLY • 90 DAYS
                </span>
                <Clock className="w-5 h-5 text-[#4A0E17]" />
              </div>
              <h3 className="font-cinzel text-xl font-semibold text-[#1E1412] mb-2">
                Seasonal Dynamic Energy
              </h3>
              <p className="font-cormorant text-base text-[#1E1412]/80 leading-relaxed font-normal">
                Quarterly art rotations that refresh your space with the rhythm of the seasons, giving guests and executives a new gallery experience on every return visit.
              </p>
            </div>

            <div className="bg-[#FCFAF6] rounded-3xl p-8 border-2 border-[#4A0E17] shadow-md relative">
              <div className="flex items-center justify-between mb-4">
                <span className="font-cinzel text-xs font-bold text-[#4A0E17] bg-[#4A0E17]/15 px-3 py-1 rounded-md">
                  BI-ANNUAL • 180 DAYS
                </span>
                <Layers className="w-5 h-5 text-[#4A0E17]" />
              </div>
              <h3 className="font-cinzel text-xl font-semibold text-[#1E1412] mb-2">
                Institutional Balance
              </h3>
              <p className="font-cormorant text-base text-[#1E1412]/80 leading-relaxed font-normal">
                Half-yearly refresh options for a measured, thoughtful evolution of your corporate collection, boardrooms, and spatial brand narrative.
              </p>
            </div>

            <div className="bg-[#FCFAF6] rounded-3xl p-8 border border-[#C5A059]/35 shadow-xs hover:border-[#4A0E17] transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="font-cinzel text-xs font-bold text-[#4A0E17] bg-[#4A0E17]/10 px-3 py-1 rounded-md">
                  ANNUAL • BESPOKE
                </span>
                <Sparkles className="w-5 h-5 text-[#4A0E17]" />
              </div>
              <h3 className="font-cinzel text-xl font-semibold text-[#1E1412] mb-2">
                Milestone Curation
              </h3>
              <p className="font-cormorant text-base text-[#1E1412]/80 leading-relaxed font-normal">
                Yearly curation themes that align with corporate milestones, annual general summits, architecture redesigns, and new headquarters openings.
              </p>
            </div>
          </div>

          {/* Consultation CTA */}
          <div className="mt-14 text-center">
            <Link
              to="/inquire"
              className="pill-button pill-button-bordeaux text-xs py-4 px-8 shadow-lg inline-flex items-center gap-2.5"
            >
              <span>Schedule Curatorial Consultation</span>
              <ArrowRight className="w-4 h-4 text-[#DFC07D]" />
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
