import type { Metadata } from "next";
import UptimeClient from "./client";

export const metadata: Metadata = {
  title: "Uptime Cost Calculator — DecisionDock",
  description: "See the exact cost of each additional nine of reliability. From 99% to 99.9999% — find where diminishing returns kick in for your service.",
  openGraph: {
    title: "Should you invest in the next nine? — DecisionDock",
    description: "Interactive uptime cost curve. See where each additional nine stops paying off.",
    type: "website",
  },
};

export default function UptimePage() {
  return <UptimeClient />;
}
