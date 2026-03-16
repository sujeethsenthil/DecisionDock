import type { Metadata } from "next";
import PortfolioClient from "./client";

export const metadata: Metadata = {
  title: "Portfolio Budget Allocator — DecisionDock",
  description: "Set your budget. See all four domains against it. Find the allocation where every dollar earns its place.",
  openGraph: {
    title: "Where should your next dollar go? — DecisionDock",
    description: "Cross-domain budget allocation with real diminishing returns curves. Find the tradeoffs your team has never seen before.",
    type: "website",
  },
};

export default function PortfolioPage() {
  return <PortfolioClient />;
}
