"use client";

import { useState, useEffect, useCallback } from "react";

interface Stat {
  number: string;
  line1: string;
  line2: string;
  source: string;
}

const STATS: Stat[] = [
  {
    number: "$400B",
    line1: "lost to downtime annually",
    line2: "by Global 2000 companies.",
    source: "Oxford Economics",
  },
  {
    number: "10×",
    line1: "the cost of each additional nine",
    line2: "of uptime — and most teams don't see it coming.",
    source: "Google SRE Book",
  },
  {
    number: "$44.5B",
    line1: "in cloud infrastructure",
    line2: "is projected to be wasted in 2025.",
    source: "Harness State of Cloud Cost",
  },
  {
    number: "98%",
    line1: "of organizations say one hour",
    line2: "of downtime costs over $100,000.",
    source: "ITIC Hourly Cost of Downtime Survey",
  },
  {
    number: "65%",
    line1: "of teams have adopted SLOs",
    line2: "but only 40% use them for actual decisions.",
    source: "Catchpoint SRE Report 2025",
  },
];

interface Props {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<"in" | "visible" | "out">("in");
  const [exiting, setExiting] = useState(false);

  const advanceOrFinish = useCallback(() => {
    if (currentIndex < STATS.length - 1) {
      setPhase("out");
      setTimeout(() => {
        setCurrentIndex((i) => i + 1);
        setPhase("in");
        setTimeout(() => setPhase("visible"), 50);
      }, 400);
    } else {
      setExiting(true);
      setTimeout(onComplete, 600);
    }
  }, [currentIndex, onComplete]);

  // Auto-advance each stat
  useEffect(() => {
    setTimeout(() => setPhase("visible"), 50);
    const timer = setTimeout(advanceOrFinish, 2800);
    return () => clearTimeout(timer);
  }, [currentIndex, advanceOrFinish]);

  const stat = STATS[currentIndex];

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 20000,
        background: "#0F172A",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        opacity: exiting ? 0 : 1,
        transition: "opacity 0.6s ease",
        cursor: "pointer",
      }}
      onClick={advanceOrFinish}
    >
      {/* Stat content */}
      <div
        key={currentIndex}
        style={{
          textAlign: "center", maxWidth: 560, padding: "0 32px",
          opacity: phase === "visible" ? 1 : 0,
          transform: phase === "visible" ? "translateX(0)" : phase === "in" ? "translateX(60px)" : "translateX(-60px)",
          transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div style={{
          fontSize: 80, fontWeight: 800, color: "#FFFFFF",
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "-0.04em", lineHeight: 1,
          marginBottom: 20,
        }}>
          {stat.number}
        </div>
        <div style={{
          fontSize: 20, fontWeight: 300, color: "rgba(255,255,255,0.75)",
          lineHeight: 1.5, letterSpacing: "-0.01em",
        }}>
          {stat.line1}
        </div>
        <div style={{
          fontSize: 20, fontWeight: 300, color: "rgba(255,255,255,0.75)",
          lineHeight: 1.5, letterSpacing: "-0.01em",
        }}>
          {stat.line2}
        </div>
        <div style={{
          fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.25)",
          marginTop: 16, letterSpacing: "0.02em",
        }}>
          — {stat.source}
        </div>
      </div>

      {/* Progress dots */}
      <div style={{
        position: "absolute", bottom: 60,
        display: "flex", gap: 8,
      }}>
        {STATS.map((_, i) => (
          <div key={i} style={{
            width: i === currentIndex ? 24 : 8,
            height: 8,
            borderRadius: 4,
            background: i === currentIndex ? "rgba(255,255,255,0.8)" : i < currentIndex ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.15)",
            transition: "all 0.3s ease",
          }} />
        ))}
      </div>

      {/* Skip hint */}
      <div style={{
        position: "absolute", bottom: 30,
        fontSize: 12, color: "rgba(255,255,255,0.2)",
      }}>
        Click to skip
      </div>
    </div>
  );
}
