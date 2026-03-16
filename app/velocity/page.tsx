import type { Metadata } from "next";
import VelocityClient from "./client";

export const metadata: Metadata = {
  title: "Deployment Velocity Cost Calculator — DecisionDock",
  description: "See the real cost of shipping faster. From weekly releases to elite CI/CD — find where deployment velocity stops paying off.",
  openGraph: {
    title: "Should you ship faster? — DecisionDock",
    description: "Interactive deployment velocity curve. See where each step up in cadence stops paying off.",
    type: "website",
  },
};

export default function VelocityPage() {
  return <VelocityClient />;
}
