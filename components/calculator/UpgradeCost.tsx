"use client";

import { C, zoneColor, zoneSurface } from "@/lib/constants";
import { fc, fmtDur } from "@/lib/format";

interface Props {
  isUpgrade: boolean;
  deltaCost: number;
  deltaDown: number;
  costPerMin: number;
  target: number;
}

export function UpgradeCost({ isUpgrade, deltaCost, deltaDown, costPerMin, target }: Props) {
  const color = zoneColor(target);
  const surface = zoneSurface(target);

  return (
    <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", padding: "24px 28px", minHeight: 220, display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ fontSize: 11, color: C.subtle, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>Cost of the upgrade</div>
      {!isUpgrade ? (
        <div style={{ fontSize: 14, color: C.subtle, flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>Drag the slider past 99.9% to see upgrade costs</div>
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, background: surface, borderRadius: 10, padding: "14px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 10, color: C.subtle, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Additional Spend</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 22, fontWeight: 700, color }}>+{fc(deltaCost)}</div>
              <div style={{ fontSize: 10, color: C.subtle, marginTop: 2 }}>per year</div>
            </div>
            <div style={{ flex: 1, background: C.emeraldSurface, borderRadius: 10, padding: "14px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 10, color: C.subtle, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Downtime Saved</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 22, fontWeight: 700, color: C.emerald }}>{fmtDur(deltaDown)}</div>
              <div style={{ fontSize: 10, color: C.subtle, marginTop: 2 }}>per year</div>
            </div>
          </div>
          <div style={{ background: C.light, borderRadius: 10, padding: "14px 16px", textAlign: "center", borderLeft: `3px solid ${color}` }}>
            <div style={{ fontSize: 10, color: C.subtle, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Price Per Minute of Uptime</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 26, fontWeight: 700, color }}>{fc(costPerMin)}<span style={{ fontSize: 11, fontWeight: 400, color: C.subtle }}>/min</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
