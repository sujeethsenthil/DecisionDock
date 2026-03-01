"use client";

import type { DomainKey } from "@/lib/models";
import { DOMAINS } from "@/lib/models";

interface DomainTabsProps {
  activeDomain: DomainKey;
  onDomainChange: (key: DomainKey) => void;
}

const DOMAIN_ORDER: DomainKey[] = ["uptime", "marketing", "coverage", "csat"];

export function DomainTabs({ activeDomain, onDomainChange }: DomainTabsProps) {
  return (
    <nav
      role="tablist"
      aria-label="Domain"
      className="border-b border-[#D0D5DD]"
      style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "24px" }}
    >
      {DOMAIN_ORDER.map((key, index) => {
        const isActive = activeDomain === key;
        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${key}`}
            id={`tab-${key}`}
            onClick={() => onDomainChange(key)}
            className="-mb-px rounded-t-md border-b-2 px-4 py-3 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 hover:bg-[#3B82F6]/5"
            style={{
              borderBottomColor: isActive ? "#3B82F6" : "transparent",
              color: isActive ? "#1B2A4A" : "#555555",
              fontWeight: isActive ? 600 : 400,
              marginRight: index < DOMAIN_ORDER.length - 1 ? 8 : 0,
            }}
          >
            {DOMAINS[key].label}
          </button>
        );
      })}
    </nav>
  );
}
