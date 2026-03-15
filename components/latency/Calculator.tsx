"use client";

import { useCallback, useEffect, useRef } from "react";
import { useViewport, useTokens } from "@/lib/hooks";
import { latencyCurve } from "@/lib/models/latency";
import { usePlatformStore } from "@/lib/store/platform";
import { Analytics } from "@/lib/analytics";
import { DOMAIN_CONFIGS } from "@/lib/models/portfolio";
import dynamic from "next/dynamic";
const CostCurveChart = dynamic(() => import("./CostCurveChart").then(m => ({ default: m.CostCurveChart })), { ssr: false });
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
  const { currentX: current, targetX: target } = usePlatformStore((s) => s.domains.latency);
  const setCurrentX = usePlatformStore((s) => s.setCurrentX);
  const setTargetX  = usePlatformStore((s) => s.setTargetX);
  const { h } = useViewport();
  const T = useTokens(h);
  const cfg = DOMAIN_CONFIGS.latency;
  const draggedRef = useRef(false);

  useEffect(() => {
    Analytics.domainViewed({ domain: "latency" });
  }, []);

  const handleSetCurrent = useCallback((level: number) => {
    const clamped = Math.round(Math.max(2, Math.min(5.9, level)) * 10) / 10;
    setCurrentX("latency", clamped);
    Analytics.chartClicked({
      domain: "latency",
      current_x: clamped,
      level_label: cfg.levelLabel(clamped),
    });
    onChartClick?.();
  }, [setCurrentX, cfg, onChartClick]);

  const handleSliderChange = useCallback((v: number) => {
    setTargetX("latency", v);
    if (!draggedRef.current) {
      draggedRef.current = true;
      Analytics.sliderDragged({
        domain: "latency",
        target_x: v,
        level_label: cfg.levelLabel(v),
        annual_cost: cfg.cost(v),
      });
    }
    onSliderDrag?.();
  }, [setTargetX, cfg, onSliderDrag]);

  const handlePointerUp = useCallback(() => { draggedRef.current = false; }, []);

  const isUpgrade = target > current + 0.05;
  const g = T.gap;

  return (
    <div onPointerUp={handlePointerUp}>
      <div style={{ display: "flex", gap: g, alignItems: "stretch" }}>
        <div style={{ flex: "1 1 68%", minWidth: 420, display: "flex", flexDirection: "column", gap: g }}>
          <div ref={chartRef} style={{ display: "flex", flexDirection: "column", flex: "1 1 auto" }}>
            <CostCurveChart data={latencyCurve} current={current} target={target} isUpgrade={isUpgrade} onSetCurrent={handleSetCurrent} tokens={T} />
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
