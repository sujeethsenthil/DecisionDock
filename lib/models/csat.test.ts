import { describe, it, expect } from "vitest";
import { csatAnnualCost, csatCostPerPoint } from "./csat";

describe("csat", () => {
  describe("csatAnnualCost", () => {
    it("anchors at 50% CSAT to $50K", () => {
      expect(csatAnnualCost(50)).toBe(50_000);
    });
    it("increases with CSAT", () => {
      expect(csatAnnualCost(70)).toBeGreaterThan(csatAnnualCost(50));
      expect(csatAnnualCost(90)).toBeGreaterThan(csatAnnualCost(70));
    });
  });

  describe("csatCostPerPoint", () => {
    it("is positive", () => {
      expect(csatCostPerPoint(60)).toBeGreaterThan(0);
      expect(csatCostPerPoint(80)).toBeGreaterThan(0);
    });
    it("increases at higher CSAT (diminishing returns)", () => {
      const at70 = csatCostPerPoint(70);
      const at85 = csatCostPerPoint(85);
      const at95 = csatCostPerPoint(95);
      expect(at85).toBeGreaterThan(at70);
      expect(at95).toBeGreaterThan(at85);
    });
  });
});
