"use client";

import { useState, useCallback } from "react";
import { C } from "@/lib/constants";
import { useViewport, useTokens } from "@/lib/hooks";
import { velocityCurve } from "@/lib/models/velocity";
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

  const handleSetCurrent = useCallback((level: number) => {
    const clamped = Math.round(Math.max(2, Math.min(5.9, level)) * 10) / 10;
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
      <div style={{ display: "flex", gap: g, alignItems: "stretch" }}>
        <div style={{ flex: "1 1 68%", minWidth: 420, display: "flex", flexDirection: "column", gap: g }}>
          <div ref={chartRef} style={{ display: "flex", flexDirection: "column", flex: "1 1 auto" }}>
            <CostCurveChart data={velocityCurve} current={current} target={target} isUpgrade={isUpgrade} onSetCurrent={handleSetCurrent} tokens={T} />
          </div>
          <div ref={bottomRef}>
            <BottomTiles current={current} target={target} isUpgrade={isUpgrade} tokens={T} />
          </div>
        </div>
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
