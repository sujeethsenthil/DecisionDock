"use client";

import { C } from "@/lib/constants";
import { fc, fcFull } from "@/lib/format";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { useTokens } from "@/lib/hooks";
import {
  DOMAIN_ORDER,
  DOMAIN_CONFIGS,
  DomainKey,
  Persona,
  getRoiZone,
} from "@/lib/models/portfolio";

interface Props {
  budget: number;
  targetX: Persona;
  tokens: ReturnType<typeof useTokens>;
}

export function AllocationSidebar({ budget, targetX, tokens: T }: Props) {
  const domainCosts = DOMAIN_ORDER.reduce((acc, k) => {
    acc[k] = DOMAIN_CONFIGS[k].cost(targetX[k]);
    return acc;
  }, {} as Record<DomainKey, number>);

  const totalTargetCost = DOMAIN_ORDER.reduce((s, k) => s + domainCosts[k], 0);
  const pool    = budget - totalTargetCost;
  const isOver  = pool < 0;
  const isZero  = Math.abs(pool) < 1;

  const budgetBarPct = Math.min(100, (totalTargetCost / budget) * 100);
  const barColor     = isOver ? C.red : C.emerald;
  const poolColor    = isOver ? C.red : isZero ? C.navy : C.emerald;

  // Contextual hint
  const biggestDomain = DOMAIN_ORDER.reduce((a, b) =>
    domainCosts[a] > domainCosts[b] ? a : b
  );
  const biggestZone  = getRoiZone(biggestDomain, targetX[biggestDomain]);
  const biggestLabel = DOMAIN_CONFIGS[biggestDomain].label;
  const zoneDesc     = biggestZone === "flat" ? "already flattened" : "not yet flattened";

  let hint = "";
  if (isOver)       hint = `${biggestLabel} is your biggest driver — its ROI curve has ${zoneDesc}.`;
  else if (isZero)  hint = "All domains funded within budget.";
  else              hint = "Drag the glowing sliders to put this budget to work.";

  return (
    <div style={{
      position: "sticky",
      top: 24,
      alignSelf: "flex-start",
      background: C.white,
      borderRadius: 12,
      border: `1px solid ${C.border}`,
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      padding: "14px 16px",
      display: "flex",
      flexDirection: "column",
      gap: 12,
    }}>

      {/* Budget tracker label */}
      <div style={{ fontSize: 10, fontWeight: 600, color: C.subtle, textTransform: "uppercase", letterSpacing: "0.07em" }}>
        Budget Tracker
      </div>

      {/* Budget bar */}
      <div>
        <div style={{ height: 8, borderRadius: 4, background: C.border, overflow: "hidden", marginBottom: 6 }}>
          <div style={{
            height: "100%",
            width: `${budgetBarPct}%`,
            background: barColor,
            borderRadius: 4,
            transition: "width 0.15s ease, background 0.15s ease",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 9, color: C.subtle, fontFamily: "'JetBrains Mono', monospace" }}>
            {fcFull(totalTargetCost)} targeted
          </span>
          <span style={{ fontSize: 9, color: C.subtle, fontFamily: "'JetBrains Mono', monospace" }}>
            {fcFull(budget)} budget
          </span>
        </div>
      </div>

      {/* Per-domain rows */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {DOMAIN_ORDER.map((k, i) => {
          const cfg  = DOMAIN_CONFIGS[k];
          const cost = domainCosts[k];
          const pct  = budget > 0 ? Math.round((cost / budget) * 100) : 0;

          return (
            <div key={k} style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "7px 0",
              borderBottom: i < DOMAIN_ORDER.length - 1 ? `1px solid ${C.border}` : "none",
              gap: 6,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: cfg.color, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: C.med, fontWeight: 500 }}>{cfg.label}</span>
              </div>
              <span style={{ fontSize: 9, color: C.subtle, fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>
                {pct}%
              </span>
              <div style={{ flexShrink: 0 }}>
                <AnimatedCounter value={cost} color={cfg.color} size={11} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Free pool block */}
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: C.subtle, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>
          Free Pool
        </div>
        <div style={{ marginBottom: 4, display: "flex", alignItems: "baseline", gap: 2 }}>
          {isOver && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 700, color: poolColor, letterSpacing: "-0.02em", lineHeight: 1 }}>−</span>}
          <AnimatedCounter value={Math.abs(pool)} color={poolColor} size={28} />
        </div>
        <div style={{ fontSize: 11, color: C.med, marginBottom: 8 }}>
          {isOver ? `Over budget by ${fcFull(Math.abs(pool))}` : isZero ? "Budget fully allocated" : "Available to allocate"}
        </div>
        <div style={{ background: "rgba(0,0,0,0.03)", borderRadius: 8, padding: "8px 10px", fontSize: 10, color: C.subtle, lineHeight: 1.5 }}>
          {hint}
        </div>
      </div>


    </div>
  );
}
