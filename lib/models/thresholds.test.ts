import { describe, it, expect } from "vitest";
import { DOMAINS } from "./index";
import type { DomainKey } from "./types";

function getActiveThresholds(domain: DomainKey, sliderValue: number) {
  const config = DOMAINS[domain];
  return config.thresholds.filter((t) =>
    t.direction === "above" ? sliderValue >= t.trigger : sliderValue <= t.trigger
  );
}

describe("threshold logic", () => {
  describe("uptime", () => {
    it("no threshold below 3.0 nines", () => {
      const active = getActiveThresholds("uptime", 2.5);
      expect(active).toHaveLength(0);
    });
    it("3.0 nines triggers 10x threshold", () => {
      const active = getActiveThresholds("uptime", 3.0);
      expect(active.some((t) => t.title.includes("10×") || t.title.includes("10x"))).toBe(true);
    });
    it("at 3.0 exactly, exactly one threshold (10x)", () => {
      const active = getActiveThresholds("uptime", 3.0);
      expect(active).toHaveLength(1);
    });
    it("at 4.0 nines, multiple thresholds active", () => {
      const active = getActiveThresholds("uptime", 4.0);
      expect(active.length).toBeGreaterThanOrEqual(2);
    });
    it("at 5.0 nines, includes Google-scale", () => {
      const active = getActiveThresholds("uptime", 5.0);
      expect(active.some((t) => t.title.toLowerCase().includes("google"))).toBe(true);
    });
  });

  describe("marketing", () => {
    it("at $25K triggers marginal CPA threshold", () => {
      const active = getActiveThresholds("marketing", 25_000);
      expect(active.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("coverage", () => {
    it("at 75% triggers commendable threshold", () => {
      const active = getActiveThresholds("coverage", 75);
      expect(active.some((t) => t.title.toLowerCase().includes("commendable"))).toBe(true);
    });
  });

  describe("csat", () => {
    it("at 76.9% triggers national average", () => {
      const active = getActiveThresholds("csat", 76.9);
      expect(active.some((t) => t.title.toLowerCase().includes("average"))).toBe(true);
    });
  });
});
