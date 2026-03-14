import { uptimeCost } from "./uptime";
import { latencyCost } from "./latency";
import { velocityCost } from "./velocity";
import { capacityCost } from "./capacity";

// ─── Domain config ────────────────────────────────────────────
export type DomainKey = "uptime" | "latency" | "velocity" | "capacity";

export interface DomainConfig {
  key: DomainKey;
  label: string;
  color: string;
  xMin: number;
  xMax: number;
  xFloor: number;
  cost: (x: number) => number;
  levelLabel: (x: number) => string;
  axisMin: string;
  axisMax: string;
}

export const DOMAIN_CONFIGS: Record<DomainKey, DomainConfig> = {
  uptime: {
    key: "uptime",
    label: "Uptime",
    color: "#3B82F6",
    xMin: 2, xMax: 6, xFloor: 2.2,
    cost: uptimeCost,
    levelLabel: (x) => {
      if (x < 2.5) return "99%";
      if (x < 3.5) return "99.9%";
      if (x < 4.5) return "99.99%";
      if (x < 5.5) return "99.999%";
      return "99.9999%";
    },
    axisMin: "99% · $5K/yr",
    axisMax: "99.9999% · $50M/yr",
  },
  latency: {
    key: "latency",
    label: "Latency",
    color: "#10B981",
    xMin: 2, xMax: 6, xFloor: 2.2,
    cost: latencyCost,
    levelLabel: (x) => {
      if (x < 2.5) return ">2s";
      if (x < 3.5) return "~500ms";
      if (x < 4.5) return "~125ms";
      if (x < 5.5) return "~30ms";
      return "<10ms";
    },
    axisMin: ">2s · $5K/yr",
    axisMax: "<10ms · $40M/yr",
  },
  velocity: {
    key: "velocity",
    label: "Velocity",
    color: "#F59E0B",
    xMin: 2, xMax: 6, xFloor: 2.2,
    cost: velocityCost,
    levelLabel: (x) => {
      if (x < 2.5) return "Weekly";
      if (x < 3.5) return "Daily";
      if (x < 4.5) return "10×/day";
      if (x < 5.5) return "50×/day";
      return "Elite";
    },
    axisMin: "Weekly · $8K/yr",
    axisMax: "Elite · $26M/yr",
  },
  capacity: {
    key: "capacity",
    label: "Capacity",
    color: "#EF4444",
    xMin: 2, xMax: 6, xFloor: 2.2,
    cost: capacityCost,
    levelLabel: (x) => {
      if (x < 2.5) return "Minimal";
      if (x < 3.5) return "Standard";
      if (x < 4.5) return "N+1";
      if (x < 5.5) return "N+2";
      return "Full redundancy";
    },
    axisMin: "Minimal · $15K/yr",
    axisMax: "Full redundancy · $375M/yr",
  },
};

export const DOMAIN_ORDER: DomainKey[] = ["uptime", "latency", "velocity", "capacity"];

// ─── Inflection points ────────────────────────────────────────
export const INFLECTION_X: Record<DomainKey, number> = {
  uptime:   3.5,
  latency:  3.8,
  velocity: 3.5,
  capacity: 3.6,
};

// ─── ROI zone classification ──────────────────────────────────
export type ROIZone = "steep" | "approaching" | "flat";

export function getRoiZone(key: DomainKey, x: number): ROIZone {
  const inflX = INFLECTION_X[key];
  if (x > inflX + 0.4) return "flat";
  if (x > inflX - 0.3) return "approaching";
  return "steep";
}

export function getRoiLabel(zone: ROIZone): string {
  if (zone === "steep") return "steep · invest";
  if (zone === "approaching") return "near inflection";
  return "flat zone · trim here";
}

// ─── Industry persona benchmarks ─────────────────────────────
export type Industry = "saas" | "ecomm" | "fintech" | "health";
export type Scale = "startup" | "mid" | "enterprise";

export interface Persona {
  uptime: number;
  latency: number;
  velocity: number;
  capacity: number;
}

const PERSONA_CURRENT: Record<Industry, Record<Scale, Persona>> = {
  saas: {
    startup:    { uptime: 2.8, latency: 2.9, velocity: 3.0, capacity: 2.8 },
    mid:        { uptime: 3.2, latency: 3.3, velocity: 3.4, capacity: 3.1 },
    enterprise: { uptime: 3.8, latency: 3.7, velocity: 3.6, capacity: 3.5 },
  },
  ecomm: {
    startup:    { uptime: 2.7, latency: 3.1, velocity: 2.7, capacity: 2.9 },
    mid:        { uptime: 3.3, latency: 3.6, velocity: 3.1, capacity: 3.3 },
    enterprise: { uptime: 3.9, latency: 4.1, velocity: 3.5, capacity: 3.8 },
  },
  fintech: {
    startup:    { uptime: 3.2, latency: 3.0, velocity: 2.9, capacity: 3.0 },
    mid:        { uptime: 3.8, latency: 3.5, velocity: 3.3, capacity: 3.5 },
    enterprise: { uptime: 4.5, latency: 4.2, velocity: 3.8, capacity: 4.0 },
  },
  health: {
    startup:    { uptime: 3.0, latency: 2.8, velocity: 2.7, capacity: 2.9 },
    mid:        { uptime: 3.5, latency: 3.2, velocity: 3.0, capacity: 3.3 },
    enterprise: { uptime: 4.2, latency: 3.8, velocity: 3.4, capacity: 3.8 },
  },
};

const PERSONA_DESIRED: Record<Industry, Record<Scale, Persona>> = {
  saas: {
    startup:    { uptime: 3.5, latency: 3.6, velocity: 3.7, capacity: 3.5 },
    mid:        { uptime: 4.2, latency: 4.0, velocity: 4.2, capacity: 3.9 },
    enterprise: { uptime: 5.0, latency: 4.8, velocity: 4.6, capacity: 4.5 },
  },
  ecomm: {
    startup:    { uptime: 3.4, latency: 3.8, velocity: 3.4, capacity: 3.6 },
    mid:        { uptime: 4.2, latency: 4.4, velocity: 3.9, capacity: 4.1 },
    enterprise: { uptime: 5.0, latency: 5.2, velocity: 4.4, capacity: 4.8 },
  },
  fintech: {
    startup:    { uptime: 3.9, latency: 3.7, velocity: 3.6, capacity: 3.8 },
    mid:        { uptime: 4.6, latency: 4.4, velocity: 4.1, capacity: 4.4 },
    enterprise: { uptime: 5.5, latency: 5.2, velocity: 4.7, capacity: 5.0 },
  },
  health: {
    startup:    { uptime: 3.8, latency: 3.5, velocity: 3.4, capacity: 3.6 },
    mid:        { uptime: 4.4, latency: 4.0, velocity: 3.8, capacity: 4.1 },
    enterprise: { uptime: 5.2, latency: 4.8, velocity: 4.3, capacity: 4.7 },
  },
};

export function getPersonaCurrent(industry: Industry, scale: Scale): Persona {
  return PERSONA_CURRENT[industry][scale];
}

export function getPersonaDesired(industry: Industry, scale: Scale): Persona {
  return PERSONA_DESIRED[industry][scale];
}

// ─── Budget math ──────────────────────────────────────────────
export interface AllocationState {
  budget: number;
  currentX: Persona;
  targetX: Persona;
}

export function currentTotalCost(state: AllocationState): number {
  return DOMAIN_ORDER.reduce((sum, k) => sum + DOMAIN_CONFIGS[k].cost(state.currentX[k]), 0);
}

export function targetTotalCost(state: AllocationState): number {
  return DOMAIN_ORDER.reduce((sum, k) => sum + DOMAIN_CONFIGS[k].cost(state.targetX[k]), 0);
}

export function freePool(state: AllocationState): number {
  return state.budget - targetTotalCost(state);
}

// Max x a domain slider can reach given current free pool
export function maxReachableX(key: DomainKey, state: AllocationState): number {
  const pool = freePool(state);
  if (pool <= 0) return state.targetX[key];
  const cfg = DOMAIN_CONFIGS[key];
  const currentCost = cfg.cost(state.targetX[key]);
  const maxCost = currentCost + pool;
  let lo = state.targetX[key], hi = cfg.xMax;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (cfg.cost(mid) < maxCost) lo = mid; else hi = mid;
  }
  return Math.min(cfg.xMax, (lo + hi) / 2);
}

// ─── Curve data for mini charts ───────────────────────────────
export function miniCurve(key: DomainKey): { x: number; cost: number }[] {
  const cfg = DOMAIN_CONFIGS[key];
  return Array.from({ length: 60 }, (_, i) => {
    const x = cfg.xMin + (i / 59) * (cfg.xMax - cfg.xMin);
    return { x, cost: cfg.cost(x) };
  });
}
