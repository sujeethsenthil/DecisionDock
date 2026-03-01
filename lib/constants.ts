export const COLORS = {
  blue: "#3B82F6",
  emerald: "#22C55E",
  amber: "#F59E0B",
  red: "#EF4444",
  navy: "#1B2A4A",
  dark: "#333333",
  med: "#64748B",
  light: "#F8FAFC",
  border: "#E2E8F0",
  white: "#FFFFFF",
  pageBg: "#F1F5F9",
} as const;

export const SPRING_CONFIG = {
  stiffness: 120,
  damping: 20,
  mass: 0.8,
} as const;

export function getZoneColor(
  value: number,
  zones: { value: number; caution: number }
): string {
  if (value <= zones.value) return COLORS.blue;
  if (value <= zones.caution) return COLORS.amber;
  return COLORS.red;
}

export function getZoneBg(
  value: number,
  zones: { value: number; caution: number }
): string {
  if (value <= zones.value) return "rgba(59,130,246,0.08)";
  if (value <= zones.caution) return "rgba(245,158,11,0.08)";
  return "rgba(239,68,68,0.08)";
}

export function getZoneLabel(
  value: number,
  zones: { value: number; caution: number }
): string {
  if (value <= zones.value) return "Value zone";
  if (value <= zones.caution) return "Diminishing returns";
  return "Overspend zone";
}
