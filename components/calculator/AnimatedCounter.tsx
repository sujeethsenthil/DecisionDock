"use client";

import { useState, useEffect, useRef } from "react";
import { fcFull } from "@/lib/format";

function useSpring(target: number) {
  const [current, setCurrent] = useState(target);
  const ref = useRef({ value: target, velocity: 0, target });
  const raf = useRef<number | null>(null);
  const prevTime = useRef<number | null>(null);

  useEffect(() => {
    ref.current.target = target;
    const tick = (time: number) => {
      if (!prevTime.current) prevTime.current = time;
      const dt = Math.min((time - prevTime.current) / 1000, 0.064);
      prevTime.current = time;
      const spring = -140 * (ref.current.value - ref.current.target);
      const damp = -22 * ref.current.velocity;
      ref.current.velocity += ((spring + damp) / 0.7) * dt;
      ref.current.value += ref.current.velocity * dt;
      if (
        Math.abs(ref.current.value - ref.current.target) < 0.5 &&
        Math.abs(ref.current.velocity) < 0.5
      ) {
        ref.current.value = ref.current.target;
        ref.current.velocity = 0;
        setCurrent(ref.current.target);
        prevTime.current = null;
        return;
      }
      setCurrent(ref.current.value);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      prevTime.current = null;
    };
  }, [target]);

  return Math.round(current);
}

interface Props {
  value: number;
  color: string;
}

export function AnimatedCounter({ value, color }: Props) {
  const v = useSpring(value);
  return (
    <span
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        color,
        fontWeight: 700,
        fontVariantNumeric: "tabular-nums",
        fontSize: 20,
        letterSpacing: "-0.02em",
      }}
    >
      {fcFull(v)}
    </span>
  );
}
