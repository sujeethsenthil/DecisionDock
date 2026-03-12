"use client";

import { useState, useRef, useCallback } from "react";
import { ModuleTabs } from "@/components/platform/ModuleTabs";
import { ModuleHero } from "@/components/platform/ModuleHero";
import { Calculator } from "@/components/capacity/Calculator";

export default function CapacityPage() {
  const chartRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const upgradeRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  return (
    <main style={{ minHeight: "100vh", background: "#F0F4F8", position: "relative" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "30px 48px 16px" }}>
        <ModuleHero
          headline="How much headroom do you actually need?"
          subtext="Click the chart to set your current buffer. Drag the slider to see what more capacity costs."
        />
        <ModuleTabs />
        <Calculator
          chartRef={chartRef}
          sliderRef={sliderRef}
          upgradeRef={upgradeRef}
          bottomRef={bottomRef}
        />
      </div>
    </main>
  );
}
