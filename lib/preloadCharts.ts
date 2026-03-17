// Preload chart chunks so they are in cache when the user clicks a tab.
// Next.js does not prefetch next/dynamic chunks with router.prefetch(route).
// Static paths required for bundler code-splitting.

export function preloadUptimeChart(): void {
  import("@/components/uptime/CostCurveChart");
}

export function preloadLatencyChart(): void {
  import("@/components/latency/CostCurveChart");
}

export function preloadVelocityChart(): void {
  import("@/components/velocity/CostCurveChart");
}

export function preloadCapacityChart(): void {
  import("@/components/capacity/CostCurveChart");
}

const ROUTE_PRELOAD: Record<string, () => void> = {
  "/uptime":   preloadUptimeChart,
  "/latency":  preloadLatencyChart,
  "/velocity": preloadVelocityChart,
  "/capacity": preloadCapacityChart,
};

/** Preload the chart for the given route (e.g. "/latency"). No-op for Portfolio. */
export function preloadChartForRoute(route: string): void {
  const fn = ROUTE_PRELOAD[route];
  if (fn) fn();
}
