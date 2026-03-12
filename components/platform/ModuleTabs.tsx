"use client";

import { useRouter, usePathname } from "next/navigation";
import { C } from "@/lib/constants";
import { useViewport, useTokens } from "@/lib/hooks";

interface ModuleTab {
  label: string;
  route: string;
  live: boolean;
}

const MODULES: ModuleTab[] = [
  { label: "Uptime",    route: "/uptime",    live: true  },
  { label: "Latency",   route: "/latency",   live: true  },
  { label: "Velocity",  route: "/velocity",  live: true  },
  { label: "Capacity",  route: "/capacity",  live: true  },
];

export function ModuleTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const { h } = useViewport();
  const T = useTokens(h);

  return (
    <div
      style={{
        display: "flex",
        gap: 3,
        padding: 4,
        background: C.white,
        borderRadius: 10,
        border: `1px solid ${C.border}`,
        width: "fit-content",
        margin: `0 auto ${T.tabMb}px`,
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      {MODULES.map((mod) => {
        const isActive = pathname === mod.route;
        const isClickable = mod.live;

        return (
          <button
            key={mod.route}
            onClick={() => { if (isClickable && !isActive) router.push(mod.route); }}
            style={{
              padding: T.tabPad,
              fontSize: T.tabFs,
              fontWeight: isActive ? 600 : 400,
              borderRadius: 7,
              border: "none",
              cursor: isClickable ? "pointer" : "not-allowed",
              background: isActive ? C.navy : "transparent",
              color: isActive ? C.white : C.subtle,
              opacity: isClickable ? 1 : 0.5,
              transition: "all 0.15s",
            }}
            title={!isClickable ? "Coming soon" : ""}
          >
            {mod.label}
            {!mod.live && (
              <span style={{ fontSize: T.tabFs - 2, marginLeft: 4, opacity: 0.6 }}>
                soon
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
