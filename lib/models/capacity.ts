/** Capacity domain: cost of maintaining headroom buffer above peak */

// Core math — from queuing theory M/M/1: R = S/(1−ρ)
export const bufferMultiplier = (x: number): number => 1 + 0.2 * Math.pow(2, x - 2);
export const peakSlowdown = (x: number): number => {
  const b = bufferMultiplier(x);
  return b / (b - 1); // M/M/1 at utilization = 1/buffer
};
export const capacityCost = (x: number): number => 15000 * Math.pow(5, x - 2);

// Pre-computed curve (201 points, x from 2 to 6)
export const capacityCurve = Array.from({ length: 201 }, (_, i) => {
  const x = 2 + (i * 4) / 200;
  return { x: Math.round(x * 1e3) / 1e3, cost: capacityCost(x) };
});

// What buffer level MEANS for operations
export function bufferRisk(mult: number): string {
  if (mult < 1.3) return "One spike away from outage";
  if (mult < 1.6) return "Tight under peak load";
  if (mult < 2.2) return "Handles typical surges";
  if (mult < 3.5) return "Survives instance failures";
  return "Full redundancy at peak";
}

export interface Threshold {
  min: number;
  max: number;
  icon: string;
  t: string;
  infra: string;
  team: string;
  staffing: string;
  b: string;
}

export const THRESHOLDS: Threshold[] = [
  { min: 2, max: 2.99, icon: "⚠️", t: "Minimal buffer", infra: "Reactive auto-scaling + basic monitoring", team: "No dedicated capacity team", staffing: "Included in existing cloud budget", b: "Acceptable only if traffic is predictable and low-stakes." },
  { min: 3, max: 3.49, icon: "📊", t: "Standard provisioning", infra: "Auto-scaling groups + load testing + alerting", team: "1–2 DevOps engineers", staffing: "~$150K–$350K staffing", b: "Handles normal traffic spikes. Most SaaS teams operate here." },
  { min: 3.5, max: 3.99, icon: "🛡️", t: "N+1 provisioning", infra: "Pre-provisioned capacity + chaos testing + CDN", team: "2–4 capacity/SRE engineers", staffing: "~$400K–$900K staffing", b: "Survives one instance failure at peak without degradation." },
  { min: 4, max: 4.99, icon: "🏗️", t: "N+2 provisioning", infra: "Multi-AZ pre-provisioned + chaos engineering + runbooks", team: "4–8 SRE/capacity engineers", staffing: "~$1M–$2.5M staffing", b: "Google's standard. Simultaneous planned + unplanned outage." },
  { min: 5, max: 6, icon: "🔒", t: "Full redundancy", infra: "Multi-region warm standby + dedicated capacity reserves", team: "8–15 SRE + capacity planners", staffing: "~$3M–$8M staffing", b: "27% of cloud spend is wasted (Flexera). Verify you need this." },
];

export function getThreshold(n: number): Threshold {
  return THRESHOLDS.find((t) => n >= t.min && n <= t.max) || THRESHOLDS[0];
}

/**
 * Estimated peak degradation incidents per year based on peak slowdown factor.
 * Derived from M/M/1 queuing behavior: P(queue > k) = ρ^(k+1).
 * Higher utilization (lower buffer) → exponentially more time in degraded state
 * → more customer-visible incidents during traffic spikes.
 * Calibrated to industry norms: Gartner reports avg 12 significant incidents/yr
 * for under-provisioned services; Google SRE targets <4/yr for well-provisioned.
 */
export function incidentsPerYear(slowdownFactor: number): number {
  if (slowdownFactor > 5)   return 24;    // Minimal buffer: ~2/month, any spike hurts
  if (slowdownFactor > 3)   return 12;    // Tight: ~monthly degradation events
  if (slowdownFactor > 2)   return 5;     // Standard: quarterly-ish
  if (slowdownFactor > 1.5) return 2;     // Well-provisioned: semi-annual
  if (slowdownFactor > 1.2) return 0.5;   // Strong buffer: rare
  return 0.1;                              // Full redundancy: near-zero
}

/**
 * Breakeven cost per incident: how expensive must each degradation event be
 * for this capacity investment to pay for itself?
 * Formula: annualCost / incidentsAvoided
 */
export function breakEvenIncidentCost(annualCost: number, baselineSlowdown: number, targetSlowdown: number): number {
  const baseIncidents = incidentsPerYear(baselineSlowdown);
  const targetIncidents = incidentsPerYear(targetSlowdown);
  const avoided = baseIncidents - targetIncidents;
  if (avoided <= 0) return Infinity;
  return annualCost / avoided;
}
