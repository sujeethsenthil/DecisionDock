import type { Metadata } from "next";
import LatencyClient from "./client";

export const metadata: Metadata = {
  title: "Latency Cost Calculator — DecisionDock",
  description: "See the exact cost of chasing the next millisecond. From 2s to sub-10ms — find where your latency investment stops paying off.",
  openGraph: {
    title: "Should you chase the next millisecond? — DecisionDock",
    description: "Interactive latency cost curve. See where each ms of improvement stops paying off.",
    type: "website",
  },
};

export default function LatencyPage() {
  return <LatencyClient />;
}
