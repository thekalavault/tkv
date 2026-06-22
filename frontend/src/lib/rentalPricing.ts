/**
 * Artwork Rental Pricing Model
 * Calculates monthly rent based on artwork replacement value
 * and classifies artworks into tiers
 */

export type ArtworkTier = 'small' | 'medium' | 'large' | 'extra-large';

export interface PricingTier {
  tier: ArtworkTier;
  label: string;
  valueRange: { min: number; max: number };
  yearlyRent: number;
  halfYearlyRent: number;
  quarterlyRent: number;
  monthlyRent: number;
  description: string;
}

export interface ClassifiedArtwork {
  id: number | string;
  title: string;
  artist: string;
  replacementValue: number;
  tier: ArtworkTier;
  pricing: PricingTier;
  monthlyRent: number;
  [key: string]: any;
}

/**
 * Pricing tiers based on artwork replacement value
 */
export const PRICING_TIERS: Record<ArtworkTier, PricingTier> = {
  small: {
    tier: 'small',
    label: 'Small Format',
    valueRange: { min: 5000, max: 25000 },
    yearlyRent: 35000,
    halfYearlyRent: 26999,
    quarterlyRent: 19999,
    monthlyRent: 2917, // 35000 / 12
    description: 'Compact artworks for personal spaces, home offices, intimate settings',
  },
  medium: {
    tier: 'medium',
    label: 'Medium Format',
    valueRange: { min: 26000, max: 50000 },
    yearlyRent: 50000,
    halfYearlyRent: 37999,
    quarterlyRent: 24999,
    monthlyRent: 4167, // 50000 / 12
    description: 'Standard gallery-sized pieces for living rooms, executive offices, meeting rooms',
  },
  large: {
    tier: 'large',
    label: 'Large Format',
    valueRange: { min: 51000, max: 75000 },
    yearlyRent: 70000,
    halfYearlyRent: 51999,
    quarterlyRent: 34999,
    monthlyRent: 5833, // 70000 / 12
    description: 'Statement pieces for conference rooms, corporate atriums, gallery spaces',
  },
  'extra-large': {
    tier: 'extra-large',
    label: 'Architectural Scale',
    valueRange: { min: 76000, max: 100000 },
    yearlyRent: 90000,
    halfYearlyRent: 67999,
    quarterlyRent: 44999,
    monthlyRent: 7500, // 90000 / 12
    description: 'Large-format installations for headquarters, landmark spaces, multi-floor coordination',
  },
};

/**
 * Classifies an artwork into a tier based on replacement value
 * @param replacementValue The replacement/insurance value of the artwork in dollars
 * @returns The appropriate pricing tier
 */
export function classifyArtworkTier(replacementValue: number): ArtworkTier {
  if (replacementValue >= 76000 && replacementValue <= 100000) return 'extra-large';
  if (replacementValue >= 51000 && replacementValue < 76000) return 'large';
  if (replacementValue >= 26000 && replacementValue < 51000) return 'medium';
  if (replacementValue >= 5000 && replacementValue < 26000) return 'small';
  
  // Default to small if below minimum
  return 'small';
}

/**
 * Gets pricing tier info by tier name
 */
export function getPricingTier(tier: ArtworkTier): PricingTier {
  return PRICING_TIERS[tier];
}

/**
 * Calculates monthly rent for an artwork
 * @param replacementValue The artwork's replacement value
 * @returns Monthly rent amount
 */
export function calculateMonthlyRent(replacementValue: number): number {
  const tier = classifyArtworkTier(replacementValue);
  return PRICING_TIERS[tier].monthlyRent;
}

/**
 * Calculates rent for a custom period
 * @param replacementValue The artwork's replacement value
 * @param months Number of months to calculate for
 * @returns Rent amount for the specified period
 */
export function calculateRentForPeriod(replacementValue: number, months: number): number {
  const monthlyRent = calculateMonthlyRent(replacementValue);
  return monthlyRent * months;
}

/**
 * Classifies and prices an entire artwork with all calculations
 */
export function classifyArtwork(
  artwork: any,
  replacementValue?: number
): ClassifiedArtwork {
  // Use provided value or extract from artwork
  const value = replacementValue ?? artwork.replacementValue ?? artwork.value ?? 25000;
  const tier = classifyArtworkTier(value);
  const pricing = PRICING_TIERS[tier];

  return {
    ...artwork,
    replacementValue: value,
    tier,
    pricing,
    monthlyRent: pricing.monthlyRent,
  };
}

/**
 * Classifies multiple artworks and adds pricing info
 */
export function classifyArtworks(
  artworks: any[],
  replacementValueMap?: Record<string | number, number>
): ClassifiedArtwork[] {
  return artworks.map(artwork => {
    const replacementValue = replacementValueMap?.[artwork.id] ?? artwork.replacementValue;
    return classifyArtwork(artwork, replacementValue);
  });
}

export function formatPrice(value: number): string {
  return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

/**
 * Format rental price for display
 */
export function formatRentalPrice(amount: number, period: 'monthly' | 'yearly' = 'monthly'): string {
  const suffix = period === 'monthly' ? '/mo' : '/yr';
  return `₹${Math.round(amount).toLocaleString('en-IN')} ${suffix}`;
}
