# Phase 4 — Deployment checklist

## Pre-deploy

1. **Tests:** `pnpm test` — all model, format, engine, and threshold tests pass.
2. **Build:** `pnpm build` — completes with no errors; output in `out/`.
3. **Lighthouse (optional):** Deploy to a preview URL and run Lighthouse (target: Performance >90, Accessibility no critical issues).

## Vercel

- **Build command:** `pnpm build` (or `npm run build` if using npm).
- **Output directory:** `out` (Next.js static export).
- **Environment variables:** None required.
- **Framework preset:** Next.js.

## Social preview (Open Graph)

- Add **`public/og-image.png`** (1200×630 px) for link previews. Metadata is already set in `app/layout.tsx`; the image is referenced as `/og-image.png`.
- If the file is missing, shares may show no image until you add it.

## Post-deploy

- Confirm the app loads and the two-column layout appears at ≥768px width.
- Test slider keyboard: Arrow keys step, Home/End jump to min/max.
- Optional: Run axe DevTools or Lighthouse Accessibility on the live URL.
