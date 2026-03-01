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
- `pnpm test` — Vitest (when added)

## Repo hygiene

- Commits are scoped by feature/fix (e.g. `feat: add uptime chart`, `chore: add deps`).
- No backend, API routes, or auth; all computation is client-side.
