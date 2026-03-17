import type { Metadata } from "next";
import CapacityClient from "./client";

export const metadata: Metadata = {
  title: "Infrastructure Capacity Cost Calculator — DecisionDock",
  description:
    "See the real cost of each level of headroom. From minimal buffer to N+2 redundancy — find where capacity investment stops paying off.",
  alternates: {
    canonical: "https://decision-dock.vercel.app/capacity",
  },
  openGraph: {
    title: "How much headroom is enough? — DecisionDock",
    description:
      "Interactive capacity cost curve. See the real price of N+1 vs N+2 redundancy and whether your risk profile justifies it.",
    url: "https://decision-dock.vercel.app/capacity",
    type: "website",
    siteName: "DecisionDock",
  },
  twitter: {
    card: "summary_large_image",
    title: "How much headroom is enough? — DecisionDock",
    description:
      "Interactive capacity cost curve. See the real price of N+1 vs N+2 redundancy and whether your risk profile justifies it.",
  },
};

export default function CapacityPage() {
  return <CapacityClient />;
}
