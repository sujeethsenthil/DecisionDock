"use client";

import { C, zoneColor, zoneSurface } from "@/lib/constants";
import { fc, fmtBuffer, fmtSlowdown, fmtCapacityExact } from "@/lib/format";
import { capacityCost, bufferMultiplier, peakSlowdown, getThreshold } from "@/lib/models/capacity";

interface Props {
  current: number;
  target: number;
  isUpgrade: boolean;
  tokens: any;
}

export function BottomTiles({ current, target, isUpgrade, tokens: T }: Props) {
  const color = zoneColor(target);
  const th = getThreshold(target);
  const dC = capacityCost(target) - capacityCost(current);
  const bSlow = peakSlowdown(current);
  const tSlow = peakSlowdown(target);
  const dSlow = bSlow - tSlow;
  const cpsx = dSlow > 0 ? dC / dSlow : 0;
  const peakHrThreshold = dSlow > 0 ? dC / (dSlow * 2000) : 0; // ~2000 peak hours/yr
  const g = T.gap;

  return (
    <div style={{ display: "flex", gap: g, alignItems: "stretch" }}>
      {/* What you'd need */}
      <div style={{ flex: "1 1 50%", background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", padding: T.botPad, minHeight: T.botMinH, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: T.botLFs, color: C.subtle, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>What you&apos;d need at {fmtCapacityExact(target)}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: T.botTFs + 4 }}>{th.icon}</span>
          <span style={{ fontSize: T.botTFs, fontWeight: 700, color: C.navy }}>{th.t}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          <div style={{ display: "flex", gap: 6, alignItems: "baseline" }}>
            <span style={{ fontSize: T.botSFs - 1, color: C.subtle, minWidth: 32 }}>Infra</span>
            <span style={{ fontSize: T.botSFs, color: C.body, lineHeight: 1.4 }}>{th.infra}</span>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "baseline" }}>
            <span style={{ fontSize: T.botSFs - 1, color: C.subtle, minWidth: 32 }}>Team</span>
            <span style={{ fontSize: T.botSFs, color: C.body, lineHeight: 1.4 }}>{th.team}</span>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "baseline" }}>
            <span style={{ fontSize: T.botSFs - 1, color: C.subtle, minWidth: 32 }}>Cost</span>
            <span style={{ fontSize: T.botSFs, color: C.navy, fontWeight: 600, lineHeight: 1.4 }}>{th.staffing}</span>
          </div>
        </div>
        <div style={{ fontSize: T.botSFs - 1, color: C.subtle, lineHeight: 1.4, marginTop: 4 }}>{th.b}</div>
      </div>

      {/* Should you do it */}
      <div style={{ flex: "1 1 50%", background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", padding: T.botPad, minHeight: T.botMinH, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: T.botLFs, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color, marginBottom: 8 }}>Should you do it?</div>
        <div style={{ fontSize: T.botBFs, color: C.body, lineHeight: 1.55, flex: 1 }}>
          {!isUpgrade
            ? `At ${fmtBuffer(bufferMultiplier(target))} buffer, you're running lean. Acceptable if traffic is predictable and spikes are rare.`
            : target <= current + 2
              ? `Adding headroom to ${fmtBuffer(bufferMultiplier(target))} costs +${fc(dC)}/yr and reduces peak slowdown by ${fmtSlowdown(dSlow)}. Worth it if peak-hour revenue exceeds ${fc(peakHrThreshold)}/hr.`
              : `Reaching ${fmtBuffer(bufferMultiplier(target))} from ${fmtBuffer(bufferMultiplier(current))} requires +${fc(dC)}/yr. Peak slowdown drops from ${fmtSlowdown(bSlow)} to ${fmtSlowdown(tSlow)}. Only for services where peak performance is revenue-critical.`}
        </div>
        {isUpgrade && cpsx > 0 && (
          <div style={{ marginTop: 6, padding: T.roiPad, background: zoneSurface(target), borderRadius: 8, fontSize: T.roiFs, color: C.dark, lineHeight: 1.5 }}>
            <strong>Quick math:</strong> If peak-hour revenue exceeds <strong style={{ color }}>{fc(peakHrThreshold)}/hr</strong>, this headroom pays for itself.
          </div>
        )}
      </div>
    </div>
  );
}
