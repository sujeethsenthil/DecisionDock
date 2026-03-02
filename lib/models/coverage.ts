import type { DomainConfig } from "./types";
import { formatPercentage } from "../format";

export const coverageEffort = (pct: number): number => {
  if (pct <= 0) return 0;
  let total = 0;
  for (let i = 1; i <= pct; i++) total += Math.exp(0.06 * i);
  return total;
};

export const coverageMarginal = (pct: number): number => Math.exp(0.06 * pct);

export const coverageBugRate = (pct: number): number =>
  Math.min(0.98, 0.4 * Math.log(pct / 10 + 1));

export const coverageConfig: DomainConfig = {
  key: "coverage",
  label: "Coverage",
  desc: "Test coverage effort curve",
  framing: "The last 10% of coverage costs more than the first 60%. Most of it covers code that rarely breaks.",
  slider: { min: 30, max: 100, step: 1, default: 75, format: (v) => `${v}%` },
  xLabel: "Test Coverage",
  yLabel: "Cumulative Effort (eng-months)",
  xFmt: (v) => `${v}%`,
  yFmt: (v) => `${Math.round(v)}mo`,
  costFn: coverageEffort,
  displayFn: coverageEffort,
  marginalFn: coverageMarginal,
  secondaryFn: coverageBugRate,
  secondaryLabel: "Bug Detection Rate",
  secondaryFmt: formatPercentage,
  decisionSummaryFn: (slider) => {
    const effortAt75 = coverageEffort(75);
    const effortAtSlider = coverageEffort(slider);
    const marginal = coverageMarginal(slider);
    const marginalAt30 = coverageMarginal(30);
    const multiplier = marginal / marginalAt30;

    if (slider <= 75) {
      return `At ${slider}% coverage, you're in Google's "commendable" range. Each additional point costs ${multiplier.toFixed(1)}× the effort of early coverage — still a good investment.`;
    }
    const additionalEffort = effortAtSlider - effortAt75;
    return `Going from 75% to ${slider}% costs ${Math.round(additionalEffort)} additional engineering-months. Each point now requires ${multiplier.toFixed(0)}× the effort of your first 30%. Is the bug detection gain worth it?`;
  },
  chartTitle: "Engineering Effort vs. Test Coverage",
  source: "Sources: Google Testing Blog, Kochhar et al. 2015, Bach et al. 2017",
  zones: { value: 60, caution: 90 },
  thresholds: [
    {
      trigger: 60, dir: "above", icon: "✅",
      title: 'Google\'s "acceptable"',
      body: "60% covers happy paths and core functions. Google considers this the minimum acceptable level.",
    },
    {
      trigger: 75, dir: "above", icon: "🏅",
      title: 'Google\'s "commendable"',
      body: "75% is commendable. Google's internal median is 78%. Edge cases and error paths are now covered.",
    },
    {
      trigger: 90, dir: "above", icon: "🏆",
      title: 'Google\'s "exemplary"',
      body: "Beyond 90%, gains are logarithmic. You're testing generated code and timing-dependent behavior.",
    },
    {
      trigger: 95, dir: "above", icon: "⚠️",
      title: "Extreme diminishing returns",
      body: "95–100% requires 10–50× more effort per point. You're covering dead code and exception handlers.",
    },
  ],
};
