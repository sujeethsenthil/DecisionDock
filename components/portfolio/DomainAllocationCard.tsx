"use client";

import { C } from "@/lib/constants";
import { fc } from "@/lib/format";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { useTokens } from "@/lib/hooks";
import {
  DomainKey,
  DOMAIN_CONFIGS,
  INFLECTION_X,
  getRoiZone,
  getRoiLabel,
} from "@/lib/models/portfolio";

interface Props {
  domainKey: DomainKey;
  currentX: number;
  targetX: number;
  maxX: number;
  onTargetChange: (key: DomainKey, x: number) => void;
  tokens: ReturnType<typeof useTokens>;
}

const ROI_TAG_STYLES = {
  steep:      { background: "rgba(16,185,129,0.12)",  color: C.emerald },
  approaching:{ background: "rgba(245,158,11,0.12)",  color: C.amber   },
  flat:       { background: "rgba(239,68,68,0.12)",   color: C.red     },
};

export function DomainAllocationCard({
  domainKey, currentX, targetX, maxX, onTargetChange, tokens: T,
}: Props) {
  const cfg    = DOMAIN_CONFIGS[domainKey];
  const inflX  = INFLECTION_X[domainKey];
  const zone   = getRoiZone(domainKey, targetX);
  const tagStyle = ROI_TAG_STYLES[zone];

  const currentCost = cfg.cost(currentX);
  const targetCost  = cfg.cost(targetX);
  const deltaCost   = targetCost - currentCost;
  const floorCost   = cfg.cost(cfg.xFloor);

  const { xMin, xMax, xFloor } = cfg;
  const isCapActive = maxX < xMax - 0.01;
  const capPct = isCapActive
    ? ((maxX - xFloor) / (xMax - xFloor)) * 100
    : 100;

  // ROI message based on inflection position
  let roiMessage = "";
  let roiColor: string = C.subtle;
  if (targetX >= inflX + 0.4) {
    roiMessage = "Past inflection — returns have flattened. Consider trimming here first.";
    roiColor = C.red;
  } else if (targetX >= inflX - 0.3) {
    roiMessage = "Approaching the inflection point — each dollar buys less improvement.";
    roiColor = C.amber;
  } else {
    roiMessage = "Still in the steep zone — investment here yields strong returns.";
    roiColor = C.emerald;
  }

  return (
    <div style={{
      background: C.white,
      borderRadius: 12,
      border: `1px solid ${C.border}`,
      padding: "16px 18px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      display: "flex",
      flexDirection: "column",
      gap: 12,
    }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.color, flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{cfg.label}</span>
        </div>
        <span style={{
          fontSize: 9, padding: "2px 8px", borderRadius: 99,
          fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
          ...tagStyle,
        }}>
          {getRoiLabel(zone)}
        </span>
      </div>

      {/* Value prop — current → target */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        background: C.pageBg,
        borderRadius: 8,
        border: `1px solid ${C.border}`,
      }}>
        {/* Current */}
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 9, fontWeight: 600, color: C.subtle, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>
            Current
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.med, letterSpacing: "-0.01em" }}>
            {cfg.levelLabel(currentX)}
          </div>
          <div style={{ fontSize: 10, color: C.subtle, fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
            {fc(currentCost)}/yr
          </div>
        </div>

        {/* Arrow */}
        <div style={{ color: cfg.color, fontSize: 18, fontWeight: 300, flexShrink: 0 }}>→</div>

        {/* Target */}
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 9, fontWeight: 600, color: C.subtle, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>
            Target
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: cfg.color, letterSpacing: "-0.01em" }}>
            {cfg.levelLabel(targetX)}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4, marginTop: 2 }}>
            <AnimatedCounter value={targetCost} color={cfg.color} size={11} />
            {deltaCost !== 0 && (
              <span style={{ fontSize: 9, color: deltaCost > 0 ? C.red : C.emerald, fontFamily: "'JetBrains Mono', monospace" }}>
                {deltaCost > 0 ? "+" : ""}{fc(deltaCost)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ROI signal */}
      <div style={{ fontSize: 11, color: roiColor, lineHeight: 1.45, minHeight: 32 }}>
        {roiMessage}
      </div>

      {/* Slider */}
      <div>
        <div style={{ position: "relative" }}>
          <input
            type="range"
            min={xFloor}
            max={maxX}
            step={0.05}
            value={targetX}
            onChange={(e) => onTargetChange(domainKey, parseFloat(e.target.value))}
            style={{
              width: "100%",
              height: 6,
              accentColor: cfg.color,
              cursor: maxX <= xFloor + 0.01 ? "not-allowed" : "pointer",
            }}
          />
          {/* Cap hairline */}
          {isCapActive && (
            <div style={{
              position: "absolute", top: "50%", left: `${capPct}%`,
              transform: "translate(-50%, -50%)",
              width: 1, height: 14,
              background: C.med, opacity: 0.4,
              pointerEvents: "none",
            }} />
          )}
        </div>

        {/* Slider axis labels */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ fontSize: 9, color: C.subtle }}>{cfg.axisMin}</span>
          <span style={{ fontSize: 9, color: C.subtle }}>{cfg.axisMax}</span>
        </div>
      </div>

    </div>
  );
}
