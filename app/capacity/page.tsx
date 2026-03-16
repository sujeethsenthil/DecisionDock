import type { Metadata } from "next";
import CapacityClient from "./client";

export const metadata: Metadata = {
  title: "Infrastructure Capacity Cost Calculator — DecisionDock",
  description: "See the real cost of each level of headroom. From minimal buffer to full redundancy — find where capacity investment stops paying off.",
  openGraph: {
    title: "How much headroom do you actually need? — DecisionDock",
    description: "Interactive capacity cost curve. See where each buffer level stops paying off.",
    type: "website",
  },
};

export default function CapacityPage() {
  return <CapacityClient />;
}
