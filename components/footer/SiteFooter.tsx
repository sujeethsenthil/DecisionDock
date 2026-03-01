import { COLORS } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer style={{ marginTop: 64, textAlign: "center", paddingBottom: 32 }}>
      <div style={{ fontSize: 12, color: COLORS.med }}>
        Part of the{" "}
        <span style={{ fontWeight: 600, color: COLORS.navy }}>DecisionDock</span>{" "}
        portfolio — Decision frameworks for engineering leaders
      </div>
    </footer>
  );
}
