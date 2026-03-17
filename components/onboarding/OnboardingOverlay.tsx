"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { C } from "@/lib/constants";

// Domain tours: 5 steps (0–4)
// Portfolio tour: 3 steps (0–2)
export type TourStep = 0 | 1 | 2 | 3 | 4 | "done";
export type TourDomain = "uptime" | "latency" | "velocity" | "capacity" | "portfolio";

interface StepConfig {
  title: string;
  body: string;
  target: string;
  position: "top" | "bottom" | "left" | "right";
  action: "next" | "click-chart" | "drag-slider" | "finish";
  buttonLabel: string;
  scrollToTarget?: boolean;
  bridgeToPortfolio?: boolean;
}

// ── Copy principles ───────────────────────────────────────────
// User lens: "I'm allocating budgets — what does this earn me,
//             and what am I giving up to get it?"
// Step 0: industry stat — frames the return opportunity
// Step 1: names the decision the user is actually making
// Step 2: click chart — anchor the decision
// Step 3: drag slider — price the decision
// Step 4: bottom tiles — the full return picture to defend the call
const DOMAIN_STEPS: Record<TourDomain, StepConfig[]> = {

  uptime: [
    {
      title: "1 hour of downtime. $300K gone.",
      body: "Industry average for mid-market SaaS. Your reliability spend is buying protection against that number — but past a certain point, each extra dollar of protection returns less than the dollar before it.",
      target: "chart", position: "right", action: "next",
      buttonLabel: "What's my number?",
    },
    {
      title: "Where is your reliability spend on this curve?",
      body: "Every team sits somewhere on this curve. Most don't know exactly where — or how close they are to the point where the next dollar stops earning its keep.",
      target: "chart", position: "right", action: "next",
      buttonLabel: "Show me",
    },
    {
      title: "Click to set where you are today.",
      body: "Mark your current reliability level. This anchors everything — the return you're already getting, and what the next move would cost.",
      target: "chart", position: "right", action: "click-chart",
      buttonLabel: "",
    },
    {
      title: "What would the next level return?",
      body: "Drag to your target. The gap between where you are and where you're going — that's the decision you're pricing.",
      target: "slider", position: "left", action: "drag-slider",
      buttonLabel: "",
    },
    {
      title: "This is what you bring to the conversation.",
      body: "The cost of the move, the downtime you'd eliminate, and the revenue per minute of uptime you'd gain. Every number you need to defend — or challenge — the ask.",
      target: "bottom", position: "top", action: "finish",
      buttonLabel: "Got it",
      bridgeToPortfolio: true,
    },
  ],

  latency: [
    {
      title: "100ms of latency costs ~1% conversion.",
      body: "Google and Deloitte research across e-commerce and SaaS. Speed has a direct revenue return — until users stop noticing, and the spend keeps climbing without the return.",
      target: "chart", position: "right", action: "next",
      buttonLabel: "What's my threshold?",
    },
    {
      title: "There's a point where faster stops earning.",
      body: "Below ~100ms, users can't perceive the difference. Every dollar you spend past that threshold is a dollar that returns nothing — and isn't available for the domains that still have room to grow.",
      target: "chart", position: "right", action: "next",
      buttonLabel: "Show me",
    },
    {
      title: "Click to set your current response time.",
      body: "Where is your p99 today? This is your starting point — the return you're already capturing, and what's still on the table.",
      target: "chart", position: "right", action: "click-chart",
      buttonLabel: "",
    },
    {
      title: "What would faster return?",
      body: "Drag to your target. See what the speed improvement actually earns — and whether it clears the bar.",
      target: "slider", position: "left", action: "drag-slider",
      buttonLabel: "",
    },
    {
      title: "The full return picture.",
      body: "Annual cost, user experience gain, and the revenue-per-millisecond math. The numbers that turn a speed conversation into a business conversation.",
      target: "bottom", position: "top", action: "finish",
      buttonLabel: "Got it",
      bridgeToPortfolio: true,
    },
  ],

  velocity: [
    {
      title: "Elite teams ship 5× more often. They don't spend 5× more.",
      body: "DORA research across thousands of teams. Deploy frequency returns compound — faster feedback, less risk per release. But the return curve bends well before most teams' spend does.",
      target: "chart", position: "right", action: "next",
      buttonLabel: "Where's the bend?",
    },
    {
      title: "Shipping faster has a ceiling you can't buy past.",
      body: "Beyond a certain frequency, the constraint isn't tooling — it's culture, coordination, and review capacity. Spending past that point funds infrastructure nobody can use yet.",
      target: "chart", position: "right", action: "next",
      buttonLabel: "Show me",
    },
    {
      title: "Click to set your current deploy cadence.",
      body: "Where is your team today? This is your baseline — what you're already returning, and how much room remains.",
      target: "chart", position: "right", action: "click-chart",
      buttonLabel: "",
    },
    {
      title: "What would moving up return?",
      body: "Drag to your target frequency. See the investment required and where the return starts to flatten.",
      target: "slider", position: "left", action: "drag-slider",
      buttonLabel: "",
    },
    {
      title: "The full return picture.",
      body: "Cost of the move, DORA tier you'd reach, and the organisational readiness bar. What you need to make the case — or push back on it.",
      target: "bottom", position: "top", action: "finish",
      buttonLabel: "Got it",
      bridgeToPortfolio: true,
    },
  ],

  capacity: [
    {
      title: "Most teams provision for the crisis they fear, not the one they'll face.",
      body: "Queuing theory shows N+1 redundancy handles over 95% of real failure scenarios. But the fear of the edge case drives spend well past the point of meaningful return.",
      target: "chart", position: "right", action: "next",
      buttonLabel: "What's my real exposure?",
    },
    {
      title: "Every tier above N+1 earns less than the one before it.",
      body: "The risk reduction per dollar spent drops sharply after the first redundancy tier. That spend doesn't disappear — it comes out of domains where the return is still steep.",
      target: "chart", position: "right", action: "next",
      buttonLabel: "Show me",
    },
    {
      title: "Click to set your current headroom.",
      body: "Where is your capacity buffer today? Mark it, and see exactly where you sit on the return curve.",
      target: "chart", position: "right", action: "click-chart",
      buttonLabel: "",
    },
    {
      title: "What would more headroom return?",
      body: "Drag to your target tier. See the cost of the additional coverage and the risk reduction it actually buys.",
      target: "slider", position: "left", action: "drag-slider",
      buttonLabel: "",
    },
    {
      title: "The full return picture.",
      body: "The cost of the tier, the failure scenarios it covers, and the point at which you're paying for peace of mind rather than protection. Your number for the budget conversation.",
      target: "bottom", position: "top", action: "finish",
      buttonLabel: "Got it",
      bridgeToPortfolio: true,
    },
  ],

  portfolio: [
    {
      title: "You've priced each decision. Now see what they cost together.",
      body: "Enter your total budget. Every domain's target spend adds up — and for the first time, you'll see whether your priorities fit your envelope.",
      target: "budget", position: "right",  action: "next",
      buttonLabel: "Got it",
    },
    {
      title: "Every slider move is a reallocation.",
      body: "Push one domain higher and the others feel it. The sliders are physically capped by what's left — you can see the cross-domain tradeoff in real time.",
      target: "cards", position: "top", action: "next",
      buttonLabel: "Next",
      scrollToTarget: true,
    },
    {
      title: "This number is the decision.",
      body: "When the free pool hits zero, you've made your call. Pull one domain back to give another room. This is the opportunity cost, made visible.",
      target: "sidebar", position: "left", action: "finish",
      buttonLabel: "Start allocating",
      scrollToTarget: true,
    },
  ],
};

interface Props {
  domain: TourDomain;
  step: TourStep;
  onNext: () => void;
  onSkip: () => void;
  refs: Record<string, React.RefObject<HTMLDivElement>>;
}

export function OnboardingOverlay({ domain, step, onNext, onSkip, refs }: Props) {
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);
  const steps = DOMAIN_STEPS[domain];
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  const updateSpotlight = useCallback(() => {
    if (step === "done") return;
    const config = steps[step as number];
    if (!config) return;
    const ref = refs[config.target];
    if (!ref?.current) return;
    const raw = ref.current.getBoundingClientRect();
    if (config.target === "budget") {
      // budgetCardRef is on the full-width parent.
      // Measure the actual white card (first child) to get its real rendered width.
      const card = ref.current.querySelector(':scope > div') as HTMLElement | null;
      if (card) {
        setSpotlightRect(card.getBoundingClientRect());
      } else {
        setSpotlightRect(raw);
      }
    } else {
      setSpotlightRect(raw);
    }
  }, [step, steps, refs]);

  useEffect(() => {
    if (step === "done") return;
    const config = steps[step as number];
    if (!config) return;

    if (config.scrollToTarget) {
      const ref = refs[config.target];
      if (ref?.current) {
        // Manual scroll accounting for sticky header (~56px) + breathing room
        const elRect  = ref.current.getBoundingClientRect();
        const STICKY_H = 64;
        const targetY  = window.scrollY + elRect.top - STICKY_H - 32;
        window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
        // Wait for scroll to fully settle before measuring
        const t = setTimeout(updateSpotlight, 750);
        return () => clearTimeout(t);
      }
    }

    updateSpotlight();
    window.addEventListener("resize", updateSpotlight);
    window.addEventListener("scroll", updateSpotlight);
    const t1 = setTimeout(updateSpotlight, 50);
    const t2 = setTimeout(updateSpotlight, 250);
    return () => {
      window.removeEventListener("resize", updateSpotlight);
      window.removeEventListener("scroll", updateSpotlight);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [updateSpotlight, step, steps, refs]);

  if (step === "done") return null;
  const config = steps[step as number];
  if (!config || !spotlightRect || !mounted) return null;

  const pad = 14;
  const sx = spotlightRect.left - pad;
  const sy = spotlightRect.top  - pad;
  const sw = spotlightRect.width  + pad * 2;
  const sh = spotlightRect.height + pad * 2;
  const sr = 20;

  const winW = typeof window !== "undefined" ? window.innerWidth  : 1440;
  const winH = typeof window !== "undefined" ? window.innerHeight : 900;

  const TOOLTIP_W  = 320;
  const TOOLTIP_H  = 220; // conservative estimate for clamping
  const TOOLTIP_GAP = 24;

  const getTooltipStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: "fixed", zIndex: 100001, width: TOOLTIP_W, maxWidth: TOOLTIP_W,
      transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
    };

    // Vertical centre of spotlight, clamped so tooltip stays in viewport
    const vcenter = Math.max(
      TOOLTIP_H / 2 + 16,
      Math.min(sy + sh / 2, winH - TOOLTIP_H / 2 - 16)
    );

    // Horizontal centre of spotlight, clamped
    const hcenter = Math.max(
      TOOLTIP_W / 2 + 16,
      Math.min(sx + sw / 2, winW - TOOLTIP_W / 2 - 16)
    );

    switch (config.position) {
      case "right": {
        // Prefer right of spotlight; fall back to left if no room
        const leftPos = sx + sw + TOOLTIP_GAP;
        const left    = leftPos + TOOLTIP_W > winW - 16
          ? Math.max(16, sx - TOOLTIP_W - TOOLTIP_GAP)  // flip left
          : leftPos;
        return { ...base, left, top: vcenter, transform: "translateY(-50%)" };
      }
      case "left": {
        const rightPos = winW - sx + TOOLTIP_GAP;
        const right    = rightPos + TOOLTIP_W > winW - 16
          ? Math.max(16, winW - (sx + sw + TOOLTIP_GAP + TOOLTIP_W))
          : rightPos;
        return { ...base, right: Math.max(16, right), top: vcenter, transform: "translateY(-50%)" };
      }
      case "top": {
        // Tooltip sits above spotlight — clamp so it never goes above viewport
        const desiredBottom = winH - sy + TOOLTIP_GAP;
        const clampedTop    = Math.max(16, winH - desiredBottom - TOOLTIP_H);
        return { ...base, left: hcenter, top: clampedTop, transform: "translateX(-50%)" };
      }
      case "bottom": {
        // Tooltip sits below spotlight — clamp so it never goes below viewport
        const desiredTop = sy + sh + TOOLTIP_GAP;
        const clampedTop = Math.min(desiredTop, winH - TOOLTIP_H - 16);
        return { ...base, left: hcenter, top: Math.max(16, clampedTop), transform: "translateX(-50%)" };
      }
      default:
        return base;
    }
  };

  const isInteractive = config.action === "click-chart" || config.action === "drag-slider";
  const stepNum   = step as number;
  const totalSteps = steps.length;

  const overlay = (
    <>
      {/* Dim + spotlight */}
      <div style={{ position: "fixed", inset: 0, zIndex: 99999, pointerEvents: isInteractive ? "none" : "auto" }}>
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          <defs>
            <mask id="spotlight-mask">
              <rect width="100%" height="100%" fill="white" />
              <rect x={sx} y={sy} width={sw} height={sh} rx={sr} ry={sr} fill="black"
                style={{ transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)" }} />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="rgba(15,23,42,0.55)" mask="url(#spotlight-mask)" />
          <rect x={sx} y={sy} width={sw} height={sh} rx={sr} ry={sr}
            fill="none" stroke="rgba(59,130,246,0.25)" strokeWidth={2}
            style={{ transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)" }} />
        </svg>
      </div>

      {/* Tooltip */}
      <div style={getTooltipStyle()}>
        <div style={{
          background: C.white, borderRadius: 18, padding: "24px 28px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.06)",
          border: `1px solid ${C.border}`, pointerEvents: "auto",
        }}>
          {/* Progress dots */}
          <div style={{ display: "flex", gap: 5, marginBottom: 16 }}>
            {steps.map((_, i) => (
              <div key={i} style={{
                width: i === stepNum ? 24 : 7, height: 7, borderRadius: 4,
                background: i === stepNum ? C.blue : i < stepNum ? C.navy : C.border,
                transition: "all 0.3s ease",
              }} />
            ))}
          </div>

          <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 8, lineHeight: 1.3 }}>
            {config.title}
          </div>
          <div style={{ fontSize: 13, color: C.body, lineHeight: 1.6, marginBottom: 20 }}>
            {config.body}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={onSkip}
              style={{ background: "none", border: "none", color: C.subtle, fontSize: 12, cursor: "pointer", padding: "4px 0", transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.med)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.subtle)}>
              Skip
            </button>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
              {config.buttonLabel ? (
                <button onClick={onNext}
                  style={{
                    background: C.navy, color: C.white, border: "none", borderRadius: 10,
                    padding: "10px 22px", fontSize: 13, fontWeight: 600, cursor: "pointer",
                    transition: "all 0.15s", boxShadow: "0 2px 8px rgba(15,23,42,0.2)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = C.dark)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = C.navy)}>
                  {config.buttonLabel}
                </button>
              ) : (
                <div style={{ fontSize: 12, color: C.blue, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{
                    display: "inline-block", width: 7, height: 7, borderRadius: "50%",
                    background: C.blue, animation: "onb-pulse 1.5s ease-in-out infinite",
                  }} />
                  {config.action === "click-chart" ? "Click the chart to continue" : "Drag the slider to continue"}
                </div>
              )}

              {config.bridgeToPortfolio && (
                <button
                  onClick={() => { onSkip(); router.push("/portfolio"); }}
                  style={{
                    background: "none", border: "none",
                    color: C.blue, fontSize: 12, fontWeight: 600,
                    cursor: "pointer", padding: "2px 0",
                    display: "flex", alignItems: "center", gap: 4,
                    transition: "opacity 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  See all four domains together →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes onb-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(1.6); }
        }
      `}</style>
    </>
  );

  return createPortal(overlay, document.body);
}
