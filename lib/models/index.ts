import type { DomainConfig, DomainKey } from "./types";
import { uptimeConfig } from "./uptime-config";
import { marketingConfig } from "./marketing-config";
import { coverageConfig } from "./coverage-config";
import { csatConfig } from "./csat-config";

export const DOMAINS: Record<DomainKey, DomainConfig> = {
  uptime: uptimeConfig,
  marketing: marketingConfig,
  coverage: coverageConfig,
  csat: csatConfig,
};

export type { DomainConfig, DomainKey, DataPoint, SliderConfig, ThresholdAnnotation } from "./types";
export { uptimeConfig } from "./uptime-config";
export { marketingConfig } from "./marketing-config";
export { coverageConfig } from "./coverage-config";
export { csatConfig } from "./csat-config";
