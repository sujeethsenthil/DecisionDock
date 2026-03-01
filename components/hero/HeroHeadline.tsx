import { COLORS } from "@/lib/constants";

export function HeroHeadline() {
  return (
    <div style={{ textAlign: "center", marginBottom: 48 }}>
      <h1
        style={{
          fontSize: 42,
          fontWeight: 700,
          color: COLORS.navy,
          letterSpacing: "-0.025em",
          lineHeight: 1.15,
          marginBottom: 8,
        }}
      >
        What does the next nine actually cost?
      </h1>
      <p style={{ color: COLORS.med, fontSize: 16 }}>
        Drag the slider. Watch the cost explode.
      </p>
    </div>
  );
}
