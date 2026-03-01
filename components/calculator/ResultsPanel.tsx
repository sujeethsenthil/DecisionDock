"use client";

import { useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import type { DomainConfig } from "@/lib/models";
import { AnimatedCounter } from "./AnimatedCounter";

interface ResultsPanelProps {
  config: DomainConfig;
  sliderValue: number;
  onSliderChange: (value: number) => void;
  displayCost: number;
  secondaryLabel: string;
  secondaryValue: string;
}

function logScalePosition(value: number, min: number, max: number): number {
  if (value <= min) return 0;
  return (100 * Math.log(value / min)) / Math.log(max / min);
}

function logScaleValue(position: number, min: number, max: number): number {
  if (position <= 0) return min;
  return min * Math.pow(max / min, position / 100);
}

export function ResultsPanel({
  config,
  sliderValue,
  onSliderChange,
  displayCost,
  secondaryLabel,
  secondaryValue,
}: ResultsPanelProps) {
  const { sliderConfig } = config;
  const isLogScale = config.key === "marketing";

  const sliderProps = useMemo(() => {
    if (isLogScale) {
      const min = sliderConfig.min;
      const max = sliderConfig.max;
      const position = logScalePosition(sliderValue, min, max);
      return {
        value: [position] as [number],
        min: 0,
        max: 100,
        step: 0.5,
        onValueChange: ([p]: number[]) =>
          onSliderChange(Math.round(logScaleValue(p, min, max) / 1000) * 1000),
      };
    }
    return {
      value: [sliderValue] as [number],
      min: sliderConfig.min,
      max: sliderConfig.max,
      step: sliderConfig.step,
      onValueChange: ([v]: number[]) => onSliderChange(v),
    };
  }, [isLogScale, sliderConfig, sliderValue, onSliderChange]);

  return (
    <div className="flex flex-col gap-6">
      <div aria-live="polite" aria-atomic="true">
        <p className="text-sm text-[#555555]">Estimated annual cost</p>
        <p className="font-mono text-3xl font-bold text-[#1B2A4A] lg:text-[3rem]">
          <AnimatedCounter value={displayCost} />
        </p>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-[#555555]">
          <span>{sliderConfig.format(sliderConfig.min)}</span>
          <span className="font-medium text-[#333333]">
            {sliderConfig.format(sliderValue)}
          </span>
          <span>{sliderConfig.format(sliderConfig.max)}</span>
        </div>
        <Slider
          {...sliderProps}
          aria-label={`Set target ${config.label.toLowerCase()}`}
        />
      </div>
      <div>
        <p className="text-sm text-[#555555]">{secondaryLabel}</p>
        <p
          className="font-mono text-2xl font-bold text-[#333333]"
          style={{ fontVariantNumeric: "tabular-nums" }}
          data-numeric
        >
          {secondaryValue}
        </p>
      </div>
    </div>
  );
}
