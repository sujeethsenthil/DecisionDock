import type { Metadata } from "next";
import CapacityClient from "./client";

export const metadata: Metadata = {
  title: "Infrastructure Capacity Cost Calculator — DecisionDock",
  description: "See the real cost of each level of headroom. From minimal buffer to N+2 redundancy — find where capacity investment stops paying off.",
  openGraph: {
    title: "How much headroom do you actually need? — DecisionDock",
    description: "Interactive capacity cost curve. See what N+1 vs N+2 provisioning costs and where the redundancy returns flatten.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How much headroom do you actually need? — DecisionDock",
    description: "Interactive capacity cost curve. See what N+1 vs N+2 provisioning costs and where the redundancy returns flatten.",
  },
};

export default function CapacityPage() {
  return <CapacityClient />;
}
