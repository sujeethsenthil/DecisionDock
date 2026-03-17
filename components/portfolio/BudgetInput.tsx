"use client";

import { useState } from "react";
import { C } from "@/lib/constants";
import { fcFull, parseCurrencyInput } from "@/lib/format";
import { useTokens } from "@/lib/hooks";
import { Industry, Scale } from "@/lib/models/portfolio";

interface Props {
  budget: number;
  industry: Industry;
  scale: Scale;
  onBudgetChange: (v: number) => void;
  onIndustryChange: (v: Industry) => void;
  onScaleChange: (v: Scale) => void;
  tokens: ReturnType<typeof useTokens>;
}

const INDUSTRY_LABELS: Record<Industry, string> = {
  saas: "SaaS / Tech",
  ecomm: "E-commerce",
  fintech: "Fintech",
  health: "Healthcare",
};

const SCALE_LABELS: Record<Scale, string> = {
  startup: "Startup (1–50)",
  mid: "Mid-market (51–500)",
  enterprise: "Enterprise (500+)",
};

export function BudgetInput({
  budget, industry, scale,
  onBudgetChange, onIndustryChange, onScaleChange,
  tokens: T,
}: Props) {
  const [budgetFocused, setBudgetFocused] = useState(false);
  const [budgetEditStr, setBudgetEditStr] = useState("");

  const selectStyle = {
    width: "100%",
    padding: "10px 12px",
    fontSize: 13,
    fontWeight: 500,
    color: C.navy,
    background: C.white,
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    cursor: "pointer",
    appearance: "none" as const,
    WebkitAppearance: "none" as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394A3B8' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
    paddingRight: 32,
    outline: "none",
  };

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr",
        gap: T.gap,
        marginBottom: 8,
      }}>
        {/* Budget input */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: C.subtle, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>
            Annual Operating Budget
          </div>
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 14, fontWeight: 600, color: C.subtle,
            }}>$</span>
            <input
              type="text"
              inputMode="numeric"
              value={budgetFocused ? budgetEditStr : fcFull(budget).slice(1)}
              onChange={(e) => {
                setBudgetEditStr(e.target.value);
                const v = parseCurrencyInput(e.target.value);
                if (!isNaN(v) && v > 0) onBudgetChange(v);
              }}
              onFocus={() => {
                setBudgetEditStr(String(Math.round(budget)));
                setBudgetFocused(true);
              }}
              onBlur={(e) => {
                const v = parseCurrencyInput(budgetEditStr || e.currentTarget.value);
                if (!isNaN(v) && v > 0) onBudgetChange(v);
                setBudgetFocused(false);
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
                fontVariantNumeric: "tabular-nums",
              }}
            />
          </div>
        </div>

        {/* Industry */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: C.subtle, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>
            Industry
          </div>
          <select
            value={industry}
            onChange={(e) => onIndustryChange(e.target.value as Industry)}
            style={selectStyle}
          >
            {(Object.keys(INDUSTRY_LABELS) as Industry[]).map((k) => (
              <option key={k} value={k}>{INDUSTRY_LABELS[k]}</option>
            ))}
          </select>
        </div>

        {/* Scale */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: C.subtle, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>
            Company Scale
          </div>
          <select
            value={scale}
            onChange={(e) => onScaleChange(e.target.value as Scale)}
            style={selectStyle}
          >
            {(Object.keys(SCALE_LABELS) as Scale[]).map((k) => (
              <option key={k} value={k}>{SCALE_LABELS[k]}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ fontSize: 10, color: C.subtle, fontStyle: "italic", textAlign: "center" }}>
        Starting points are calibrated to your industry. Use sliders to adjust.
      </div>
    </div>
  );
}
