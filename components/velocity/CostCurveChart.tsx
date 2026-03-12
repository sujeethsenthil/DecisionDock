"use client";

import { useRef } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, ReferenceLine,
  ReferenceArea, Tooltip, ResponsiveContainer,
} from "recharts";
import { C, zoneColor } from "@/lib/constants";
import { fc, fmtVelocityTick, fmtDeploys, fmtCfr } from "@/lib/format";
import { velocityCost, deploysPerDay, changeFailRate } from "@/lib/models/velocity";
import { TrackingLabel } from "@/components/shared/TrackingLabel";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const pt = payload[0].payload;
  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", fontSize: 13 }}>
      <div style={{ fontWeight: 600, color: C.navy }}>{fmtDeploys(deploysPerDay(pt.x))}</div>
      <div style={{ color: C.body, marginTop: 3, fontFamily: "'JetBrains Mono',monospace" }}>{fc(pt.cost)}/yr</div>
    </div>
  );
}

interface Props {
  data: { x: number; cost: number }[];
  current: number;
  target: number;
  isUpgrade: boolean;
  onSetCurrent: (level: number) => void;
  tokens: any;
}

export function CostCurveChart({ data, current, target, isUpgrade, onSetCurrent, tokens: T }: Props) {
  const color = zoneColor(target);
  const chartRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    const container = chartRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const plotLeft = T.chartMarginL;
    const plotRight = rect.width - T.chartMarginR;
    const plotWidth = plotRight - plotLeft;
    if (x < plotLeft || x > plotRight) return;
    const ratio = (x - plotLeft) / plotWidth;
    const level = 2 + ratio * 4;
    onSetCurrent(level);
  };

  const bC = velocityCost(current);
  const bD = deploysPerDay(current);
  const bCfr = changeFailRate(current);
  const tC = velocityCost(target);
  const tD = deploysPerDay(target);
  const tCfr = changeFailRate(target);

  return (
    <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: T.chartMinH }}>
      <div style={{ padding: `10px ${T.gap + 6}px`, borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontSize: T.chartTFs, fontWeight: 700, color: C.navy }}>What deployment speed actually costs</span>
          <span style={{ fontSize: T.chartSFs, color: C.subtle, marginLeft: 8 }}>platform investment by release frequency</span>
        </div>
        <span style={{ fontSize: T.srcFs, color: C.subtle, fontStyle: "italic" }}>DORA elite benchmark</span>
      </div>
      <div ref={chartRef} onClick={handleClick} style={{ flex: 1, padding: "4px 8px 0 0", minHeight: 0, position: "relative", cursor: "crosshair" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 24, right: 20, left: 12, bottom: 28 }}>
            <defs>
              <linearGradient id="vg" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={C.blue} stopOpacity={0.12} />
                <stop offset="40%" stopColor={C.amber} stopOpacity={0.18} />
                <stop offset="100%" stopColor={C.red} stopOpacity={0.28} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#EEF2F6" vertical={false} />
            <XAxis dataKey="x" type="number" domain={[2, 6]} ticks={[2, 3, 4, 5, 6]} tickFormatter={fmtVelocityTick} tick={{ fontSize: 11, fill: C.subtle }} axisLine={{ stroke: C.border }} tickLine={false} label={{ value: "Release Frequency", position: "insideBottom", offset: -8, fill: C.subtle, fontSize: 11 }} />
            <YAxis tickFormatter={fc} tick={{ fontSize: 11, fill: C.subtle }} axisLine={false} tickLine={false} width={54} label={{ value: "Annual Platform Cost", angle: -90, position: "insideLeft", offset: 4, fill: C.subtle, fontSize: 11 }} />
            <ReferenceArea x1={2} x2={3} fill={C.blue} fillOpacity={0.015} />
            <ReferenceArea x1={3} x2={4} fill={C.amber} fillOpacity={0.015} />
            <ReferenceArea x1={4} x2={6} fill={C.red} fillOpacity={0.015} />
            <ReferenceLine x={current} stroke={C.blue} strokeWidth={1.5} strokeDasharray="4 3" />
            {isUpgrade && <ReferenceLine x={target} stroke={color} strokeWidth={2} strokeDasharray="5 3" />}
            {isUpgrade && <ReferenceArea x1={current} x2={target} fill={color} fillOpacity={0.05} />}
            <Area type="monotone" dataKey="cost" stroke={C.blue} strokeWidth={2.5} fill="url(#vg)" isAnimationActive animationDuration={350} animationEasing="ease-out" />
            <Tooltip content={<ChartTooltip />} />
          </AreaChart>
        </ResponsiveContainer>

        <TrackingLabel nines={current} color={C.blue} marginL={T.chartMarginL} marginR={T.chartMarginR}>
          <div style={{ fontSize: 9, color: C.blue, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Your velocity · {fmtDeploys(bD)}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, fontFamily: "'JetBrains Mono',monospace", marginTop: 1 }}>{fc(bC)}<span style={{ fontSize: 9, fontWeight: 400, color: C.subtle }}>/yr</span></div>
          <div style={{ fontSize: 9, color: C.subtle }}>{fmtCfr(bCfr)} change failure rate</div>
        </TrackingLabel>

        {isUpgrade && (
          <TrackingLabel nines={target} color={color} marginL={T.chartMarginL} marginR={T.chartMarginR}>
            <div style={{ fontSize: 9, color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Considering · {fmtDeploys(tD)}</div>
            <div style={{ marginTop: 1 }}><AnimatedCounter value={tC} color={color} size={13} /><span style={{ fontSize: 9, fontWeight: 400, color: C.subtle }}>/yr</span></div>
            <div style={{ fontSize: 9, color: C.subtle }}>{fmtCfr(tCfr)} change failure rate</div>
          </TrackingLabel>
        )}
      </div>
      <div style={{ padding: `5px ${T.gap + 6}px 6px`, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
        <span style={{ fontSize: T.srcFs, color: C.subtle }}>Click the chart to set where you are today · Sources: DORA/Accelerate, Forsgren et al.</span>
        <span style={{ fontSize: T.srcFs, color: C.subtle }}>Elite teams ship 208× more often</span>
      </div>
    </div>
  );
}
