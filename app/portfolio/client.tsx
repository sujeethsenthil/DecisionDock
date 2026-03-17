"use client";

import { useMemo, useCallback, useRef, useEffect, useState } from "react";
import { ModuleTabs } from "@/components/platform/ModuleTabs";
import { DomainAllocationCard } from "@/components/portfolio/DomainAllocationCard";
import { AllocationSidebar } from "@/components/portfolio/AllocationSidebar";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { useViewport, useTokens } from "@/lib/hooks";
import { C } from "@/lib/constants";
import { usePlatformStore } from "@/lib/store/platform";
import { Analytics } from "@/lib/analytics";
import { OnboardingOverlay, type TourStep } from "@/components/onboarding/OnboardingOverlay";
import { TutorButton } from "@/components/onboarding/TutorButton";
import {
  DOMAIN_ORDER,
  DOMAIN_CONFIGS,
  DomainKey,
  Persona,
  currentTotalCost,
  targetTotalCost,
  freePool,
  maxReachableX,
  AllocationState,
} from "@/lib/models/portfolio";

// ── Page ─────────────────────────────────────────────────────
export default function PortfolioClient() {
  const { h } = useViewport();
  const T = useTokens(h);
  const budgetCardRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const STORAGE_KEY = "dd_onboarding_portfolio";
  const [tourPhase, setTourPhase] = useState<"idle" | "tour" | "done">("idle");
  const [tourStep, setTourStep] = useState<TourStep>(0);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) setTourPhase("done");
    } catch {}
  }, []);

  const markTourDone = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const startTour = useCallback(() => {
    setTourStep(0);
    setTourPhase("tour");
  }, []);

  const handleTourNext = useCallback(() => {
    setTourStep((s) => {
      if (s === "done") return "done";
      const next = (s as number) + 1;
      if (next >= 3) {
        setTourPhase("done");
        markTourDone();
        return "done";
      }
      return next as TourStep;
    });
  }, [markTourDone]);

  const handleTourSkip = useCallback(() => {
    setTourPhase("done");
    setTourStep("done");
    markTourDone();
  }, [markTourDone]);

  const domains = usePlatformStore((s) => s.domains);
  const budget = usePlatformStore((s) => s.budget);
  const setBudget = usePlatformStore((s) => s.setBudget);
  const setTargetX = usePlatformStore((s) => s.setTargetX);

  const currentX: Persona = useMemo(
    () => ({
      uptime: domains.uptime.currentX,
      latency: domains.latency.currentX,
      velocity: domains.velocity.currentX,
      capacity: domains.capacity.currentX,
    }),
    [domains],
  );

  const targetX: Persona = useMemo(
    () => ({
      uptime: domains.uptime.targetX,
      latency: domains.latency.targetX,
      velocity: domains.velocity.targetX,
      capacity: domains.capacity.targetX,
    }),
    [domains],
  );

  const state: AllocationState = useMemo(
    () => ({ budget, currentX, targetX }),
    [budget, currentX, targetX],
  );

  const curSpend = useMemo(() => currentTotalCost(state), [state]);
  const desSpend = useMemo(() => targetTotalCost(state), [state]);
  const pool = useMemo(() => freePool(state), [state]);

  const maxX = useMemo(
    () =>
      Object.fromEntries(DOMAIN_ORDER.map((k) => [k, maxReachableX(k, state)])) as unknown as Persona,
    [state],
  );

  const isOver = pool < 0;
  const isZero = Math.abs(pool) < 1;
  const utilizationPct = Math.min(110, (desSpend / budget) * 100);
  const utilColor = utilizationPct > 100 ? C.red : utilizationPct > 85 ? C.amber : C.emerald;
  const heroColor = isOver ? C.red : isZero ? C.emerald : C.amber;
  const heroLabel = isOver ? "over budget" : isZero ? "fully allocated" : "unallocated";

  // Track portfolio visited once on mount
  useEffect(() => {
    Analytics.portfolioVisited(budget, desSpend, isOver);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track budget changes — debounced 800ms
  const budgetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleBudgetChange = useCallback(
    (v: number) => {
      setBudget(v);
      if (budgetTimerRef.current) clearTimeout(budgetTimerRef.current);
      budgetTimerRef.current = setTimeout(() => {
        Analytics.budgetEntered(v, desSpend, v - desSpend);
      }, 800);
    },
    [setBudget, desSpend],
  );

  // Track allocation zeroed — fires once when pool first hits zero
  const wasPositiveRef = useRef(true);
  useEffect(() => {
    if (wasPositiveRef.current && isZero) {
      Analytics.allocationZeroed(
        budget,
        budget > 0 ? Math.round((DOMAIN_CONFIGS.uptime.cost(targetX.uptime) / budget) * 100) : 0,
        budget > 0 ? Math.round((DOMAIN_CONFIGS.latency.cost(targetX.latency) / budget) * 100) : 0,
        budget > 0 ? Math.round((DOMAIN_CONFIGS.velocity.cost(targetX.velocity) / budget) * 100) : 0,
        budget > 0 ? Math.round((DOMAIN_CONFIGS.capacity.cost(targetX.capacity) / budget) * 100) : 0,
      );
    }
    wasPositiveRef.current = !isZero;
  }, [isZero, budget, targetX]);

  const handleTargetChange = useCallback(
    (key: DomainKey, x: number) => {
      setTargetX(key, x);
    },
    [setTargetX],
  );

  return (
    <main
      style={{
        background: C.pageBg,
        minHeight: "100vh",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header bar */}
      <header
        style={{
          height: 60,
          display: "flex",
          alignItems: "center",
          padding: "0 32px",
          borderBottom: `1px solid ${C.border}`,
          background: C.pageBg,
          backgroundColor: C.pageBg,
          boxSizing: "border-box",
        }}
      >
        <ModuleTabs />
      </header>

      {/* Headline */}
      <div
        style={{
          textAlign: "center",
          fontSize: 22,
          fontWeight: 700,
          color: C.navy,
          padding: "12px 0 8px",
        }}
      >
        This is what your decisions mean to your portfolio
      </div>

      {/* Budget + pool card */}
      <div
        ref={budgetCardRef}
        style={{
          background: C.white,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: "12px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          maxWidth: 560,
          margin: "0 auto 12px",
          boxSizing: "border-box",
        }}
        onClick={(e) =>
          (e.currentTarget.querySelector("input") as HTMLInputElement)?.focus()
        }
      >
        {/* Budget input */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            cursor: "text",
          }}
        >
          <span style={{
            fontSize: 10,
            fontWeight: 700,
            color: C.subtle,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}>
            Your Budget
          </span>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 28,
              fontWeight: 800,
              color: C.navy,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              opacity: 0.4,
              userSelect: "none",
            }}
          >
            $
          </span>
          <input
            type="number"
            value={budget}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              if (!isNaN(v) && v > 0) handleBudgetChange(v);
            }}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 28,
              fontWeight: 800,
              color: C.navy,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              background: "transparent",
              border: "none",
              borderBottom: `2px solid ${C.navy}`,
              outline: "none",
              width: "8ch",
              minWidth: "4ch",
              maxWidth: "10ch",
              transition: "border-color 0.15s",
              padding: 0,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderBottomColor = C.blue;
              e.currentTarget.select();
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderBottomColor = C.navy;
            }}
          />
          </div>
        </div>

        {/* Vertical divider */}
        <div style={{ width: 1, height: 32, background: C.border, flexShrink: 0 }} />

        {/* Pool badge + number */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: isOver
                ? "rgba(239,68,68,0.06)"
                : isZero
                ? "rgba(34,197,94,0.06)"
                : "rgba(245,158,11,0.06)",
              borderRadius: 999,
              padding: "4px 10px",
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: heroColor,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {heroLabel}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
            {isOver && (
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 24,
                  fontWeight: 800,
                  color: heroColor,
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                }}
              >
                −
              </span>
            )}
            <AnimatedCounter value={Math.abs(pool)} color={heroColor} size={28} />
          </div>
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            alignItems: "stretch",
            padding: 12,
            gap: 12,
            width: "100%",
            maxWidth: 1320,
            boxSizing: "border-box",
          }}
        >
          <div
            ref={cardsRef}
            style={{
              flex: 1,
              minWidth: 0,
              minHeight: 0,
              display: "grid",
              gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
              gridTemplateRows: "1fr 1fr",
              gap: 12,
            }}
          >
            {DOMAIN_ORDER.map((key) => (
              <DomainAllocationCard
                key={key}
                domainKey={key}
                currentX={currentX[key]}
                targetX={targetX[key]}
                maxX={maxX[key]}
                freePool={pool}
                onTargetChange={handleTargetChange}
                tokens={T}
              />
            ))}
          </div>

          <div
            ref={sidebarRef}
            style={{
              width: 220,
              minWidth: 220,
              maxWidth: 220,
              flexShrink: 0,
              alignSelf: "flex-start",
              position: "sticky",
              top: 12,
            }}
          >
            <AllocationSidebar budget={budget} targetX={targetX} tokens={T} />
          </div>
        </div>
      </div>

      {tourPhase === "tour" && (
        <OnboardingOverlay
          domain="portfolio"
          step={tourStep}
          onNext={handleTourNext}
          onSkip={handleTourSkip}
          refs={{ budget: budgetCardRef, cards: cardsRef, sidebar: sidebarRef }}
        />
      )}

      <TutorButton onStartTour={startTour} toured={tourPhase === "done"} />
    </main>
  );
}
