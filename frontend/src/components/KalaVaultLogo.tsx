import React, { useState, useEffect } from 'react';

interface LogoProps {
  /**
   * Type of logo variant to display:
   * - 'submark': Just the elegant symbol (arch, stairs, and glow)
   * - 'alternate': Symbol on the left, "THE KALA VAULT" text on the right (horizontal)
   * - 'stacked': Symbol on top, "THE KALA VAULT" text below (vertical)
   */
  variant?: 'submark' | 'alternate' | 'stacked';
  /**
   * High-level aesthetic theme:
   * - 'gold': Gold outline with white/cream accents (perfect for scrolled navbar or light backgrounds)
   * - 'white': White outline with gold accents (perfect for dark transparent navbar or dark backgrounds)
   * - 'dark': Dark/gold theme (perfect for default footer)
   */
  theme?: 'gold' | 'white' | 'dark';
  /**
   * Height/width scaling class (e.g. 'h-8', 'h-12', 'h-24')
   */
  className?: string;
  /**
   * Additional style overrides
   */
  style?: React.CSSProperties;
}

export default function KalaVaultLogo({
  variant = 'submark',
  theme = 'gold',
  className = '',
  style,
}: LogoProps) {
  const isWhiteTheme = theme === 'white';
  const isDarkTheme = theme === 'dark';

  // Typography coloring - Always gold
  const textTitleColor = 'text-gallery-gold';

  // Render the processed transparent image masked in an arch shape, with no borders or shadows
  const renderSymbol = (size = 80) => {
    const height = size * 1.8;
    return (
      <div 
        className="inline-block relative overflow-hidden shrink-0"
        style={{
          width: `${size}px`,
          height: `${height}px`,
          borderRadius: `${size / 2}px ${size / 2}px 0px 0px`, // Perfect arch masking to crop out background
          // Removed all border and shadow lines
        }}
      >
        <img
          src="/assets/kalavault_logo_symbol.png"
          alt="Kala Vault Premium Arch"
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-[2.8]" 
          style={{
            transform: 'scale(2.58)', // High zoom factor to crop out the outer beige arch/wall completely
            transformOrigin: 'center 46%', // Shift slightly upwards to align the inner dark arch perfectly
            filter: isWhiteTheme ? 'brightness(1.05) contrast(1.02)' : 'none',
          }}
        />
      </div>
    );
  };

  if (variant === 'submark') {
    return (
      <div className={`flex items-center justify-center ${className}`} style={style}>
        {renderSymbol(48)}
      </div>
    );
  }

  if (variant === 'alternate') {
    return (
      <div className={`flex items-center gap-4.5 ${className}`} style={style}>
        {renderSymbol(36)}
        <div className="flex flex-col text-left justify-center">
          <span className={`font-display-lg text-[18px] md:text-[22px] font-semibold tracking-[0.24em] uppercase ${textTitleColor} leading-none`}>
            THE KALA VAULT
          </span>
        </div>
      </div>
    );
  }

  // Stacked Logo layout
  return (
    <div className={`flex flex-col items-center lg:items-start text-center lg:text-left gap-5 ${className}`} style={style}>
      {renderSymbol(56)}
      <div className="flex flex-col items-center lg:items-start">
        <span className={`font-display-lg text-[24px] md:text-[28px] font-medium tracking-[0.24em] uppercase ${textTitleColor} leading-none`}>
          KALA VAULT
        </span>
      </div>
    </div>
  );
}
