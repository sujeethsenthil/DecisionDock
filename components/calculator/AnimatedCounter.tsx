"use client";

import { useState, useEffect, useRef } from "react";
import { SPRING_CONFIG } from "@/lib/constants";

function useSpringValue(target: number) {
  const [current, setCurrent] = useState(target);
  const ref = useRef({ value: target, velocity: 0, target });
  const raf = useRef<number | null>(null);
  const prevTime = useRef<number | null>(null);

  useEffect(() => {
    ref.current.target = target;

    const animate = (time: number) => {
      if (prevTime.current === null) prevTime.current = time;
      const dt = Math.min((time - prevTime.current) / 1000, 0.064);
      prevTime.current = time;

      const { stiffness, damping, mass } = SPRING_CONFIG;
      const spring = -stiffness * (ref.current.value - ref.current.target);
      const dampForce = -damping * ref.current.velocity;
      const accel = (spring + dampForce) / mass;

      ref.current.velocity += accel * dt;
      ref.current.value += ref.current.velocity * dt;

      const diff = Math.abs(ref.current.value - ref.current.target);
      const vel = Math.abs(ref.current.velocity);

      if (diff < 0.5 && vel < 0.5) {
        ref.current.value = ref.current.target;
        ref.current.velocity = 0;
        setCurrent(ref.current.target);
        prevTime.current = null;
        return;
      }

      setCurrent(ref.current.value);
      raf.current = requestAnimationFrame(animate);
    };

    raf.current = requestAnimationFrame(animate);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      prevTime.current = null;
    };
  }, [target]);

  return Math.round(current);
}

function formatDisplay(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${Math.round(n).toLocaleString("en-US")}`;
  return `$${Math.round(n)}`;
}

interface AnimatedCounterProps {
  value: number;
  color?: string;
  size?: string;
}

export function AnimatedCounter({
  value,
  color = "#1B2A4A",
  size = "text-5xl",
}: AnimatedCounterProps) {
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const animated = useSpringValue(value);
  const display = prefersReduced ? value : animated;

  return (
    <span
      className={`${size} font-bold tracking-tight`}
      style={{
        fontFamily: "var(--font-jetbrains), 'JetBrains Mono', 'SF Mono', monospace",
        color,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {formatDisplay(display)}
    </span>
  );
}
