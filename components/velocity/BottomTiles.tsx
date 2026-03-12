"use client";

import { C, zoneColor, zoneSurface } from "@/lib/constants";
import { fc, fmtDeploys, fmtCfr, fmtVelocityExact } from "@/lib/format";
import { velocityCost, deploysPerDay, changeFailRate, getThreshold } from "@/lib/models/velocity";

interface Props {
  current: number;
  target: number;
  isUpgrade: boolean;
  tokens: any;
}

export function BottomTiles({ current, target, isUpgrade, tokens: T }: Props) {
  const color = zoneColor(target);
  const th = getThreshold(target);
  const dC = velocityCost(target) - velocityCost(current);
  const bCfr = changeFailRate(current);
  const tCfr = changeFailRate(target);
  const dCfr = bCfr - tCfr;
  const cppt = dCfr > 0 ? dC / dCfr : 0;
  const g = T.gap;

  return (
    <div style={{ display: "flex", gap: g, alignItems: "stretch" }}>
      {/* What you'd need */}
      <div style={{ flex: "1 1 50%", background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", padding: T.botPad, minHeight: T.botMinH, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: T.botLFs, color: C.subtle, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>What you&apos;d need at {fmtVelocityExact(target)}</div>
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
            ? `At ${fmtDeploys(deploysPerDay(target))}, you're in a solid cadence. No additional CI/CD investment needed unless failure rate is impacting customers.`
            : target <= current + 2
              ? `Scaling to ${fmtDeploys(deploysPerDay(target))} costs +${fc(dC)}/yr and drops failure rate by ${dCfr.toFixed(1)} points. Worth it if each point costs your team >${fc(cppt)}/yr.`
              : `Reaching ${fmtDeploys(deploysPerDay(target))} from ${fmtDeploys(deploysPerDay(current))} requires +${fc(dC)}/yr. Failure rate drops from ${fmtCfr(bCfr)} to ${fmtCfr(tCfr)}. Only if incident costs exceed ${fc(cppt)}/point/yr.`}
        </div>
        {isUpgrade && cppt > 0 && (
          <div style={{ marginTop: 6, padding: T.roiPad, background: zoneSurface(target), borderRadius: 8, fontSize: T.roiFs, color: C.dark, lineHeight: 1.5 }}>
            <strong>Quick math:</strong> If each point of failure rate costs your team more than <strong style={{ color }}>{fc(cppt)}/yr</strong> in incidents, this pays for itself.
          </div>
        )}
      </div>
    </div>
  );
}
