"use client";

import { ModuleTabs } from "@/components/platform/ModuleTabs";
import { ModuleHero } from "@/components/platform/ModuleHero";

export default function MarketingPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#F0F4F8" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "30px 48px 16px" }}>
        <ModuleHero
          headline="Where does your next dollar stop working?"
          subtext="Visualize the saturation curve of your ad spend. See when marginal CPA exceeds marginal value."
        />
        <ModuleTabs />
      </div>
    </main>
  );
}
