"use client";

import { useState, useRef, useCallback } from "react";
import { HeroHeadline } from "@/components/hero/HeroHeadline";
import { Calculator } from "@/components/calculator/Calculator";
import { SplashScreen } from "@/components/onboarding/SplashScreen";
import { WelcomeModal } from "@/components/onboarding/WelcomeModal";
import { OnboardingOverlay, type TourStep } from "@/components/onboarding/OnboardingOverlay";

type Phase = "splash" | "welcome" | "tour" | "done";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("splash");
  const [tourStep, setTourStep] = useState<TourStep>(0);

  const chartRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const upgradeRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const refs = { chart: chartRef, slider: sliderRef, upgrade: upgradeRef, bottom: bottomRef };

  // Phase transitions
  const handleSplashComplete = useCallback(() => setPhase("welcome"), []);
  const handleStartTour = useCallback(() => { setPhase("tour"); setTourStep(0); }, []);
  const handleSkipAll = useCallback(() => { setPhase("done"); setTourStep("done"); }, []);

  // Tour navigation
  const handleTourNext = useCallback(() => {
    setTourStep((s) => {
      if (s === "done") return "done";
      const next = (s as number) + 1;
      if (next > 5) { setPhase("done"); return "done"; }
      return next as TourStep;
    });
  }, []);

  const handleTourSkip = useCallback(() => {
    setPhase("done");
    setTourStep("done");
  }, []);

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
      {phase === "splash" && <SplashScreen onComplete={handleSplashComplete} />}

      {/* Welcome modal */}
      {phase === "welcome" && <WelcomeModal onStartTour={handleStartTour} onSkip={handleSkipAll} />}

      {/* Main content — always rendered (for refs to work) */}
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "30px 48px 16px" }}>
        <HeroHeadline />
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
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1.1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.6"; e.currentTarget.style.transform = "scale(1)"; }}
        >
          ?
        </button>
      )}
    </main>
  );
}
