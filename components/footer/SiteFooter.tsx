import { C } from "@/lib/constants";

export function SiteFooter() {
  return (
    <div style={{ marginTop: 20, textAlign: "center", paddingBottom: 12 }}>
      <div style={{ fontSize: 11, color: C.subtle }}>
        Part of the <span style={{ fontWeight: 600, color: C.navy }}>DecisionDock</span> portfolio — Decision frameworks for engineering leaders
      </div>
    </div>
  );
}
