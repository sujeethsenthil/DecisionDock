/** Total cost of ownership (infra + staffing + overhead) at 2 nines = $5K/yr */
const BASE_COST = 5000;

/** Minutes per year */
const MINUTES_PER_YEAR = 525960;

/**
 * Annual cost at n nines. Cost(n) = BASE_COST * 10^(n - 2).
 * Anchor points: 2→$5K, 3→$50K, 4→$500K, 5→$5M, 6→$50M.
 */
export function uptimeCost(nines: number): number {
  return BASE_COST * Math.pow(10, nines - 2);
}

/**
 * Downtime in minutes per year at n nines.
 * availability = 1 - 10^(-nines); downtime = (1 - availability) * MINUTES_PER_YEAR.
 */
export function uptimeDowntimeMinutes(nines: number): number {
  const availability = 1 - Math.pow(10, -nines);
  return (1 - availability) * MINUTES_PER_YEAR;
}

/** Marginal cost per 0.1 nines at given nines (annual $). */
export function uptimeMarginalCost(nines: number): number {
  const delta = 0.1;
  return (uptimeCost(nines + delta) - uptimeCost(nines)) / delta;
}
