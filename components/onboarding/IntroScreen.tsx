"use client";

import { useEffect, useRef, useState } from "react";

export const INTRO_KEY = "dd_intro_done";

interface Props {
  onDone: () => void;
}

const DURATION = 7000;
const BAR_XS   = [6, 28, 50, 72];
const BAR_W    = 16;
const SVG_H    = 64;

// ── Panel definitions ─────────────────────────────────────────
// Color scheme: amber for "the bet" (warm, active),
// red-tinted for "blind spot" (warning), emerald for "clarity" (outcome)
const PANELS = [
  {
    label:      "The bet",
    labelColor: "#F59E0B",
    borderTop:  "2px solid rgba(245,158,11,0.5)",
    bars: [
      { h: 18, fill: "rgba(255,255,255,0.1)" },
      { h: 46, fill: "#F59E0B"              },
      { h: 12, fill: "rgba(255,255,255,0.1)" },
      { h: 14, fill: "rgba(255,255,255,0.1)" },
    ],
    badge:    { text: "doubled down", color: "rgba(245,158,11,0.7)" },
    caption:  "You backed one area heavily. The others got what was left.",
    question: false,
    check:    false,
  },
  {
    label:      "The blind spot",
    labelColor: "#EF4444",
    borderTop:  "2px solid rgba(239,68,68,0.5)",
    bars: [
      { h: 18, fill: "rgba(255,255,255,0.1)" },
      { h: 46, fill: "rgba(239,68,68,0.35)"  },
      { h: 12, fill: "rgba(255,255,255,0.1)" },
      { h: 14, fill: "rgba(255,255,255,0.1)" },
    ],
    badge:    null,
    caption:  "The spend is on record. What it produced — isn't.",
    question: true,
    check:    false,
  },
  {
    label:      "The clarity",
    labelColor: "#10B981",
    borderTop:  "2px solid rgba(16,185,129,0.5)",
    bars: [
      { h: 28, fill: "rgba(255,255,255,0.18)" },
      { h: 34, fill: "#10B981"               },
      { h: 26, fill: "rgba(255,255,255,0.18)" },
      { h: 30, fill: "rgba(255,255,255,0.18)" },
    ],
    badge:    null,
    caption:  "See the outcome of every dollar. Rebalance with conviction.",
    question: false,
    check:    true,
  },
];

export function IntroScreen({ onDone }: Props) {
  const [mounted,  setMounted]  = useState(false);
  const [exiting,  setExiting]  = useState(false);
  const [paused,   setPaused]   = useState(false);
  const [stage,    setStage]    = useState([0, 0, 0]);
  const [progress, setProgress] = useState(0);

  const rafRef      = useRef<number>(0);
  const startRef    = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);
  const doneRef     = useRef(false);

  // ── Dismiss ───────────────────────────────────────────────
  const dismiss = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    cancelAnimationFrame(rafRef.current);
    setExiting(true);
    try { localStorage.setItem(INTRO_KEY, "1"); } catch {}
    setTimeout(onDone, 380);
  };

  // ── Toggle pause ──────────────────────────────────────────
  const togglePause = (e: React.MouseEvent) => {
    e.stopPropagation(); // don't dismiss on pause click
    setPaused(p => !p);
  };

  // ── Mount fade-in ─────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  // ── Staggered card entrance ───────────────────────────────
  useEffect(() => {
    if (!mounted) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    [0, 1, 2].forEach((i) => {
      const base = 300 + i * 600;
      timers.push(setTimeout(() => setStage(s => { const n=[...s]; n[i]=1; return n; }), base));
      timers.push(setTimeout(() => setStage(s => { const n=[...s]; n[i]=2; return n; }), base + 220));
      timers.push(setTimeout(() => setStage(s => { const n=[...s]; n[i]=3; return n; }), base + 480));
    });
    return () => timers.forEach(clearTimeout);
  }, [mounted]);

  // ── Progress bar + auto-dismiss ───────────────────────────
  // Pause freezes elapsed time; resume continues from where it left off
  useEffect(() => {
    if (!mounted) return;
    startRef.current = performance.now();

    const tick = (now: number) => {
      const pct = Math.min((now - startRef.current) / DURATION, 1);
      setProgress(pct);
      if (pct < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        dismiss();
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mounted]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!mounted) return;
    if (paused) {
      // Freeze: record how far we got
      cancelAnimationFrame(rafRef.current);
      pausedAtRef.current = progress * DURATION;
    } else {
      // Resume: shift start so elapsed continues from pausedAt
      startRef.current = performance.now() - pausedAtRef.current;
      const tick = (now: number) => {
        const pct = Math.min((now - startRef.current) / DURATION, 1);
        setProgress(pct);
        if (pct < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          dismiss();
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [paused]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─────────────────────────────────────────────────────────
  return (
    <div
      onClick={dismiss}
      style={{
        position:       "fixed",
        inset:          0,
        zIndex:         50000,
        background:     "#0B1120",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        padding:        "32px 24px",
        cursor:         "pointer",
        opacity:        exiting ? 0 : mounted ? 1 : 0,
        transition:     "opacity 0.38s ease",
        userSelect:     "none",
      }}
    >
      <div style={{
        maxWidth:   900,
        width:      "100%",
        transform:  mounted && !exiting ? "translateY(0)" : "translateY(14px)",
        transition: "transform 0.42s cubic-bezier(0.4,0,0.2,1)",
      }}>

        {/* Eyebrow */}
        <div style={{
          fontSize: 11, fontWeight: 600,
          color: "rgba(255,255,255,0.22)",
          letterSpacing: "0.14em", textTransform: "uppercase",
          marginBottom: 32,
        }}>
          DecisionDock
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 32, fontWeight: 800,
          color: "#FFFFFF",
          letterSpacing: "-0.03em", lineHeight: 1.18,
          margin: "0 0 12px",
        }}>
          One budget. Endless asks.<br />
          <span style={{ color: "#F59E0B" }}>See which ones earn it.</span>
        </h1>

        {/* Sub */}
        <p style={{
          fontSize: 15,
          color: "rgba(255,255,255,0.5)",
          lineHeight: 1.5, margin: "0 0 44px", fontWeight: 300,
        }}>
          Your bets, quantified. Your tradeoffs, visible.
        </p>

        {/* Three separate floating tiles */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "20px",
          marginBottom: 36,
        }}>
          {PANELS.map((panel, i) => (
            <div
              key={i}
              onClick={(e) => e.stopPropagation()} // tiles don't dismiss
              style={{
                background:  "rgba(255,255,255,0.04)",
                borderRadius: 14,
                border:      "1px solid rgba(255,255,255,0.07)",
                borderTop:   panel.borderTop,
                padding:     "24px 22px 20px",
                opacity:     stage[i] >= 1 ? 1 : 0,
                transform:   stage[i] >= 1 ? "translateY(0)" : "translateY(16px)",
                transition:  "opacity 0.45s ease, transform 0.45s cubic-bezier(0.4,0,0.2,1)",
                cursor:      "default",
              }}
            >
              {/* Panel label */}
              <div style={{
                fontSize: 10, fontWeight: 700,
                color: panel.labelColor,
                textTransform: "uppercase", letterSpacing: "0.12em",
                marginBottom: 18,
              }}>
                {panel.label}
              </div>

              {/* Bar chart */}
              <svg
                width="100%"
                viewBox={`0 0 100 ${SVG_H}`}
                style={{ display: "block", marginBottom: 16, overflow: "visible" }}
              >
                {panel.bars.map((bar, j) => (
                  <rect
                    key={j}
                    x={BAR_XS[j]}
                    y={SVG_H - bar.h}
                    width={BAR_W}
                    height={bar.h}
                    rx={2}
                    fill={bar.fill}
                    style={{
                      transformOrigin: `${BAR_XS[j] + BAR_W / 2}px ${SVG_H}px`,
                      transform:  stage[i] >= 2 ? "scaleY(1)" : "scaleY(0)",
                      transition: `transform 0.45s cubic-bezier(0.34,1.2,0.64,1) ${j * 55}ms`,
                    }}
                  />
                ))}

                {/* Bet: "doubled down" badge above tall bar */}
                {panel.badge && (
                  <text
                    x={36} y={SVG_H - 46 - 6}
                    textAnchor="middle" fontSize={7}
                    fill={panel.badge.color}
                    style={{
                      opacity:    stage[i] >= 3 ? 1 : 0,
                      transition: "opacity 0.35s ease",
                    }}
                  >
                    {panel.badge.text}
                  </text>
                )}

                {/* Blind spot: question mark box */}
                {panel.question && (
                  <>
                    <rect
                      x={24} y={SVG_H - 46 - 22}
                      width={24} height={18} rx={4}
                      fill="#1E293B"
                      stroke="rgba(239,68,68,0.25)" strokeWidth={0.5}
                      style={{
                        opacity:    stage[i] >= 3 ? 1 : 0,
                        transition: "opacity 0.35s ease",
                      }}
                    />
                    <text
                      x={36} y={SVG_H - 46 - 9}
                      textAnchor="middle" fontSize={13}
                      fill="rgba(239,68,68,0.6)"
                      style={{
                        opacity:    stage[i] >= 3 ? 1 : 0,
                        transition: "opacity 0.35s ease 0.08s",
                      }}
                    >
                      ?
                    </text>
                  </>
                )}

                {/* Clarity: ceiling line + checkmark */}
                {panel.check && (
                  <>
                    <line
                      x1={6} y1={SVG_H - 34 - 8}
                      x2={88} y2={SVG_H - 34 - 8}
                      stroke="rgba(16,185,129,0.2)" strokeWidth={1}
                    />
                    <circle
                      cx={82} cy={SVG_H - 34 - 18} r={6}
                      fill="none"
                      stroke="rgba(16,185,129,0.55)" strokeWidth={1}
                      style={{
                        opacity:    stage[i] >= 3 ? 1 : 0,
                        transition: "opacity 0.35s ease",
                      }}
                    />
                    <path
                      d="M79 14l2 2 4-4"
                      stroke="#10B981" strokeWidth={1.2}
                      strokeLinecap="round" strokeLinejoin="round"
                      fill="none"
                      style={{
                        opacity:    stage[i] >= 3 ? 1 : 0,
                        transition: "opacity 0.35s ease 0.1s",
                      }}
                    />
                  </>
                )}
              </svg>

              {/* Caption */}
              <div style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.6,
              }}>
                {panel.caption}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar: pause + progress + skip */}
        <div style={{
          display:     "flex",
          alignItems:  "center",
          gap:         14,
        }}>

          {/* Pause / Resume button */}
          <button
            onClick={togglePause}
            title={paused ? "Resume" : "Pause"}
            style={{
              background:   "rgba(255,255,255,0.07)",
              border:       "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              width:        32,
              height:       24,
              display:      "flex",
              alignItems:   "center",
              justifyContent: "center",
              cursor:       "pointer",
              flexShrink:   0,
              transition:   "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
          >
            {paused ? (
              // Play triangle
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 1.5l6 3.5-6 3.5V1.5z" fill="rgba(255,255,255,0.5)"/>
              </svg>
            ) : (
              // Pause bars
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <rect x="2" y="1.5" width="2.5" height="7" rx="1" fill="rgba(255,255,255,0.5)"/>
                <rect x="5.5" y="1.5" width="2.5" height="7" rx="1" fill="rgba(255,255,255,0.5)"/>
              </svg>
            )}
          </button>

          {/* Progress bar */}
          <div style={{
            flex: 1, height: 2,
            background: "rgba(255,255,255,0.07)",
            borderRadius: 2, overflow: "hidden",
          }}>
            <div style={{
              height:     "100%",
              width:      `${progress * 100}%`,
              background: "#F59E0B",
              borderRadius: 2,
              transition: paused ? "none" : "width 0.08s linear",
            }} />
          </div>

          {/* Skip */}
          <span style={{
            fontSize:      11,
            color:         "rgba(255,255,255,0.2)",
            whiteSpace:    "nowrap",
            letterSpacing: "0.03em",
          }}>
            click to skip
          </span>

        </div>
      </div>
    </div>
  );
}
