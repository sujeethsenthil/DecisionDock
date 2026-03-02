"use client";

import { useState } from "react";
import { C } from "@/lib/constants";
import { uptimeCost, uptimeDown, uptimeCurve } from "@/lib/models/uptime";
import { CostCurveChart } from "./CostCurveChart";
import { ControlPanel } from "./ControlPanel";
import { BottomLine } from "./BottomLine";
import { UpgradeCost } from "./UpgradeCost";

const BASELINE = 3;

export function Calculator() {
  const [target, setTarget] = useState(3);

  const baseCost = uptimeCost(BASELINE);
  const targetCost = uptimeCost(target);
  const deltaCost = targetCost - baseCost;
  const baseDown = uptimeDown(BASELINE);
  const targetDown = uptimeDown(target);
  const deltaDown = baseDown - targetDown;
  const costPerMin = deltaDown > 0 ? deltaCost / deltaDown : 0;
  const isUpgrade = target > BASELINE + 0.05;

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 3, padding: 4, background: C.white, borderRadius: 10, border: `1px solid ${C.border}`, width: "fit-content", margin: "0 auto 24px", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
        {["Uptime", "Marketing", "Coverage", "CSAT"].map((l, i) => (
          <button key={l} style={{
            padding: "7px 20px", fontSize: 13, fontWeight: i === 0 ? 600 : 400,
            borderRadius: 7, border: "none", cursor: i === 0 ? "default" : "not-allowed",
            background: i === 0 ? C.navy : "transparent", color: i === 0 ? C.white : C.subtle,
            opacity: i === 0 ? 1 : 0.5, transition: "all 0.15s",
          }} title={i > 0 ? "Coming soon" : ""}>
            {l}{i > 0 && <span style={{ fontSize: 10, marginLeft: 4, opacity: 0.6 }}>soon</span>}
          </button>
        ))}
      </div>

      {/* Top row: chart + control panel (fixed height, stretch) */}
      <div style={{ display: "flex", gap: 20, marginBottom: 20, alignItems: "stretch" }}>
        <div style={{ flex: "1 1 62%", minWidth: 480, minHeight: 440 }}>
          <CostCurveChart data={uptimeCurve} baseline={BASELINE} target={target} isUpgrade={isUpgrade} />
        </div>
        <div style={{ flex: "1 1 34%", minWidth: 300, minHeight: 440 }}>
          <ControlPanel target={target} onTargetChange={setTarget} baseCost={baseCost} targetCost={targetCost} baseDown={baseDown} targetDown={targetDown} />
        </div>
      </div>

      {/* Bottom row: bottom line + upgrade cost (fixed height, stretch) */}
      <div style={{ display: "flex", gap: 20, alignItems: "stretch" }}>
        <div style={{ flex: "1 1 calc(50% - 10px)", minHeight: 220 }}>
          <BottomLine target={target} isUpgrade={isUpgrade} deltaCost={deltaCost} deltaDown={deltaDown} costPerMin={costPerMin} />
        </div>
        <div style={{ flex: "1 1 calc(50% - 10px)", minHeight: 220 }}>
          <UpgradeCost target={target} isUpgrade={isUpgrade} deltaCost={deltaCost} deltaDown={deltaDown} costPerMin={costPerMin} />
        </div>
      </div>
    </div>
  );
}
