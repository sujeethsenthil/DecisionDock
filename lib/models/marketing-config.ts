import type { DomainConfig, ThresholdAnnotation } from "./types";
import {
  marketingEffectiveAnnualCost,
  marketingCPA,
  marketingMarginalCPA,
  marketingConversions,
} from "./marketing";
import { formatCurrency } from "@/lib/format";

const MIN_SPEND = 5000;
const MAX_SPEND = 500000;
const DEFAULT_SPEND = 25000;

function formatSpend(v: number): string {
  if (v >= 1000) return `$${v / 1000}K`;
  return `$${v}`;
}

const thresholds: ThresholdAnnotation[] = [
  {
    trigger: 25000,
    direction: "above",
    icon: "📉",
    title: "Marginal CPA rising",
    body: "Your average CPA is ~$30, but each additional $1K of spend now costs $38+ per conversion. Average ROAS masks marginal waste.",
  },
  {
    trigger: 100000,
    direction: "above",
    icon: "⚠️",
    title: "Deep saturation",
    body: "Marginal CPA has doubled. You're paying $85+ for each additional conversion. Consider reallocating to underinvested channels.",
  },
  {
    trigger: 250000,
    direction: "above",
    icon: "🛑",
    title: "ROAS below breakeven",
    body: "At this spend level, marginal ROAS approaches 1.0× or below. Each new dollar may cost more than the revenue it generates.",
  },
];

/** Zone boundaries: value below 25K, caution 25–100K, overspend 100K+ */
export const marketingConfig: DomainConfig = {
  key: "marketing",
  label: "Marketing",
  description: "Explore marketing diminishing returns.",
  sliderConfig: {
    min: MIN_SPEND,
    max: MAX_SPEND,
    step: 1000,
    default: DEFAULT_SPEND,
    format: formatSpend,
  },
  xAxis: {
    label: "Monthly ad spend ($)",
    format: formatSpend,
  },
  yAxis: {
    label: "Effective annual cost ($)",
    format: (v) => (v >= 1_000_000 ? `$${v / 1_000_000}M` : `$${Math.round(v / 1_000)}K`),
  },
  costFn: marketingEffectiveAnnualCost,
  displayCostFn: (spend) => 12 * spend,
  marginalCostFn: (spend) => marketingMarginalCPA(spend),
  secondaryFn: marketingCPA,
  secondaryLabel: "Average CPA",
  secondaryFormat: (cpa) => formatCurrency(cpa),
  thresholds,
  source:
    "Ad spend saturation modeled using a Hill function (α=1.5, K=$50K), the standard model used by Meta's Robyn and Google's Meridian MMM platforms. CPA benchmarks from WordStream (2024) and Saxifrage Blog empirical data.",
  zones: { value: 25000, caution: 100000 },
};
