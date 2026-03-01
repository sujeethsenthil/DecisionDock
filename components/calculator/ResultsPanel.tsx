"use client";

import { Slider } from "@/components/ui/slider";
import type { DomainConfig } from "@/lib/models";

interface ResultsPanelProps {
  config: DomainConfig;
  sliderValue: number;
  onSliderChange: (value: number) => void;
  primaryLabel: string;
  primaryValue: string;
  secondaryLabel: string;
  secondaryValue: string;
}

export function ResultsPanel({
  config,
  sliderValue,
  onSliderChange,
  primaryLabel,
  primaryValue,
  secondaryLabel,
  secondaryValue,
}: ResultsPanelProps) {
  const { sliderConfig } = config;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-[#555555]">{primaryLabel}</p>
        <p
          className="font-mono text-3xl font-bold text-[#1B2A4A] lg:text-[3rem]"
          style={{ fontVariantNumeric: "tabular-nums" }}
          data-numeric
        >
          {primaryValue}
        </p>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-[#555555]">
          <span>{sliderConfig.format(sliderConfig.min)}</span>
          <span className="font-medium text-[#333333]">{sliderConfig.format(sliderValue)}</span>
          <span>{sliderConfig.format(sliderConfig.max)}</span>
        </div>
        <Slider
          value={[sliderValue]}
          min={sliderConfig.min}
          max={sliderConfig.max}
          step={sliderConfig.step}
          onValueChange={([v]) => onSliderChange(v)}
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
