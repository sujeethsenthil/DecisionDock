"use client";

import { C, zoneColor, zoneSurface, zoneLabel } from "@/lib/constants";
import { fc, fmtNinesExact, fmtDur } from "@/lib/format";
import { getThreshold } from "@/lib/models/uptime";
import { AnimatedCounter } from "./AnimatedCounter";

interface Props {
  target: number;
  onTargetChange: (v: number) => void;
  baseCost: number;
  targetCost: number;
  baseDown: number;
  targetDown: number;
}

export function ControlPanel({ target, onTargetChange, baseCost, targetCost, baseDown, targetDown }: Props) {
  const color = zoneColor(target);
  const surface = zoneSurface(target);
  const label = zoneLabel(target);
  const pct = ((target - 2) / 4) * 100;
  const th = getThreshold(target);

  return (
    <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", padding: "24px 28px", display: "flex", flexDirection: "column", height: "100%" }}>

      {/* Slider */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 12, color: C.subtle, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Target availability</span>
          <span style={{ fontSize: 11, fontWeight: 600, color, background: surface, padding: "3px 10px", borderRadius: 12 }}>{label}</span>
        </div>
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 32, fontWeight: 300, color, fontFamily: "'Inter',sans-serif", letterSpacing: "-0.04em" }}>{fmtNinesExact(target)}</span>
        </div>
        <input
          type="range" min={2} max={6} step={0.1} value={target}
          onChange={(e) => onTargetChange(parseFloat(e.target.value))}
          aria-label="Set target availability"
          style={{
            width: "100%", height: 6, WebkitAppearance: "none", appearance: "none",
            borderRadius: 4, outline: "none", cursor: "pointer",
            background: `linear-gradient(to right, ${C.blue} 0%, ${C.blue} ${pct * 0.4}%, ${C.amber} ${pct * 0.65}%, ${C.red} 100%)`,
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ fontSize: 10, color: C.subtle }}>99%</span>
          <span style={{ fontSize: 10, color: C.subtle }}>99.9999%</span>
        </div>
      </div>

      {/* Current / Target */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "14px 16px", borderRight: `1px solid ${C.border}`, background: C.light }}>
          <div style={{ fontSize: 10, color: C.blue, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>Current (99.9%)</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.navy, fontFamily: "'JetBrains Mono',monospace", lineHeight: 1 }}>{fc(baseCost)}<span style={{ fontSize: 11, fontWeight: 400, color: C.subtle }}>/yr</span></div>
          <div style={{ fontSize: 11, color: C.subtle, marginTop: 6 }}>{fmtDur(baseDown)} downtime/yr</div>
        </div>
        <div style={{ padding: "14px 16px", background: surface }}>
          <div style={{ fontSize: 10, color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>Target ({fmtNinesExact(target)})</div>
          <div style={{ lineHeight: 1 }}><AnimatedCounter value={targetCost} color={color} /><span style={{ fontSize: 11, fontWeight: 400, color: C.subtle }}>/yr</span></div>
          <div style={{ fontSize: 11, color: C.subtle, marginTop: 6 }}>{fmtDur(targetDown)} downtime/yr</div>
        </div>
      </div>

      {/* What this requires */}
      <div style={{ background: C.light, borderRadius: 10, padding: "14px 16px", flex: 1, minHeight: 120 }}>
        <div style={{ fontSize: 10, color: C.subtle, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>What {fmtNinesExact(target)} requires</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 18 }}>{th.icon}</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{th.title}</span>
        </div>
        <div style={{ fontSize: 13, color: C.body, lineHeight: 1.45, marginBottom: 4 }}>{th.what}</div>
        <div style={{ fontSize: 12, color: C.subtle, lineHeight: 1.45 }}>{th.body}</div>
      </div>
    </div>
  );
}
