"use client";

import { useMemo, useCallback, useRef } from "react";
import { ModuleTabs } from "@/components/platform/ModuleTabs";
import { DomainAllocationCard } from "@/components/portfolio/DomainAllocationCard";
import { AllocationSidebar } from "@/components/portfolio/AllocationSidebar";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { useViewport, useTokens } from "@/lib/hooks";
import { C } from "@/lib/constants";
import { fc, fcFull } from "@/lib/format";
import { usePlatformStore } from "@/lib/store/platform";
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

// ── Utilization ring ──────────────────────────────────────────
function UtilizationRing({ pct, color, size = 72 }: { pct: number; color: string; size?: number }) {
  const r     = size * 0.39;
  const circ  = 2 * Math.PI * r;
  const filled = Math.min(pct / 100, 1) * circ;
  const fs    = size < 60 ? 10 : 13;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth="5" />
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth="5"
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: "stroke-dasharray 0.3s ease" }}
      />
      <text x={size/2} y={size/2 + fs * 0.35} textAnchor="middle"
        fontSize={fs} fontWeight="700" fill={color}
        fontFamily="'JetBrains Mono', monospace">
        {Math.round(pct)}%
      </text>
    </svg>
  );
}

// ── Stats bar ─────────────────────────────────────────────────
function StatsBar({
  curSpend, desSpend, utilizationPct, utilColor, budget, isOver, compact,
}: {
  curSpend: number; desSpend: number; utilizationPct: number;
  utilColor: string; budget: number; isOver: boolean; compact?: boolean;
}) {
  const numFs   = compact ? 16 : 22;
  const labelFs = compact ? 8 : 9;
  const pad     = compact ? "10px 16px" : "18px 20px";

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      background: C.white,
      borderRadius: compact ? 10 : 12,
      border: `1px solid ${C.border}`,
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      overflow: "hidden",
      width: "100%",
      maxWidth: compact ? "100%" : 660,
    }}>
      <div style={{ flex: 1, padding: pad, borderRight: `1px solid ${C.border}`, textAlign: "center" }}>
        <div style={{ fontSize: labelFs, fontWeight: 600, color: C.subtle, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: compact ? 3 : 6 }}>
          Currently spending
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: numFs, fontWeight: 700, color: C.blue, letterSpacing: "-0.02em" }}>
          {fcFull(curSpend)}
        </div>
        {!compact && <div style={{ fontSize: 10, color: C.subtle, marginTop: 3 }}>across 4 domains</div>}
      </div>

      <div style={{ flex: 1, padding: pad, borderRight: `1px solid ${C.border}`, textAlign: "center" }}>
        <div style={{ fontSize: labelFs, fontWeight: 600, color: C.subtle, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: compact ? 3 : 6 }}>
          Desired state
        </div>
        <AnimatedCounter value={desSpend} color={isOver ? C.amber : C.emerald} size={numFs} />
        {!compact && <div style={{ fontSize: 10, color: C.subtle, marginTop: 3 }}>sum of all targets</div>}
      </div>

      <div style={{
        flex: compact ? "0 0 auto" : 1,
        padding: compact ? "8px 14px" : "14px 20px",
        textAlign: "center",
        display: "flex",
        flexDirection: compact ? "row" : "column",
        alignItems: "center",
        gap: compact ? 8 : 4,
      }}>
        {!compact && (
          <div style={{ fontSize: labelFs, fontWeight: 600, color: C.subtle, textTransform: "uppercase", letterSpacing: "0.07em" }}>
            Budget utilization
          </div>
        )}
        <UtilizationRing pct={utilizationPct} color={utilColor} size={compact ? 36 : 72} />
        {!compact && <div style={{ fontSize: 10, color: C.subtle }}>of {fcFull(budget)}</div>}
        {compact && (
          <div style={{ fontSize: 9, color: C.subtle, fontFamily: "'JetBrains Mono', monospace" }}>
            of {fcFull(budget)}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Scroll cue ───────────────────────────────────────────────
function ScrollCue({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "absolute",
        bottom: 28,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        background: C.white,
        border: `1px solid ${C.border}`,
        borderRadius: 99,
        padding: "10px 22px",
        cursor: "pointer",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        animation: "scroll-bounce 2.2s ease-in-out infinite",
        zIndex: 10,
      }}
    >
      <span style={{ fontSize: 11, fontWeight: 700, color: C.navy, letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
        Set your allocation
      </span>
      <svg width="14" height="9" viewBox="0 0 14 9" fill="none">
        <path d="M1 1l6 6 6-6" stroke={C.navy} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}

// ── Page ─────────────────────────────────────────────────────
export default function PortfolioPage() {
  const { h }   = useViewport();
  const T       = useTokens(h);
  const act2Ref = useRef<HTMLDivElement>(null);

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
  const pool     = useMemo(() => freePool(state), [state]);

  const maxX: Persona = useMemo(() => ({
    uptime: maxReachableX("uptime", state),
    latency: maxReachableX("latency", state),
    velocity: maxReachableX("velocity", state),
    capacity: maxReachableX("capacity", state),
  }), [state]);

  const isOver         = pool < 0;
  const isZero         = Math.abs(pool) < 1;
  const utilizationPct = Math.min(110, (desSpend / budget) * 100);
  const utilColor      = utilizationPct > 100 ? C.red : utilizationPct > 85 ? C.amber : C.emerald;
  const heroColor      = isOver ? C.red : isZero ? C.emerald : C.amber;
  const heroLabel      = isOver ? "over budget" : isZero ? "fully allocated" : "unallocated";
  const heroSub        = isOver
    ? "Trim the flat-zone sliders below to close the gap"
    : isZero
    ? "Every dollar is working. Nicely done."
    : "Drag the glowing sliders below to put it to work";

  const scrollToAct2 = useCallback(() => {
    act2Ref.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <main style={{ background: C.pageBg }}>

      {/* ══════════════════════════════════════════
          ACT 1 — Full viewport hero
      ══════════════════════════════════════════ */}
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative" }}>

        {/* Nav */}
        <div style={{ padding: "24px 48px 0", maxWidth: 1320, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
          <ModuleTabs />
        </div>

        {/* Centered hero */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "0 48px 80px",
          maxWidth: 760, margin: "0 auto", width: "100%",
          textAlign: "center",
        }}>

          {/* Eyebrow */}
          <div style={{ fontSize: 11, fontWeight: 600, color: C.subtle, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 28 }}>
            Portfolio budget allocator
          </div>

          {/* Budget + Gap — side by side, same scale */}
          <div style={{
            display: "flex", alignItems: "stretch",
            justifyContent: "center", gap: 0,
            marginBottom: 16, width: "100%",
          }}>

            {/* Left — budget (the action) */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                background: C.navy, borderRadius: 99, padding: "4px 14px",
              }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Enter your budget
                </span>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1 5h8M6 2l3 3-3 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <div
                style={{ display: "flex", alignItems: "baseline", gap: 3, cursor: "text" }}
                onClick={(e) => (e.currentTarget.querySelector("input") as HTMLInputElement)?.focus()}
              >
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 80, fontWeight: 800,
                  color: C.navy, letterSpacing: "-0.04em", lineHeight: 1,
                  opacity: 0.2, userSelect: "none",
                }}>$</span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    if (!isNaN(v) && v > 0) setBudget(v);
                  }}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 80, fontWeight: 800,
                    color: C.navy,
                    letterSpacing: "-0.04em", lineHeight: 1,
                    background: "transparent",
                    border: "none",
                    borderBottom: `3px solid ${C.navy}`,
                    outline: "none",
                    width: "8ch", minWidth: "4ch", maxWidth: "10ch",
                    transition: "border-color 0.15s",
                    padding: 0,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderBottomColor = C.blue;
                    e.currentTarget.select();
                  }}
                  onBlur={(e) => { e.currentTarget.style.borderBottomColor = C.navy; }}
                />
              </div>
              <span style={{ fontSize: 10, color: C.subtle, fontStyle: "italic" }}>
                targets pulled from your domain selections
              </span>
            </div>

            {/* Divider */}
            <div style={{ width: 1, background: C.border, margin: "0 40px", flexShrink: 0 }} />

            {/* Right — gap (the reaction) */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                background: isOver ? "rgba(239,68,68,0.1)" : isZero ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)",
                borderRadius: 99, padding: "4px 14px",
              }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: heroColor, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {heroLabel}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
                {isOver && (
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 80, fontWeight: 800, color: heroColor, letterSpacing: "-0.04em", lineHeight: 1 }}>−</span>
                )}
                <AnimatedCounter value={Math.abs(pool)} color={heroColor} size={80} />
              </div>
              <span style={{ fontSize: 10, color: C.subtle, fontStyle: "italic", lineHeight: 1.5, textAlign: "center" }}>
                {heroSub}
              </span>
            </div>

          </div>

          {/* Domain cost pills */}
          <div style={{ display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap", justifyContent: "center" }}>
            {DOMAIN_ORDER.map((k) => {
              const cfg  = DOMAIN_CONFIGS[k];
              const cost = cfg.cost(targetX[k]);
              const pct  = budget > 0 ? Math.round((cost / budget) * 100) : 0;
              return (
                <div key={k} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: C.white, border: `1px solid ${C.border}`,
                  borderRadius: 99, padding: "5px 12px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color }} />
                  <span style={{ fontSize: 11, color: C.med, fontWeight: 500 }}>{cfg.label}</span>
                  <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: cfg.color }}>{fc(cost)}</span>
                  <span style={{ fontSize: 9, color: C.subtle }}>{pct}%</span>
                </div>
              );
            })}
          </div>

          {/* Stats bar */}
          <div style={{ marginTop: 28, width: "100%", display: "flex", justifyContent: "center" }}>
            <StatsBar
              curSpend={curSpend} desSpend={desSpend}
              utilizationPct={utilizationPct} utilColor={utilColor}
              budget={budget} isOver={isOver}
            />
          </div>

        </div>

        <ScrollCue onClick={scrollToAct2} />
      </div>

      {/* ══════════════════════════════════════════
          ACT 2 — Allocation grid
      ══════════════════════════════════════════ */}
      <div ref={act2Ref} style={{ borderTop: `1px solid ${C.border}`, minHeight: "100vh" }}>

        {/* Sticky compact stats bar */}
        <div style={{
          position: "sticky", top: 0, zIndex: 20,
          background: "rgba(240,244,248,0.92)",
          backdropFilter: "blur(8px)",
          borderBottom: `1px solid ${C.border}`,
          padding: "8px 48px",
        }}>
          <div style={{ maxWidth: 1320, margin: "0 auto" }}>
            <StatsBar
              curSpend={curSpend} desSpend={desSpend}
              utilizationPct={utilizationPct} utilColor={utilColor}
              budget={budget} isOver={isOver} compact
            />
          </div>
        </div>

        <div style={{ maxWidth: 1320, margin: "0 auto", padding: T.pad }}>

          {/* Section header */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: C.subtle, textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
              Allocation plan
            </span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
            <span style={{ fontSize: 10, color: C.subtle, fontStyle: "italic", whiteSpace: "nowrap" }}>
              sliders constrained to free pool
            </span>
          </div>

          {/* 2×2 grid + sidebar */}
          <div style={{ display: "flex", gap: T.gap, alignItems: "flex-start" }}>
            <div style={{
              flex: 1, minWidth: 0,
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
                  freePool={pool}
                  onTargetChange={handleTargetChange}
                  tokens={T}
                />
              ))}
            </div>
            <div style={{ width: 220, flexShrink: 0 }}>
              <AllocationSidebar budget={budget} targetX={targetX} tokens={T} />
            </div>
          </div>

        </div>
      </div>

    </main>
  );
}
