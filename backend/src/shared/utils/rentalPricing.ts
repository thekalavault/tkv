/**
 * Backend Artwork Rental Pricing Service
 * Matches frontend pricing model for consistency across the application
 */

export type ArtworkTier = 'small' | 'medium' | 'large' | 'extra-large';

export interface ArtworkRentalInfo {
  tier: ArtworkTier;
  tierLabel: string;
  replacementValue: number;
  monthlyRentCents: number; // In cents for database storage
  monthlyRent: number; // In dollars for display
  yearlyRent: number;
  halfYearlyRent: number;
  quarterlyRent: number;
}

const PRICING_TIERS: Record<ArtworkTier, Omit<ArtworkRentalInfo, 'replacementValue' | 'monthlyRentCents' | 'monthlyRent'>> = {
  small: {
    tier: 'small',
    tierLabel: 'Small Format',
    yearlyRent: 35000,
    halfYearlyRent: 26999,
    quarterlyRent: 19999,
  },
  medium: {
    tier: 'medium',
    tierLabel: 'Medium Format',
    yearlyRent: 50000,
    halfYearlyRent: 37999,
    quarterlyRent: 24999,
  },
  large: {
    tier: 'large',
    tierLabel: 'Large Format',
    yearlyRent: 70000,
    halfYearlyRent: 51999,
    quarterlyRent: 34999,
  },
  'extra-large': {
    tier: 'extra-large',
    tierLabel: 'Architectural Scale',
    yearlyRent: 90000,
    halfYearlyRent: 67999,
    quarterlyRent: 44999,
  },
};

/**
 * Classifies artwork based on replacement value
 */
export function classifyArtworkTier(replacementValue: number): ArtworkTier {
  if (replacementValue >= 76000) return 'extra-large';
  if (replacementValue >= 51000) return 'large';
  if (replacementValue >= 26000) return 'medium';
  return 'small';
}

/**
 * Gets complete rental information for an artwork
 */
export function getArtworkRentalInfo(replacementValue: number): ArtworkRentalInfo {
  const tier = classifyArtworkTier(replacementValue);
  const tierInfo = PRICING_TIERS[tier];
  const monthlyRent = tierInfo.yearlyRent / 12;

  return {
    ...tierInfo,
    replacementValue,
    monthlyRent,
    monthlyRentCents: Math.round(monthlyRent * 100), // Convert to cents for database
  };
}

/**
 * Calculates rental price for a given period
 */
export function calculateRentalPrice(
  replacementValue: number,
  period: 'monthly' | 'quarterly' | 'half-yearly' | 'yearly'
): number {
  const info = getArtworkRentalInfo(replacementValue);
  const prices: Record<string, number> = {
    monthly: info.monthlyRent,
    quarterly: info.quarterlyRent / 3,
    'half-yearly': info.halfYearlyRent / 6,
    yearly: info.yearlyRent / 12,
  };
  return prices[period] || 0;
}

/**
 * Validates replacement value is within defined range for a tier
 */
export function isValidReplacementValue(replacementValue: number, tier: ArtworkTier): boolean {
  const ranges: Record<ArtworkTier, { min: number; max: number }> = {
    small: { min: 5000, max: 25000 },
    medium: { min: 26000, max: 50000 },
    large: { min: 51000, max: 75000 },
    'extra-large': { min: 76000, max: 100000 },
  };
  const range = ranges[tier];
  return replacementValue >= range.min && replacementValue <= range.max;
}

/**
 * Gets tier configuration
 */
export function getTierConfig(tier: ArtworkTier) {
  return {
    ...PRICING_TIERS[tier],
    tier,
  };
}

/**
 * Gets all tier configurations
 */
export function getAllTierConfigs() {
  return Object.entries(PRICING_TIERS).map(([tier, config]) => ({
    ...config,
    tier: tier as ArtworkTier,
  }));
}
