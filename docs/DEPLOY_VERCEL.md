# Deploy the Nines Calculator to Vercel

This app is a Next.js static export (`output: "export"`). No backend, env vars, or database. Follow these phases to host on Vercel.

---

## Phase 1: Pre-deploy verification (done)

- Run locally: `pnpm install` then `pnpm build`
- Confirm `out/` is generated (static files). Vercel will use this.
- Optional: serve locally with `npx serve out` and open the URL.

---

## Phase 2: Connect repository to Vercel

1. **Create a Vercel account** at [vercel.com](https://vercel.com) (sign up with GitHub, GitLab, Bitbucket, or email).
2. **Import the project**
   - In the Vercel dashboard: **Add New** → **Project**
   - Connect your Git provider and select the **DecisionDock** repo (or the repo that contains this code).
3. **Select the repository and branch** (e.g. `main`).

---

## Phase 3: Configure and deploy

1. **Framework preset**: Leave as **Next.js** (auto-detected).
2. **Root directory**: Leave blank if this app is at the repo root; set it only if the app lives in a subfolder (e.g. `apps/nines-calculator`).
3. **Build and output**
   - **Build Command:** `pnpm build` (or `pnpm run build`)
   - **Output Directory:** Leave default — Vercel uses the Next.js output (the `out` directory) for static export.
   - **Install Command:** `pnpm install` (usually inferred from `packageManager` in `package.json`).
4. **Environment variables:** None required; skip.
5. Click **Deploy**.

After the first deploy, open the **Production URL** (e.g. `your-project.vercel.app`) and verify:
- Calculator loads; slider and chart work.
- All four domains work: Uptime, Marketing, Test Coverage, CSAT.

---

## Phase 4: Optional — Custom domain and automation

- **Custom domain:** Project → **Settings** → **Domains** → **Add** (e.g. `nines.yourcompany.com`). Follow the DNS instructions (CNAME or A record).
- **Preview deployments:** Every push to a non-production branch gets a unique preview URL; no extra config.
- **Production branch:** In **Project Settings** → **Git**, set which branch (e.g. `main`) deploys to production.

---

## Summary

| Phase | Action |
|-------|--------|
| 1 | Run `pnpm build` locally; confirm `out/` exists |
| 2 | Create Vercel account; import DecisionDock repo |
| 3 | Use defaults (Next.js, `pnpm build`); deploy and test production URL |
| 4 | (Optional) Add custom domain; set production branch |

No `vercel.json` is required. Add it only if you need redirects, headers, or other overrides.
