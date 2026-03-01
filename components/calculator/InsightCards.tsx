"use client";

import type { ThresholdAnnotation } from "@/lib/models";
import { COLORS } from "@/lib/constants";

interface InsightCardsProps {
  thresholds: ThresholdAnnotation[];
}

export function InsightCards({ thresholds }: InsightCardsProps) {
  if (thresholds.length === 0) return null;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      {thresholds.map((t, i) => (
        <div
          key={`${t.trigger}-${i}`}
          style={{
            flex: "1 1 calc(50% - 6px)",
            minWidth: 280,
            background: COLORS.white,
            borderRadius: 12,
            border: `1px solid ${COLORS.border}`,
            padding: "16px 20px",
            borderLeft: `4px solid ${COLORS.amber}`,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.navy }}>
            <span style={{ marginRight: 8 }}>{t.icon}</span>
            {t.title}
          </div>
          <div style={{ fontSize: 13, color: COLORS.dark, marginTop: 4, lineHeight: 1.5 }}>
            {t.body}
          </div>
        </div>
      ))}
    </div>
  );
}
