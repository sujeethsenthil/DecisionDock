/** Latency domain: cost of achieving a target p99 response time */

// Core math — every halving of latency costs ~8× more
export const latencyMs = (x: number): number => 2000 / Math.pow(4, x - 2);
export const latencyCost = (x: number): number => 5000 * Math.pow(8, x - 2);

// Pre-computed curve (201 points, x from 2 to 6)
export const latencyCurve = Array.from({ length: 201 }, (_, i) => {
  const x = 2 + (i * 4) / 200;
  return { x: Math.round(x * 1e3) / 1e3, cost: latencyCost(x) };
});

// Perception descriptor — what the latency MEANS to users
export function latencyPerception(ms: number): string {
  if (ms >= 1500) return "Users are leaving";
  if (ms >= 800) return "Noticeably slow";
  if (ms >= 300) return "Users notice delay";
  if (ms >= 100) return "Feels responsive";
  if (ms >= 50) return "Near-instant";
  return "Below perception";
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
  { min: 2, max: 2.99, icon: "✅", t: "Standard hosting", infra: "Single-region server + basic CDN", team: "No dedicated performance staff", staffing: "Included in existing hosting budget", b: "Adequate for content sites, blogs, and internal tools." },
  { min: 3, max: 3.49, icon: "⚡", t: "CDN-optimized", infra: "Multi-region CDN + caching layer + DB indexing", team: "1–2 performance-aware engineers", staffing: "~$150K–$300K staffing", b: "Users perceive your app as fast. The baseline for SaaS." },
  { min: 3.5, max: 3.99, icon: "🎯", t: "Perception threshold", infra: "Edge CDN + tuned backend + query optimization", team: "2–3 performance engineers", staffing: "~$400K–$700K staffing", b: "Under 200ms, most users perceive instant response." },
  { min: 4, max: 4.99, icon: "🏎️", t: "Real-time grade", infra: "Edge compute + low-latency DB + connection pooling", team: "4–6 performance engineers", staffing: "~$800K–$1.5M staffing", b: "Required for search, trading, and live collaboration." },
  { min: 5, max: 6, icon: "🔬", t: "Purpose-built", infra: "Co-located hardware + custom protocols + kernel bypass", team: "8–15 specialized engineers", staffing: "~$2M–$5M staffing", b: "Sub-10ms is physics-constrained. Only HFT and gaming justify this." },
];

export function getThreshold(n: number): Threshold {
  return THRESHOLDS.find((t) => n >= t.min && n <= t.max) || THRESHOLDS[0];
}
