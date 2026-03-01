import type { DomainConfig, ThresholdAnnotation } from "./types";
import { uptimeCost, uptimeDowntimeMinutes, uptimeMarginalCost } from "./uptime";
import { formatPercentage } from "@/lib/format";
import { UPTIME_ZONES } from "@/lib/constants";

function ninesToPercent(nines: number): string {
  const pct = (1 - Math.pow(10, -nines)) * 100;
  return formatPercentage(pct, 2);
}

const thresholds: ThresholdAnnotation[] = [
  {
    trigger: 3.0,
    direction: "above",
    icon: "⚡",
    title: "The 10× threshold",
    body: "Each additional nine roughly multiplies your total cost by 10×. Going from 3 to 4 nines takes you from ~$50K to ~$500K/year.",
  },
  {
    trigger: 3.5,
    direction: "above",
    icon: "👥",
    title: "Dedicated SRE team",
    body: "Beyond ~99.95%, you need a dedicated SRE team (4–8 engineers). Google's minimum on-call team is 8 SREs across two time zones.",
  },
  {
    trigger: 4.0,
    direction: "above",
    icon: "🌍",
    title: "Multi-region required",
    body: "99.99% demands multi-region infrastructure with active-active or hot standby. This roughly doubles your entire cloud bill.",
  },
  {
    trigger: 5.0,
    direction: "above",
    icon: "🚨",
    title: "Google-scale investment",
    body: "99.999% requires 12–20+ SREs, formal verification, and >90% of dev time on testing. Google targets this for only their most critical services.",
  },
];

export const uptimeConfig: DomainConfig = {
  key: "uptime",
  label: "Uptime",
  description: "Explore uptime diminishing returns.",
  sliderConfig: {
    min: 2,
    max: 6,
    step: 0.1,
    default: 3,
    format: (nines) => ninesToPercent(nines),
  },
  xAxis: {
    label: "Availability (nines)",
    format: (nines) => ninesToPercent(nines),
  },
  yAxis: {
    label: "Annual cost ($)",
    format: (v) => (v >= 1_000_000 ? `$${v / 1_000_000}M` : `$${v / 1_000}K`),
  },
  costFn: uptimeCost,
  marginalCostFn: uptimeMarginalCost,
  secondaryFn: uptimeDowntimeMinutes,
  secondaryLabel: "Downtime per year",
  secondaryFormat: (mins) =>
    mins >= 60 ? `${(mins / 60).toFixed(1)}h` : `${Math.round(mins)}m`,
  thresholds,
  source:
    "Total cost of ownership (infrastructure + staffing + operational overhead) modeled as an exponential curve: each additional nine of availability multiplies cost by ~10×. Calibrated to Google SRE Book, AWS Multi-AZ pricing, and industry SRE compensation benchmarks.",
  zones: { value: UPTIME_ZONES.value, caution: UPTIME_ZONES.caution },
};
