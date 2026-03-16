import type { Metadata } from "next";
import LatencyClient from "./client";

export const metadata: Metadata = {
  title: "Latency Cost Calculator — DecisionDock",
  description: "See the real cost of chasing milliseconds. From 2s to sub-10ms — find where latency investment stops paying off for your users and budget.",
  openGraph: {
    title: "Should you chase the next millisecond? — DecisionDock",
    description: "Interactive latency cost curve. See where each ms of improvement stops paying off and what your users actually notice.",
    type: "website",
  },
};

export default function LatencyPage() {
  return <LatencyClient />;
}
