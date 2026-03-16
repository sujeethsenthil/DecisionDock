# Phased Plan: Guided Onboarding on a New Branch

Use this plan to implement the 30-second guided tour on a separate branch. Each phase is shippable and testable.

---

## Phase 0: Branch and scaffolding

**Goal:** New branch and minimal structure; no behavior change.

1. Create and checkout a feature branch (e.g. `feature/guided-onboarding`).
2. Add an `onboarding/` folder under `components/` with placeholder files:
   - `SplashScreen.tsx` (export a simple div or null for now)
   - `WelcomeModal.tsx` (placeholder)
   - `OnboardingOverlay.tsx` (placeholder)
3. In `app/page.tsx`, introduce the **phase** type and state only:
   - `type Phase = "splash" | "welcome" | "tour" | "done"`
   - `const [phase, setPhase] = useState<Phase>("splash")`
   - Do **not** render the onboarding components yet; keep the existing page as-is.
4. Confirm app still runs and looks unchanged.

**Exit criteria:** Branch exists, phase state exists, placeholder components are in place.

---

## Phase 1: Splash screen

**Goal:** First screen shows, then transitions to welcome.

1. Implement `SplashScreen.tsx`:
   - Accept `onComplete: () => void`.
   - Show a simple branded splash (logo/title, optional short animation).
   - After a delay (or on user tap), call `onComplete()`.
2. In `app/page.tsx`:
   - Import `SplashScreen`.
   - When `phase === "splash"`, render `<SplashScreen onComplete={() => setPhase("welcome")} />`.
   - Keep main content rendered underneath (or hidden) so layout/refs are stable later.
3. Confirm: opening the app shows splash → after completion, splash disappears. Main content can be visible or covered; your choice for this phase.

**Exit criteria:** Splash displays and transitions to the next phase.

---

## Phase 2: Welcome modal

**Goal:** Welcome modal with “Take the 30-second tour” and “I’ll explore on my own”.

1. Implement `WelcomeModal.tsx`:
   - Props: `onStartTour: () => void`, `onSkip: () => void`.
   - Full-screen overlay (backdrop + centered card).
   - Copy and styling: headline, short description, primary button “Take the 30-second tour” → `onStartTour`, secondary “I’ll explore on my own” → `onSkip`.
   - Optional: simple enter animation (e.g. fade + scale) after mount.
2. In `app/page.tsx`:
   - When `phase === "welcome"`, render `<WelcomeModal onStartTour={...} onSkip={...} />`.
   - `onStartTour`: `setPhase("tour")` and set tour step to `0` (add `tourStep` state in this phase).
   - `onSkip`: `setPhase("done")` and set tour step to `"done"`.
3. Add `tourStep` state: `TourStep = 0 | 1 | 2 | 3 | 4 | 5 | "done"` (type can live in overlay file or page).
4. Confirm: after splash, welcome modal appears; “Take the 30-second tour” moves to tour phase; “I’ll explore on my own” moves to done (no overlay yet).

**Exit criteria:** Welcome modal shows after splash; both buttons change phase and step correctly.

---

## Phase 3: Refs and layout for spotlight targets

**Goal:** Refs for chart, slider, upgrade block, and bottom section so the overlay can spotlight them.

1. In `app/page.tsx`, create refs and pass them into the main content:
   - `chartRef`, `sliderRef`, `upgradeRef`, `bottomRef` (all `useRef<HTMLDivElement>(null)`).
   - Pass them into `Calculator` (or wherever the chart, slider, upgrade card, and bottom block live).
2. In `Calculator` (and child components as needed):
   - Accept optional ref props and attach `ref={chartRef}` to the chart container, `ref={sliderRef}` to the slider container, `ref={upgradeRef}` to the upgrade/cost summary block, `ref={bottomRef}` to the bottom section.
3. Ensure layout and refs are correct at different viewport sizes (resize, scroll).
4. Confirm: no UI change yet; refs are just wired. You can log `ref.current` in dev to verify they’re set when phase is `"tour"`.

**Exit criteria:** All four refs are attached and non-null when the main content is mounted.

---

## Phase 4: Onboarding overlay — steps and spotlight

**Goal:** Tour overlay with dimmed screen, spotlight, and one tooltip per step.

1. Define step config (e.g. in `OnboardingOverlay.tsx`):
   - Array of steps: `title`, `body`, `target` (e.g. `"chart" | "slider" | "upgrade" | "bottom"`), `position` (tooltip placement), `action`, `buttonLabel`.
   - Use the same six steps as in the current implementation (or your copy).
2. Implement `OnboardingOverlay`:
   - Props: `step: TourStep`, `onNext`, `onSkip`, `refs` (object mapping target name → ref).
   - If `step === "done"`, return `null`.
   - For current step, get `config` and `refs[config.target].current.getBoundingClientRect()` to compute spotlight rect (with padding). Update on mount, resize, and scroll.
   - Full-screen SVG overlay: mask so everything is dark except a rounded rect around the target; optional border around the cutout.
   - Single tooltip card positioned relative to spotlight (e.g. right/left/top/bottom). Content: progress dots, `config.title`, `config.body`, “Skip tour” button, and primary button when `config.buttonLabel` is set.
3. In `app/page.tsx`, when `phase === "tour"`, render `<OnboardingOverlay step={tourStep} onNext={handleTourNext} onSkip={handleTourSkip} refs={refs} />`.
4. Implement `handleTourNext`: increment `tourStep`; when moving past step 5, set `phase` to `"done"` and `tourStep` to `"done"`.
5. Confirm: after “Take the 30-second tour”, overlay appears; spotlight and tooltip follow chart/slider/upgrade/bottom; “Tell me more” / “How do I use this?” etc. advance steps; “Skip tour” ends the tour.

**Exit criteria:** All six steps show in order with correct spotlight and tooltip; next/skip work.

---

## Phase 5: Interactive steps (click chart, drag slider)

**Goal:** Steps 2 and 3 advance only when the user interacts with the chart or slider.

1. In `OnboardingOverlay`:
   - For steps with `action === "click-chart"` or `action === "drag-slider"`, hide the primary button and show the hint text (“Click the chart to continue” / “Drag the slider to continue”).
   - Set the overlay’s full-screen blocking layer to `pointerEvents: "none"` for those steps so events reach the chart/slider.
2. In `Calculator` (or chart/slider components):
   - Accept optional `onChartClick` and `onSliderDrag` callbacks; call them on click and on drag (or first drag).
3. In `app/page.tsx`:
   - `handleChartClick`: if `phase === "tour"` and `tourStep === 2`, set `tourStep` to 3.
   - `handleSliderDrag`: if `phase === "tour"` and `tourStep === 3`, set `tourStep` to 4.
   - Pass these handlers and the refs into `Calculator`.
4. Confirm: step 2 only advances when the user clicks the chart; step 3 only advances when they drag the slider.

**Exit criteria:** Interactive steps advance only via the required user action.

---

## Phase 6: Replay and polish

**Goal:** Replay button after tour and small UX improvements.

1. When `phase === "done"`, show a “Replay tour” control (e.g. floating “?” button bottom-right). On click: `setPhase("tour")`, `setTourStep(0)`.
2. Polish (optional):
   - Tooltip enter/exit animation.
   - Progress dots animation.
   - Pulse or hint animation for “Click the chart” / “Drag the slider”.
   - Accessibility: focus management, `aria-live` for step content, keyboard skip.
3. Test full flow: splash → welcome → tour (all steps, including click and drag) → done → replay.

**Exit criteria:** Replay works; tour is usable and matches design/accessibility goals.

---

## Dependency overview

```
Phase 0 (branch + scaffolding)
    → Phase 1 (Splash)
    → Phase 2 (Welcome modal + tourStep state)
    → Phase 3 (Refs)
    → Phase 4 (Overlay + spotlight + tooltip)
    → Phase 5 (Interactive steps)
    → Phase 6 (Replay + polish)
```

Phases 3 and 4 can be partially parallelized (e.g. define refs in Phase 3 while drafting overlay in Phase 4), but the overlay needs refs to be wired before spotlights work. Recommend doing 3 before 4.

---

## Checklist (quick reference)

- [ ] Phase 0: Branch, phase state, placeholder components
- [ ] Phase 1: SplashScreen with onComplete
- [ ] Phase 2: WelcomeModal, onStartTour / onSkip, tourStep state
- [ ] Phase 3: chartRef, sliderRef, upgradeRef, bottomRef wired in Calculator
- [ ] Phase 4: OnboardingOverlay with STEPS, spotlight, tooltip, onNext/onSkip
- [ ] Phase 5: click-chart and drag-slider steps, pointerEvents and callbacks
- [ ] Phase 6: Replay button and polish
- [ ] Full flow test + accessibility pass
