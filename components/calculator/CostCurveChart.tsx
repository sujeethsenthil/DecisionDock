"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, ReferenceLine,
  ReferenceArea, Tooltip, ResponsiveContainer,
} from "recharts";
import { C, zoneColor } from "@/lib/constants";
import { fc, fmtNines, fmtNinesExact } from "@/lib/format";

interface DataPoint { x: number; cost: number; }

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const pt = payload[0].payload as DataPoint;
  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", fontSize: 13 }}>
      <div style={{ fontWeight: 600, color: C.navy }}>{fmtNinesExact(pt.x)}</div>
      <div style={{ color: C.body, marginTop: 3, fontFamily: "'JetBrains Mono',monospace" }}>{fc(pt.cost)}/yr</div>
    </div>
  );
}

interface Props {
  data: DataPoint[];
  baseline: number;
  target: number;
  isUpgrade: boolean;
}

export function CostCurveChart({ data, baseline, target, isUpgrade }: Props) {
  const color = zoneColor(target);

  return (
    <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", overflow: "hidden", display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header bar */}
      <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Annual Total Cost of Ownership</span>
          <span style={{ fontSize: 12, color: C.subtle, marginLeft: 8 }}>by availability target</span>
        </div>
        <span style={{ fontSize: 10, color: C.subtle, fontStyle: "italic" }}>Mid-market SaaS benchmark</span>
      </div>

      {/* Chart */}
      <div style={{ padding: "4px 10px 0 4px", flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 16, left: 8, bottom: 30 }}>
            <defs>
              <linearGradient id="cost-gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={C.blue} stopOpacity={0.12} />
                <stop offset="45%" stopColor={C.amber} stopOpacity={0.18} />
                <stop offset="100%" stopColor={C.red} stopOpacity={0.28} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#EEF2F6" vertical={false} />
            <XAxis dataKey="x" type="number" domain={[2, 6]} ticks={[2, 3, 4, 5, 6]} tickFormatter={fmtNines} tick={{ fontSize: 11, fill: C.subtle }} axisLine={{ stroke: C.border }} tickLine={false} label={{ value: "Availability Target", position: "insideBottom", offset: -10, fill: C.subtle, fontSize: 11 }} />
            <YAxis tickFormatter={fc} tick={{ fontSize: 11, fill: C.subtle }} axisLine={false} tickLine={false} width={52} label={{ value: "Annual TCO", angle: -90, position: "insideLeft", offset: 4, fill: C.subtle, fontSize: 11 }} />
            <ReferenceArea x1={2} x2={3} fill={C.blue} fillOpacity={0.02} />
            <ReferenceArea x1={3} x2={4} fill={C.amber} fillOpacity={0.02} />
            <ReferenceArea x1={4} x2={6} fill={C.red} fillOpacity={0.02} />
            <ReferenceLine x={baseline} stroke={C.blue} strokeWidth={1.5} strokeDasharray="4 3" label={{ value: "Current", position: "top", fill: C.blue, fontSize: 10, fontWeight: 600 }} />
            {isUpgrade && <ReferenceLine x={target} stroke={color} strokeWidth={2} strokeDasharray="5 3" label={{ value: "Target", position: "top", fill: color, fontSize: 10, fontWeight: 600 }} />}
            {isUpgrade && <ReferenceArea x1={baseline} x2={target} fill={color} fillOpacity={0.05} />}
            <Area type="monotone" dataKey="cost" stroke={C.blue} strokeWidth={2.5} fill="url(#cost-gradient)" isAnimationActive animationDuration={350} animationEasing="ease-out" />
            <Tooltip content={<ChartTooltip />} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Source bar */}
      <div style={{ padding: "8px 20px 10px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 10, color: C.subtle }}>Sources: Google SRE Book, AWS pricing, industry SRE compensation benchmarks</span>
        <span style={{ fontSize: 10, color: C.subtle }}>The 10× multiplier between nines is consistent across service scales</span>
      </div>
    </div>
  );
}
