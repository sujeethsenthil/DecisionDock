"use client";

import { ModuleTabs } from "@/components/platform/ModuleTabs";
import { ModuleHero } from "@/components/platform/ModuleHero";

export default function CoveragePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#F0F4F8" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "30px 48px 16px" }}>
        <ModuleHero
          headline="When does more testing stop finding bugs?"
          subtext="See the logarithmic effort curve of test coverage — and find your team's optimal stopping point."
        />
        <ModuleTabs />
      </div>
    </main>
  );
}
