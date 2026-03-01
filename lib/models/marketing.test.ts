import { describe, it, expect } from "vitest";
import {
  marketingConversions,
  marketingCPA,
  marketingMarginalCPA,
} from "./marketing";

describe("marketing", () => {
  describe("marketingCPA", () => {
    it("CPA is positive and finite at typical spend levels", () => {
      expect(marketingCPA(10_000)).toBeGreaterThan(0);
      expect(marketingCPA(50_000)).toBeGreaterThan(0);
      expect(marketingCPA(100_000)).toBeLessThan(1000);
    });
    it("CPA at high spend (500K) exceeds CPA at mid spend (50K)", () => {
      expect(marketingCPA(500_000)).toBeGreaterThan(marketingCPA(50_000));
    });
  });

  describe("marketingConversions", () => {
    it("increases with spend and saturates", () => {
      const c10 = marketingConversions(10_000);
      const c50 = marketingConversions(50_000);
      const c500 = marketingConversions(500_000);
      expect(c50).toBeGreaterThan(c10);
      expect(c500).toBeGreaterThan(c50);
      expect(c500).toBeLessThanOrEqual(5500); // MAX_CONV is 5000, allow small overshoot
    });
  });

  describe("marketingMarginalCPA", () => {
    it("rises as spend increases (diminishing returns)", () => {
      const m25 = marketingMarginalCPA(25_000);
      const m100 = marketingMarginalCPA(100_000);
      expect(m100).toBeGreaterThan(m25);
    });
  });
});
