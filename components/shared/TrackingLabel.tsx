"use client";

import React from "react";

interface Props {
  nines: number;
  color: string;
  marginL: number;
  marginR: number;
  children: React.ReactNode;
}

export function TrackingLabel({ nines, color, children, marginL, marginR }: Props) {
  const pctOfPlot = ((nines - 2) / 4) * 100;
  const clampedPct = Math.max(5, Math.min(85, pctOfPlot));

  return (
    <div style={{
      position: "absolute",
      left: `calc(${marginL}px + (100% - ${marginL + marginR}px) * ${clampedPct / 100})`,
      transform: "translateX(-50%)",
      top: 8,
      background: "rgba(255,255,255,0.88)",
      backdropFilter: "blur(6px)",
      borderRadius: 8,
      padding: "4px 8px",
      border: `1px solid ${color}22`,
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      pointerEvents: "none" as const,
      whiteSpace: "nowrap" as const,
      zIndex: 5,
      transition: "left 0.15s ease-out",
    }}>
      {children}
    </div>
  );
}
