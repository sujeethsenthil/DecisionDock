"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DataPoint } from "@/lib/models/types";
import type { DomainConfig } from "@/lib/models";
import { formatCurrency } from "@/lib/format";
import { COLORS } from "@/lib/constants";

const CHART_HEIGHT = 400;
const GRADIENT_ID = "cost-curve-gradient";

interface CostCurveChartProps {
  data: DataPoint[];
  config: DomainConfig;
  sliderValue: number;
  chartTitle: string;
}

function getZoneColor(nines: number, zones: { value: number; caution: number }): string {
  if (nines < zones.value) return COLORS.blue;
  if (nines < zones.caution) return COLORS.amber;
  return COLORS.red;
}

export function CostCurveChart({
  data,
  config,
  sliderValue,
  chartTitle,
}: CostCurveChartProps) {
  const { zones, sliderConfig, yAxis, source } = config;
  const refLineColor = getZoneColor(sliderValue, zones);

  return (
    <div className="relative min-h-[280px] w-full bg-white lg:min-h-[400px]" style={{ height: CHART_HEIGHT }}>
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <AreaChart
          data={data}
          margin={{ top: 24, right: 24, left: 8, bottom: 48 }}
        >
          <defs>
            <linearGradient id={GRADIENT_ID} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={COLORS.blue} stopOpacity={0.3} />
              <stop offset="50%" stopColor={COLORS.amber} stopOpacity={0.4} />
              <stop offset="100%" stopColor={COLORS.red} stopOpacity={0.5} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.borderGray} vertical={false} />
          <XAxis
            dataKey="x"
            type="number"
            domain={[sliderConfig.min, sliderConfig.max]}
            tickFormatter={(v) => config.xAxis.format(v)}
            tick={{ fontSize: 12, fill: COLORS.medGray }}
            axisLine={{ stroke: COLORS.borderGray }}
            tickLine={false}
            label={{ value: config.xAxis.label, position: "insideBottom", offset: -8, fill: COLORS.medGray, fontSize: 12 }}
          />
          <YAxis
            type="number"
            tickFormatter={(v) => yAxis.format(v)}
            tick={{ fontSize: 12, fill: COLORS.medGray, fontVariantNumeric: "tabular-nums" }}
            axisLine={false}
            tickLine={false}
            width={48}
            label={{ value: yAxis.label, angle: -90, position: "insideLeft", fill: COLORS.medGray, fontSize: 12 }}
          />
          <ReferenceArea
            x1={sliderConfig.min}
            x2={zones.value}
            fill={COLORS.blue}
            fillOpacity={0.05}
          />
          <ReferenceArea
            x1={zones.value}
            x2={zones.caution}
            fill={COLORS.amber}
            fillOpacity={0.05}
          />
          <ReferenceArea
            x1={zones.caution}
            x2={sliderConfig.max}
            fill={COLORS.red}
            fillOpacity={0.05}
          />
          <Area
            type="monotone"
            dataKey="cost"
            stroke={COLORS.blue}
            strokeWidth={2}
            fill={`url(#${GRADIENT_ID})`}
            isAnimationActive
            animationDuration={300}
            animationEasing="ease-out"
          />
          <ReferenceLine
            x={sliderValue}
            stroke={refLineColor}
            strokeWidth={2}
            strokeDasharray="4 4"
            label={{
              value: sliderConfig.format(sliderValue),
              position: "top",
              fill: refLineColor,
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "var(--font-jetbrains-mono), monospace",
            }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const point = payload[0].payload as DataPoint;
              const marginal = config.marginalCostFn(point.x);
              return (
                <div className="rounded-lg border border-[#D0D5DD] bg-white p-3 shadow-md">
                  <div className="text-sm text-[#333333]">
                    <span className="font-medium">{config.xAxis.format(point.x)}</span>
                  </div>
                  <div className="mt-1 font-mono text-sm text-[#1B2A4A]">
                    {formatCurrency(point.cost)} / year
                  </div>
                  <div className="mt-0.5 text-xs text-[#555555]">
                    Marginal: {formatCurrency(marginal)}
                  </div>
                </div>
              );
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
      {/* Chart title and source inside chart boundary (screenshot-ready) */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6 pb-14">
        <h2 className="text-base font-bold text-[#1B2A4A]">{chartTitle}</h2>
        <p className="text-right text-xs text-[#555555] max-w-[70%] ml-auto">{source}</p>
      </div>
    </div>
  );
}
