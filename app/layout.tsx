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
  title: "The Nines Calculator — What does the next nine actually cost?",
  description:
    "Visualize the exponential cost of incremental perfection. See how each additional nine of uptime, each dollar of ad spend, and each point of CSAT hits diminishing returns.",
  openGraph: {
    title: "The Nines Calculator",
    description: "What does the next nine actually cost?",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
