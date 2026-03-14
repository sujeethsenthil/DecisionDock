"use client";

import { useMemo, useCallback } from "react";
import { ModuleTabs } from "@/components/platform/ModuleTabs";
import { ModuleHero } from "@/components/platform/ModuleHero";
import { TensionStrip } from "@/components/portfolio/TensionStrip";
import { DomainAllocationCard } from "@/components/portfolio/DomainAllocationCard";
import { AllocationSidebar } from "@/components/portfolio/AllocationSidebar";
import { useViewport, useTokens } from "@/lib/hooks";
import { C } from "@/lib/constants";
import { usePlatformStore } from "@/lib/store/platform";
import {
  DOMAIN_ORDER,
  DomainKey,
  Persona,
  currentTotalCost,
  targetTotalCost,
  maxReachableX,
  AllocationState,
} from "@/lib/models/portfolio";

export default function PortfolioPage() {
  const { h } = useViewport();
  const T = useTokens(h);

  const domains    = usePlatformStore((s) => s.domains);
  const budget     = usePlatformStore((s) => s.budget);
  const setBudget  = usePlatformStore((s) => s.setBudget);
  const setTargetX = usePlatformStore((s) => s.setTargetX);

  const currentX: Persona = useMemo(() => ({
    uptime:   domains.uptime.currentX,
    latency:  domains.latency.currentX,
    velocity: domains.velocity.currentX,
    capacity: domains.capacity.currentX,
  }), [domains]);

  const targetX: Persona = useMemo(() => ({
    uptime:   domains.uptime.targetX,
    latency:  domains.latency.targetX,
    velocity: domains.velocity.targetX,
    capacity: domains.capacity.targetX,
  }), [domains]);

  const state: AllocationState = useMemo(
    () => ({ budget, currentX, targetX }),
    [budget, currentX, targetX]
  );

  const handleTargetChange = useCallback((key: DomainKey, x: number) => {
    setTargetX(key, x);
  }, [setTargetX]);

  const curSpend = useMemo(() => currentTotalCost(state), [state]);
  const desSpend = useMemo(() => targetTotalCost(state), [state]);

  const maxX = useMemo((): Persona => ({
    uptime: maxReachableX("uptime", state),
    latency: maxReachableX("latency", state),
    velocity: maxReachableX("velocity", state),
    capacity: maxReachableX("capacity", state),
  }), [state]);

  return (
    <main style={{ minHeight: "100vh", background: C.pageBg }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: T.pad }}>

        <ModuleHero
          headline="Where should your next dollar go?"
          subtext="Set your budget. See where you stand. Fit what matters within what you have."
        />
        <ModuleTabs />

        {/* ── SECTION 1: Budget + tension strip ── */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: C.subtle, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>
              Total Operating Budget
            </div>
            <div style={{ position: "relative", maxWidth: 340 }}>
              <span style={{
                position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 14, fontWeight: 600, color: C.subtle,
              }}>$</span>
              <input
                type="number"
                value={budget}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  if (!isNaN(v) && v > 0) setBudget(v);
                }}
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 26px",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 14, fontWeight: 600,
                  color: C.navy,
                  background: C.white,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ marginTop: 8, fontSize: 10, color: C.subtle, fontStyle: "italic" }}>
              Current state and targets are pulled from your domain selections.
            </div>
          </div>

          <TensionStrip
            budget={budget}
            currentSpend={curSpend}
            desiredSpend={desSpend}
            tokens={T}
          />
        </div>

        {/* ── Section divider ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <span style={{
            fontSize: 11, fontWeight: 600, color: C.subtle,
            textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap",
          }}>
            Allocation plan
          </span>
          <div style={{ flex: 1, height: 1, background: C.border }} />
          <span style={{ fontSize: 10, color: C.subtle, fontStyle: "italic", whiteSpace: "nowrap" }}>
            sliders constrained to free pool
          </span>
        </div>

        {/* ── SECTION 2: 2x2 grid + sidebar ── */}
        <div style={{ display: "flex", gap: T.gap, alignItems: "flex-start" }}>
          <div style={{
            flex: 1,
            minWidth: 0,
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
            gap: T.gap,
          }}>
            {DOMAIN_ORDER.map((key) => (
              <DomainAllocationCard
                key={key}
                domainKey={key}
                currentX={currentX[key]}
                targetX={targetX[key]}
                maxX={maxX[key]}
                onTargetChange={handleTargetChange}
                tokens={T}
              />
            ))}
          </div>

          <div style={{ width: 220, flexShrink: 0 }}>
            <AllocationSidebar
              budget={budget}
              targetX={targetX}
              tokens={T}
            />
          </div>
        </div>

      </div>
    </main>
  );
}
