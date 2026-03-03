"use client";

import { useState, useEffect } from "react";
import { C } from "@/lib/constants";

interface Props {
  onStartTour: () => void;
  onSkip: () => void;
}

export function WelcomeModal({ onStartTour, onSkip }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 15000,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(15,23,42,0.4)",
      backdropFilter: "blur(4px)",
      opacity: visible ? 1 : 0,
      transition: "opacity 0.4s ease",
    }}>
      <div style={{
        background: C.white, borderRadius: 20, padding: "40px 44px",
        maxWidth: 440, width: "90%",
        boxShadow: "0 16px 48px rgba(0,0,0,0.16), 0 4px 16px rgba(0,0,0,0.08)",
        textAlign: "center",
        transform: visible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.97)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>📊</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.navy, lineHeight: 1.3, marginBottom: 12 }}>
          See where your reliability investment stops paying off
        </div>
        <div style={{ fontSize: 15, color: C.body, lineHeight: 1.6, marginBottom: 28 }}>
          This tool shows the exact cost of each uptime level — and whether the next one is worth it for your team.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            onClick={onStartTour}
            style={{
              background: C.navy, color: C.white, border: "none",
              borderRadius: 12, padding: "14px 28px", fontSize: 15, fontWeight: 600,
              cursor: "pointer", transition: "all 0.15s",
              boxShadow: "0 2px 8px rgba(15,23,42,0.2)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = C.dark)}
            onMouseLeave={(e) => (e.currentTarget.style.background = C.navy)}
          >
            Take the 30-second tour
          </button>
          <button
            onClick={onSkip}
            style={{
              background: "none", color: C.subtle, border: "none",
              padding: "10px", fontSize: 14, cursor: "pointer",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.med)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.subtle)}
          >
            I&apos;ll explore on my own
          </button>
        </div>
      </div>
    </div>
  );
}
