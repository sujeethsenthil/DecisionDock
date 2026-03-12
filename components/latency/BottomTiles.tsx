"use client";

import { C, zoneColor, zoneSurface } from "@/lib/constants";
import { fc, fmtMs, fmtLatencyExact } from "@/lib/format";
import { latencyCost, latencyMs, getThreshold } from "@/lib/models/latency";

interface Props {
  current: number;
  target: number;
  isUpgrade: boolean;
  tokens: any;
}

export function BottomTiles({ current, target, isUpgrade, tokens: T }: Props) {
  const color = zoneColor(target);
  const th = getThreshold(target);
  const dC = latencyCost(target) - latencyCost(current);
  const dMs = latencyMs(current) - latencyMs(target);
  const cpms = dMs > 0 ? dC / dMs : 0;
  const revThreshold = cpms > 0 ? cpms / 0.0007 : 0; // 100ms ≈ 7% conversion (Akamai)
  const g = T.gap;

  return (
    <div style={{ display: "flex", gap: g, alignItems: "stretch" }}>
      {/* What you'd need */}
      <div style={{ flex: "1 1 50%", background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", padding: T.botPad, minHeight: T.botMinH, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: T.botLFs, color: C.subtle, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>What you&apos;d need at {fmtLatencyExact(target)}</div>
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
            ? `At ${fmtMs(latencyMs(target))}, you're within acceptable thresholds. No investment needed unless latency directly drives conversion.`
            : target <= current + 2
              ? `Shaving ${fmtMs(dMs)} costs +${fc(dC)}/yr. Worth it if each millisecond drives >${fc(cpms)} in annual conversion impact.`
              : `Reaching ${fmtMs(latencyMs(target))} from ${fmtMs(latencyMs(current))} requires +${fc(dC)}/yr for ${fmtMs(dMs)} faster response. Only for sites where latency is the primary revenue driver.`}
        </div>
        {isUpgrade && cpms > 0 && (
          <div style={{ marginTop: 6, padding: T.roiPad, background: zoneSurface(target), borderRadius: 8, fontSize: T.roiFs, color: C.dark, lineHeight: 1.5 }}>
            <strong>Quick math:</strong> If your site generates more than <strong style={{ color }}>{fc(revThreshold)}/yr</strong> in revenue, this latency improvement pays for itself.
          </div>
        )}
      </div>
    </div>
  );
}
