// ─── Mixpanel analytics wrapper ───────────────────────────────
// All tracking calls go through this file — never call mixpanel directly
// from components. This keeps the event taxonomy in one place and makes
// it easy to add properties, rename events, or swap providers later.

import mixpanel from "mixpanel-browser";

const TOKEN = "e6fc3c47ceea39b4ee1beff2f7099d93";

let initialised = false;

function init() {
  if (initialised || typeof window === "undefined") return;
  mixpanel.init(TOKEN, {
    track_pageview: false,   // we track manually for more control
    persistence: "localStorage",
    ignore_dnt: false,
    batch_requests: true,
  });
  initialised = true;
}

// ─── Event types ──────────────────────────────────────────────

export type DomainName = "uptime" | "latency" | "velocity" | "capacity";

interface DomainViewedProps {
  domain: DomainName;
}

interface ChartClickedProps {
  domain: DomainName;
  current_x: number;
  level_label: string;
}

interface SliderDraggedProps {
  domain: DomainName;
  target_x: number;
  level_label: string;
  annual_cost: number;
}

interface PortfolioVisitedProps {
  budget: number;
  desired_spend: number;
  is_overshoot: boolean;
}

interface BudgetEnteredProps {
  budget: number;
  desired_spend: number;
  free_pool: number;
}

interface AllocationZeroedProps {
  budget: number;
  uptime_pct: number;
  latency_pct: number;
  velocity_pct: number;
  capacity_pct: number;
}

interface SliderPulsedProps {
  domain: DomainName;
  free_pool: number;
}

// ─── Track calls ──────────────────────────────────────────────

export const Analytics = {

  domainViewed(props: DomainViewedProps) {
    init();
    mixpanel.track("Domain Viewed", props);
  },

  chartClicked(props: ChartClickedProps) {
    init();
    mixpanel.track("Chart Clicked", props);
  },

  sliderDragged(props: SliderDraggedProps) {
    init();
    mixpanel.track("Slider Dragged", props);
  },

  portfolioVisited(props: PortfolioVisitedProps) {
    init();
    mixpanel.track("Portfolio Visited", props);
  },

  budgetEntered(props: BudgetEnteredProps) {
    init();
    mixpanel.track("Budget Entered", props);
  },

  allocationZeroed(props: AllocationZeroedProps) {
    init();
    mixpanel.track("Allocation Zeroed", props);
  },

  sliderPulsed(props: SliderPulsedProps) {
    init();
    mixpanel.track("Surplus Slider Pulsed", props);
  },
};
