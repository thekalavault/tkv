import React from 'react';

interface LogoProps {
  /**
   * Type of logo variant to display:
   * - 'submark': The refined TKV monogram seal
   * - 'alternate': TKV monogram on the left, "THE KALA VAULT" text on the right (horizontal)
   * - 'stacked': TKV emblem on top, "THE KALA VAULT" text below (vertical)
   * - 'framed': Museum-grade framed artwork sign exactly matching the authentic brand piece
   */
  variant?: 'submark' | 'alternate' | 'stacked' | 'framed';
  /**
   * Aesthetic color theme:
   * - 'gold': Gold outline with wine/bordeaux & cream accents
   * - 'white': White/light gold accents for dark backgrounds
   * - 'bordeaux': Deep imperial bordeaux theme
   * - 'dark': Dark espresso/gold theme
   */
  theme?: 'gold' | 'white' | 'bordeaux' | 'dark';
  /**
   * Optional custom symbol size in pixels (controls width/height scale)
   */
  symbolSize?: number;
  /**
   * Height/width scaling class
   */
  className?: string;
  /**
   * Additional style overrides
   */
  style?: React.CSSProperties;
  /**
   * Optional show subtitle
   */
  showSubtitle?: boolean;
}

/**
 * High-fidelity Vector TKV Monogram Emblem
 * Handcrafted to embody the imperial bordeaux & gold-leaf beveled sign of The Kala Vault
 */
export const TkvMonogramSvg: React.FC<{
  size?: number;
  theme?: 'gold' | 'white' | 'bordeaux' | 'dark';
  withFrame?: boolean;
  withCorners?: boolean;
}> = ({ size = 44, theme = 'gold', withFrame = false, withCorners = false }) => {
  const isDark = theme === 'white' || theme === 'dark';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-500 hover:scale-105"
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Rich Imperial Bordeaux Velvet Gradient */}
        <linearGradient id="tkvBordeauxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7A1C2C" />
          <stop offset="35%" stopColor="#58111A" />
          <stop offset="70%" stopColor="#4A0E17" />
          <stop offset="100%" stopColor="#30070D" />
        </linearGradient>

        {/* Polished Gold Leaf Gradient for Bevels & Highlights */}
        <linearGradient id="tkvGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5E4B8" />
          <stop offset="30%" stopColor="#DFC07D" />
          <stop offset="70%" stopColor="#C5A059" />
          <stop offset="100%" stopColor="#967228" />
        </linearGradient>

        {/* Subtle Drop Shadow for Gilded 3D Dimension */}
        <filter id="tkv3dShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="1.5" stdDeviation="1" floodColor="#180507" floodOpacity="0.45" />
          <feDropShadow dx="-0.5" dy="-0.5" stdDeviation="0.5" floodColor="#FFE9B3" floodOpacity="0.3" />
        </filter>

        {/* Frame Outer Shadow */}
        <filter id="tkvFrameGlow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#2A140F" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* Optional Parchment Backplate & Ornate Border Frame */}
      {withFrame && (
        <g filter="url(#tkvFrameGlow)">
          {/* Outer Walnut / Gold Border */}
          <rect
            x="3"
            y="3"
            width="114"
            height="114"
            rx="4"
            fill={isDark ? "#1C1210" : "#FAF6F0"}
            stroke="url(#tkvGoldGrad)"
            strokeWidth="1.2"
          />
          {/* Inner Fine Gold Hairline */}
          <rect
            x="8"
            y="8"
            width="104"
            height="104"
            rx="2"
            fill="none"
            stroke="url(#tkvGoldGrad)"
            strokeWidth="0.6"
            strokeOpacity="0.6"
          />
        </g>
      )}

      {/* Four Corner Vintage Filigree Accents (when requested or withFrame) */}
      {(withCorners || withFrame) && (
        <g stroke="url(#tkvGoldGrad)" strokeWidth="0.8" fill="none" opacity="0.85">
          {/* Top-Left Corner */}
          <path d="M 12 20 L 12 14 Q 12 12 14 12 L 20 12" />
          <circle cx="12" cy="12" r="1.2" fill="url(#tkvGoldGrad)" />
          <path d="M 15 15 L 17 15 M 15 15 L 15 17" strokeWidth="0.5" />

          {/* Top-Right Corner */}
          <path d="M 108 20 L 108 14 Q 108 12 106 12 L 100 12" />
          <circle cx="108" cy="12" r="1.2" fill="url(#tkvGoldGrad)" />
          <path d="M 105 15 L 103 15 M 105 15 L 105 17" strokeWidth="0.5" />

          {/* Bottom-Left Corner */}
          <path d="M 12 100 L 12 106 Q 12 108 14 108 L 20 108" />
          <circle cx="12" cy="108" r="1.2" fill="url(#tkvGoldGrad)" />
          <path d="M 15 105 L 17 105 M 15 105 L 15 103" strokeWidth="0.5" />

          {/* Bottom-Right Corner */}
          <path d="M 108 100 L 108 106 Q 108 108 106 108 L 100 108" />
          <circle cx="108" cy="108" r="1.2" fill="url(#tkvGoldGrad)" />
          <path d="M 105 105 L 103 105 M 105 105 L 105 103" strokeWidth="0.5" />

          {/* Top Divider with 4-point Star */}
          <line x1="28" y1="18" x2="52" y2="18" strokeWidth="0.6" strokeOpacity="0.7" />
          <path d="M 60 14 Q 60 18 64 18 Q 60 18 60 22 Q 60 18 56 18 Q 60 18 60 14 Z" fill="url(#tkvGoldGrad)" stroke="none" />
          <line x1="68" y1="18" x2="92" y2="18" strokeWidth="0.6" strokeOpacity="0.7" />

          {/* Bottom Divider with 4-point Star */}
          <line x1="28" y1="102" x2="52" y2="102" strokeWidth="0.6" strokeOpacity="0.7" />
          <path d="M 60 98 Q 60 102 64 102 Q 60 102 60 106 Q 60 102 56 102 Q 60 102 60 98 Z" fill="url(#tkvGoldGrad)" stroke="none" />
          <line x1="68" y1="102" x2="92" y2="102" strokeWidth="0.6" strokeOpacity="0.7" />
        </g>
      )}

      {/* Main Monogram Group: T - K - V */}
      <g filter="url(#tkv3dShadow)">
        {/* Letter 'T' */}
        {/* Top Serif Bar */}
        <path
          d="M 16 32 C 16 30 18 29.5 21 29.5 L 43 29.5 C 46 29.5 48 30 48 32 L 48 35.5 C 48 36.5 46.5 36.5 45.5 35.5 C 44 34 42.5 33.5 38 33.5 L 34.5 33.5 L 34.5 77 C 34.5 81.5 36 83 39 84 C 40 84.5 39.5 86.5 38 86.5 L 23 86.5 C 21.5 86.5 21 84.5 22 84 C 25 83 26.5 81.5 26.5 77 L 26.5 33.5 L 23 33.5 C 18.5 33.5 17 34 15.5 35.5 C 14.5 36.5 13 36.5 13 35.5 Z"
          fill="url(#tkvBordeauxGrad)"
          stroke="url(#tkvGoldGrad)"
          strokeWidth="0.7"
        />

        {/* Letter 'K' & Interlocking Flow */}
        {/* Vertical stem of K */}
        <path
          d="M 44 33 C 44 31 45.5 30 48.5 30 L 53 30 C 54.5 30 55 31.5 54 32.5 C 52 34 51.5 36 51.5 40 L 51.5 76 C 51.5 80 52 82 54 83.5 C 55 84.5 54.5 86 53 86 L 44 86 C 42.5 86 42 84.5 43 83.5 C 45 82 45.5 80 45.5 76 L 45.5 40 C 45.5 36 45 34 43 32.5 C 42 31.5 42.5 30 44 30 Z"
          fill="url(#tkvBordeauxGrad)"
          stroke="url(#tkvGoldGrad)"
          strokeWidth="0.7"
        />

        {/* Upper diagonal arm of K merging towards V */}
        <path
          d="M 49 56 L 65.5 34.5 C 67.5 32 66.5 30 63.5 30 L 69.5 30 C 72 30 73.5 31 74 33 L 74.5 35 C 74.5 36 73 36.5 71.5 36 L 56.5 55.5 L 53 60 Z"
          fill="url(#tkvBordeauxGrad)"
          stroke="url(#tkvGoldGrad)"
          strokeWidth="0.7"
        />

        {/* Lower sweeping calligraphic tail of K swooping under V */}
        <path
          d="M 50.5 51 C 54 55 60 63 68 73 C 74.5 81 81.5 87 93 89 C 95.5 89.5 96.5 91 94.5 91.8 C 87 94.5 76 92.5 66.5 83.5 C 59.5 77 54 68 49 61 Z"
          fill="url(#tkvBordeauxGrad)"
          stroke="url(#tkvGoldGrad)"
          strokeWidth="0.7"
        />

        {/* Letter 'V' */}
        {/* Left diagonal stroke of V */}
        <path
          d="M 68 31 C 68 29.5 69.5 29 72 29 L 77.5 29 C 79 29 79.5 30.5 78.5 31.5 C 76.5 33 75 35.5 73.5 39.5 L 80 62 L 86 39.5 C 84.5 35.5 83 33 81 31.5 C 80 30.5 80.5 29 82 29 L 98 29 C 100 29 101 30.5 99.5 32 L 96.5 35 C 95 36 93.5 38 90.5 45.5 L 81.5 76 C 80 81 78.5 83 76 83 C 73.5 83 72 81 70.5 76 L 64 55 Z"
          fill="url(#tkvBordeauxGrad)"
          stroke="url(#tkvGoldGrad)"
          strokeWidth="0.7"
        />
      </g>
    </svg>
  );
};

export default function KalaVaultLogo({
  variant = 'alternate',
  theme = 'gold',
  symbolSize,
  className = '',
  style,
  showSubtitle = false,
}: LogoProps) {
  const isDarkTheme = theme === 'dark' || theme === 'white';

  // Submark: Monogram Seal with authentic brand image
  if (variant === 'submark') {
    const size = symbolSize || 42;
    return (
      <div className={`inline-flex items-center justify-center ${className}`} style={style}>
        <img 
          src="/assets/logo.jpeg" 
          alt="The Kala Vault" 
          style={{ width: size, height: size }}
          className="rounded-lg object-cover border border-[#C5A059]/40 shadow-xs"
        />
      </div>
    );
  }

  // Framed: Museum Artwork Sign with Parchment and Walnut/Gold Framing
  if (variant === 'framed') {
    const size = symbolSize || 100;
    return (
      <div className={`inline-flex flex-col items-center justify-center ${className}`} style={style}>
        <div className="relative p-1 rounded-xl shadow-[0_12px_36px_rgba(30,18,14,0.35)]">
          <img 
            src="/assets/logo.jpeg" 
            alt="The Kala Vault" 
            style={{ width: size, height: size }}
            className="rounded-lg object-cover border border-[#C5A059]/50 shadow-md"
          />
        </div>
        {showSubtitle && (
          <div className="mt-3 text-center">
            <span className="font-cinzel text-xs uppercase tracking-[0.25em] font-bold text-[#C5A059] block">
              THE KALA VAULT
            </span>
            <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-[#1E1412]/70 font-semibold">
              MUSEUM ARCHIVAL CURATION
            </span>
          </div>
        )}
      </div>
    );
  }

  // Alternate: Horizontal layout with Logo + Wordmark
  if (variant === 'alternate') {
    const isCompact = symbolSize && symbolSize <= 28;
    const size = symbolSize || 36;

    return (
      <div className={`inline-flex items-center ${isCompact ? 'gap-2.5' : 'gap-3.5'} ${className}`} style={style}>
        <div className="relative shrink-0 flex items-center justify-center">
          <img 
            src="/assets/logo.jpeg" 
            alt="The Kala Vault" 
            style={{ width: size, height: size }}
            className="rounded-md object-cover border border-[#C5A059]/40 shadow-2xs"
          />
        </div>
        <div className="flex flex-col text-left justify-center select-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-brand ${
                isCompact
                  ? 'text-[15px] md:text-[16.5px] tracking-[0.16em]'
                  : 'text-[17.5px] md:text-[20px] tracking-[0.18em]'
              } font-bold uppercase transition-colors duration-300 leading-none ${
                isDarkTheme ? 'text-[#FAF6F0]' : 'text-[#1E1412]'
              }`}
            >
              THE KALA VAULT
            </span>
          </div>
          {showSubtitle && (
            <span className="font-cinzel text-[8.5px] uppercase tracking-[0.24em] text-[#C5A059] font-bold mt-1">
              FINE ART VAULT &amp; ROTATIONAL SALON
            </span>
          )}
        </div>
      </div>
    );
  }

  // Stacked: Vertical Layout
  const size = symbolSize || 56;
  return (
    <div className={`flex flex-col items-center text-center gap-3 select-none ${className}`} style={style}>
      <div className="relative flex items-center justify-center p-2 rounded-2xl bg-[#FAF6F0]/80 border border-[#C5A059]/30 shadow-xs">
        <TkvMonogramSvg size={size} theme={theme} withCorners={true} />
      </div>
      <div className="flex flex-col items-center">
        <span
          className={`font-brand text-[20px] md:text-[24px] font-bold tracking-[0.18em] uppercase leading-tight ${
            isDarkTheme ? 'text-[#FAF6F0]' : 'text-[#1E1412]'
          }`}
        >
          THE KALA VAULT
        </span>
        <span className="font-cinzel text-[10px] tracking-[0.24em] uppercase text-[#C5A059] font-bold mt-1">
          FINE ART VAULT &amp; ROTATIONAL SALON
        </span>
      </div>
    </div>
  );
}
