import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DomainKey } from "@/lib/models/portfolio";

export interface DomainState {
  currentX: number;
  targetX: number;
}

interface PlatformStore {
  domains: Record<DomainKey, DomainState>;
  budget: number;
  setCurrentX: (key: DomainKey, x: number) => void;
  setTargetX: (key: DomainKey, x: number) => void;
  setBudget: (v: number) => void;
}

const DEFAULTS: Record<DomainKey, DomainState> = {
  uptime:   { currentX: 2, targetX: 3 },
  latency:  { currentX: 2, targetX: 3 },
  velocity: { currentX: 2, targetX: 3 },
  capacity: { currentX: 2, targetX: 3 },
};

export const usePlatformStore = create<PlatformStore>()(
  persist(
    (set) => ({
      domains: DEFAULTS,
      budget: 1_000_000,

      setCurrentX: (key, x) =>
        set((s) => ({
          domains: {
            ...s.domains,
            [key]: {
              ...s.domains[key],
              currentX: x,
              // target must always be >= current
              targetX: Math.max(s.domains[key].targetX, x),
            },
          },
        })),

      setTargetX: (key, x) =>
        set((s) => ({
          domains: {
            ...s.domains,
            [key]: { ...s.domains[key], targetX: x },
          },
        })),

      setBudget: (v) => set({ budget: v }),
    }),
    {
      name: "dd-platform-state",
      skipHydration: true,
      storage: {
        getItem: (name) => {
          if (typeof window === "undefined") return null;
          const v = sessionStorage.getItem(name);
          return v ? JSON.parse(v) : null;
        },
        setItem: (name, value) => {
          if (typeof window !== "undefined")
            sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          if (typeof window !== "undefined") sessionStorage.removeItem(name);
        },
      },
    }
  )
);
