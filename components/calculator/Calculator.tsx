"use client";

import { useState, useMemo, useCallback } from "react";
import { DOMAINS } from "@/lib/models";
import type { DomainKey } from "@/lib/models";
import { generateCurveData } from "@/lib/engine";
import { COLORS } from "@/lib/constants";
import { CostCurveChart } from "./CostCurveChart";
import { ResultsPanel } from "./ResultsPanel";
import { DomainTabs } from "./DomainTabs";
import { InsightCards } from "./InsightCards";

export function Calculator() {
  // ─── Two state values. That's it. ───
  const [domain, setDomain] = useState<DomainKey>("uptime");
  const [slider, setSlider] = useState<number>(DOMAINS.uptime.slider.default);

  const config = DOMAINS[domain];

  // Atomic tab switch — both states update in one handler, no useEffect
  const handleDomainChange = useCallback((newDomain: DomainKey) => {
    setDomain(newDomain);
    setSlider(DOMAINS[newDomain].slider.default);
  }, []);

  // ─── All derived data via useMemo ───
  const curveData = useMemo(() => generateCurveData(config), [config]);

  const displayCost = useMemo(
    () => config.displayFn(slider),
    [config, slider]
  );

  const secondary = useMemo(
    () => config.secondaryFn(slider),
    [config, slider]
  );

  const marginalCost = useMemo(
    () => config.marginalFn(slider),
    [config, slider]
  );

  const activeThresholds = useMemo(
    () =>
      config.thresholds.filter((t) =>
        t.dir === "above" ? slider >= t.trigger : slider <= t.trigger
      ),
    [config, slider]
  );

  const decisionSummary = useMemo(
    () => config.decisionSummaryFn(slider, config),
    [config, slider]
  );

  return (
    <div>
      {/* Tabs */}
      <DomainTabs activeDomain={domain} onDomainChange={handleDomainChange} />

      {/* Problem framing — answers "why does this matter to me?" */}
      <p
        style={{
          textAlign: "center",
          color: COLORS.med,
          fontSize: 15,
          marginTop: 16,
          marginBottom: 32,
          maxWidth: 600,
          marginLeft: "auto",
          marginRight: "auto",
          lineHeight: 1.5,
        }}
      >
        {config.framing}
      </p>

      {/* Two-column layout: chart left, results right */}
      <div
        style={{
          display: "flex",
          gap: 32,
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {/* LEFT: Chart (62%) */}
        <div style={{ flex: "1 1 62%", minWidth: 500 }}>
          <CostCurveChart
            data={curveData}
            config={config}
            sliderValue={slider}
          />
        </div>

        {/* RIGHT: Results panel (30%) */}
        <div style={{ flex: "1 1 30%", minWidth: 280 }}>
          <ResultsPanel
            config={config}
            sliderValue={slider}
            onSliderChange={setSlider}
            displayCost={displayCost}
            secondaryValue={config.secondaryFmt(secondary)}
            marginalCost={marginalCost}
            decisionSummary={decisionSummary}
          />
        </div>
      </div>

      {/* Threshold annotations (below grid, full width) */}
      {activeThresholds.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <InsightCards thresholds={activeThresholds} />
        </div>
      )}
    </div>
  );
}
