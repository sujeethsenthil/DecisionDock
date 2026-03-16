import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { StoreHydrator } from "@/components/platform/StoreHydrator";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "DecisionDock — Where does your next investment stop paying off?",
    template: "%s",
  },
  description: "Interactive diminishing returns calculators for engineering leaders. See the exact cost of each uptime nine, each millisecond of latency, each step up in deployment velocity and capacity.",
  openGraph: {
    title: "DecisionDock — Decision Intelligence for Engineering Leaders",
    description: "See where your next infrastructure dollar stops paying off. Interactive cost curves for uptime, latency, velocity, and capacity.",
    type: "website",
    siteName: "DecisionDock",
  },
  twitter: {
    card: "summary_large_image",
    title: "DecisionDock — Where does your next investment stop paying off?",
    description: "Interactive diminishing returns curves for engineering leaders.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <StoreHydrator />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
