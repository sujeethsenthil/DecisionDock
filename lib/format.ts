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
