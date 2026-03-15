"use client";

import { useState, useEffect, useCallback } from "react";

interface Stat {
  number: string;
  line1: string;
  line2: string;
  source: string;
}

// 3 stats max — 2s each = 6s total worst case vs 14s before
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
    line2: "of uptime — most teams never see it coming.",
    source: "Google SRE Book",
  },
  {
    number: "65%",
    line1: "of teams have adopted SLOs",
    line2: "but only 40% use them for actual decisions.",
    source: "Catchpoint SRE Report 2025",
  },
];

const AUTO_ADVANCE_MS = 2000;

interface Props {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: Props) {
  const [index, setIndex]     = useState(0);
  const [phase, setPhase]     = useState<"in" | "visible" | "out">("in");
  const [exiting, setExiting] = useState(false);

  const finish = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    setTimeout(onComplete, 400);
  }, [exiting, onComplete]);

  const advance = useCallback(() => {
    if (exiting) return;
    if (index < STATS.length - 1) {
      setPhase("out");
      setTimeout(() => {
        setIndex((i) => i + 1);
        setPhase("in");
        setTimeout(() => setPhase("visible"), 30);
      }, 300);
    } else {
      finish();
    }
  }, [index, exiting, finish]);

  // Fade in on mount and on each stat change
  useEffect(() => {
    const t = setTimeout(() => setPhase("visible"), 30);
    return () => clearTimeout(t);
  }, [index]);

  // Auto-advance
  useEffect(() => {
    const t = setTimeout(advance, AUTO_ADVANCE_MS);
    return () => clearTimeout(t);
  }, [advance]);

  const stat = STATS[index];

  return (
    <div
      onClick={advance}
      style={{
        position: "fixed", inset: 0, zIndex: 20000,
        background: "#0F172A",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        opacity: exiting ? 0 : 1,
        transition: "opacity 0.4s ease",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      {/* Stat */}
      <div
        key={index}
        style={{
          textAlign: "center", maxWidth: 560, padding: "0 40px",
          opacity: phase === "visible" ? 1 : 0,
          transform: phase === "visible"
            ? "translateX(0)"
            : phase === "in" ? "translateX(48px)" : "translateX(-48px)",
          transition: "opacity 0.35s ease, transform 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div style={{
          fontSize: 80, fontWeight: 800,
          fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
          color: "#FFFFFF",
          letterSpacing: "-0.04em", lineHeight: 1,
          marginBottom: 20,
        }}>
          {stat.number}
        </div>
        <div style={{
          fontSize: 20, fontWeight: 300,
          color: "rgba(255,255,255,0.75)",
          lineHeight: 1.5, letterSpacing: "-0.01em",
        }}>
          {stat.line1}
        </div>
        <div style={{
          fontSize: 20, fontWeight: 300,
          color: "rgba(255,255,255,0.75)",
          lineHeight: 1.5, letterSpacing: "-0.01em",
        }}>
          {stat.line2}
        </div>
        <div style={{
          fontSize: 11, color: "rgba(255,255,255,0.25)",
          marginTop: 16, letterSpacing: "0.06em", textTransform: "uppercase",
        }}>
          — {stat.source}
        </div>
      </div>

      {/* Progress bar — cleaner than dots, shows time passing */}
      <div style={{
        position: "absolute", bottom: 80,
        width: 120, height: 2,
        background: "rgba(255,255,255,0.12)",
        borderRadius: 2, overflow: "hidden",
      }}>
        <div style={{
          height: "100%",
          width: `${((index + 1) / STATS.length) * 100}%`,
          background: "rgba(255,255,255,0.7)",
          borderRadius: 2,
          transition: "width 0.3s ease",
        }} />
      </div>

      {/* Skip — prominent, can't miss it */}
      <button
        onClick={(e) => { e.stopPropagation(); finish(); }}
        style={{
          position: "absolute", bottom: 28,
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 99,
          padding: "8px 20px",
          fontSize: 12, fontWeight: 600,
          color: "rgba(255,255,255,0.5)",
          cursor: "pointer",
          letterSpacing: "0.06em", textTransform: "uppercase",
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.14)";
          e.currentTarget.style.color = "rgba(255,255,255,0.85)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.08)";
          e.currentTarget.style.color = "rgba(255,255,255,0.5)";
        }}
      >
        Skip →
      </button>
    </div>
  );
}
