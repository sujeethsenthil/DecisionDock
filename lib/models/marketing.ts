import type { DomainConfig } from "./types";
import { formatCurrency, formatCurrencyShort } from "../format";

const ALPHA = 1.5;
const K = 50000;
const MAX_CONV = 5000;

export const mktConversions = (s: number): number =>
  MAX_CONV * Math.pow(s, ALPHA) / (Math.pow(K, ALPHA) + Math.pow(s, ALPHA));

export const mktCPA = (s: number): number => {
  const c = mktConversions(s);
  return c > 0 ? s / c : 0;
};

export const mktMarginalCPA = (s: number): number => {
  const delta = 500;
  const dc = mktConversions(s + delta) - mktConversions(s);
  return dc > 0 ? delta / dc : Infinity;
};

export const marketingConfig: DomainConfig = {
  key: "marketing",
  label: "Marketing",
  desc: "Ad spend saturation curve",
  framing: "Your average CPA hides the real story. Your last dollar costs 5–8× more than your first.",
  slider: {
    min: 5000, max: 500000, step: 5000, default: 25000,
    format: (v) => formatCurrencyShort(v) + "/mo",
  },
  xLabel: "Monthly Ad Spend",
  yLabel: "Cost per Acquisition",
  xFmt: formatCurrencyShort,
  yFmt: formatCurrency,
  costFn: (s) => s * 12,
  displayFn: mktCPA,
  marginalFn: mktMarginalCPA,
  secondaryFn: mktCPA,
  secondaryLabel: "Average CPA",
  secondaryFmt: formatCurrency,
  decisionSummaryFn: (slider) => {
    const avgCPA = mktCPA(slider);
    const margCPA = mktMarginalCPA(slider);
    const ratio = margCPA > 0 && avgCPA > 0 ? (margCPA / avgCPA) : 0;
    if (ratio <= 1.5) {
      return `At ${formatCurrencyShort(slider)}/mo, your marginal CPA (${formatCurrency(margCPA)}) is close to your average (${formatCurrency(avgCPA)}). You have room to scale.`;
    }
    return `At ${formatCurrencyShort(slider)}/mo, your marginal CPA (${formatCurrency(margCPA)}) is ${ratio.toFixed(1)}× your average (${formatCurrency(avgCPA)}). Every dollar above this point costs ${ratio.toFixed(1)}× more than your average suggests.`;
  },
  chartTitle: "Cost per Acquisition vs. Ad Spend",
  source: "Sources: WordStream CPA benchmarks, Meta Robyn, Saxifrage Blog",
  zones: { value: 25000, caution: 100000 },
  logScale: true,
  thresholds: [
    {
      trigger: 25000, dir: "above", icon: "📉",
      title: "Marginal CPA rising",
      body: "Average CPA is ~$30, but each additional $1K now costs $38+ per conversion.",
    },
    {
      trigger: 100000, dir: "above", icon: "⚠️",
      title: "Deep saturation",
      body: "Marginal CPA has doubled. You're paying $85+ for each additional conversion.",
    },
    {
      trigger: 250000, dir: "above", icon: "🛑",
      title: "ROAS below breakeven",
      body: "Marginal ROAS approaches 1.0× or below. Each new dollar may cost more than it generates.",
    },
  ],
};
