"use client";

import type { DomainKey } from "@/lib/models";
import { DOMAINS, DOMAIN_KEYS } from "@/lib/models";
import { COLORS } from "@/lib/constants";

interface DomainTabsProps {
  activeDomain: DomainKey;
  onDomainChange: (domain: DomainKey) => void;
}

export function DomainTabs({ activeDomain, onDomainChange }: DomainTabsProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: 4,
        padding: 4,
        background: COLORS.white,
        borderRadius: 12,
        border: `1px solid ${COLORS.border}`,
        width: "fit-content",
        margin: "0 auto",
      }}
    >
      {DOMAIN_KEYS.map((key) => (
        <button
          key={key}
          onClick={() => onDomainChange(key)}
          style={{
            padding: "10px 24px",
            fontSize: 14,
            fontWeight: activeDomain === key ? 600 : 400,
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: activeDomain === key ? COLORS.navy : "transparent",
            color: activeDomain === key ? COLORS.white : COLORS.med,
            transition: "all 0.2s ease",
          }}
        >
          {DOMAINS[key].label}
        </button>
      ))}
    </div>
  );
}
