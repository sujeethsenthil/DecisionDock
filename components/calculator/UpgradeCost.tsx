"use client";

import { C, zoneColor, zoneSurface } from "@/lib/constants";
import { fc, fmtNinesExact, fmtDur } from "@/lib/format";
import { uptimeCost, uptimeDown } from "@/lib/models/uptime";
import { AnimatedCounter } from "./AnimatedCounter";

interface Props {
  current: number;
  target: number;
  isUpgrade: boolean;
  tokens: any;
}

export function UpgradeCost({ current, target, isUpgrade, tokens: T }: Props) {
  const color = zoneColor(target);
  const bC = uptimeCost(current);
  const tC = uptimeCost(target);
  const dC = tC - bC;
  const bD = uptimeDown(current);
  const tD = uptimeDown(target);
  const dD = bD - tD;
  const cpm = dD > 0 ? dC / dD : 0;
  const g = T.gap;
  const nextNine = Math.min(6, Math.ceil(current + 0.01));
  const nextCost = uptimeCost(nextNine);
  const nextDown = uptimeDown(current) - uptimeDown(nextNine);

  return (
    <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", flex: 1, padding: T.rPad, display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: T.rLabelFs, color: C.subtle, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: g + 2 }}>What the upgrade costs</div>
      {!isUpgrade ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ background: C.bS, borderRadius: 10, padding: T.upgPad, marginBottom: g }}>
            <div style={{ fontSize: T.upgLFs, color: C.blue, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>You're here · {fmtNinesExact(current)}</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: T.upgNFs + 4, fontWeight: 700, color: C.navy }}>{fc(bC)}<span style={{ fontSize: 10, fontWeight: 400, color: C.subtle }}>/yr</span></div>
            <div style={{ fontSize: T.upgLFs + 1, color: C.subtle, marginTop: 3 }}>{fmtDur(bD)} downtime per year</div>
          </div>
          <div style={{ background: C.light, borderRadius: 10, padding: T.upgPad }}>
            <div style={{ fontSize: T.upgLFs, color: C.subtle, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>What the next nine looks like</div>
            <div style={{ fontSize: T.botSFs || 11, color: C.body, lineHeight: 1.5 }}>Moving to <strong style={{ color: C.amber }}>{fmtNinesExact(nextNine)}</strong> would cost ~<strong>{fc(nextCost)}/yr</strong> — a {Math.round(nextCost / bC)}× increase for {fmtDur(nextDown)} less downtime.</div>
          </div>
          <div style={{ marginTop: g, fontSize: T.upgLFs + 1, color: C.subtle, textAlign: "center", lineHeight: 1.4 }}>
            Drag the slider to see what more reliability costs →
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: g, padding: "6px 0" }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: T.upgNFs - 2, fontWeight: 700, color: C.navy }}>{fc(bC)}</span>
            <span style={{ fontSize: 14, color: C.subtle }}>→</span>
            <AnimatedCounter value={tC} color={color} size={T.upgNFs - 2} />
            <span style={{ fontSize: 10, color: C.subtle }}>/yr</span>
          </div>
          <div style={{ marginBottom: g }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
              <span style={{ fontSize: T.upgLFs, color: C.subtle, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>How much more you'd pay</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: T.upgNFs - 2, fontWeight: 700, color }}>{(tC / bC).toFixed(0)}×</span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: C.border, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 3, background: `linear-gradient(to right, ${C.blue}, ${color})`, width: `${Math.min(100, ((target - current) / (6 - current)) * 100)}%`, transition: "width 0.3s ease-out" }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: g }}>
            <div style={{ flex: 1, background: zoneSurface(target), borderRadius: 10, padding: T.upgPad, textAlign: "center" }}>
              <div style={{ fontSize: T.upgLFs, color: C.subtle, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>Additional spend</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: T.upgNFs + 2, fontWeight: 700, color }}>+{fc(dC)}</div>
              <div style={{ fontSize: T.upgLFs, color: C.subtle, marginTop: 2 }}>per year</div>
            </div>
            <div style={{ flex: 1, background: C.eS, borderRadius: 10, padding: T.upgPad, textAlign: "center" }}>
              <div style={{ fontSize: T.upgLFs, color: C.subtle, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>Downtime you'd eliminate</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: T.upgNFs + 2, fontWeight: 700, color: C.emerald }}>{fmtDur(dD)}</div>
              <div style={{ fontSize: T.upgLFs, color: C.subtle, marginTop: 2 }}>per year</div>
            </div>
          </div>
          <div style={{ background: C.light, borderRadius: 10, padding: "12px 14px", textAlign: "center", borderLeft: `3px solid ${color}` }}>
            <div style={{ fontSize: T.upgLFs, color: C.subtle, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>What each minute of uptime costs you</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: T.upgPpmFs + 2, fontWeight: 700, color }}>{fc(cpm)}<span style={{ fontSize: 10, fontWeight: 400, color: C.subtle }}>/min</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
