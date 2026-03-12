"use client";

import { ModuleTabs } from "@/components/platform/ModuleTabs";
import { ModuleHero } from "@/components/platform/ModuleHero";

export default function CSATPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#F0F4F8" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "30px 48px 16px" }}>
        <ModuleHero
          headline="When does delighting customers stop paying off?"
          subtext="Map the exponential cost of CSAT improvements against diminishing revenue impact."
        />
        <ModuleTabs />
      </div>
    </main>
  );
}
