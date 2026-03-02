export const C = {
  blue: "#3B82F6",
  emerald: "#10B981",
  amber: "#F59E0B",
  red: "#EF4444",
  navy: "#0F172A",
  dark: "#1E293B",
  body: "#334155",
  med: "#64748B",
  subtle: "#94A3B8",
  light: "#F8FAFC",
  border: "#E2E8F0",
  white: "#FFFFFF",
  pageBg: "#F0F4F8",
  bS: "rgba(59,130,246,0.06)",
  aS: "rgba(245,158,11,0.06)",
  rS: "rgba(239,68,68,0.06)",
  eS: "rgba(16,185,129,0.06)",
} as const;

export function zoneColor(n: number): string {
  return n <= 3 ? C.blue : n <= 4 ? C.amber : C.red;
}
export function zoneSurface(n: number): string {
  return n <= 3 ? C.bS : n <= 4 ? C.aS : C.rS;
}
export function zoneLabel(n: number): string {
  return n <= 3 ? "Cost-effective" : n <= 4 ? "Diminishing returns" : "Extreme cost";
}
