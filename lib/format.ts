/**
 * Format number as currency: $, commas, K/M suffix. No decimals.
 */
export function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return `$${m % 1 === 0 ? m : m.toFixed(1)}M`;
  }
  if (value >= 1_000) {
    const k = value / 1_000;
    return `$${k % 1 === 0 ? k : k.toFixed(1)}K`;
  }
  return `$${Math.round(value).toLocaleString()}`;
}

/**
 * Format as percentage, e.g. "99.9%".
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format duration in minutes as "Xh Ym" or "Xm".
 */
export function formatDurationMinutes(minutes: number): string {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${Math.round(minutes)}m`;
}
