import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Nines Calculator — Should you invest in the next nine?",
  description:
    "Each nine of uptime multiplies your total cost by 10×. Visualize the ROI of your next reliability investment.",
  openGraph: {
    title: "The Nines Calculator — DecisionDock",
    description: "Should you invest in the next nine? Each nine of uptime ≈ 10× your total cost.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
