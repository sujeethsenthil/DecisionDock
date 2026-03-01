"use client";

import { useMemo } from "react";
import type { DomainConfig } from "@/lib/models";
import { COLORS, getZoneColor, getZoneBg, getZoneLabel } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";
import { toLogScale, fromLogScale } from "@/lib/engine";
import { AnimatedCounter } from "./AnimatedCounter";

interface ResultsPanelProps {
  config: DomainConfig;
  sliderValue: number;
  onSliderChange: (value: number) => void;
  displayCost: number;
  secondaryValue: string;
  marginalCost: number;
}

export function ResultsPanel({
  config,
  sliderValue,
  onSliderChange,
  displayCost,
  secondaryValue,
  marginalCost,
}: ResultsPanelProps) {
  const { slider: sc, zones } = config;
  const isLog = config.logScale;
  const zc = getZoneColor(sliderValue, zones);

  const sliderMin = isLog ? 0 : sc.min;
  const sliderMax = isLog ? 100 : sc.max;
  const sliderStep = isLog ? 0.5 : sc.step;
  const sliderDisplay = isLog ? toLogScale(sliderValue, sc.min, sc.max) : sliderValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    if (isLog) {
      onSliderChange(Math.round(fromLogScale(v, sc.min, sc.max) / 1000) * 1000);
    } else {
      onSliderChange(v);
    }
  };

  const pct = ((sliderDisplay - sliderMin) / (sliderMax - sliderMin)) * 100;

  return (
    <div
      style={{
        background: COLORS.white,
        borderRadius: 16,
        border: `1px solid ${COLORS.border}`,
        padding: 32,
        display: "flex",
        flexDirection: "column",
        gap: 28,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      {/* Cost counter */}
      <div>
        <div
          style={{
            fontSize: 13, color: COLORS.med, marginBottom: 6,
            fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em",
          }}
        >
          {config.key === "coverage" ? "Cumulative Effort" : "Estimated Annual Cost"}
        </div>
        <div aria-live="polite" aria-atomic="true">
          <AnimatedCounter value={displayCost} color={zc} />
        </div>
        <div
          style={{
            display: "inline-block", marginLeft: 12, fontSize: 12, fontWeight: 600,
            padding: "3px 10px", borderRadius: 20, color: zc,
            background: getZoneBg(sliderValue, zones),
          }}
        >
          {getZoneLabel(sliderValue, zones)}
        </div>
      </div>

      {/* Slider */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: COLORS.med }}>{sc.format(sc.min)}</span>
          <span
            style={{
              fontSize: 14, fontWeight: 700, color: zc,
              fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
            }}
          >
            {sc.format(sliderValue)}
          </span>
          <span style={{ fontSize: 12, color: COLORS.med }}>{sc.format(sc.max)}</span>
        </div>
        <input
          type="range"
          min={sliderMin}
          max={sliderMax}
          step={sliderStep}
          value={sliderDisplay}
          onChange={handleChange}
          aria-label={`Set target ${config.label.toLowerCase()}`}
          className="nines-slider"
          style={{
            width: "100%", height: 8,
            WebkitAppearance: "none", appearance: "none",
            borderRadius: 8, outline: "none", cursor: "pointer",
            background: `linear-gradient(to right, ${COLORS.blue} 0%, ${COLORS.amber} ${Math.min(pct + 10, 100)}%, ${COLORS.red} 100%)`,
          }}
        />
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: COLORS.border }} />

      {/* Secondary metric */}
      <div>
        <div style={{ fontSize: 13, color: COLORS.med, marginBottom: 4, fontWeight: 500 }}>
          {config.secondaryLabel}
        </div>
        <div
          style={{
            fontSize: 28, fontWeight: 700, color: COLORS.navy,
            fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {secondaryValue}
        </div>
      </div>

      {/* Marginal cost */}
      <div>
        <div style={{ fontSize: 13, color: COLORS.med, marginBottom: 4, fontWeight: 500 }}>
          Marginal Cost of Next Step
        </div>
        <div
          style={{
            fontSize: 28, fontWeight: 700, color: COLORS.red,
            fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {formatCurrency(marginalCost)}
        </div>
      </div>
    </div>
  );
}
