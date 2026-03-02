import { C } from "@/lib/constants";

export function HeroHeadline() {
  return (
    <div style={{ textAlign: "center", marginBottom: 24 }}>
      <h1 style={{ fontSize: 36, fontWeight: 800, color: C.navy, letterSpacing: "-0.035em", lineHeight: 1.1, margin: 0 }}>
        Should you invest in the next nine?
      </h1>
      <p style={{ color: C.med, fontSize: 15, marginTop: 8, lineHeight: 1.4 }}>
        Each nine of uptime ≈ 10× your total cost. Drag the slider to find out if it's worth it.
      </p>
    </div>
  );
}
