import React from 'react';
import { motion } from 'motion/react';

// Bespoke Luxury Gold & Bordeaux Vector Icons for Beige Background

// 01. Precision Museum Framing & Archival Bevel
function PrismFramingIcon() {
  return (
    <svg className="w-9 h-9 shrink-0" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldLinearBeige1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C5A059" />
          <stop offset="50%" stopColor="#8F6B24" />
          <stop offset="100%" stopColor="#4A0E17" />
        </linearGradient>
        <linearGradient id="crystalShineBeige" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C5A059" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#4A0E17" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Outer Precision Hardwood Frame Corner */}
      <path
        d="M8 38V10C8 8.89543 8.89543 8 10 8H38"
        stroke="url(#goldLinearBeige1)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner Bevel Line */}
      <path
        d="M14 38V16C14 14.8954 14.8954 14 16 14H38"
        stroke="#C5A059"
        strokeWidth="1.5"
        strokeOpacity="0.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Archival Optical Prism */}
      <polygon
        points="10,36 26,20 26,36"
        fill="url(#crystalShineBeige)"
        stroke="#4A0E17"
        strokeWidth="1.2"
      />
      {/* UV Protection Glare Ray */}
      <line x1="26" y1="20" x2="40" y2="34" stroke="#C5A059" strokeWidth="1.5" strokeDasharray="2 2" />
      <circle cx="26" cy="20" r="2" fill="#4A0E17" />
    </svg>
  );
}

// 02. Precision Laser Alignment & Security Anchor
function LaserShieldIcon() {
  return (
    <svg className="w-9 h-9 shrink-0" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldLinearBeige2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C5A059" />
          <stop offset="50%" stopColor="#8F6B24" />
          <stop offset="100%" stopColor="#4A0E17" />
        </linearGradient>
      </defs>

      {/* Shield Silhouette */}
      <path
        d="M24 6L10 11.5V23.5C10 32 16 39.5 24 41.5C32 39.5 38 32 38 23.5V11.5L24 6Z"
        stroke="url(#goldLinearBeige2)"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="#4A0E17"
        fillOpacity="0.05"
      />
      {/* Crosshair Laser Guidelines */}
      <line x1="8" y1="23.5" x2="40" y2="23.5" stroke="#C5A059" strokeWidth="1.2" strokeOpacity="0.8" />
      <line x1="24" y1="14" x2="24" y2="33" stroke="#C5A059" strokeWidth="1.2" strokeOpacity="0.8" />

      {/* Precision Reticle Target */}
      <circle cx="24" cy="23.5" r="5.5" stroke="#4A0E17" strokeWidth="1.2" strokeDasharray="2.5 1.5" />
      <circle cx="24" cy="23.5" r="2.2" fill="#4A0E17" />
    </svg>
  );
}

// 03. Insulated Climate-Monitored Transit Crate
function TransportCrateIcon() {
  return (
    <svg className="w-9 h-9 shrink-0" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldLinearBeige3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C5A059" />
          <stop offset="50%" stopColor="#8F6B24" />
          <stop offset="100%" stopColor="#4A0E17" />
        </linearGradient>
      </defs>

      {/* Flight Case Contour */}
      <rect x="5" y="10" width="38" height="28" rx="3" stroke="url(#goldLinearBeige3)" strokeWidth="2" fill="#4A0E17" fillOpacity="0.04" />
      {/* Protective Corner Bumpers */}
      <rect x="5" y="10" width="7" height="7" rx="1" stroke="#C5A059" strokeWidth="1" />
      <rect x="36" y="10" width="7" height="7" rx="1" stroke="#C5A059" strokeWidth="1" />
      <rect x="5" y="31" width="7" height="7" rx="1" stroke="#C5A059" strokeWidth="1" />
      <rect x="36" y="31" width="7" height="7" rx="1" stroke="#C5A059" strokeWidth="1" />
      
      {/* Insulated Horizontal Ribs */}
      <line x1="12" y1="19" x2="36" y2="19" stroke="#C5A059" strokeWidth="1.2" strokeOpacity="0.7" />
      <line x1="12" y1="29" x2="36" y2="29" stroke="#C5A059" strokeWidth="1.2" strokeOpacity="0.7" />

      {/* Precision Thermometer / Barometer Dial */}
      <circle cx="24" cy="24" r="5" stroke="#4A0E17" strokeWidth="1.2" fill="#FCFAF6" />
      <line x1="24" y1="24" x2="27" y2="21" stroke="#4A0E17" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="24" cy="24" r="1.2" fill="#C5A059" />
    </svg>
  );
}

// 04. Institutional Protection & Vault Crest
function ConciergeVaultKeyIcon() {
  return (
    <svg className="w-9 h-9 shrink-0" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldLinearBeige4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C5A059" />
          <stop offset="50%" stopColor="#8F6B24" />
          <stop offset="100%" stopColor="#4A0E17" />
        </linearGradient>
      </defs>

      {/* Concentric Vault Dial Ring */}
      <circle cx="24" cy="24" r="18" stroke="url(#goldLinearBeige4)" strokeWidth="1.8" strokeDasharray="1.5 2.5" fill="#4A0E17" fillOpacity="0.04" />
      <circle cx="24" cy="24" r="13" stroke="#C5A059" strokeWidth="1.2" strokeOpacity="0.8" />

      {/* Archival Vault Keyhole Crest */}
      <circle cx="24" cy="17" r="3.5" stroke="#4A0E17" strokeWidth="1.5" fill="#FCFAF6" />
      <line x1="24" y1="20.5" x2="24" y2="32" stroke="#4A0E17" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 27H28V29.5H24" stroke="#4A0E17" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M24 30.5H29V33H24" stroke="#4A0E17" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export default function WhiteGloveProtocolSection() {
  const protocolCards = [
    {
      title: 'Museum-Grade Framing',
      description: 'Custom archival mounts, 99.8% UV-protective museum glass, and bespoke hand-finished hardwood profiles tailored to your interiors.',
      icon: <PrismFramingIcon />
    },
    {
      title: 'Precision Laser Mounting',
      description: 'Sub-millimeter laser-aligned mounting executed by certified museum art handlers with subterranean anti-theft anchors.',
      icon: <LaserShieldIcon />
    },
    {
      title: 'Climate-Monitored Transit',
      description: 'Temperature-controlled, shock-insulated, and fully insured white-glove transport directly into your executive suites.',
      icon: <TransportCrateIcon />
    },
    {
      title: 'Institutional Protection',
      description: 'Comprehensive coverage shielding all fine art assets against accidental damage, environmental shifts, and wear.',
      icon: <ConciergeVaultKeyIcon />
    }
  ];

  return (
    <section className="px-4 sm:px-6 md:px-10 max-w-[1440px] mx-auto mb-16 select-none">
      {/* Vault Luxury Beige / Parchment Container */}
      <div className="relative rounded-3xl p-5 sm:p-7 md:p-8 border border-[#C5A059]/35 bg-[#FAF6F0] shadow-[0_15px_40px_rgba(74,14,23,0.05)] overflow-hidden">
        
        {/* Subtle Architectural Blueprint Watermark */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.05]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 85% 85%, rgba(197, 160, 89, 0.3) 0%, transparent 60%),
              linear-gradient(to right, rgba(74, 14, 23, 0.2) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(74, 14, 23, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 36px 36px, 36px 36px'
          }}
        />

        {/* Ambient Subtle Glow */}
        <div 
          className="absolute top-0 right-0 w-96 h-96 pointer-events-none opacity-30"
          style={{
            background: 'radial-gradient(circle at 100% 0%, rgba(197, 160, 89, 0.2) 0%, transparent 70%)'
          }}
        />

        {/* Compact Header Row */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 mb-5 border-b border-[#C5A059]/30">
          <div>
            <div className="inline-flex items-center gap-2 mb-1">
              <span className="text-[#4A0E17] text-xs">✦</span>
              <span className="font-cinzel text-[10px] uppercase tracking-[0.25em] text-[#4A0E17] font-bold">
                WHITE-GLOVE PROTOCOL
              </span>
              <div className="h-px w-14 sm:w-20 bg-gradient-to-r from-[#4A0E17] to-transparent ml-2" />
            </div>

            <h2 className="font-cinzel text-xl sm:text-2xl md:text-3xl font-bold tracking-tight uppercase leading-tight text-[#1E1412]">
              ZERO OPERATIONAL DISRUPTION
            </h2>
          </div>

          <p className="font-cormorant italic text-sm sm:text-base text-[#1E1412]/80 max-w-sm md:text-right leading-snug font-normal">
            Logistical mastery executed entirely by certified museum art handlers, archival framers, and institutional conservators.
          </p>
        </div>

        {/* Main Content Grid: Left Hero Card + Right 2x2 Modules */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
          
          {/* Left Hero Card */}
          <div className="lg:col-span-4 bg-[#FCFAF6] rounded-2xl p-4 sm:p-5 border border-[#C5A059]/35 flex flex-col justify-between shadow-xs backdrop-blur-sm group hover:border-[#4A0E17] hover:shadow-md transition-all duration-300">
            <div className="relative rounded-xl overflow-hidden aspect-[16/10] mb-3.5 border border-[#C5A059]/25 bg-[#1E1412]">
              <img
                src="/assets/keyhole_magnifier_art.jpg"
                alt="Antique brass keyhole magnifier over architectural blueprint plans"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>

            <div>
              <span className="font-cinzel text-[9.5px] uppercase tracking-[0.22em] text-[#C5A059] font-bold block mb-1">
                MUSEUM STANDARDS
              </span>
              <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#1E1412] tracking-wide mb-1.5 group-hover:text-[#4A0E17] transition-colors">
                Certified Art Technicians
              </h3>
              <p className="font-cormorant text-[13.5px] sm:text-sm text-[#1E1412]/80 leading-relaxed font-normal">
                Sub-millimeter laser alignment, seismic architectural wall anchors, and discreet off-hours installation.
              </p>
            </div>
          </div>

          {/* Right 2x2 Grid of 4 Service Modules */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            {protocolCards.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                className="bg-[#FCFAF6] hover:bg-white rounded-2xl p-4 sm:p-4.5 border border-[#C5A059]/30 hover:border-[#4A0E17] transition-all duration-300 flex flex-col justify-between group shadow-xs hover:shadow-md"
              >
                <div>
                  <div className="flex items-center mb-3">
                    {card.icon}
                  </div>

                  <h4 className="font-cinzel text-xs sm:text-[13.5px] font-bold text-[#1E1412] tracking-wider uppercase mb-1.5 group-hover:text-[#4A0E17] transition-colors leading-snug">
                    {card.title}
                  </h4>

                  <p className="font-cormorant text-[13px] sm:text-[13.5px] text-[#1E1412]/80 leading-relaxed font-normal">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
