"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DomainKey } from "@/lib/models";
import { DOMAINS } from "@/lib/models";

interface DomainTabsProps {
  activeDomain: DomainKey;
  onDomainChange: (key: DomainKey) => void;
}

const DOMAIN_ORDER: DomainKey[] = ["uptime", "marketing", "coverage", "csat"];

export function DomainTabs({ activeDomain, onDomainChange }: DomainTabsProps) {
  return (
    <Tabs
      value={activeDomain}
      onValueChange={(v) => onDomainChange(v as DomainKey)}
      className="w-full"
    >
      <TabsList className="h-12 w-full justify-start rounded-lg bg-transparent p-0">
        {DOMAIN_ORDER.map((key) => (
          <TabsTrigger
            key={key}
            value={key}
            className="rounded-md px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-[#3B82F6]"
          >
            {DOMAINS[key].label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
