"use client";

import { useState, useCallback } from "react";
import { C } from "@/lib/constants";
import { useViewport, useTokens } from "@/lib/hooks";
import { uptimeCurve } from "@/lib/models/uptime";
import { CostCurveChart } from "./CostCurveChart";
import { SliderPanel } from "./SliderPanel";
import { UpgradeCost } from "./UpgradeCost";
import { BottomTiles } from "./BottomTiles";

interface Props {
  onChartClick?: () => void;
  onSliderDrag?: () => void;
  chartRef?: React.RefObject<HTMLDivElement>;
  sliderRef?: React.RefObject<HTMLDivElement>;
  upgradeRef?: React.RefObject<HTMLDivElement>;
  bottomRef?: React.RefObject<HTMLDivElement>;
}

export function Calculator({ onChartClick, onSliderDrag, chartRef, sliderRef, upgradeRef, bottomRef }: Props) {
  const [current, setCurrent] = useState(2);
  const [target, setTarget] = useState(3);
  const { h } = useViewport();
  const T = useTokens(h);

  const handleSetCurrent = useCallback((nines: number) => {
    const clamped = Math.round(Math.max(2, Math.min(5.9, nines)) * 10) / 10;
    setCurrent(clamped);
    setTarget((t) => Math.max(t, clamped));
    onChartClick?.();
  }, [onChartClick]);

  const handleSliderChange = useCallback((v: number) => {
    setTarget(v);
    onSliderDrag?.();
  }, [onSliderDrag]);

  const isUpgrade = target > current + 0.05;
  const g = T.gap;

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 3, padding: 4, background: C.white, borderRadius: 10, border: `1px solid ${C.border}`, width: "fit-content", margin: `0 auto ${T.tabMb}px`, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
        {["Uptime", "Marketing", "Coverage", "CSAT"].map((l, i) => (
          <button key={l} style={{
            padding: T.tabPad, fontSize: T.tabFs, fontWeight: i === 0 ? 600 : 400,
            borderRadius: 7, border: "none", cursor: i === 0 ? "default" : "not-allowed",
            background: i === 0 ? C.navy : "transparent", color: i === 0 ? C.white : C.subtle,
            opacity: i === 0 ? 1 : 0.5, transition: "all 0.15s",
          }} title={i > 0 ? "Coming soon" : ""}>
            {l}{i > 0 && <span style={{ fontSize: T.tabFs - 2, marginLeft: 4, opacity: 0.6 }}>soon</span>}
          </button>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: "flex", gap: g, alignItems: "stretch" }}>
        {/* Left column */}
        <div style={{ flex: "1 1 68%", minWidth: 420, display: "flex", flexDirection: "column", gap: g }}>
          {/* Chart — ref wrapper matches chart's flex behavior */}
          <div ref={chartRef} style={{ display: "flex", flexDirection: "column", flex: "1 1 auto" }}>
            <CostCurveChart data={uptimeCurve} current={current} target={target} isUpgrade={isUpgrade} onSetCurrent={handleSetCurrent} tokens={T} />
          </div>
          <div ref={bottomRef}>
            <BottomTiles current={current} target={target} isUpgrade={isUpgrade} tokens={T} />
          </div>
        </div>

        {/* Right column */}
        <div style={{ flex: "1 1 28%", minWidth: 240, display: "flex", flexDirection: "column", gap: g }}>
          <div ref={sliderRef}>
            <SliderPanel current={current} target={target} onTargetChange={handleSliderChange} tokens={T} />
          </div>
          <div ref={upgradeRef} style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <UpgradeCost current={current} target={target} isUpgrade={isUpgrade} tokens={T} />
          </div>
        </div>
      </div>
    </div>
  );
}
