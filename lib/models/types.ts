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
  direction: "above" | "below";
  icon: string;
  title: string;
  body: string;
}

export interface DomainConfig {
  key: DomainKey;
  label: string;
  description: string;
  sliderConfig: SliderConfig;
  xAxis: { label: string; format: (v: number) => string };
  yAxis: { label: string; format: (v: number) => string };
  costFn: (x: number) => number;
  marginalCostFn: (x: number) => number;
  secondaryFn: (x: number) => number;
  secondaryLabel: string;
  secondaryFormat: (v: number) => string;
  thresholds: ThresholdAnnotation[];
  source: string;
  zones: { value: number; caution: number };
}

export interface DataPoint {
  x: number;
  cost: number;
  label: string;
}
