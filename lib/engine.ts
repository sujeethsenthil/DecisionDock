import type { DomainConfig, DataPoint } from "./models/types";

export function generateCurveData(
  config: DomainConfig,
  numPoints: number = 200
): DataPoint[] {
  const { min, max } = config.slider;
  const step = (max - min) / numPoints;

  return Array.from({ length: numPoints + 1 }, (_, i) => {
    const x = min + i * step;
    return {
      x: Math.round(x * 1000) / 1000,
      cost: config.displayFn(x),
    };
  });
}

// Log-scale helpers for marketing slider
export function toLogScale(value: number, min: number, max: number): number {
  if (value <= min) return 0;
  return (100 * Math.log(value / min)) / Math.log(max / min);
}

export function fromLogScale(position: number, min: number, max: number): number {
  if (position <= 0) return min;
  return min * Math.pow(max / min, position / 100);
}
