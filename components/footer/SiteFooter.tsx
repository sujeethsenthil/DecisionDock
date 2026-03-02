"use client";

import { C } from "@/lib/constants";
import { useTokens, useViewport } from "@/lib/hooks";

export function SiteFooter() {
  const { h } = useViewport();
  const T = useTokens(h);

  return (
    <div style={{ marginTop: T.footMt, textAlign: "center", paddingBottom: 6 }}>
      <div style={{ fontSize: T.footFs, color: C.subtle }}>
        Part of the <span style={{ fontWeight: 600, color: C.navy }}>DecisionDock</span> portfolio — Decision frameworks for engineering leaders
      </div>
    </div>
  );
}
