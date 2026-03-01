import type { DomainConfig, DomainKey } from "./types";
import { uptimeConfig } from "./uptime-config";

/** All domain configs. Phase 1: uptime only; Phase 2 replaces stubs with real configs. */
export const DOMAINS: Record<DomainKey, DomainConfig> = {
  uptime: uptimeConfig,
  marketing: { ...uptimeConfig, key: "marketing", label: "Marketing", description: "Explore marketing diminishing returns." },
  coverage: { ...uptimeConfig, key: "coverage", label: "Coverage", description: "Explore coverage diminishing returns." },
  csat: { ...uptimeConfig, key: "csat", label: "CSAT", description: "Explore CSAT diminishing returns." },
};

export type { DomainConfig, DomainKey, DataPoint, SliderConfig, ThresholdAnnotation } from "./types";
export { uptimeConfig } from "./uptime-config";
