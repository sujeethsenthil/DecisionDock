# Phased Plan: Polish Portfolio Guided Workflow

**Goals:**  
1. Keep a clear **focused box** (spotlight) for each step.  
2. Ensure **callout boxes never exceed page limits** (viewport containment).  

---

## Current state

- **Portfolio tour:** 3 steps — budget (0) → cards (1) → sidebar (2). Refs: `budget`, `cards`, `sidebar`.
- **Focused box:** `OnboardingOverlay` already draws a spotlight (dimmed overlay + SVG mask cutout + blue stroke). Budget step uses a tight 560px-wide card clamp.
- **Callouts:** Tooltip is positioned with `getTooltipStyle()` using `winW`/`winH` and fixed offsets. There is no `maxHeight` on the callout, and positioning uses `transform: translateY(-50%)` / `translateX(-50%)` without ensuring the full box stays in view, so the callout can extend past the viewport in edge cases.

---

## Phase 1: Strengthen the focused box (Portfolio)

**Goal:** Make the spotlight unambiguously the “focused” element and ensure it wraps the right UI for each Portfolio step.

1. **Verify ref targets**
   - Confirm `budgetRef` wraps the **white budget card** (Enter your budget + over budget) and not the full-width row. If the ref currently wraps a larger container, narrow it in `app/portfolio/client.tsx` so the spotlight is tight around the card.
   - Confirm `cardsRef` wraps the allocation **grid** (four domain cards) and `sidebarRef` the **Budget Tracker** sidebar.

2. **Optional: stronger focus ring**
   - In `OnboardingOverlay.tsx`, consider a slightly stronger stroke or a thin inner glow for the spotlight rect (e.g. increase stroke opacity or add a second, softer rect) so the focused box reads more clearly, especially on light backgrounds.
   - Keep 8px grid: padding around spotlight remains 14px; border radius 20px (sr) is fine.

3. **Acceptance**
   - For each of the 3 Portfolio steps, the only “lit” area is the intended element (budget card, cards grid, sidebar). No unintended clipping of the stroke; no giant spotlight.

---

## Phase 2: Callout viewport containment

**Goal:** No callout box ever extends beyond the viewport (no horizontal overflow, no vertical overflow above or below).

1. **Safe area constants**
   - In `OnboardingOverlay.tsx`, define:
     - `SAFE_EDGE = 16` (min distance from viewport edge).
     - `CALLOUT_MAX_HEIGHT = 320` (or measure dynamically; 320 is a safe default for ~3 lines of body + title + dots + buttons).

2. **Constrain callout height**
   - On the **inner** callout div (the white card), set `maxHeight: CALLOUT_MAX_HEIGHT`, `overflowY: "auto"`, and optional `overflowX: "hidden"`. This keeps long copy from growing the card past the viewport.

3. **Position clamping that respects full box**
   - Refactor `getTooltipStyle()` so the **entire** callout stays in view:
     - Use a single vertical anchor (e.g. preferred `top` or `bottom`) and a single horizontal anchor (e.g. preferred `left` or `right`), then clamp:
       - `left >= SAFE_EDGE`, `left + 320 <= winW - SAFE_EDGE` (or use `min(maxWidth, winW - 2*SAFE_EDGE)`).
       - `top >= SAFE_EDGE`, `top + CALLOUT_MAX_HEIGHT <= winH - SAFE_EDGE`.
     - When using `transform: translateY(-50%)` or `translateX(-50%)`, compute the **resulting** top/left after transform and then nudge so the final box stays within `[SAFE_EDGE, winW - SAFE_EDGE]` and `[SAFE_EDGE, winH - SAFE_EDGE]`. Alternatively, avoid percent-based transform and use explicit `top`/`left` computed so the box is fully in view (simpler and more predictable).
   - Prefer one approach: either (a) compute position so the box fits and avoid translate, or (b) compute position with translate, then clamp the anchor so that after transform the box edges stay in safe bounds (e.g. for `top` + `translateY(-50%)`, ensure `top - CALLOUT_MAX_HEIGHT/2 >= SAFE_EDGE` and `top + CALLOUT_MAX_HEIGHT/2 <= winH - SAFE_EDGE`).

4. **Resize/scroll**
   - Keep existing `resize` and `scroll` listeners that call `updateSpotlight()` so the spotlight and callout position update when the user scrolls or resizes. After Phase 2, the same clamping logic keeps the callout in view on scroll/resize.

5. **Acceptance**
   - At each Portfolio step, and for domain tours (e.g. Uptime) at each step, run through: default viewport, narrow width (e.g. 375px), short height (e.g. 600px), and after scrolling. Confirm no callout content is ever clipped by the viewport or overlaps the safe edge.

---

## Phase 3: Scroll and layout (Portfolio steps 1 & 2)

**Goal:** When a step uses `scrollToTarget`, the focused box and callout end up fully on-screen and stable.

1. **Scroll timing**
   - Portfolio steps 1 and 2 use `scrollToTarget: true`. The overlay already scrolls and then runs `updateSpotlight` after 750ms. Ensure 750ms is enough on slow devices; if needed, add a short extra delay or use `requestAnimationFrame` + a small timeout before measuring.
   - After scroll settles, run the same viewport-containment logic from Phase 2 so the callout is placed within the visible area (e.g. if the spotlight is in the lower half, show the callout above it; if above the fold, show below).

2. **No layout jump**
   - Ensure the callout doesn’t cause a layout shift that moves the spotlight target (e.g. callout is `position: fixed`, so it shouldn’t; just confirm no overflow or margin on the overlay that could resize the page).

3. **Acceptance**
   - Start Portfolio tour; step 0 (budget) in view. Go to step 1: page scrolls to cards, spotlight on cards, callout fully in view. Go to step 2: scroll to sidebar, spotlight on sidebar, callout fully in view. No callout exceeding page limits.

---

## Phase 4: Copy and accessibility (optional polish)

- **Copy:** Shorten any Portfolio step body text if it consistently forces scroll inside the callout (Phase 2 already caps height and adds scroll).
- **Focus:** When overlay is shown, trap focus in the overlay (Skip / primary button) and restore focus on Skip or finish. Optional: ensure the spotlighted element is announced (e.g. `aria-describedby` pointing to the callout) for screen readers.
- **Reduced motion:** If you add any motion to the spotlight or callout, respect `prefers-reduced-motion: reduce` (e.g. disable or shorten transitions).

---

## Implementation order

| Phase | Focus                         | Deliverable                                      |
|-------|-------------------------------|--------------------------------------------------|
| 1     | Focused box                   | Correct, tight spotlight for budget/cards/sidebar |
| 2     | Callout in viewport           | Callout never exceeds page limits                 |
| 3     | Scroll + layout               | Steps 1 & 2 scroll and position correctly         |
| 4     | Copy + a11y (optional)        | Shorter copy, focus trap, reduced motion          |

**Suggested branch:** `feature/portfolio-tour-polish`. Implement Phase 1 and 2 first (focused box + viewport containment), then Phase 3; Phase 4 as time allows.
