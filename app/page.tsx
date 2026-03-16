"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ModuleTabs } from "@/components/platform/ModuleTabs";
import { ModuleHero } from "@/components/platform/ModuleHero";
import { Calculator } from "@/components/uptime/Calculator";
import dynamic from "next/dynamic";
const SplashScreen = dynamic(() => import("@/components/onboarding/SplashScreen").then(m => ({ default: m.SplashScreen })), { ssr: false });
const WelcomeModal = dynamic(() => import("@/components/onboarding/WelcomeModal").then(m => ({ default: m.WelcomeModal })), { ssr: false });
const OnboardingOverlay = dynamic(() => import("@/components/onboarding/OnboardingOverlay").then(m => ({ default: m.OnboardingOverlay })), { ssr: false });
import type { TourStep } from "@/components/onboarding/OnboardingOverlay";

const ONBOARDING_KEY = "dd_uptime_onboarding_done";

type Phase = "splash" | "welcome" | "tour" | "done";

export default function UptimePage() {
  // Start as "splash" on server and first paint — resolve after mount
  // to avoid synchronous localStorage read blocking the render.
  const [phase, setPhase] = useState<Phase>("splash");

  useEffect(() => {
    try {
      if (localStorage.getItem(ONBOARDING_KEY)) setPhase("done");
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [tourStep, setTourStep] = useState<TourStep>(0);

  const chartRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const upgradeRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const refs = { chart: chartRef, slider: sliderRef, upgrade: upgradeRef, bottom: bottomRef };

  // Persist completion
  const markDone = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, "true");
  }, []);

  // Phase transitions
  const handleStartTour = useCallback(() => {
    setPhase("tour");
    setTourStep(0);
  }, []);

  const handleSkipAll = useCallback(() => {
    setPhase("done");
    setTourStep("done");
    markDone();
  }, [markDone]);

  // Tour navigation
  const handleTourNext = useCallback(() => {
    setTourStep((s) => {
      if (s === "done") return "done";
      const next = (s as number) + 1;
      if (next > 5) {
        setPhase("done");
        markDone();
        return "done";
      }
      return next as TourStep;
    });
  }, [markDone]);

  const handleTourSkip = useCallback(() => {
    setPhase("done");
    setTourStep("done");
    markDone();
  }, [markDone]);

  // Interactive step advances
  const handleChartClick = useCallback(() => {
    if (phase === "tour") setTourStep((s) => (s === 2 ? 3 : s));
  }, [phase]);

  const handleSliderDrag = useCallback(() => {
    if (phase === "tour") setTourStep((s) => (s === 3 ? 4 : s));
  }, [phase]);

  // Replay
  const handleReplay = useCallback(() => {
    setPhase("tour");
    setTourStep(0);
  }, []);

  return (
    <main style={{ minHeight: "100vh", background: "#F0F4F8", position: "relative" }}>
      {/* Splash screen */}
      {phase === "splash" && (
        <SplashScreen onComplete={() => setPhase("welcome")} />
      )}

      {/* Welcome modal */}
      {phase === "welcome" && (
        <WelcomeModal onStartTour={handleStartTour} onSkip={handleSkipAll} />
      )}

      {/* Main content — always rendered (for refs to work) */}
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "30px 48px 16px" }}>
        <ModuleHero
          headline="Should you invest in the next nine?"
          subtext="Click the chart to set where you are today. Drag the slider to see what the next level costs."
        />
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

      {/* Tour overlay */}
      {phase === "tour" && (
        <OnboardingOverlay
          step={tourStep}
          onNext={handleTourNext}
          onSkip={handleTourSkip}
          refs={refs}
        />
      )}

      {/* Replay button */}
      {phase === "done" && (
        <button
          onClick={handleReplay}
          title="Replay tour"
          style={{
            position: "fixed", bottom: 20, right: 20,
            width: 40, height: 40, borderRadius: "50%",
            background: "#0F172A", color: "white", border: "none",
            fontSize: 18, cursor: "pointer",
            boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.15s", zIndex: 100, opacity: 0.6,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "0.6";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          ?
        </button>
      )}
    </main>
  );
}
