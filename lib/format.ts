export function formatCurrency(n: number): string {
  if (n < 0) return `-${formatCurrency(-n)}`;
  if (n < 1000) return `$${Math.round(n)}`;
  if (n < 10000) return `$${(n / 1000).toFixed(1)}K`;
  if (n < 1000000) return `$${Math.round(n / 1000)}K`;
  if (n < 10000000) return `$${(n / 1000000).toFixed(1)}M`;
  return `$${Math.round(n / 1000000)}M`;
}

export function formatCurrencyFull(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${Math.round(n).toLocaleString("en-US")}`;
  return `$${Math.round(n)}`;
}

export function formatCurrencyShort(n: number): string {
  if (n < 1000) return `$${n}`;
  if (n < 1000000) return `$${Math.round(n / 1000)}K`;
  return `$${(n / 1000000).toFixed(1)}M`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 1) return `${(minutes * 60).toFixed(1)}s`;
  if (minutes < 60) return `${minutes.toFixed(1)} min`;
  if (minutes < 1440) {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  const days = Math.floor(minutes / 1440);
  const hours = Math.round((minutes % 1440) / 60);
  return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
}

export function formatNines(nines: number): string {
  const pct = (1 - Math.pow(10, -nines)) * 100;
  const decimals = Math.max(1, Math.ceil(nines) - 1);
  return `${pct.toFixed(decimals)}%`;
}

export function formatPercentage(n: number): string {
  if (n < 1) return `${(n * 100).toFixed(1)}%`;
  return `${n.toFixed(1)}%`;
}
