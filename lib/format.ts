import { latencyMs } from "./models/latency";
import { deploysPerDay, mttrHours } from "./models/velocity";
import { bufferMultiplier } from "./models/capacity";

/* ── Currency ─────────────────────────────────────────── */

export function fc(n: number): string {
  if (n < 0) return `-${fc(-n)}`;
  if (n < 1e3) return `$${Math.round(n)}`;
  if (n < 1e4) return `$${(n / 1e3).toFixed(1)}K`;
  if (n < 1e6) return `$${Math.round(n / 1e3)}K`;
  if (n < 1e7) return `$${(n / 1e6).toFixed(1)}M`;
  return `$${Math.round(n / 1e6)}M`;
}

export function fcFull(n: number): string {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${Math.round(n).toLocaleString("en-US")}`;
  return `$${Math.round(n)}`;
}

/* ── Uptime formatters ────────────────────────────────── */

export function fmtNines(ni: number): string {
  const r = Math.round(ni);
  if (r <= 2) return "99%";
  if (r <= 3) return "99.9%";
  if (r <= 4) return "99.99%";
  if (r <= 5) return "99.999%";
  return "99.9999%";
}

export function fmtNinesExact(ni: number): string {
  const p = (1 - Math.pow(10, -ni)) * 100;
  const d = Math.min(4, Math.max(1, Math.ceil(ni) - 1));
  return parseFloat(p.toFixed(d)) + "%";
}

export function fmtDur(m: number): string {
  if (m < 1) return `${(m * 60).toFixed(1)}s`;
  if (m < 60) return `${m.toFixed(1)} min`;
  if (m < 1440) {
    const h = Math.floor(m / 60);
    const mn = Math.round(m % 60);
    return mn > 0 ? `${h}h ${mn}m` : `${h}h`;
  }
  const d = Math.floor(m / 1440);
  const h = Math.round((m % 1440) / 60);
  return h > 0 ? `${d}d ${h}h` : `${d}d`;
}

/* ── Latency formatters ───────────────────────────────── */

export function fmtMs(ms: number): string {
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms >= 100) return `${Math.round(ms)}ms`;
  if (ms >= 10) return `${ms.toFixed(1)}ms`;
  return `${ms.toFixed(1)}ms`;
}

export function fmtLatencyTick(x: number): string {
  const ms = latencyMs(Math.round(x));
  return fmtMs(ms);
}

export function fmtLatencyExact(x: number): string {
  return fmtMs(latencyMs(x));
}

/* ── Velocity formatters ──────────────────────────────── */

export function fmtDeploys(dpd: number): string {
  if (dpd < 0.3) return "Weekly";
  if (dpd < 0.8) return `${dpd.toFixed(1)}/day`;
  if (dpd < 2) return "Daily";
  if (dpd < 10) return `${Math.round(dpd)}/day`;
  return `${Math.round(dpd)}/day`;
}

export function fmtVelocityTick(x: number): string {
  return fmtDeploys(deploysPerDay(Math.round(x)));
}

export function fmtVelocityExact(x: number): string {
  return fmtDeploys(deploysPerDay(x));
}

export function fmtCfr(pct: number): string {
  if (pct >= 10) return `${Math.round(pct)}%`;
  return `${pct.toFixed(1)}%`;
}

export function fmtMttr(hours: number): string {
  if (hours >= 48) return `${Math.round(hours / 24)}d`;
  if (hours >= 2) return `${Math.round(hours)}h`;
  if (hours >= 1) return `${hours.toFixed(1)}h`;
  const min = hours * 60;
  if (min >= 10) return `${Math.round(min)} min`;
  return `${min.toFixed(0)} min`;
}

export function fmtMttrExact(x: number): string {
  return fmtMttr(mttrHours(x));
}

/* ── Capacity formatters ──────────────────────────────── */

export function fmtBuffer(mult: number): string {
  return `${mult.toFixed(1)}×`;
}

export function fmtCapacityTick(x: number): string {
  return fmtBuffer(bufferMultiplier(Math.round(x)));
}

export function fmtCapacityExact(x: number): string {
  return fmtBuffer(bufferMultiplier(x));
}

export function fmtSlowdown(mult: number): string {
  if (mult >= 10) return `${Math.round(mult)}×`;
  return `${mult.toFixed(1)}×`;
}
