import { describe, it, expect } from "vitest";
import { formatCurrency, formatPercentage, formatDurationMinutes } from "./format";

describe("formatCurrency", () => {
  it("formats thousands with K suffix", () => {
    expect(formatCurrency(5_000)).toBe("$5K");
    expect(formatCurrency(50_000)).toBe("$50K");
  });
  it("formats millions with M suffix", () => {
    expect(formatCurrency(1_000_000)).toBe("$1M");
    expect(formatCurrency(5_000_000)).toBe("$5M");
  });
  it("uses one decimal for non-integer K", () => {
    expect(formatCurrency(1234.56)).toBe("$1.2K");
  });
});

describe("formatPercentage", () => {
  it("formats with default 1 decimal", () => {
    expect(formatPercentage(99.9)).toBe("99.9%");
  });
  it("formats with 0 decimals when specified", () => {
    expect(formatPercentage(75, 0)).toBe("75%");
  });
});

describe("formatDurationMinutes", () => {
  it("formats minutes only when under 60", () => {
    expect(formatDurationMinutes(45)).toBe("45m");
  });
  it("formats hours and minutes", () => {
    expect(formatDurationMinutes(90)).toBe("1h 30m");
  });
});
