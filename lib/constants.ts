/** Framer Motion spring config for animated counter */
export const SPRING_CONFIG = {
  mass: 0.8,
  stiffness: 75,
  damping: 15,
} as const;

/** Design system colors (hex) */
export const COLORS = {
  blue: "#3B82F6",
  emerald: "#22C55E",
  amber: "#F59E0B",
  red: "#EF4444",
  navy: "#1B2A4A",
  darkGray: "#333333",
  medGray: "#555555",
  lightGray: "#F2F4F7",
  borderGray: "#D0D5DD",
  white: "#FFFFFF",
} as const;

/** Uptime zone boundaries (in nines). Blue: 2–3, Amber: 3–4, Red: 4+ */
export const UPTIME_ZONES = {
  value: 3,
  caution: 4,
} as const;
