// ─── PostHog analytics wrapper ────────────────────────────────
// All tracking calls go through this file — never call posthog directly
// from components. Keeps the event taxonomy in one place and makes it
// easy to add properties, rename events, or swap providers later.

import posthog from "posthog-js";

const KEY  = "phc_Xi1JHuizXtiXHNJYU0p9c0WqbaCUrTr1HiGHn0vrC8Y";
const HOST = "https://us.i.posthog.com";

let initialised = false;

function init() {
  if (initialised || typeof window === "undefined") return;
  posthog.init(KEY, {
    api_host: HOST,
    person_profiles: "identified_only",
    capture_pageview: false,   // we track manually for full control
    capture_pageleave: true,   // free bounce rate signal
    autocapture: false,        // manual only — keeps data clean
  });
  initialised = true;
}

// ─── Event types ──────────────────────────────────────────────

export type DomainName = "uptime" | "latency" | "velocity" | "capacity";

// ─── Track calls ──────────────────────────────────────────────

export const Analytics = {

  domainViewed(domain: DomainName) {
    init();
    posthog.capture("domain_viewed", { domain });
  },

  chartClicked(domain: DomainName, currentX: number, levelLabel: string) {
    init();
    posthog.capture("chart_clicked", { domain, current_x: currentX, level_label: levelLabel });
  },

  sliderDragged(domain: DomainName, targetX: number, levelLabel: string, annualCost: number) {
    init();
    posthog.capture("slider_dragged", { domain, target_x: targetX, level_label: levelLabel, annual_cost: annualCost });
  },

  portfolioVisited(budget: number, desiredSpend: number, isOvershoot: boolean) {
    init();
    posthog.capture("portfolio_visited", { budget, desired_spend: desiredSpend, is_overshoot: isOvershoot });
  },

  budgetEntered(budget: number, desiredSpend: number, freePool: number) {
    init();
    posthog.capture("budget_entered", { budget, desired_spend: desiredSpend, free_pool: freePool });
  },

  allocationZeroed(budget: number, uptimePct: number, latencyPct: number, velocityPct: number, capacityPct: number) {
    init();
    posthog.capture("allocation_zeroed", {
      budget,
      uptime_pct:   uptimePct,
      latency_pct:  latencyPct,
      velocity_pct: velocityPct,
      capacity_pct: capacityPct,
    });
  },

  surplusSliderPulsed(domain: DomainName, freePool: number) {
    init();
    posthog.capture("surplus_slider_pulsed", { domain, free_pool: freePool });
  },
};
