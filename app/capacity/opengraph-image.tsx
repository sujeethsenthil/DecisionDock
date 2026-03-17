import { ImageResponse } from "next/og";

export const alt = "Infrastructure Capacity Cost Calculator — DecisionDock";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(<Card />, { ...size });
}

function Card() {
  return (
    <div style={{ width: 1200, height: 630, background: "#0F172A", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 48, height: 48, borderRadius: 12, background: "#1E293B", border: "1px solid #334155" }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: "#3B82F6", letterSpacing: "-0.04em" }}>DD</span>
        </div>
        <span style={{ fontSize: 18, fontWeight: 600, color: "#94A3B8" }}>DecisionDock</span>
        <div style={{ display: "flex", marginLeft: 8, paddingLeft: 12, paddingRight: 12, paddingTop: 4, paddingBottom: 4, borderRadius: 99, background: "#EF444422", border: "1px solid #EF444444" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#EF4444", textTransform: "uppercase", letterSpacing: "0.08em" }}>Capacity</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 52, fontWeight: 800, color: "#F8FAFC", lineHeight: 1.1, letterSpacing: "-0.02em", maxWidth: 880 }}>
          How much headroom is enough?
        </div>
        <div style={{ fontSize: 22, color: "#64748B", lineHeight: 1.5, maxWidth: 720 }}>
          From minimal buffer to full N+2 redundancy — find where capacity investment stops paying off.
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444" }} />
        <span style={{ fontSize: 15, color: "#64748B", fontWeight: 500 }}>Capacity · decision-dock.vercel.app</span>
      </div>
    </div>
  );
}
