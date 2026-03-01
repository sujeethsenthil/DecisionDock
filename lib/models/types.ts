export type DomainKey = "uptime" | "marketing" | "coverage" | "csat";

export interface SliderConfig {
  min: number;
  max: number;
  step: number;
  default: number;
  format: (v: number) => string;
}

export interface ThresholdAnnotation {
  trigger: number;
  dir: "above" | "below";
  icon: string;
  title: string;
  body: string;
}

export interface DomainConfig {
  key: DomainKey;
  label: string;
  desc: string;
  slider: SliderConfig;
  xLabel: string;
  yLabel: string;
  xFmt: (v: number) => string;
  yFmt: (v: number) => string;
  costFn: (x: number) => number;
  displayFn: (x: number) => number;
  marginalFn: (x: number) => number;
  secondaryFn: (x: number) => number;
  secondaryLabel: string;
  secondaryFmt: (v: number) => string;
  chartTitle: string;
  source: string;
  zones: { value: number; caution: number };
  ticks?: number[];
  logScale?: boolean;
  thresholds: ThresholdAnnotation[];
}

export interface DataPoint {
  x: number;
  cost: number;
}
