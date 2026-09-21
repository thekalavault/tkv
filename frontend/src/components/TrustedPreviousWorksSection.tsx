import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

const SECTORS_DATA = [
  {
    id: 1,
    title: "Hotels & Hospitality",
    description: "Create lasting memories for every guest with monumental grand foyer masterworks and intimate, rotating salon suite collections.",
    features: ["Grand Foyer Centerpieces", "Presidential Suite Framing", "Quarterly Rotation Policy"],
    image: "/assets/artistic_hotel_foyer.jpg"
  },
  {
    id: 2,
    title: "Corporates & Workspaces",
    description: "Boost team creativity, workplace wellness, and authoritative brand expression through curated boardroom abstracts.",
    features: ["Executive Boardroom Trios", "Acoustic Wall Dressing", "100% Tax Deductible OPEX"],
    image: "/assets/artistic_boardroom.jpg"
  },
  {
    id: 3,
    title: "Cafés & Fine Dining",
    description: "Atmospheric wall styling and contemporary collections that keep discerning diners coming back and lingering longer.",
    features: ["Intimate Gallery Walls", "Custom Warm Luminaire Match", "Dynamic Seasonal Curation"],
    image: "/assets/artistic_cafe_dining.jpg"
  },
  {
    id: 4,
    title: "Builders & Luxury Show-Flats",
    description: "Make premier show-flats and architectural model penthouses unforgettable with bespoke staging that accelerates sales.",
    features: ["Double-Height Wall Staging", "Architectural Scale Works", "Rapid Turnkey Installation"],
    image: "/assets/artistic_showflat_penthouse.jpg"
  }
];

// Curated 3 Key Enterprise Brand Partners: ITC, JLL, LUCIA
const BRAND_PARTNERS = [
  {
    name: 'ITC HOTELS',
    subtitle: 'THE LUXURY COLLECTION',
    symbol: '🏛️'
  },
  {
    name: 'JLL',
    subtitle: 'REAL ESTATE ADVISORY',
    symbol: '🏢'
  },
  {
    name: 'LUCIA INTERIORS',
    subtitle: 'HAUTE ARCHITECTURE',
    symbol: '⚜️'
  }
];

export default function TrustedPreviousWorksSection() {
  return (
    <section className="bg-[#FAF6F0] py-14 md:py-20 border-y border-[#C5A059]/25 relative overflow-hidden">
      
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 md:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
          <span className="font-cinzel text-[10.5px] uppercase tracking-[0.28em] text-[#7B2431] font-bold block mb-1.5">
            WHERE WE CREATE
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl text-[#1E1412] font-bold tracking-tight">
            Styling Your <span className="font-cormorant italic font-normal text-[#7B2431]">World</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#1E1412]/75 mt-2 font-light leading-relaxed max-w-xl mx-auto">
            From monumental hotel foyers to executive boardrooms and artisanal dining salons, we bring every space to life.
          </p>
        </div>

        {/* 4 Minimalist & Clean Sector Cards (No badges, No buttons, Pure elegance) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-14">
          {SECTORS_DATA.map((sector, index) => (
            <motion.div 
              key={sector.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
              whileHover={{ y: -4 }}
              className="bg-[#FCFAF6] rounded-2xl overflow-hidden border border-[#C5A059]/30 hover:border-[#7B2431] shadow-xs hover:shadow-[0_16px_36px_rgba(123,36,49,0.10)] transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Clean Image Container */}
                <div className="aspect-[16/11] w-full overflow-hidden relative bg-[#1E1412]">
                  <img 
                    src={sector.image} 
                    alt={sector.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Body Content */}
                <div className="p-5 sm:p-6">
                  <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#1E1412] group-hover:text-[#7B2431] transition-colors leading-snug mb-2">
                    {sector.title}
                  </h3>

                  <p className="text-xs sm:text-[12.5px] text-[#1E1412]/75 leading-relaxed font-light mb-4">
                    {sector.description}
                  </p>

                  {/* Deliverables Checklist */}
                  <div className="space-y-1.5 border-t border-[#C5A059]/20 pt-3.5">
                    {sector.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-[11.5px] text-[#1E1412]/80 font-light">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#7B2431] shrink-0" />
                        <span className="truncate">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ─────────────────────────────────────────────────────────────────────────────
            BRAND LOGO MARQUEE: STRICTLY ITC, JLL, LUCIA INTERIORS (3 BRANDS)
            ───────────────────────────────────────────────────────────────────────────── */}
        <div className="bg-[#FCFAF6] rounded-2xl p-6 sm:p-7 border border-[#C5A059]/30 shadow-xs relative overflow-hidden">
          
          <div className="text-center mb-5">
            <span className="font-cinzel text-[10px] uppercase tracking-[0.3em] text-[#7B2431] font-bold block mb-1">
              CURATION PARTNERS & CLIENT NETWORK
            </span>
            <p className="text-xs text-[#1E1412]/70 font-light">
              Trusted by world-renowned hospitality, real estate, and architectural leaders
            </p>
          </div>

          {/* Infinite Marquee Strip: Exactly ITC, JLL, LUCIA */}
          <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex items-center gap-10 sm:gap-16 w-max animate-marquee hover:[animation-play-state:paused] py-1">
              {[...BRAND_PARTNERS, ...BRAND_PARTNERS, ...BRAND_PARTNERS, ...BRAND_PARTNERS].map((brand, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3.5 px-7 py-3 rounded-xl bg-[#FAF6F0] border border-[#C5A059]/25 hover:border-[#7B2431] hover:shadow-md transition-all duration-300 shrink-0 group cursor-default"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">
                    {brand.symbol}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-cinzel text-sm sm:text-base font-bold tracking-widest text-[#1E1412] group-hover:text-[#7B2431] transition-colors uppercase">
                      {brand.name}
                    </span>
                    <span className="font-mono text-[8.5px] tracking-wider text-[#1E1412]/50 font-semibold uppercase">
                      {brand.subtitle}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
