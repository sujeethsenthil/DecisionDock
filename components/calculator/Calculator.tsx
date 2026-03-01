"use client";

import { useMemo, useState, useCallback } from "react";
import { DOMAINS } from "@/lib/models";
import type { DomainKey } from "@/lib/models";
import { generateCurveData } from "@/lib/engine";
import { CostCurveChart } from "./CostCurveChart";
import { ResultsPanel } from "./ResultsPanel";
import { DomainTabs } from "./DomainTabs";
import { AnimatedCounter } from "./AnimatedCounter";
import { InsightCards } from "./InsightCards";

const CHART_TITLES: Record<DomainKey, string> = {
  uptime: "Annual Cost of Uptime Targets",
  marketing: "Effective Cost vs. Ad Spend",
  coverage: "Cumulative Effort vs. Test Coverage",
  csat: "Annual Support Cost vs. CSAT",
};

export function Calculator() {
  const [activeDomain, setActiveDomain] = useState<DomainKey>("uptime");
  const config = DOMAINS[activeDomain];
  const defaultSlider = config.sliderConfig.default;
  const [sliderValue, setSliderValue] = useState(defaultSlider);

  const handleDomainChange = useCallback((newDomain: DomainKey) => {
    setActiveDomain(newDomain);
    setSliderValue(DOMAINS[newDomain].sliderConfig.default);
  }, []);

  const curveData = useMemo(() => generateCurveData(config), [config]);
  const displayCost = useMemo(
    () => (config.displayCostFn ?? config.costFn)(sliderValue),
    [config, sliderValue]
  );
  const secondaryMetric = useMemo(
    () => config.secondaryFn(sliderValue),
    [config, sliderValue]
  );

  const activeThresholds = useMemo(
    () =>
      config.thresholds.filter((t) =>
        t.direction === "above" ? sliderValue >= t.trigger : sliderValue <= t.trigger
      ),
    [config, sliderValue]
  );

  return (
    <div className="mt-12">
      <DomainTabs activeDomain={activeDomain} onDomainChange={handleDomainChange} />
      <section className="mt-8 flex flex-col gap-8 lg:mt-12 lg:flex-row lg:gap-8 max-[700px]:[&_.chart-col]:order-2 max-[700px]:[&_.results-col]:order-1">
        <div className="chart-col min-w-0 flex-1 lg:min-w-[65%]">
          <CostCurveChart
            data={curveData}
            config={config}
            sliderValue={sliderValue}
            chartTitle={CHART_TITLES[activeDomain]}
          />
        </div>
        <aside className="results-col flex shrink-0 flex-col lg:w-[35%] lg:max-w-[400px]">
          <div className="rounded-lg border border-[#D0D5DD] bg-white p-6 shadow-sm">
            <ResultsPanel
              config={config}
              sliderValue={sliderValue}
              onSliderChange={setSliderValue}
              displayCost={displayCost}
              secondaryLabel={config.secondaryLabel}
              secondaryValue={config.secondaryFormat(secondaryMetric)}
            />
          </div>
        </aside>
      </section>
      {activeThresholds.length > 0 && (
        <div className="mt-12">
          <InsightCards thresholds={activeThresholds} />
        </div>
      )}
    </div>
  );
}
