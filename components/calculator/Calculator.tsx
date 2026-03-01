"use client";

import { useMemo, useState } from "react";
import { DOMAINS } from "@/lib/models";
import type { DomainKey } from "@/lib/models";
import { generateCurveData } from "@/lib/engine";
import { formatCurrency } from "@/lib/format";
import { CostCurveChart } from "./CostCurveChart";
import { ResultsPanel } from "./ResultsPanel";

export function Calculator() {
  const [activeDomain, setActiveDomain] = useState<DomainKey>("uptime");
  const config = DOMAINS[activeDomain];
  const defaultSlider = config.sliderConfig.default;
  const [sliderValue, setSliderValue] = useState(defaultSlider);

  const curveData = useMemo(() => generateCurveData(config), [config]);
  const currentCost = useMemo(() => config.costFn(sliderValue), [config, sliderValue]);
  const secondaryMetric = useMemo(() => config.secondaryFn(sliderValue), [config, sliderValue]);

  return (
    <section className="mt-12 flex flex-col gap-8 lg:mt-16 lg:flex-row lg:gap-8">
      <div className="min-w-0 flex-1 lg:min-w-[65%]">
        <CostCurveChart
          data={curveData}
          config={config}
          sliderValue={sliderValue}
          chartTitle="Annual Cost of Uptime Targets"
        />
      </div>
      <aside className="flex shrink-0 flex-col lg:w-[35%] lg:max-w-[400px]">
        <div className="rounded-lg border border-[#D0D5DD] bg-white p-6 shadow-sm">
          <ResultsPanel
            config={config}
            sliderValue={sliderValue}
            onSliderChange={setSliderValue}
            primaryLabel="Estimated annual cost"
            primaryValue={formatCurrency(currentCost)}
            secondaryLabel={config.secondaryLabel}
            secondaryValue={config.secondaryFormat(secondaryMetric)}
          />
        </div>
      </aside>
    </section>
  );
}
