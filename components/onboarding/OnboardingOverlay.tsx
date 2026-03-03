"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { C } from "@/lib/constants";

export type TourStep = 0 | 1 | 2 | 3 | 4 | 5 | "done";

interface StepConfig {
  title: string;
  body: string;
  target: string;
  position: "top" | "bottom" | "left" | "right";
  action: "next" | "click-chart" | "drag-slider" | "finish";
  buttonLabel: string;
}

const STEPS: StepConfig[] = [
  {
    title: "Your reliability bill follows a pattern",
    body: "Every engineering team faces this curve. Uptime costs stay manageable at first — then they explode. Understanding where that happens is the difference between a smart investment and a wasted one.",
    target: "chart",
    position: "right",
    action: "next",
    buttonLabel: "Tell me more",
  },
  {
    title: "The 10× trap most teams fall into",
    body: "Going from 99.9% to 99.99% uptime doesn't cost a little more — it costs roughly 10× more. And the next nine after that? Another 10×. Most teams don't see this until the budget is already blown.",
    target: "chart",
    position: "right",
    action: "next",
    buttonLabel: "How do I use this?",
  },
  {
    title: "Where is your service today?",
    body: "Click anywhere on the chart to mark your current reliability level. This becomes your starting point — everything else is calculated relative to where you are now.",
    target: "chart",
    position: "right",
    action: "click-chart",
    buttonLabel: "",
  },
  {
    title: "Where are you being asked to go?",
    body: "Your VP wants five nines. Your PM wants less downtime. Drag this slider to whatever target your team is considering — and watch the cost unfold.",
    target: "slider",
    position: "left",
    action: "drag-slider",
    buttonLabel: "",
  },
  {
    title: "Here's what that move actually costs",
    body: "The additional spend, the downtime you'd eliminate, and the price of each minute of uptime gained. This is the number you bring to the budget conversation.",
    target: "upgrade",
    position: "left",
    action: "next",
    buttonLabel: "What else?",
  },
  {
    title: "Your decision, quantified",
    body: "What infrastructure you'd need to build, how many SREs to hire, and a simple ROI check: does your service generate enough revenue per hour to justify this? If yes, invest. If no, push back with data.",
    target: "bottom",
    position: "top",
    action: "finish",
    buttonLabel: "Start exploring",
  },
];

interface Props {
  step: TourStep;
  onNext: () => void;
  onSkip: () => void;
  refs: Record<string, React.RefObject<HTMLDivElement>>;
}

export function OnboardingOverlay({ step, onNext, onSkip, refs }: Props) {
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);

  const updateSpotlight = useCallback(() => {
    if (step === "done") return;
    const config = STEPS[step as number];
    if (!config) return;
    const ref = refs[config.target];
    if (ref?.current) {
      setSpotlightRect(ref.current.getBoundingClientRect());
    }
  }, [step, refs]);

  useEffect(() => {
    updateSpotlight();
    window.addEventListener("resize", updateSpotlight);
    window.addEventListener("scroll", updateSpotlight);
    const t1 = setTimeout(updateSpotlight, 50);
    const t2 = setTimeout(updateSpotlight, 200);
    return () => {
      window.removeEventListener("resize", updateSpotlight);
      window.removeEventListener("scroll", updateSpotlight);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [updateSpotlight]);

  if (step === "done") return null;

  const config = STEPS[step as number];
  if (!config || !spotlightRect) return null;

  const pad = 14;
  const sx = spotlightRect.left - pad;
  const sy = spotlightRect.top - pad;
  const sw = spotlightRect.width + pad * 2;
  const sh = spotlightRect.height + pad * 2;
  const sr = 20;

  const getTooltipStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: "fixed",
      zIndex: 10002,
      maxWidth: 360,
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    };
    switch (config.position) {
      case "right": return { ...base, left: Math.min(sx + sw + 24, window.innerWidth - 400), top: sy + sh / 2, transform: "translateY(-50%)" };
      case "left": return { ...base, right: Math.min(window.innerWidth - sx + 24, window.innerWidth - 40), top: sy + sh / 2, transform: "translateY(-50%)" };
      case "top": return { ...base, left: sx + sw / 2, bottom: window.innerHeight - sy + 24, transform: "translateX(-50%)" };
      case "bottom": return { ...base, left: sx + sw / 2, top: sy + sh + 24, transform: "translateX(-50%)" };
      default: return base;
    }
  };

  const isInteractive = config.action === "click-chart" || config.action === "drag-slider";

  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 10000, pointerEvents: isInteractive ? "none" : "auto" }}>
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          <defs>
            <mask id="spotlight-mask">
              <rect width="100%" height="100%" fill="white" />
              <rect x={sx} y={sy} width={sw} height={sh} rx={sr} ry={sr} fill="black"
                style={{ transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }} />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="rgba(15, 23, 42, 0.55)" mask="url(#spotlight-mask)" />
          <rect x={sx} y={sy} width={sw} height={sh} rx={sr} ry={sr}
            fill="none" stroke="rgba(59, 130, 246, 0.25)" strokeWidth={2}
            style={{ transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }} />
        </svg>
      </div>

      <div style={getTooltipStyle()}>
        <div style={{
          background: C.white, borderRadius: 18, padding: "28px 32px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.06)",
          border: `1px solid ${C.border}`, pointerEvents: "auto",
        }}>
          {/* Progress dots */}
          <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{
                width: i === (step as number) ? 28 : 8, height: 8, borderRadius: 4,
                background: i === (step as number) ? C.blue : i < (step as number) ? C.navy : C.border,
                transition: "all 0.3s ease",
              }} />
            ))}
          </div>

          <div style={{ fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 10, lineHeight: 1.3 }}>
            {config.title}
          </div>
          <div style={{ fontSize: 14, color: C.body, lineHeight: 1.65, marginBottom: 22 }}>
            {config.body}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={onSkip}
              style={{ background: "none", border: "none", color: C.subtle, fontSize: 13, cursor: "pointer", padding: "4px 0", transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.med)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.subtle)}>
              Skip tour
            </button>

            {config.buttonLabel ? (
              <button onClick={onNext}
                style={{
                  background: C.navy, color: C.white, border: "none", borderRadius: 10,
                  padding: "11px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer",
                  transition: "all 0.15s", boxShadow: "0 2px 8px rgba(15,23,42,0.2)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = C.dark)}
                onMouseLeave={(e) => (e.currentTarget.style.background = C.navy)}>
                {config.buttonLabel}
              </button>
            ) : (
              <div style={{ fontSize: 13, color: C.blue, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{
                  display: "inline-block", width: 8, height: 8, borderRadius: "50%",
                  background: C.blue, animation: "onb-pulse 1.5s ease-in-out infinite",
                }} />
                {config.action === "click-chart" ? "Click the chart to continue" : "Drag the slider to continue"}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes onb-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.6); }
        }
      `}</style>
    </>
  );
}
