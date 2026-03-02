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
  t: string;
  infra: string;
  team: string;
  staffing: string;
  b: string;
}

export const THRESHOLDS: Threshold[] = [
  { min: 2, max: 2.99, icon: "✅", t: "Standard tier", infra: "Single-AZ cloud instance + basic monitoring", team: "No dedicated reliability staff", staffing: "Included in existing DevOps budget", b: "Sufficient for internal tools and low-traffic services." },
  { min: 3, max: 3.49, icon: "⚡", t: "10× cost threshold", infra: "Load balancer + multi-AZ deployment", team: "1–2 DevOps engineers (partial allocation)", staffing: "~$150K–$400K staffing", b: "Each additional nine from here multiplies total cost by ~10×." },
  { min: 3.5, max: 3.99, icon: "👥", t: "Dedicated SRE team", infra: "Full observability stack + automated failover", team: "4–8 dedicated SREs", staffing: "~$944K–$1.9M staffing (×$236K avg)", b: "Google's minimum on-call is 8 SREs across two time zones." },
  { min: 4, max: 4.99, icon: "🌍", t: "Multi-region required", infra: "Multi-region active-active + canary deploys", team: "8–12 SREs + incident management", staffing: "~$1.9M–$2.8M staffing", b: "Duplicating full stack across 2+ regions. ~Doubles cloud bill." },
  { min: 5, max: 6, icon: "🚨", t: "Google-scale", infra: "Fault-tolerant hardware + formal verification", team: "20–50 SREs + 24/7 NOC", staffing: "~$4.7M–$11.8M staffing", b: ">90% of dev time on testing. Only Google-critical services justify this." },
];

export function getThreshold(n: number): Threshold {
  return THRESHOLDS.find((t) => n >= t.min && n <= t.max) || THRESHOLDS[0];
}
