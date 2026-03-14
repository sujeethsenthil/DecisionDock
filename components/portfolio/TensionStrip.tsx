"use client";

import { C } from "@/lib/constants";
import { fcFull } from "@/lib/format";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { useTokens } from "@/lib/hooks";

interface Props {
  budget: number;
  currentSpend: number;
  desiredSpend: number;
  tokens: ReturnType<typeof useTokens>;
}

interface CellProps {
  label: string;
  value?: string;
  animatedValue?: number;
  animatedColor?: string;
  sub: string;
  valueColor?: string;
  background?: string;
  isLast?: boolean;
}

function Cell({ label, value, animatedValue, animatedColor, sub, valueColor, background, isLast }: CellProps) {
  return (
    <div style={{
      flex: 1,
      padding: "16px 20px",
      background: background ?? "transparent",
      borderRight: isLast ? "none" : `1px solid ${C.border}`,
      borderRadius: isLast ? "0 10px 10px 0" : undefined,
    }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: C.subtle, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ marginBottom: 3 }}>
        {animatedValue !== undefined && animatedColor !== undefined
          ? <AnimatedCounter value={animatedValue} color={animatedColor} size={24} />
          : <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 24, fontWeight: 700, color: valueColor ?? C.navy, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{value}</span>
        }
      </div>
      <div style={{ fontSize: 11, color: C.subtle }}>{sub}</div>
    </div>
  );
}

export function TensionStrip({ budget, currentSpend, desiredSpend, tokens: T }: Props) {
  const overshoot = desiredSpend > budget;
  const gap = Math.abs(desiredSpend - budget);

  return (
    <div style={{
      display: "flex",
      background: C.white,
      borderRadius: 10,
      border: `1px solid ${C.border}`,
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      overflow: "hidden",
      marginBottom: 20,
    }}>
      <Cell
        label="Your budget"
        value={fcFull(budget)}
        sub="annual operating"
        valueColor={C.navy}
      />
      <Cell
        label="Currently spending"
        value={fcFull(currentSpend)}
        sub="across 4 domains"
        valueColor={C.blue}
      />
      <Cell
        label="Desired state costs"
        value={fcFull(desiredSpend)}
        sub="sum of all targets"
        valueColor={desiredSpend > budget ? C.amber : C.emerald}
      />
      <Cell
        label={overshoot ? "Overshoot" : "Surplus"}
        animatedValue={gap}
        animatedColor={overshoot ? C.red : C.emerald}
        sub={overshoot ? "use sliders to close the gap" : "room to invest more"}
        background={overshoot ? "rgba(239,68,68,0.06)" : "rgba(16,185,129,0.06)"}
        isLast
      />
    </div>
  );
}
