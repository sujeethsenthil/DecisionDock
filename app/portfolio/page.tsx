import type { Metadata } from "next";
import PortfolioClient from "./client";

export const metadata: Metadata = {
  title: "Portfolio Budget Allocator — DecisionDock",
  description: "Set your budget. See uptime, latency, velocity, and capacity against it. Find the allocation where every engineering dollar earns its place.",
  openGraph: {
    title: "Where should your next engineering dollar go? — DecisionDock",
    description: "Cross-domain budget allocation with diminishing returns curves. See the tradeoffs across uptime, latency, velocity, and capacity.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Where should your next engineering dollar go? — DecisionDock",
    description: "Cross-domain budget allocation with diminishing returns curves. See the tradeoffs across uptime, latency, velocity, and capacity.",
  },
};

export default function PortfolioPage() {
  return <PortfolioClient />;
}
