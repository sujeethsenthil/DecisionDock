"use client";

import { useRouter, usePathname } from "next/navigation";
import { C } from "@/lib/constants";
import { useViewport, useTokens } from "@/lib/hooks";
import { usePlatformStore } from "@/lib/store/platform";

interface ModuleTab {
  label: string;
  route: string;
  live: boolean;
}

const MODULES: ModuleTab[] = [
  { label: "Uptime",    route: "/uptime",    live: true },
  { label: "Latency",   route: "/latency",   live: true },
  { label: "Velocity",  route: "/velocity",  live: true },
  { label: "Capacity",  route: "/capacity",  live: true },
  { label: "Portfolio", route: "/portfolio", live: true },
];

const ROUTE_TO_DOMAIN: Record<string, string> = {
  "/uptime":   "uptime",
  "/latency":  "latency",
  "/velocity": "velocity",
  "/capacity": "capacity",
};

// Next tab in sequence — guides user forward
const NEXT_ROUTE: Record<string, string> = {
  "/uptime":   "/latency",
  "/latency":  "/velocity",
  "/velocity": "/capacity",
  "/capacity": "/portfolio",
};

export function ModuleTabs() {
  const router   = useRouter();
  const pathname = usePathname();
  const { h }    = useViewport();
  const T        = useTokens(h);
  const domains  = usePlatformStore((s) => s.domains);

  const hasInteracted = (route: string): boolean => {
    const key = ROUTE_TO_DOMAIN[route] as keyof typeof domains | undefined;
    if (!key) return false;
    const d = domains[key];
    return d.currentX !== 2 || d.targetX !== 3;
  };

  const nextRoute = NEXT_ROUTE[pathname];

  return (
    <div style={{
      display: "flex",
      gap: 3,
      padding: 4,
      background: C.white,
      borderRadius: 10,
      border: `1px solid ${C.border}`,
      width: "fit-content",
      margin: `0 auto ${T.tabMb}px`,
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      alignItems: "center",
    }}>
      {MODULES.map((mod) => {
        const isActive    = pathname === mod.route;
        const isPortfolio = mod.route === "/portfolio";
        const visited     = hasInteracted(mod.route);
        const isNext      = mod.route === nextRoute;

        let bg: string    = "transparent";
        let color: string = C.dark;  // default: dark, not subtle — readable
        let fw            = 500;     // default: medium weight, not thin

        if (isActive) {
          bg    = isPortfolio ? C.blue : C.navy;
          color = C.white;
          fw    = 700;
        } else if (isPortfolio) {
          // Portfolio always stands out — blue text, no bg
          color = C.blue;
          fw    = 600;
        } else if (visited) {
          // Interacted domain — blue tint bg + blue text
          bg    = "rgba(59,130,246,0.08)";
          color = C.blue;
          fw    = 600;
        }

        return (
          <div key={mod.route} style={{ display: "flex", alignItems: "center", gap: 3 }}>
            {/* Separator before Portfolio */}
            {isPortfolio && (
              <div style={{
                width: 1, height: 18,
                background: C.border,
                marginLeft: 4, marginRight: 4,
                flexShrink: 0,
              }} />
            )}

            <button
              onClick={() => { if (mod.live && !isActive) router.push(mod.route); }}
              style={{
                padding: T.tabPad,
                fontSize: T.tabFs,
                fontWeight: fw,
                borderRadius: 7,
                border: "none",
                cursor: mod.live ? "pointer" : "not-allowed",
                background: bg,
                color,
                opacity: mod.live ? 1 : 0.5,
                transition: "all 0.15s",
                position: "relative",
              }}
              title={!mod.live ? "Coming soon" : ""}
            >
              {mod.label}
              {!mod.live && (
                <span style={{ fontSize: T.tabFs - 2, marginLeft: 4, opacity: 0.6 }}>
                  soon
                </span>
              )}

              {/* Blue dot on the next tab in sequence */}
              {isNext && !isActive && (
                <span style={{
                  position: "absolute",
                  top: 3,
                  right: 3,
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: C.blue,
                  display: "block",
                  boxShadow: `0 0 0 2px ${C.white}`,
                }} />
              )}

              {/* Portfolio: animated ring border to catch attention */}
              {isPortfolio && !isActive && (
                <span
                  className="portfolio-tab-ring"
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 7,
                    pointerEvents: "none",
                  }}
                />
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ── Portfolio context icon ────────────────────────────────────
export function PortfolioContextIcon() {
  const router   = useRouter();
  const pathname = usePathname();
  const isDomain = !!ROUTE_TO_DOMAIN[pathname];
  if (!isDomain) return null;

  return (
    <div
      title="See what this means for your portfolio"
      onClick={() => router.push("/portfolio")}
      style={{
        position:   "fixed",
        bottom:     80,
        right:      24,
        zIndex:     200,
        width:      44,
        height:     44,
        borderRadius: "50%",
        background: "rgba(59,130,246,0.1)",
        border:     "1px solid rgba(59,130,246,0.25)",
        cursor:     "pointer",
        display:    "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.15s, transform 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = "rgba(59,130,246,0.18)";
        (e.currentTarget as HTMLDivElement).style.transform  = "scale(1.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = "rgba(59,130,246,0.1)";
        (e.currentTarget as HTMLDivElement).style.transform  = "scale(1)";
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1"  y="10" width="3.5" height="7"  rx="1" fill="#3B82F6" opacity="0.6"/>
        <rect x="7"  y="5"  width="3.5" height="12" rx="1" fill="#3B82F6"/>
        <rect x="13" y="7"  width="3.5" height="10" rx="1" fill="#3B82F6" opacity="0.6"/>
      </svg>
    </div>
  );
}
