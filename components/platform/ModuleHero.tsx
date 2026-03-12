"use client";

import { C } from "@/lib/constants";
import { useViewport, useTokens } from "@/lib/hooks";

interface Props {
  headline: string;
  subtext: string;
}

export function ModuleHero({ headline, subtext }: Props) {
  const { h } = useViewport();
  const T = useTokens(h);

  return (
    <div style={{ textAlign: "center", marginBottom: T.heroMb }}>
      <h1
        style={{
          fontSize: T.hero,
          fontWeight: 800,
          color: C.navy,
          letterSpacing: "-0.035em",
          lineHeight: 1.1,
          margin: 0,
        }}
      >
        {headline}
      </h1>
      <p style={{ color: C.med, fontSize: T.sub, marginTop: 5, lineHeight: 1.4 }}>
        {subtext}
      </p>
    </div>
  );
}
