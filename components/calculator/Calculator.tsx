"use client";

import { useMemo, useState, useCallback } from "react";
import { DOMAINS } from "@/lib/models";
import type { DomainKey } from "@/lib/models";
import { generateCurveData } from "@/lib/engine";
import { CostCurveChart } from "./CostCurveChart";
import { ResultsPanel } from "./ResultsPanel";
import { DomainTabs } from "./DomainTabs";
import { InsightCards } from "./InsightCards";
import { Card } from "@/components/ui/card";

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

      <div className="mt-8 grid grid-cols-1 gap-8 md:mt-12 md:grid-cols-[65fr_35fr]">
        <div className="min-h-[400px] min-w-0">
          <CostCurveChart
            data={curveData}
            config={config}
            sliderValue={sliderValue}
            chartTitle={CHART_TITLES[activeDomain]}
          />
        </div>
        <div className="min-w-0">
          <Card className="p-6">
            <ResultsPanel
              config={config}
              sliderValue={sliderValue}
              onSliderChange={setSliderValue}
              displayCost={displayCost}
              secondaryLabel={config.secondaryLabel}
              secondaryValue={config.secondaryFormat(secondaryMetric)}
            />
          </Card>
        </div>
      </div>

      {/* BELOW grid, full width: aligned block for insight cards + methodology */}
      <section className="mt-12 w-full max-w-full" aria-label="Insights and methodology">
        {activeThresholds.length > 0 && (
          <div className="mb-6">
            <InsightCards thresholds={activeThresholds} />
          </div>
        )}
        <p className="text-[12px] leading-relaxed text-[#555555] max-w-[65ch] pl-4">
          {config.source}
        </p>
      </section>
    </div>
  );
}
