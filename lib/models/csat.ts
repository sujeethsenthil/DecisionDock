const BASE_SUPPORT_COST = 50000;
const K = 0.08;

export function csatAnnualCost(pct: number): number {
  return BASE_SUPPORT_COST * Math.exp(K * (pct - 50));
}

export function csatCostPerPoint(pct: number): number {
  return csatAnnualCost(pct + 1) - csatAnnualCost(pct);
}

export function retentionImpact(pct: number): number {
  return 100 * (1 - Math.exp(-0.05 * (pct - 40)));
}
