/** Velocity domain: cost of achieving higher deployment frequency */

// Core math — each 5× increase in deploy frequency costs ~6× more
export const deploysPerDay = (x: number): number => 0.2 * Math.pow(5, x - 2);
export const changeFailRate = (x: number): number => 45 * Math.pow(0.45, x - 2);
export const velocityCost = (x: number): number => 8000 * Math.pow(6, x - 2);

// Pre-computed curve (201 points, x from 2 to 6)
export const velocityCurve = Array.from({ length: 201 }, (_, i) => {
  const x = 2 + (i * 4) / 200;
  return { x: Math.round(x * 1e3) / 1e3, cost: velocityCost(x) };
});

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
  { min: 2, max: 2.99, icon: "✅", t: "Batch releases", infra: "Manual CI + weekly deploy window", team: "No dedicated platform team", staffing: "Included in existing DevOps budget", b: "Common for early-stage startups and small teams." },
  { min: 3, max: 3.49, icon: "⚡", t: "Daily shipping", infra: "Automated CI/CD + basic test suite + staging env", team: "1–2 DevOps engineers", staffing: "~$150K–$350K staffing", b: "The minimum for modern SaaS. Most teams should be here." },
  { min: 3.5, max: 3.99, icon: "🔄", t: "Continuous delivery", infra: "Full CI/CD + automated rollback + feature flags", team: "2–4 platform engineers", staffing: "~$400K–$900K staffing", b: "Feature flags and canary deploys become essential here." },
  { min: 4, max: 4.99, icon: "🚀", t: "Elite velocity", infra: "Trunk-based dev + progressive rollout + full automation", team: "4–8 platform engineers", staffing: "~$1M–$2.5M staffing", b: "DORA elite tier. The investment is in automation, not headcount." },
  { min: 5, max: 6, icon: "⚙️", t: "Per-commit shipping", infra: "Fully automated pipeline + dedicated platform team", team: "8–15 platform engineers", staffing: "~$3M–$8M staffing", b: "Only Google, Stripe, and Netflix-scale orgs sustain this." },
];

export function getThreshold(n: number): Threshold {
  return THRESHOLDS.find((t) => n >= t.min && n <= t.max) || THRESHOLDS[0];
}

/**
 * Mean Time To Recovery (hours) by velocity level.
 * DORA data: low performers recover in days–weeks, elite in under 1 hour.
 * Modeled as exponential decay: 168hrs (1 week) at level 2 → ~0.2hrs (12 min) at level 6.
 * Sources: Forsgren, Humble, Kim — Accelerate (2018); DORA State of DevOps 2023.
 * Elite teams recover 2,604× faster than low performers.
 */
export const mttrHours = (x: number): number => 168 * Math.pow(0.18, x - 2);
