import type { DomainConfig, DomainKey } from "./types";
import { uptimeConfig } from "./uptime";
import { marketingConfig } from "./marketing";
import { coverageConfig } from "./coverage";
import { csatConfig } from "./csat";

export const DOMAINS: Record<DomainKey, DomainConfig> = {
  uptime: uptimeConfig,
  marketing: marketingConfig,
  coverage: coverageConfig,
  csat: csatConfig,
};

export const DOMAIN_KEYS: DomainKey[] = ["uptime", "marketing", "coverage", "csat"];

export type { DomainConfig, DomainKey, DataPoint, ThresholdAnnotation } from "./types";
