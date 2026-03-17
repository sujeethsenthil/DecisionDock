import type { Metadata } from "next";
import UptimeClient from "./client";

export const metadata: Metadata = {
  title: "Uptime Cost Calculator — DecisionDock",
  description:
    "See the exact cost of each reliability nine. From 99% to 99.9999% — find where diminishing returns kick in and whether your next nine is worth it.",
  alternates: {
    canonical: "https://decision-dock.vercel.app/uptime",
  },
  openGraph: {
    title: "Should you invest in the next nine? — DecisionDock",
    description:
      "Interactive uptime cost curve. See the exact price of 99.99% vs 99.999% and whether your service revenue justifies the investment.",
    url: "https://decision-dock.vercel.app/uptime",
    type: "website",
    siteName: "DecisionDock",
  },
  twitter: {
    card: "summary_large_image",
    title: "Should you invest in the next nine? — DecisionDock",
    description:
      "Interactive uptime cost curve. See the exact price of 99.99% vs 99.999% and whether your service revenue justifies the investment.",
  },
};

export default function UptimePage() {
  return <UptimeClient />;
}
