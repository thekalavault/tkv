import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useEffect } from 'react';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import { Check, ArrowRight, ShieldCheck, Sparkles, Building2, Landmark, RefreshCw, Layers, Clock, Award } from 'lucide-react';

export default function Subscriptions() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const SUBSCRIPTION_SUITES = [
    {
      id: 'standard',
      number: '01',
      badge: 'STARTER TIER',
      title: 'The Standard Suite',
      price: '₹79,999',
      period: 'per month / billed quarterly',
      idealFor: 'Boutique hotels, private lounges & executive suites',
      allocation: '20 Curated Artworks',
      breakdown: [
        '2 Large Centerpieces (Lobby / Boardroom focal points)',
        '8 Medium Statements (Meeting rooms & corridors)',
        '10 Small Accents (Private leadership pods & desks)',
        'Seasonal 90-day or bi-annual collection refresh',
        'Museum-grade archival framing tailored to space',
        'White-glove delivery, mounting & insured transit',
        'Rent-to-own capital credit on any favorite work',
      ],
      isPopular: false,
      ctaText: 'Inquire Standard Suite',
      theme: 'creme'
    },
    {
      id: 'premium',
      number: '02',
      badge: 'FLAGSHIP • MOST POPULAR',
      title: 'The Premium Suite',
      price: '₹1,59,999',
      period: 'per month / billed quarterly',
      idealFor: 'Mid-sized enterprises & grand luxury hospitality',
      allocation: '50 Diverse Pieces including Sculptures',
      breakdown: [
        '8 Large Statement Canvases (Main foyer & reception)',
        '15 Medium Statement Works (Conference suites)',
        '15 Small Intimate Works (Executive offices & corridors)',
        '12 Desk & Shelf Decorative Arts & Sculptures',
        'Guaranteed quarterly (90-day) full gallery rotations',
        'Dedicated senior art consultant & 3D placement plan',
        'Concierge damage protection & white-glove handlers',
        'Flexible rent-to-own equity accrual',
      ],
      isPopular: true,
      ctaText: 'Inquire Premium Suite',
      theme: 'cherry'
    },
    {
      id: 'signature',
      number: '03',
      badge: 'BESPOKE COMMISSION',
      title: 'Signature Bespoke',
      price: '₹3,00,000+',
      period: 'starting monthly investment',
      idealFor: 'Multi-floor headquarters & landmark hotel chains',
      allocation: 'Unlimited Scaled Portfolio',
      breakdown: [
        'Rare original masterworks & limited edition releases',
        'Monumental floor-to-ceiling & sculptural commissions',
        'Priority access to unreleased private vault registries',
        'On-demand immediate swaps for summits & VIP galas',
        'Custom gallery lighting & acoustic alignment brief',
        'Complimentary white-glove installation & logistics',
        'Direct artist engagement & custom provenance plaques',
      ],
      isPopular: false,
      ctaText: 'Request Bespoke Dossier',
      theme: 'creme'
    }
  ];

  const SIZES_MATRIX = [
    {
      code: '01',
      format: 'Executive Format',
      dimension: '36" × 36"',
      bestFor: 'Private leadership suites & collaborative pods',
      price: '₹60,000 / mo',
      scope: '20 pieces included'
    },
    {
      code: '02',
      format: 'Gallery Portfolio',
      dimension: '48" × 36"',
      bestFor: 'High-visibility hallways & conference rooms',
      price: '₹80,000 / mo',
      scope: '20 pieces included'
    },
    {
      code: '03',
      format: 'Premium Statement',
      dimension: '48" × 48"',
      bestFor: 'Square-format centerpieces for modern lobbies',
      price: '₹1,10,000 / mo',
      scope: '20 pieces included'
    },
    {
      code: '04',
      format: 'Lumina Grand XL',
      dimension: '72" × 48"',
      bestFor: 'Dramatic focal points for main reception & foyers',
      price: '₹1,80,000 / mo',
      scope: '20 pieces included'
    },
    {
      code: '05',
      format: 'Architectural Scale',
      dimension: '8 ft and above',
      bestFor: 'Bespoke floor-to-ceiling signature installations',
      price: '₹2,40,000+ / mo',
      scope: '20 pieces bespoke'
    }
  ];

  return (
    <div className="bg-[#FAF6F0] text-[#1E1412] font-sans selection:bg-[#C5A059]/30 min-h-screen flex flex-col">
      <TopNavBar />

      <main className="pt-24 md:pt-32 pb-24 flex-grow">
        
        {/* ─────────────────────────────────────────────────────────────────────────────
            1. REFINED EDITORIAL HEADER
            ───────────────────────────────────────────────────────────────────────────── */}
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
                SUBSCRIPTION PROGRAMS
              </span>
              <div className="h-px w-8 bg-[#C5A059]" />
            </div>
            
            <h1 className="font-brand text-3xl sm:text-5xl md:text-6xl text-[#1E1412] font-bold tracking-tight mb-5 leading-[1.15]">
              Curated Collections, <br />
              <span className="text-[#7B2431] italic font-cormorant font-normal">Season by Season.</span>
            </h1>
            
            <p className="text-[#1E1412]/75 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-light">
              Keep your spaces perpetually dynamic. Access museum-grade original masterworks with seamless quarterly rotations, bespoke archival framing, and flexible rent-to-own options.
            </p>
          </motion.div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            2. THE 3 CORE SUBSCRIPTION SUITES (Luxury Showcase Cards)
            ───────────────────────────────────────────────────────────────────────────── */}
        <section className="px-6 md:px-12 max-w-[1440px] mx-auto mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {SUBSCRIPTION_SUITES.map((suite) => {
              const isCherry = suite.theme === 'cherry';
              return (
                <motion.div
                  key={suite.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className={`rounded-3xl flex flex-col justify-between p-8 sm:p-10 relative overflow-hidden transition-all duration-300 ${
                    isCherry
                      ? 'bg-gradient-to-b from-[#7B2431] via-[#5C1622] to-[#420B15] text-[#FAF6F0] border-2 border-[#DFC07D] shadow-[0_20px_50px_rgba(123,36,49,0.25)] scale-[1.02] lg:scale-[1.04] z-10'
                      : 'bg-[#FCFAF6] text-[#1E1412] border border-[#C5A059]/35 shadow-xs hover:border-[#7B2431] hover:shadow-md'
                  }`}
                >
                  {isCherry && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-[#DFC07D] to-[#C5A059] text-[#241611] font-cinzel text-[9.5px] uppercase tracking-[0.22em] font-bold px-4 py-1.5 rounded-bl-2xl shadow-xs">
                      FLAGSHIP
                    </div>
                  )}

                  <div>
                    {/* Number & Badge */}
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-current/15">
                      <span className={`font-mono text-xs font-bold ${
                        isCherry ? 'text-[#DFC07D]' : 'text-[#7B2431]'
                      }`}>
                        SUITE {suite.number}
                      </span>
                      <span className={`font-cinzel text-[10px] uppercase tracking-[0.2em] font-bold ${
                        isCherry ? 'text-[#DFC07D]' : 'text-[#7B2431]'
                      }`}>
                        {suite.badge}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className={`font-cinzel text-2xl sm:text-3xl font-bold mb-2 ${
                      isCherry ? 'text-white' : 'text-[#1E1412]'
                    }`}>
                      {suite.title}
                    </h3>

                    <p className={`text-xs leading-relaxed mb-6 font-light ${
                      isCherry ? 'text-[#FAF6F0]/80' : 'text-[#1E1412]/70'
                    }`}>
                      {suite.idealFor}
                    </p>

                    {/* Pricing Block */}
                    <div className={`p-5 rounded-2xl mb-6 border ${
                      isCherry 
                        ? 'bg-black/20 border-white/15' 
                        : 'bg-[#FAF6F0] border-[#C5A059]/25'
                    }`}>
                      <div className="flex items-baseline gap-2">
                        <span className={`font-cinzel text-3xl sm:text-4xl font-bold tracking-tight ${
                          isCherry ? 'text-[#DFC07D]' : 'text-[#7B2431]'
                        }`}>
                          {suite.price}
                        </span>
                      </div>
                      <span className={`text-[11px] uppercase tracking-wider font-semibold block mt-1 ${
                        isCherry ? 'text-white/70' : 'text-[#1E1412]/60'
                      }`}>
                        {suite.period}
                      </span>
                    </div>

                    {/* Allocation Chip */}
                    <div className={`py-2 px-3 rounded-xl mb-6 font-cinzel text-xs uppercase tracking-wider font-bold text-center border ${
                      isCherry 
                        ? 'bg-white/10 text-white border-white/15' 
                        : 'bg-white text-[#7B2431] border-[#C5A059]/30 shadow-2xs'
                    }`}>
                      {suite.allocation}
                    </div>

                    {/* Feature Checklist */}
                    <ul className="space-y-3 text-xs sm:text-[12.5px] mb-8 font-light leading-relaxed">
                      {suite.breakdown.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${
                            isCherry ? 'text-[#DFC07D]' : 'text-[#7B2431]'
                          }`} />
                          <span className={isCherry ? 'text-white/90' : 'text-[#1E1412]/80'}>
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <Link
                    to="/inquire"
                    className={`w-full py-4 rounded-xl font-cinzel text-xs uppercase tracking-[0.2em] font-bold text-center transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                      isCherry
                        ? 'bg-[#DFC07D] hover:bg-[#F5E4B8] text-[#241611] shadow-md hover:scale-[1.01]'
                        : 'bg-[#7B2431] hover:bg-[#8F2C3C] text-[#FAF6F0] shadow-xs hover:scale-[1.01]'
                    }`}
                  >
                    <span>{suite.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            3. ARCHITECTURAL SIZING SPECIFIER (High-End Spatial Lookbook)
            ───────────────────────────────────────────────────────────────────────────── */}
        <section className="px-6 md:px-12 max-w-[1440px] mx-auto mb-24">
          <div className="bg-[#FCFAF6] border border-[#C5A059]/35 rounded-3xl p-8 sm:p-12 md:p-14 shadow-xs relative overflow-hidden">
            
            {/* Ambient gold glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#DFC07D]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-10 border-b border-[#C5A059]/25 gap-6 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="w-4 h-4 text-[#7B2431]" />
                  <span className="font-cinzel text-[10.5px] uppercase tracking-[0.28em] text-[#7B2431] font-bold">
                    SPATIAL SPECIFICATION MATRIX
                  </span>
                </div>
                <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E1412] tracking-tight">
                  Architectural Sizing Portfolio
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#1E1412]/70 max-w-md font-light leading-relaxed">
                Precision-engineered monthly curations for <strong className="text-[#7B2431] font-semibold">20 pieces</strong> calibrated to room sightlines, ceiling heights, and corporate lighting briefs.
              </p>
            </div>

            {/* Sizing Grid with Architectural Ratio Previews */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
              {SIZES_MATRIX.map((item) => (
                <div 
                  key={item.code}
                  className="bg-[#FAF6F0] rounded-2xl border border-[#C5A059]/30 p-6 flex flex-col justify-between hover:border-[#7B2431] hover:shadow-md transition-all duration-300 group"
                >
                  <div>
                    {/* Visual Ratio Graphic */}
                    <div className="h-32 bg-[#F3ECE2] rounded-xl border border-dashed border-[#C5A059]/40 mb-6 flex items-center justify-center relative overflow-hidden group-hover:bg-[#EDE3D5] transition-colors">
                      {/* Scale Frame Simulation */}
                      <div className={`border-2 border-[#7B2431]/70 shadow-xs flex items-center justify-center bg-white/80 transition-transform group-hover:scale-105 ${
                        item.code === '01' ? 'w-18 h-18' :
                        item.code === '02' ? 'w-24 h-16' :
                        item.code === '03' ? 'w-22 h-22' :
                        item.code === '04' ? 'w-28 h-18' :
                        'w-32 h-20 border-dashed border-[#7B2431]'
                      }`}>
                        <span className="font-mono text-[9.5px] text-[#7B2431] font-bold tracking-tight">
                          {item.dimension}
                        </span>
                      </div>
                      <div className="absolute bottom-2 left-3 text-[9px] font-mono uppercase text-[#1E1412]/40 tracking-wider">
                        WALL ELEVATION
                      </div>
                      <div className="absolute top-2 right-3 font-mono text-[10px] font-bold text-[#7B2431]">
                        {item.dimension}
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div className="flex items-baseline justify-between mb-1.5">
                      <h3 className="font-cinzel text-xl font-bold text-[#1E1412] group-hover:text-[#7B2431] transition-colors">
                        {item.format}
                      </h3>
                      <span className="font-mono text-xs text-[#7B2431]/70 font-semibold">
                        {item.code}
                      </span>
                    </div>
                    
                    <p className="text-xs text-[#1E1412]/70 font-light leading-relaxed mb-6">
                      {item.bestFor}
                    </p>
                  </div>

                  {/* Pricing and Action */}
                  <div className="pt-4 border-t border-[#C5A059]/20 flex items-end justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-cinzel text-[#1E1412]/50 font-bold tracking-wider block">
                        MONTHLY INVESTMENT
                      </span>
                      <span className="font-cinzel text-2xl font-bold text-[#7B2431] block">
                        {item.price.replace(' / mo', '')}
                        <span className="text-xs font-normal text-[#1E1412]/60 ml-1 font-sans">/ mo</span>
                      </span>
                    </div>

                    <Link
                      to="/inquire"
                      className="px-4 py-2.5 rounded-lg bg-[#7B2431] hover:bg-[#8F2C3C] text-[#FAF6F0] font-cinzel text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-xs hover:gap-2"
                    >
                      <span>SPECIFY</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}

              {/* Turnkey Custom Enterprise Card */}
              <div className="bg-gradient-to-br from-[#7B2431] via-[#5A1420] to-[#3B0711] text-white rounded-2xl p-6 flex flex-col justify-between border-2 border-[#DFC07D] shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#DFC07D] text-[#241611] font-cinzel text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-bl-xl">
                  ENTERPRISE
                </div>

                <div>
                  {/* Visual Enterprise Graphic */}
                  <div className="h-32 bg-black/20 rounded-xl border border-white/20 mb-6 flex flex-col items-center justify-center p-3 text-center">
                    <Building2 className="w-8 h-8 text-[#DFC07D] mb-1.5" />
                    <span className="font-cinzel text-xs uppercase tracking-wider font-bold text-white/90">
                      Campus & Multi-Floor Rollouts
                    </span>
                    <span className="text-[10px] text-[#DFC07D] font-mono mt-1">
                      100+ Artworks • Custom Sculptures
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mb-1.5">
                    <h3 className="font-cinzel text-xl font-bold text-white">
                      Full Architectural Scale
                    </h3>
                    <span className="font-mono text-xs text-[#DFC07D] font-semibold">
                      06
                    </span>
                  </div>
                  
                  <p className="text-xs text-[#FAF6F0]/80 font-light leading-relaxed mb-6">
                    Floor-to-ceiling sculptural focal points, acoustic art panels, multi-city headquarters, and tailored museum curation.
                  </p>
                </div>

                <div className="pt-4 border-t border-white/15">
                  <Link
                    to="/inquire"
                    className="w-full py-3 rounded-lg bg-[#DFC07D] hover:bg-[#F5E4B8] text-[#241611] font-cinzel text-xs font-bold uppercase tracking-[0.16em] text-center block transition-all shadow-md hover:scale-[1.01]"
                  >
                    CONSULT SENIOR CURATOR
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            4. THE KALA VAULT EDGE (4 Foundational Value Pillars)
            ───────────────────────────────────────────────────────────────────────────── */}
        <section className="px-6 md:px-12 max-w-[1440px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-cinzel text-[10.5px] uppercase tracking-[0.24em] text-[#7B2431] font-bold block mb-1">
              THE VALUE PROPOSITION
            </span>
            <h2 className="font-cinzel text-3xl md:text-4xl text-[#1E1412] font-bold">
              The Kala Vault Edge
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#FCFAF6] rounded-2xl p-7 border border-[#C5A059]/30 shadow-2xs hover:border-[#7B2431] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#7B2431]/10 flex items-center justify-center text-[#7B2431] mb-4">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="font-cinzel text-base font-bold text-[#1E1412] mb-2">
                Experience First
              </h3>
              <p className="text-xs text-[#1E1412]/75 leading-relaxed font-light">
                Your visitors and team enjoy a "new gallery" feel every few months — always fresh, dynamic, and inspiring.
              </p>
            </div>

            <div className="bg-[#FCFAF6] rounded-2xl p-7 border border-[#C5A059]/30 shadow-2xs hover:border-[#7B2431] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#7B2431]/10 flex items-center justify-center text-[#7B2431] mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-cinzel text-base font-bold text-[#1E1412] mb-2">
                Cost Effective
              </h3>
              <p className="text-xs text-[#1E1412]/75 leading-relaxed font-light">
                No huge upfront capital investment. Access high-value artwork collections at a fraction of the outright acquisition cost.
              </p>
            </div>

            <div className="bg-[#FCFAF6] rounded-2xl p-7 border border-[#C5A059]/30 shadow-2xs hover:border-[#7B2431] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#7B2431]/10 flex items-center justify-center text-[#7B2431] mb-4">
                <Check className="w-5 h-5" />
              </div>
              <h3 className="font-cinzel text-base font-bold text-[#1E1412] mb-2">
                Zero Hassle
              </h3>
              <p className="text-xs text-[#1E1412]/75 leading-relaxed font-light">
                We handle curation, delivery, precision installation, and insured transit. You simply enjoy the view.
              </p>
            </div>

            <div className="bg-[#FCFAF6] rounded-2xl p-7 border border-[#C5A059]/30 shadow-2xs hover:border-[#7B2431] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#7B2431]/10 flex items-center justify-center text-[#7B2431] mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-cinzel text-base font-bold text-[#1E1412] mb-2">
                Rent to Own
              </h3>
              <p className="text-xs text-[#1E1412]/75 leading-relaxed font-light">
                Fall in love with a piece? You have the flexible option to permanently purchase any artwork after renting.
              </p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
