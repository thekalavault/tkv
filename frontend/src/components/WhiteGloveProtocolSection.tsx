import React from 'react';
import { motion } from 'motion/react';

// Custom Detailed SVG Graphics for the 4 Protocol Modules matching the exact Reference Deck

// 01. Prism & Museum-Grade Framing Corner
function PrismFramingIcon() {
  return (
    <svg className="w-12 h-12" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldFrameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5E5C9" />
          <stop offset="50%" stopColor="#C5A059" />
          <stop offset="100%" stopColor="#7E6028" />
        </linearGradient>
        <linearGradient id="prismSpectrum" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF4D6D" />
          <stop offset="25%" stopColor="#FFAA00" />
          <stop offset="50%" stopColor="#00F5D4" />
          <stop offset="75%" stopColor="#00BBF9" />
          <stop offset="100%" stopColor="#9B5DE5" />
        </linearGradient>
        <filter id="prismGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer Precision Hardwood Frame Corner */}
      <path
        d="M8 44V10C8 8.89543 8.89543 8 10 8H44"
        stroke="url(#goldFrameGrad)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner Bevel Frame Line */}
      <path
        d="M15 44V17C15 15.8954 15.8954 15 17 15H44"
        stroke="url(#goldFrameGrad)"
        strokeWidth="2"
        strokeOpacity="0.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Optical Glass Triangle / Prism */}
      <polygon
        points="10,42 28,24 28,42"
        fill="url(#prismSpectrum)"
        fillOpacity="0.85"
        filter="url(#prismGlow)"
      />
      
      {/* Prism Refraction Light Beam */}
      <line x1="28" y1="24" x2="46" y2="42" stroke="url(#prismSpectrum)" strokeWidth="2" strokeDasharray="2 2" />
      <circle cx="28" cy="24" r="2" fill="#FFFFFF" />
    </svg>
  );
}

// 02. Precision Laser Shield & Crosshair
function LaserShieldIcon() {
  return (
    <svg className="w-12 h-12" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shieldGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE8B5" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#8C6E25" />
        </linearGradient>
        <radialGradient id="laserRuby" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF4B4B" />
          <stop offset="60%" stopColor="#FF1E1E" />
          <stop offset="100%" stopColor="#B30000" />
        </radialGradient>
      </defs>

      {/* Shield Silhouette */}
      <path
        d="M28 8L12 14V28C12 37.5 18.8 46.2 28 48C37.2 46.2 44 37.5 44 28V14L28 8Z"
        stroke="url(#shieldGold)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        fill="#1E1612"
        fillOpacity="0.6"
      />

      {/* Inner Concentric Shield Rim */}
      <path
        d="M28 12.5L16 17V28C16 35.3 21.1 42.1 28 43.8C34.9 42.1 40 35.3 40 28V17L28 12.5Z"
        stroke="url(#shieldGold)"
        strokeWidth="1"
        strokeOpacity="0.4"
      />

      {/* Crosshair Horizontal & Vertical Laser Guideline */}
      <line x1="8" y1="28" x2="48" y2="28" stroke="url(#shieldGold)" strokeWidth="1.5" strokeOpacity="0.8" />
      <line x1="28" y1="18" x2="28" y2="38" stroke="url(#shieldGold)" strokeWidth="1.5" strokeOpacity="0.8" />

      {/* Laser Target Reticle */}
      <circle cx="28" cy="28" r="7" stroke="url(#shieldGold)" strokeWidth="1.5" strokeDasharray="3 2" />
      {/* Concentrated Ruby Laser Core */}
      <circle cx="28" cy="28" r="3" fill="url(#laserRuby)" />
      <circle cx="28" cy="28" r="1" fill="#FFFFFF" />

      {/* Leveling Cross-ticks */}
      <line x1="48" y1="26" x2="48" y2="30" stroke="url(#shieldGold)" strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="26" x2="8" y2="30" stroke="url(#shieldGold)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// 03. Insulated Flight Transport Crate + Precision Pressure/Temp Dial
function TransportCrateIcon() {
  return (
    <div className="flex items-center gap-2">
      {/* Pressure/Temp Dial */}
      <svg className="w-10 h-10 shrink-0" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gaugeBezel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#C0C0C0" />
            <stop offset="100%" stopColor="#4A4A4A" />
          </linearGradient>
          <radialGradient id="gaugeDialFace" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F9F6F0" />
            <stop offset="85%" stopColor="#ECE5D8" />
            <stop offset="100%" stopColor="#C4B8A5" />
          </radialGradient>
        </defs>
        {/* Outer Steel Bezel */}
        <circle cx="22" cy="22" r="19" stroke="url(#gaugeBezel)" strokeWidth="2.5" fill="#1A1A1A" />
        <circle cx="22" cy="22" r="16.5" fill="url(#gaugeDialFace)" />
        
        {/* Gauge Tick Marks */}
        <path d="M12 28 A 12 12 0 1 1 32 28" fill="none" stroke="#2A2A2A" strokeWidth="1" strokeDasharray="1.5 2.5" />
        <path d="M26 12 A 12 12 0 0 1 32 28" fill="none" stroke="#D9381E" strokeWidth="2" />
        
        {/* Gauge Needle */}
        <line x1="22" y1="22" x2="29" y2="15" stroke="#C02626" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="22" cy="22" r="2.5" fill="#1E1E1E" />
        <circle cx="22" cy="22" r="1" fill="#FFFFFF" />
      </svg>

      {/* Flight Container Case */}
      <svg className="w-14 h-10 shrink-0" viewBox="0 0 64 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="crateBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#68737D" />
            <stop offset="30%" stopColor="#4E5862" />
            <stop offset="70%" stopColor="#32383E" />
            <stop offset="100%" stopColor="#1E2328" />
          </linearGradient>
          <linearGradient id="crateTrim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E0E6ED" />
            <stop offset="50%" stopColor="#9AA5B1" />
            <stop offset="100%" stopColor="#616E7C" />
          </linearGradient>
          <linearGradient id="goldInsignia" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFEBB0" />
            <stop offset="100%" stopColor="#B38B38" />
          </linearGradient>
        </defs>

        {/* Crate Body */}
        <rect x="4" y="6" width="56" height="24" rx="3" fill="url(#crateBody)" stroke="url(#crateTrim)" strokeWidth="1.5" />
        
        {/* Horizontal Ridges */}
        <line x1="6" y1="12" x2="58" y2="12" stroke="#252A2F" strokeWidth="1.5" />
        <line x1="6" y1="18" x2="58" y2="18" stroke="url(#crateTrim)" strokeWidth="1" strokeOpacity="0.4" />
        <line x1="6" y1="24" x2="58" y2="24" stroke="#252A2F" strokeWidth="1.5" />

        {/* Heavy Duty Latches */}
        <rect x="14" y="4" width="6" height="28" rx="1.5" fill="url(#crateTrim)" stroke="#1A1E22" strokeWidth="0.8" />
        <rect x="44" y="4" width="6" height="28" rx="1.5" fill="url(#crateTrim)" stroke="#1A1E22" strokeWidth="0.8" />
        
        {/* Recessed Handle */}
        <rect x="2" y="14" width="3" height="8" rx="1" fill="url(#crateTrim)" />
        <rect x="59" y="14" width="3" height="8" rx="1" fill="url(#crateTrim)" />

        {/* Center Kala Vault Gold Badge Plate */}
        <rect x="26" y="13" width="12" height="10" rx="1.5" fill="#1C1814" stroke="url(#goldInsignia)" strokeWidth="1" />
        {/* Keyhole / Seal Icon in Plate */}
        <circle cx="32" cy="17" r="1.8" fill="url(#goldInsignia)" />
        <polygon points="31,17 33,17 33.5,21 30.5,21" fill="url(#goldInsignia)" />
      </svg>
    </div>
  );
}

// 04. Concierge Archival Security & Vault Key Crest
function ConciergeVaultKeyIcon() {
  return (
    <svg className="w-11 h-11" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="vaultGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2D4" />
          <stop offset="40%" stopColor="#DFBD74" />
          <stop offset="80%" stopColor="#B38838" />
          <stop offset="100%" stopColor="#7E581A" />
        </linearGradient>
      </defs>

      {/* Outer Circular Archival Medallion */}
      <circle cx="28" cy="28" r="22" stroke="url(#vaultGoldGrad)" strokeWidth="2" strokeDasharray="1 3" fill="#1C1612" fillOpacity="0.8" />
      <circle cx="28" cy="28" r="17" stroke="url(#vaultGoldGrad)" strokeWidth="1.5" strokeOpacity="0.7" />

      {/* Central Fine Art Vault Key */}
      {/* Key Bow */}
      <circle cx="28" cy="18" r="5" stroke="url(#vaultGoldGrad)" strokeWidth="2" fill="#14100E" />
      <circle cx="28" cy="18" r="2" fill="url(#vaultGoldGrad)" />
      
      {/* Key Stem */}
      <line x1="28" y1="23" x2="28" y2="40" stroke="url(#vaultGoldGrad)" strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Key Wards / Teeth */}
      <path d="M28 34H33V37H28" stroke="url(#vaultGoldGrad)" strokeWidth="2" strokeLinejoin="round" />
      <path d="M28 38H34V41H28" stroke="url(#vaultGoldGrad)" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export default function WhiteGloveProtocolSection() {
  const protocolCards = [
    {
      title: 'MUSEUM-GRADE FRAMING',
      description: 'Custom archival mounts, UV-protective museum glass, and bespoke hand-finished hardwood profiles tailored to your decor.',
      icon: <PrismFramingIcon />
    },
    {
      title: 'PRECISION LASER INSTALLATION',
      description: 'Professional laser-aligned mounting executed by certified museum art handlers with tamper-proof architectural anchors.',
      icon: <LaserShieldIcon />
    },
    {
      title: 'INSULATED MUSEUM ART TRANSPORT CONTAINER',
      description: 'Seamless, temperature-monitored, and fully insured white-glove transport of all artworks directly into your suites.',
      icon: <TransportCrateIcon />
    },
    {
      title: 'CONCIERGE PROTECTION PLAN',
      description: 'A comprehensive institutional coverage policy shielding all fine art assets against accidental damage or environmental factors.',
      icon: <ConciergeVaultKeyIcon />
    }
  ];

  return (
    <section className="px-4 sm:px-6 md:px-12 max-w-[1500px] mx-auto mb-28">
      {/* Vault Dark Container with Blueprint Underlay */}
      <div className="relative rounded-[2rem] p-6 sm:p-10 md:p-12 lg:p-14 border border-[#C5A059]/25 bg-[#14100E] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] overflow-hidden">
        
        {/* Subtle Architectural Blueprint & Vault Schematics Watermark */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-screen"
          style={{
            backgroundImage: `
              radial-gradient(circle at 85% 85%, rgba(223, 192, 125, 0.4) 0%, transparent 60%),
              linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 40px 40px, 40px 40px'
          }}
        />

        {/* Blueprint Vault Lock Silhouette in Corner */}
        <div className="absolute right-[-40px] bottom-[-40px] w-96 h-96 rounded-full border border-[#DFC07D]/10 pointer-events-none flex items-center justify-center opacity-40">
          <div className="w-64 h-64 rounded-full border border-dashed border-[#DFC07D]/15 flex items-center justify-center">
            <div className="w-36 h-36 rounded-full border border-[#DFC07D]/20" />
          </div>
        </div>

        {/* Top Header Row with Gilded Key Line & Subtitle */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 mb-8 border-b border-white/10">
          <div>
            {/* Ribbon Badge with key connector */}
            <div className="flex items-center gap-3 mb-2.5">
              <span className="text-[#DFC07D] text-xs">🏷️</span>
              <span className="font-cinzel text-[10.5px] uppercase tracking-[0.26em] text-[#DFC07D] font-bold">
                WHITE-GLOVE PROTOCOL
              </span>
              <div className="h-px w-16 sm:w-28 bg-gradient-to-r from-[#DFC07D] to-transparent" />
              <span className="text-[#DFC07D] text-sm -ml-2">🗝</span>
            </div>

            {/* Headline with metallic gilded gradient */}
            <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold tracking-tight uppercase leading-[1.12] bg-gradient-to-r from-[#FFF0D4] via-[#DFC07D] to-[#B38B38] bg-clip-text text-transparent">
              ZERO OPERATIONAL DISRUPTION
            </h2>
          </div>

          {/* Right Subtitle */}
          <p className="text-xs sm:text-[13px] text-[#FAF6F0]/75 max-w-sm md:text-right font-light leading-relaxed">
            Logistical mastery executed entirely by certified museum art handlers, archival framers, and institutional conservators.
          </p>
        </div>

        {/* Main Content Grid: Left Hero Card + Right 2x2 Modules */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Left Hero Card: Brass Keyhole Magnifier on Blueprint */}
          <div className="lg:col-span-5 bg-[#1B1613]/90 rounded-2xl p-5 md:p-6 border border-white/10 flex flex-col justify-between shadow-xl backdrop-blur-sm group hover:border-[#DFC07D]/50 transition-all duration-300">
            {/* Magnifier Blueprint Photo Container */}
            <div className="relative rounded-xl overflow-hidden aspect-[4/3.2] mb-5 border border-white/10 bg-[#0B0908]">
              <img
                src="/assets/keyhole_magnifier_art.jpg"
                alt="Antique brass keyhole magnifier over architectural blueprint plans"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Bottom Content within Left Card */}
            <div>
              <span className="font-cinzel text-[10.5px] uppercase tracking-[0.24em] text-[#DFC07D] font-bold block mb-1.5">
                MUSEUM STANDARDS
              </span>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide mb-2 group-hover:text-[#DFC07D] transition-colors">
                CERTIFIED ART HANDLERS
              </h3>
              <p className="text-xs sm:text-[13px] text-[#FAF6F0]/70 font-light leading-relaxed">
                Laser alignment, tamper-proof architectural mounts, and scheduled off-hours mounting.
              </p>
            </div>
          </div>

          {/* Right 2x2 Grid of 4 Service Modules */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {protocolCards.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-[#1B1613]/80 hover:bg-[#221C18] rounded-2xl p-5 sm:p-6 border border-white/10 hover:border-[#DFC07D]/60 transition-all duration-300 flex flex-col justify-between group shadow-lg"
              >
                <div>
                  {/* Top Bar: Custom Graphic */}
                  <div className="flex items-center mb-4 min-h-[48px]">
                    {card.icon}
                  </div>

                  {/* Card Title */}
                  <h4 className="font-cinzel text-sm sm:text-[15px] font-bold text-white tracking-wide uppercase mb-2 group-hover:text-[#DFC07D] transition-colors leading-snug">
                    {card.title}
                  </h4>

                  {/* Card Description */}
                  <p className="text-xs sm:text-[12.5px] text-[#FAF6F0]/70 leading-relaxed font-light">
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
