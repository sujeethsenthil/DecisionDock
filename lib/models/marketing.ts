const ALPHA = 1.5;
const K = 50000;
const MAX_CONV = 5000;

/** Baseline CPA at $10K/mo for effective-cost scaling (~$25) */
const BASELINE_CPA = 25;

export function marketingConversions(spend: number): number {
  return (
    (MAX_CONV * Math.pow(spend, ALPHA)) /
    (Math.pow(K, ALPHA) + Math.pow(spend, ALPHA))
  );
}

export function marketingCPA(spend: number): number {
  const conv = marketingConversions(spend);
  return conv > 0 ? spend / conv : 0;
}

export function marketingMarginalCPA(spend: number): number {
  const delta = 500;
  const deltaConv =
    marketingConversions(spend + delta) - marketingConversions(spend);
  return deltaConv > 0 ? delta / deltaConv : Infinity;
}

/**
 * Effective annual cost for chart Y-axis (steepens with saturation).
 * Y = 12 * spend * (1 + marginalCPA / baselineCPA) so curve rises faster at high spend.
 */
export function marketingEffectiveAnnualCost(spend: number): number {
  const annualSpend = 12 * spend;
  const marginal = marketingMarginalCPA(spend);
  const ratio = Math.min(marginal / BASELINE_CPA, 20);
  return annualSpend * (1 + (ratio - 1) * 0.15);
}
