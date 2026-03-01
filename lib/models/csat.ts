import type { DomainConfig } from "./types";
import { formatCurrency, formatPercentage } from "../format";

export const csatCost = (pct: number): number =>
  50000 * Math.exp(0.08 * (pct - 50));

export const csatPerPoint = (pct: number): number =>
  csatCost(pct + 1) - csatCost(pct);

export const csatRetention = (pct: number): number =>
  100 * (1 - Math.exp(-0.05 * (pct - 40)));

export const csatConfig: DomainConfig = {
  key: "csat",
  label: "CSAT",
  desc: "Customer satisfaction cost curve",
  slider: {
    min: 50, max: 99, step: 0.5, default: 77,
    format: (v) => `${v.toFixed(1)}%`,
  },
  xLabel: "CSAT Score",
  yLabel: "Annual Support Cost",
  xFmt: (v) => `${v}%`,
  yFmt: formatCurrency,
  costFn: csatCost,
  displayFn: csatCost,
  marginalFn: csatPerPoint,
  secondaryFn: csatRetention,
  secondaryLabel: "Retention Impact",
  secondaryFmt: formatPercentage,
  chartTitle: "Annual Support Cost vs. CSAT Score",
  source: "Sources: ACSI national average (76.9), Bain & Company retention research",
  zones: { value: 77, caution: 90 },
  thresholds: [
    {
      trigger: 77, dir: "above", icon: "🏠",
      title: "National average (76.9)",
      body: "The US ACSI average. Basic improvements like response time and staffing are high-ROI here.",
    },
    {
      trigger: 85, dir: "above", icon: "💰",
      title: "Cost acceleration begins",
      body: "Above 85%, each point costs 3–5× more. Requires personalization and omnichannel support.",
    },
    {
      trigger: 90, dir: "above", icon: "🚀",
      title: "Premium territory",
      body: "90%+ needs dedicated account management and near-instant response. 10–25× cost per point.",
    },
    {
      trigger: 95, dir: "above", icon: "💎",
      title: "Luxury experience",
      body: "Custom solutions per customer. 25–100× per point. Only justifiable for high-LTV accounts.",
    },
  ],
};
