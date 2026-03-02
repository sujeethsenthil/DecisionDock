"use client";

import { C } from "@/lib/constants";
import { useTokens, useViewport } from "@/lib/hooks";

export function HeroHeadline() {
  const { h } = useViewport();
  const T = useTokens(h);

  return (
    <div style={{ textAlign: "center", marginBottom: T.heroMb }}>
      <h1 style={{ fontSize: T.hero, fontWeight: 800, color: C.navy, letterSpacing: "-0.035em", lineHeight: 1.1, margin: 0 }}>
        Should you invest in the next nine?
      </h1>
      <p style={{ color: C.med, fontSize: T.sub, marginTop: 5, lineHeight: 1.4 }}>
        Click the chart to set where you are today. Drag the slider to see what the next level costs.
      </p>
    </div>
  );
}
