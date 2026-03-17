import type { Metadata } from "next";
import VelocityClient from "./client";

export const metadata: Metadata = {
  title: "Deployment Velocity Cost Calculator — DecisionDock",
  description:
    "See the real cost of shipping faster. From weekly to elite CI/CD — find where deployment velocity investment stops paying off.",
  alternates: {
    canonical: "https://decision-dock.vercel.app/velocity",
  },
  openGraph: {
    title: "How fast should you actually ship? — DecisionDock",
    description:
      "Interactive deployment velocity cost curve. See the real cost of elite CI/CD and whether shipping 50× per day pays off.",
    url: "https://decision-dock.vercel.app/velocity",
    type: "website",
    siteName: "DecisionDock",
  },
  twitter: {
    card: "summary_large_image",
    title: "How fast should you actually ship? — DecisionDock",
    description:
      "Interactive deployment velocity cost curve. See the real cost of elite CI/CD and whether shipping 50× per day pays off.",
  },
};

export default function VelocityPage() {
  return <VelocityClient />;
}
