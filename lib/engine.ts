import type { DataPoint, DomainConfig } from "./models/types";

/**
 * Generate curve data for the full domain range. Memoize per config;
 * slider movement does not regenerate curve.
 */
export function generateCurveData(
  config: DomainConfig,
  numPoints: number = 200
): DataPoint[] {
  const { min, max } = config.sliderConfig;
  const step = (max - min) / numPoints;
  return Array.from({ length: numPoints + 1 }, (_, i) => {
    const x = min + i * step;
    return {
      x,
      cost: config.costFn(x),
      label: config.sliderConfig.format(x),
    };
  });
}
