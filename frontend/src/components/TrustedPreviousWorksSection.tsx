import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

const SECTORS_DATA = [
  {
    id: 1,
    title: "Hotels & Hospitality",
    description: "Create memorable experiences for every guest with monumental foyer masterworks and intimate, rotating salon suite collections.",
    features: ["Grand Foyer Centerpieces", "Presidential Suite Framing", "Quarterly Rotation Policy"],
    image: "/assets/artistic_hotel_foyer.jpg"
  },
  {
    id: 2,
    title: "Corporates & Workspaces",
    description: "Foster team creativity, workplace focus, and authoritative brand expression through curated boardroom art collections.",
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
    title: "Builders & Model Residences",
    description: "Elevate premier model residences and architectural penthouses with bespoke staging that accelerates collector acquisitions.",
    features: ["Double-Height Wall Staging", "Architectural Scale Works", "Rapid Turnkey Installation"],
    image: "/assets/artistic_showflat_penthouse.jpg"
  }
];

// Strictly the 3 requested brands: ITC, JLL, LUCIA INTERIORS
const BRAND_PARTNERS = [
  {
    name: 'ITC HOTELS',
    subtitle: 'Hospitality Portfolio',
  },
  {
    name: 'JLL',
    subtitle: 'Real Estate Advisory',
  },
  {
    name: 'LUCIA INTERIORS',
    subtitle: 'Architectural Atelier',
  }
];

export default function TrustedPreviousWorksSection() {
  return (
    <section className="bg-[#FAF6F0] py-14 md:py-20 border-y border-[#C5A059]/25 relative overflow-hidden select-none">
      
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 md:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
          <span className="font-cinzel text-[10.5px] uppercase tracking-[0.28em] text-[#4A0E17] font-bold block mb-1.5">
            WHERE WE CURATE
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl text-[#1E1412] font-semibold tracking-tight">
            Curating Your <span className="font-cormorant italic font-normal text-[#4A0E17]">World</span>
          </h2>
          <p className="font-cormorant text-base sm:text-lg text-[#1E1412]/75 mt-2 leading-relaxed max-w-xl mx-auto font-normal">
            From monumental hotel foyers to executive boardrooms and artisanal dining salons, we bring art into architectural spaces.
          </p>
        </div>

        {/* 4 Sector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-12">
          {SECTORS_DATA.map((sector, index) => (
            <motion.div 
              key={sector.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
              whileHover={{ y: -4 }}
              className="bg-[#FCFAF6] rounded-2xl overflow-hidden border border-[#C5A059]/30 hover:border-[#4A0E17] shadow-xs hover:shadow-[0_16px_36px_rgba(74,14,23,0.08)] transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image Container */}
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
                  <h3 className="font-cinzel text-base sm:text-lg font-semibold text-[#1E1412] group-hover:text-[#4A0E17] transition-colors leading-snug mb-2">
                    {sector.title}
                  </h3>

                  <p className="font-cormorant text-sm text-[#1E1412]/80 leading-relaxed font-normal mb-4">
                    {sector.description}
                  </p>

                  {/* Deliverables Checklist */}
                  <div className="space-y-1.5 border-t border-[#C5A059]/20 pt-3.5">
                    {sector.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs text-[#1E1412]/85 font-cormorant">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#4A0E17] shrink-0" />
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
            AUTOMATIC CONTINUOUS BRAND CAROUSEL: STRICTLY ITC, JLL, LUCIA INTERIORS
            ───────────────────────────────────────────────────────────────────────────── */}
        <div className="bg-[#FCFAF6] rounded-2xl py-7 px-4 sm:px-8 border border-[#C5A059]/30 shadow-xs overflow-hidden">
          
          <div className="text-center mb-6">
            <span className="font-cinzel text-[10px] uppercase tracking-[0.3em] text-[#4A0E17] font-bold block mb-1">
              CURATION PARTNERS & CLIENT NETWORK
            </span>
            <p className="font-cormorant italic text-sm text-[#1E1412]/70">
              Trusted across premier hospitality, commercial workspaces, and architectural ateliers
            </p>
          </div>

          {/* Infinite Smooth Automatic Marquee Carousel */}
          <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
            <div className="animate-marquee flex items-center gap-12 sm:gap-20 py-2">
              {[
                ...BRAND_PARTNERS,
                ...BRAND_PARTNERS,
                ...BRAND_PARTNERS,
                ...BRAND_PARTNERS,
                ...BRAND_PARTNERS,
                ...BRAND_PARTNERS,
              ].map((brand, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-12 sm:gap-20 shrink-0 group cursor-default"
                >
                  <div className="flex flex-col items-center text-center opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="font-cinzel text-base sm:text-lg font-semibold tracking-[0.24em] text-[#1E1412] group-hover:text-[#4A0E17] transition-colors uppercase whitespace-nowrap">
                      {brand.name}
                    </span>
                    <span className="font-cormorant italic text-xs text-[#1E1412]/60 mt-0.5 whitespace-nowrap">
                      {brand.subtitle}
                    </span>
                  </div>

                  {/* Subtle Gilded Divider Diamond between items */}
                  <span className="text-[#C5A059]/50 text-[8px] select-none">
                    ◆
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
