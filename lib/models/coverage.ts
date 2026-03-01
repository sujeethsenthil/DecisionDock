const K = 0.06;

/**
 * Cumulative engineering effort to reach coverage pct (arbitrary units).
 * Effort per point = exp(k * pct).
 */
export function coverageEffort(pct: number): number {
  if (pct <= 0) return 0;
  let total = 0;
  for (let i = 1; i <= pct; i++) {
    total += Math.exp(K * i);
  }
  return total;
}

export function coverageMarginalEffort(pct: number): number {
  return Math.exp(0.06 * pct);
}

export function bugDetectionRate(pct: number): number {
  return Math.min(0.98, 0.4 * Math.log(pct / 10 + 1));
}
