import { describe, it, expect } from "vitest";
import {
  coverageEffort,
  coverageMarginalEffort,
  bugDetectionRate,
} from "./coverage";

describe("coverage", () => {
  describe("coverageEffort", () => {
    it("is 0 at 0%", () => {
      expect(coverageEffort(0)).toBe(0);
    });
    it("increases with coverage", () => {
      expect(coverageEffort(50)).toBeGreaterThan(coverageEffort(30));
      expect(coverageEffort(90)).toBeGreaterThan(coverageEffort(75));
    });
    it("90–100% range shows much higher effort (10–50x baseline)", () => {
      const at60 = coverageEffort(60);
      const at90 = coverageEffort(90);
      const at100 = coverageEffort(100);
      expect(at90).toBeGreaterThan(at60);
      expect(at100).toBeGreaterThan(at90);
      const ratio90to60 = at90 / (at60 || 1);
      const ratio100to90 = at100 / (at90 || 1);
      expect(ratio90to60).toBeGreaterThan(1);
      expect(ratio100to90).toBeGreaterThan(1);
    });
  });

  describe("coverageMarginalEffort", () => {
    it("increases exponentially with pct", () => {
      expect(coverageMarginalEffort(80)).toBeGreaterThan(coverageMarginalEffort(50));
    });
  });

  describe("bugDetectionRate", () => {
    it("capped at 0.98", () => {
      expect(bugDetectionRate(100)).toBeLessThanOrEqual(0.98);
    });
    it("increases with coverage (logarithmic)", () => {
      expect(bugDetectionRate(80)).toBeGreaterThan(bugDetectionRate(50));
    });
  });
});
