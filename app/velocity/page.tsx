import type { Metadata } from "next";
import VelocityClient from "./client";

export const metadata: Metadata = {
  title: "Deployment Velocity Cost Calculator — DecisionDock",
  description: "See the real cost of shipping faster. From weekly to elite CI/CD — find where deployment velocity investment stops paying off.",
  openGraph: {
    title: "Should you ship faster? — DecisionDock",
    description: "Interactive deployment velocity curve. See what moving from weekly to daily deploys costs and where the returns flatten.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Should you ship faster? — DecisionDock",
    description: "Interactive deployment velocity curve. See what moving from weekly to daily deploys costs and where the returns flatten.",
  },
};

export default function VelocityPage() {
  return <VelocityClient />;
}
