"use client";

import {
  Area, AreaChart, CartesianGrid, ReferenceLine, ReferenceArea,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import type { DataPoint, DomainConfig } from "@/lib/models";
import { COLORS, getZoneColor } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";

interface CostCurveChartProps {
  data: DataPoint[];
  config: DomainConfig;
  sliderValue: number;
}

function ChartTooltip({ active, payload, config }: {
  active?: boolean;
  payload?: Array<{ payload: DataPoint }>;
  config: DomainConfig;
}) {
  if (!active || !payload?.length) return null;
  const pt = payload[0].payload;
  const marginal = config.marginalFn(pt.x);

  return (
    <div
      style={{
        background: COLORS.white,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 8,
        padding: "10px 14px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.navy }}>
        {config.xFmt(pt.x)}
      </div>
      <div
        style={{
          fontSize: 13, color: COLORS.dark, marginTop: 2,
          fontFamily: "var(--font-jetbrains), monospace",
        }}
      >
        {formatCurrency(pt.cost)} / year
      </div>
      <div style={{ fontSize: 11, color: COLORS.med, marginTop: 2 }}>
        Marginal: {formatCurrency(marginal)}
      </div>
    </div>
  );
}

export function CostCurveChart({ data, config, sliderValue }: CostCurveChartProps) {
  const { zones, slider: sliderConfig } = config;
  const refColor = getZoneColor(sliderValue, zones);

  return (
    <div
      className="relative w-full"
      style={{
        background: COLORS.white,
        borderRadius: 16,
        border: `1px solid ${COLORS.border}`,
        padding: "24px 16px 16px 8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      {/* Internal chart title (screenshot-readiness) */}
      <div className="absolute left-6 top-4 z-10">
        <span style={{ fontSize: 15, fontWeight: 700, color: COLORS.navy }}>
          {config.chartTitle}
        </span>
      </div>

      <ResponsiveContainer width="100%" height={420}>
        <AreaChart data={data} margin={{ top: 40, right: 20, left: 12, bottom: 40 }}>
          <defs>
            <linearGradient id="cost-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={COLORS.blue} stopOpacity={0.2} />
              <stop offset="45%" stopColor={COLORS.amber} stopOpacity={0.25} />
              <stop offset="100%" stopColor={COLORS.red} stopOpacity={0.35} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF1" vertical={false} />

          <XAxis
            dataKey="x"
            type="number"
            domain={[sliderConfig.min, sliderConfig.max]}
            ticks={config.ticks}
            tickFormatter={config.xFmt}
            tick={{ fontSize: 12, fill: COLORS.med }}
            axisLine={{ stroke: COLORS.border }}
            tickLine={false}
            label={{
              value: config.xLabel, position: "insideBottom", offset: -12,
              fill: COLORS.med, fontSize: 12,
            }}
          />

          <YAxis
            tickFormatter={config.yFmt}
            tick={{ fontSize: 12, fill: COLORS.med }}
            axisLine={false}
            tickLine={false}
            width={56}
            label={{
              value: config.yLabel, angle: -90, position: "insideLeft", offset: 8,
              fill: COLORS.med, fontSize: 12,
            }}
          />

          {/* Zone shading (very subtle) */}
          <ReferenceArea
            x1={sliderConfig.min} x2={zones.value}
            fill={COLORS.blue} fillOpacity={0.03}
          />
          <ReferenceArea
            x1={zones.value} x2={zones.caution}
            fill={COLORS.amber} fillOpacity={0.03}
          />
          <ReferenceArea
            x1={zones.caution} x2={sliderConfig.max}
            fill={COLORS.red} fillOpacity={0.03}
          />

          <Area
            type="monotone"
            dataKey="cost"
            stroke={COLORS.blue}
            strokeWidth={2.5}
            fill="url(#cost-gradient)"
            isAnimationActive
            animationDuration={400}
            animationEasing="ease-out"
          />

          <ReferenceLine
            x={sliderValue}
            stroke={refColor}
            strokeWidth={2}
            strokeDasharray="6 4"
            label={{
              value: sliderConfig.format(sliderValue),
              position: "top",
              fill: refColor,
              fontSize: 14,
              fontWeight: 700,
            }}
          />

          <Tooltip
            content={(props: any) => <ChartTooltip {...props} config={config} />}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Internal source attribution (screenshot-readiness) */}
      <div className="absolute bottom-3 right-5 z-10">
        <span style={{ fontSize: 11, color: COLORS.med }}>{config.source}</span>
      </div>
    </div>
  );
}
