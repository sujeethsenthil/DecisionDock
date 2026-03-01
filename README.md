# DecisionDock — The Nines Calculator

Interactive web tool that visualizes the exponential cost of incremental perfection across four domains (Uptime, Marketing, Test Coverage, CSAT). Built for the DecisionDock portfolio.

## Stack

- **Next.js 14** (App Router), **TypeScript** (strict), **Tailwind CSS 3.x**
- **Recharts 2.x** (chart), **Framer Motion 11.x** (animation)
- **shadcn-style UI** (Radix Slider, Tabs, Card) — components copied into repo
- **pnpm** — package manager; deploy: Vercel static export

## Setup

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `pnpm dev` — development server
- `pnpm build` — production static export (`out/`)
- `pnpm start` — serve production build (after `build`)
- `pnpm lint` — ESLint
- `pnpm test` — Vitest (model, format, threshold tests)
- `pnpm test:watch` — Vitest watch mode

## Phase 4 — Ship prep

- **Tests:** `pnpm test` runs Vitest (uptime/marketing/coverage/csat anchors, format, engine, threshold logic).
- **Accessibility:** Slider has `aria-label` and `aria-valuetext`; cost uses `aria-live="polite"`; focus visible on interactive elements. Radix Slider supports arrow keys and Home/End.
- **Performance:** Target Lighthouse >90, first meaningful paint <2s, bundle <250kB gzipped. Run `pnpm build` and inspect `out/` or use Lighthouse on a deployed URL.
- **Deploy (Vercel):** Build outputs static files to `out/`. Connect the repo to Vercel; build command `pnpm build`, output directory `out`. No env vars. For social previews, add `public/og-image.png` (1200×630); Open Graph and Twitter metadata are set in `app/layout.tsx`.

## Repo hygiene

- Commits are scoped by feature/fix (e.g. `feat: add uptime chart`, `chore: add deps`).
- No backend, API routes, or auth; all computation is client-side.
