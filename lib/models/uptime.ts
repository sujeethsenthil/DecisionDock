export const uptimeCost = (n: number): number => 5000 * Math.pow(10, n - 2);
export const uptimeDown = (n: number): number => Math.pow(10, -n) * 525960;

export const uptimeCurve = Array.from({ length: 201 }, (_, i) => {
  const x = 2 + (i * 4) / 200;
  return { x: Math.round(x * 1e3) / 1e3, cost: uptimeCost(x) };
});

export interface Threshold {
  min: number;
  max: number;
  icon: string;
  title: string;
  what: string;
  body: string;
}

export const THRESHOLDS: Threshold[] = [
  {
    min: 2, max: 2.99, icon: "✅", title: "Standard tier",
    what: "Basic cloud instance + monitoring",
    body: "Single-AZ deployment with basic monitoring. No dedicated reliability staff needed.",
  },
  {
    min: 3, max: 3.49, icon: "⚡", title: "10× cost threshold",
    what: "Load balancer + multi-AZ + 1–2 DevOps engineers",
    body: "Each additional nine from here multiplies total cost by roughly 10×.",
  },
  {
    min: 3.5, max: 3.99, icon: "👥", title: "Dedicated SRE team",
    what: "Full observability stack + dedicated SRE team (4–8 engineers)",
    body: "Google's minimum sustainable on-call team is 8 SREs across two time zones.",
  },
  {
    min: 4, max: 4.99, icon: "🌍", title: "Multi-region required",
    what: "Multi-region active-active infra + 8–12 SREs + canary deploys",
    body: "Requires duplicating your full stack across 2+ regions. Roughly doubles your cloud bill.",
  },
  {
    min: 5, max: 6, icon: "🚨", title: "Google-scale investment",
    what: "Fault-tolerant hardware + 20–50 SREs + 24/7 NOC",
    body: "Formal verification, >90% of dev time on testing. Only Google-critical services justify this.",
  },
];

export function getThreshold(n: number): Threshold {
  return THRESHOLDS.find((t) => n >= t.min && n <= t.max) || THRESHOLDS[0];
}
