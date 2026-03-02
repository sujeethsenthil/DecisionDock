"use client";

import { C, zoneColor, zoneSurface, zoneLabel } from "@/lib/constants";
import { fmtNinesExact } from "@/lib/format";

interface Props {
  current: number;
  target: number;
  onTargetChange: (v: number) => void;
  tokens: any;
}

export function SliderPanel({ current, target, onTargetChange, tokens: T }: Props) {
  const color = zoneColor(target);
  const surface = zoneSurface(target);
  const label = zoneLabel(target);
  const sliderPct = current < 6 ? Math.max(0, (target - current) / (6 - current)) : 0;

  return (
    <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", padding: T.rPad }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: T.rLabelFs + 1, color: C.subtle, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Where do you want to be?</span>
        <span style={{ fontSize: T.rLabelFs + 1, fontWeight: 600, color, background: surface, padding: "2px 8px", borderRadius: 10 }}>{label}</span>
      </div>
      <div style={{ textAlign: "center", marginBottom: 6 }}>
        <span style={{ fontSize: T.rNumFs, fontWeight: 300, color, fontFamily: "'Inter',sans-serif", letterSpacing: "-0.04em" }}>{fmtNinesExact(target)}</span>
      </div>
      <input
        type="range" min={current} max={6} step={0.1} value={target}
        onChange={(e) => onTargetChange(parseFloat(e.target.value))}
        aria-label="Set target availability"
        style={{
          width: "100%", height: 6, WebkitAppearance: "none", appearance: "none",
          borderRadius: 4, outline: "none", cursor: "pointer",
          background: `linear-gradient(to right, ${C.blue} 0%, ${C.blue} ${sliderPct * 40}%, ${C.amber} ${sliderPct * 65}%, ${C.red} 100%)`,
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
        <span style={{ fontSize: T.rLabelFs, color: C.subtle }}>{fmtNinesExact(current)}</span>
        <span style={{ fontSize: T.rLabelFs, color: C.subtle }}>99.9999%</span>
      </div>
    </div>
  );
}
