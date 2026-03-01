import type { DomainConfig, ThresholdAnnotation } from "./types";
import { csatAnnualCost, csatCostPerPoint } from "./csat";
import { formatCurrency } from "@/lib/format";
import { formatPercentage } from "@/lib/format";

const thresholds: ThresholdAnnotation[] = [
  {
    trigger: 76.9,
    direction: "above",
    icon: "🏠",
    title: "National average",
    body: "The US ACSI average is 76.9/100. You're at baseline. Basic improvements (response time, staffing) are high-ROI.",
  },
  {
    trigger: 85,
    direction: "above",
    icon: "💰",
    title: "Cost acceleration begins",
    body: "Above 85%, each point costs 3–5× more. You need personalization, proactive outreach, and omnichannel support.",
  },
  {
    trigger: 90,
    direction: "above",
    icon: "🚀",
    title: "Premium territory",
    body: "90%+ requires dedicated account management and near-instant response. Cost per point is 10–25× baseline.",
  },
  {
    trigger: 95,
    direction: "above",
    icon: "💎",
    title: "Luxury experience",
    body: "Above 95% demands custom solutions per customer. Cost per point is 25–100×. Only justifiable for high-LTV accounts.",
  },
];

export const csatConfig: DomainConfig = {
  key: "csat",
  label: "CSAT",
  description: "Explore CSAT diminishing returns.",
  sliderConfig: {
    min: 50,
    max: 99,
    step: 1,
    default: 76.9,
    format: (pct) => formatPercentage(pct, 1),
  },
  xAxis: {
    label: "CSAT (%)",
    format: (pct) => formatPercentage(pct, 1),
  },
  yAxis: {
    label: "Annual cost ($)",
    format: (v) => (v >= 1_000_000 ? `$${v / 1_000_000}M` : `$${v / 1_000}K`),
  },
  costFn: csatAnnualCost,
  marginalCostFn: csatCostPerPoint,
  secondaryFn: csatCostPerPoint,
  secondaryLabel: "Cost per point",
  secondaryFormat: (v) => formatCurrency(v),
  thresholds,
  source:
    "Support cost per satisfaction point modeled as an exponential curve. Benchmarked to ACSI national average (76.9), Bain & Company retention-profit research, and industry support cost data ($18–$35/ticket).",
  zones: { value: 85, caution: 90 },
};
