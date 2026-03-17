import type { Metadata } from "next";
import LatencyClient from "./client";

export const metadata: Metadata = {
  title: "Latency Cost Calculator — DecisionDock",
  description:
    "See the real cost of chasing milliseconds. From 2s to sub-10ms — find where latency investment stops paying off for your users and budget.",
  alternates: {
    canonical: "https://decision-dock.vercel.app/latency",
  },
  openGraph: {
    title: "Is chasing milliseconds worth the cost? — DecisionDock",
    description:
      "Interactive latency cost curve. See the real price of sub-100ms and whether your users will notice the difference.",
    url: "https://decision-dock.vercel.app/latency",
    type: "website",
    siteName: "DecisionDock",
  },
  twitter: {
    card: "summary_large_image",
    title: "Is chasing milliseconds worth the cost? — DecisionDock",
    description:
      "Interactive latency cost curve. See the real price of sub-100ms and whether your users will notice the difference.",
  },
};

export default function LatencyPage() {
  return <LatencyClient />;
}
