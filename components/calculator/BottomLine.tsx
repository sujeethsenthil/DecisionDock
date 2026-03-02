"use client";

import { C, zoneColor, zoneSurface } from "@/lib/constants";
import { fc, fmtNinesExact, fmtDur } from "@/lib/format";

interface Props {
  target: number;
  isUpgrade: boolean;
  deltaCost: number;
  deltaDown: number;
  costPerMin: number;
}

export function BottomLine({ target, isUpgrade, deltaCost, deltaDown, costPerMin }: Props) {
  const color = zoneColor(target);
  const surface = zoneSurface(target);

  return (
    <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", padding: "24px 28px", minHeight: 220, display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color, marginBottom: 10 }}>The bottom line</div>
      <div style={{ fontSize: 14, color: C.body, lineHeight: 1.6, flex: 1 }}>
        {!isUpgrade
          ? `At ${fmtNinesExact(target)}, you're in a cost-effective range. No additional investment needed unless your SLA requires more.`
          : target <= 4
            ? `Upgrading to ${fmtNinesExact(target)} costs +${fc(deltaCost)}/yr to eliminate ${fmtDur(deltaDown)} of annual downtime. Worth it if your revenue-per-minute exceeds ${fc(costPerMin)}.`
            : `Reaching ${fmtNinesExact(target)} requires +${fc(deltaCost)}/yr for ${fmtDur(deltaDown)} less downtime. Only justified for critical services where each minute costs >${fc(costPerMin)}.`}
      </div>
      {isUpgrade && costPerMin > 0 && (
        <div style={{ marginTop: 14, padding: "12px 14px", background: surface, borderRadius: 10, fontSize: 13, color: C.dark, lineHeight: 1.5 }}>
          <strong>ROI check:</strong> Does your service generate more than <strong style={{ color }}>{fc(costPerMin * 60)}/hr</strong>? If yes, this upgrade pays for itself.
        </div>
      )}
    </div>
  );
}
