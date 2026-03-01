import type { DomainConfig } from "./types";
import { formatCurrency, formatNines, formatDuration } from "../format";

const BASE_COST = 5000;

export const uptimeCost = (n: number): number => BASE_COST * Math.pow(10, n - 2);
export const uptimeDowntime = (n: number): number => Math.pow(10, -n) * 525960;
export const uptimeMarginal = (n: number): number =>
  (uptimeCost(n + 0.1) - uptimeCost(n)) / 0.1;

// Anchor validation (total cost of ownership):
// uptimeCost(2) =   $5,000    (single AZ, basic monitoring)
// uptimeCost(3) =  $50,000    (multi-AZ, 1-2 DevOps)
// uptimeCost(4) = $500,000    (SRE team 4-8)
// uptimeCost(5) = $5,000,000  (multi-region, 12-20 SREs)
// uptimeCost(6) = $50,000,000 (fault-tolerant, 20-50+ SREs)

export const uptimeConfig: DomainConfig = {
  key: "uptime",
  label: "Uptime",
  desc: "Reliability diminishing returns",
  slider: { min: 2, max: 6, step: 0.1, default: 3, format: formatNines },
  xLabel: "Availability Target",
  yLabel: "Annual Cost (TCO)",
  xFmt: formatNines,
  yFmt: formatCurrency,
  costFn: uptimeCost,
  displayFn: uptimeCost,
  marginalFn: uptimeMarginal,
  secondaryFn: uptimeDowntime,
  secondaryLabel: "Annual Downtime",
  secondaryFmt: formatDuration,
  chartTitle: "Annual Cost of Uptime Targets",
  source: "Sources: Google SRE Book, AWS pricing, SRE compensation benchmarks",
  zones: { value: 3, caution: 4 },
  ticks: [2, 3, 4, 5, 6],
  thresholds: [
    {
      trigger: 3, dir: "above", icon: "⚡",
      title: "The 10× threshold",
      body: "Each additional nine multiplies total cost by ~10×. Going from 3→4 nines: $50K → $500K/year.",
    },
    {
      trigger: 3.5, dir: "above", icon: "👥",
      title: "Dedicated SRE team required",
      body: "Beyond 99.95%, you need 4–8 dedicated SREs. Google's minimum on-call team is 8 engineers across two time zones.",
    },
    {
      trigger: 4, dir: "above", icon: "🌍",
      title: "Multi-region infrastructure",
      body: "99.99% demands multi-region active-active deployment. This roughly doubles your entire cloud bill.",
    },
    {
      trigger: 5, dir: "above", icon: "🚨",
      title: "Google-scale investment",
      body: "99.999% requires 12–20+ SREs, formal verification, and >90% of dev time spent on testing.",
    },
  ],
};
