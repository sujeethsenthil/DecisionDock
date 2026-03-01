import { describe, it, expect } from "vitest";
import { generateCurveData } from "./engine";
import { uptimeConfig } from "./models/uptime-config";

describe("generateCurveData", () => {
  it("returns 201 points for default numPoints", () => {
    const data = generateCurveData(uptimeConfig);
    expect(data).toHaveLength(201);
  });
  it("first point is at min with correct cost", () => {
    const data = generateCurveData(uptimeConfig);
    expect(data[0].x).toBe(2);
    expect(data[0].cost).toBe(5000);
  });
  it("last point is at max", () => {
    const data = generateCurveData(uptimeConfig);
    expect(data[data.length - 1].x).toBe(6);
  });
});
