import { describe, it, expect } from "vitest";
import { uptimeCost, uptimeDowntimeMinutes } from "./uptime";

describe("uptimeCost", () => {
  it("anchors at 2 nines to ~$5K", () => {
    expect(uptimeCost(2)).toBe(5_000);
  });
  it("anchors at 3 nines to ~$50K", () => {
    expect(uptimeCost(3)).toBe(50_000);
  });
  it("anchors at 4 nines to ~$500K", () => {
    expect(uptimeCost(4)).toBe(500_000);
  });
  it("anchors at 5 nines to ~$5M", () => {
    expect(uptimeCost(5)).toBe(5_000_000);
  });
  it("anchors at 6 nines to ~$50M", () => {
    expect(uptimeCost(6)).toBe(50_000_000);
  });
});

describe("uptimeDowntimeMinutes", () => {
  it("3 nines gives ~526 minutes per year", () => {
    const mins = uptimeDowntimeMinutes(3);
    expect(mins).toBeGreaterThan(500);
    expect(mins).toBeLessThan(600);
  });
});
