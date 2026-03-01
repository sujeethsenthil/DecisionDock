"use client";

import { useSpring, useTransform, useMotionTemplate, motion } from "framer-motion";
import { useEffect } from "react";
import { formatCurrency } from "@/lib/format";
import { SPRING_CONFIG } from "@/lib/constants";

interface AnimatedCounterProps {
  value: number;
  className?: string;
}

export function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  const spring = useSpring(value, SPRING_CONFIG);

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  const display = useTransform(spring, (v) =>
    formatCurrency(Math.round(v))
  );
  const text = useMotionTemplate`${display}`;

  return (
    <motion.span
      className={className}
      style={{ fontVariantNumeric: "tabular-nums" }}
      data-numeric
    >
      <motion.span>{text}</motion.span>
    </motion.span>
  );
}
