import type { DomainConfig, ThresholdAnnotation } from "./types";
import { coverageEffort, coverageMarginalEffort, bugDetectionRate } from "./coverage";
import { formatPercentage } from "@/lib/format";

const thresholds: ThresholdAnnotation[] = [
  {
    trigger: 60,
    direction: "above",
    icon: "✅",
    title: "Google's \"acceptable\"",
    body: "Google considers 60% coverage the minimum acceptable level. You're testing happy paths and core functions.",
  },
  {
    trigger: 75,
    direction: "above",
    icon: "🏅",
    title: "Google's \"commendable\"",
    body: "75% is commendable. Google's internal median project is at 78%. Edge cases and error paths are covered.",
  },
  {
    trigger: 90,
    direction: "above",
    icon: "🏆",
    title: "Google's \"exemplary\"",
    body: "90% is exemplary. Beyond this, Google says gains are logarithmic. You're now testing generated code and timing issues.",
  },
  {
    trigger: 95,
    direction: "above",
    icon: "⚠️",
    title: "Extreme diminishing returns",
    body: "95–100% requires 10–50× more effort per point than the 0–60% range. You're covering dead code and exception handlers.",
  },
];

export const coverageConfig: DomainConfig = {
  key: "coverage",
  label: "Coverage",
  description: "Explore coverage diminishing returns.",
  sliderConfig: {
    min: 30,
    max: 100,
    step: 1,
    default: 75,
    format: (pct) => formatPercentage(pct, 0),
  },
  xAxis: {
    label: "Test coverage (%)",
    format: (pct) => formatPercentage(pct, 0),
  },
  yAxis: {
    label: "Cumulative effort",
    format: (v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(Math.round(v))),
  },
  costFn: coverageEffort,
  marginalCostFn: coverageMarginalEffort,
  secondaryFn: bugDetectionRate,
  secondaryLabel: "Bug detection rate",
  secondaryFormat: (r) => formatPercentage(r * 100, 1),
  thresholds,
  source:
    "Engineering effort per coverage point modeled as an exponential curve, calibrated to Google's published thresholds (60% acceptable, 75% commendable, 90% exemplary) and empirical data from Kochhar et al. (2015) and Bach et al. (2017).",
  zones: { value: 75, caution: 90 },
};
