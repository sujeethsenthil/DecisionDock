"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ModuleTabs, PortfolioContextIcon } from "@/components/platform/ModuleTabs";
import { ModuleHero } from "@/components/platform/ModuleHero";
import { Calculator } from "@/components/capacity/Calculator";
import { OnboardingOverlay, type TourStep } from "@/components/onboarding/OnboardingOverlay";
import { TutorButton } from "@/components/onboarding/TutorButton";

const STORAGE_KEY = "dd_onboarding_capacity";

export default function CapacityClient() {
  const chartRef   = useRef<HTMLDivElement>(null);
  const sliderRef  = useRef<HTMLDivElement>(null);
  const upgradeRef = useRef<HTMLDivElement>(null);
  const bottomRef  = useRef<HTMLDivElement>(null);
  const refs = { chart: chartRef, slider: sliderRef, upgrade: upgradeRef, bottom: bottomRef };

  // idle = not started, tour = active, done = completed
  const [phase, setPhase] = useState<"idle" | "tour" | "done">("idle");
  const [tourStep, setTourStep] = useState<TourStep>(0);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) setPhase("done");
      // else stays "idle" — TutorButton glows, invites the tour
    } catch {}
  }, []);

  const markDone = useCallback(() => {
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch {}
  }, []);

  const startTour = useCallback(() => {
    setTourStep(0);
    setPhase("tour");
  }, []);

  const handleNext = useCallback(() => {
    setTourStep((s) => {
      if (s === "done") return "done";
      const next = (s as number) + 1;
      if (next >= 5) {
        setPhase("done");
        markDone();
        return "done";
      }
      return next as TourStep;
    });
  }, [markDone]);

  const handleSkip = useCallback(() => {
    setPhase("done");
    setTourStep("done");
    markDone();
  }, [markDone]);

  // Step 2 — chart click advances to step 3 (slider)
  const handleChartClick = useCallback(() => {
    if (phase === "tour") setTourStep((s) => (s === 2 ? 3 as TourStep : s));
  }, [phase]);

  // Step 3 — slider drag advances to step 4 (bottom tiles)
  const handleSliderDrag = useCallback(() => {
    if (phase === "tour") setTourStep((s) => (s === 3 ? 4 as TourStep : s));
  }, [phase]);

  return (
    <main style={{ minHeight: "100vh", background: "#F0F4F8", position: "relative" }}>

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "30px 48px 16px" }}>
        <ModuleHero headline="How much headroom do you actually need?" subtext="Click the chart to set your current buffer. Drag the slider to see what more capacity costs." />
        <ModuleTabs />
        <Calculator
          onChartClick={handleChartClick}
          onSliderDrag={handleSliderDrag}
          chartRef={chartRef}
          sliderRef={sliderRef}
          upgradeRef={upgradeRef}
          bottomRef={bottomRef}
        />
      </div>

      {phase === "tour" && (
        <OnboardingOverlay
          domain="capacity"
          step={tourStep}
          onNext={handleNext}
          onSkip={handleSkip}
          refs={refs}
        />
      )}

      <PortfolioContextIcon />
      <TutorButton onStartTour={startTour} toured={phase === "done"} />
    </main>
  );
}
