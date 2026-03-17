"use client";

import { useState } from "react";
import { C } from "@/lib/constants";

interface Props {
  onStartTour: () => void;
  toured: boolean;
}

// Floating tutor button — bottom right, always present.
// Glows with "Quick tour?" label until first tour complete.
// After tour: quiet replay button.
export function TutorButton({ onStartTour, toured }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24,
      zIndex: 200,
      display: "flex", alignItems: "center", gap: 10,
    }}>
      {/* Label — always visible when not toured, hover-only after */}
      <div style={{
        background: C.navy, color: "#fff",
        fontSize: 12, fontWeight: 500,
        padding: "6px 12px", borderRadius: 8,
        whiteSpace: "nowrap",
        opacity: !toured || hovered ? 1 : 0,
        transform: !toured || hovered ? "translateX(0)" : "translateX(6px)",
        transition: "opacity 0.2s ease, transform 0.2s ease",
        pointerEvents: "none",
        letterSpacing: "0.01em",
      }}>
        {toured ? "Replay tour" : "Quick tour?"}
      </div>

      <button
        onClick={onStartTour}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        title={toured ? "Replay tour" : "Quick tour?"}
        className={!toured ? "tutor-btn-glow" : ""}
        style={{
          width: 44, height: 44, borderRadius: "50%",
          background: hovered ? C.dark : C.navy,
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 12px rgba(15,23,42,0.2)",
          transition: "background 0.15s ease",
          flexShrink: 0, position: "relative",
        }}
      >
        {/* Graduation cap icon */}
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 3L2 7l8 4 8-4-8-4z" fill="rgba(255,255,255,0.9)" />
          <path d="M5 9.5v4c0 0 2 2 5 2s5-2 5-2v-4"
            stroke="rgba(255,255,255,0.9)" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" />
          <line x1="18" y1="7" x2="18" y2="12"
            stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
