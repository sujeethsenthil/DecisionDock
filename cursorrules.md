# The Nines Calculator — Cursor Rules
# These rules encode non-negotiable decisions from the Problem Brief, PRD v1.1,
# Design Doc v1.1, and Technical Plan v1.1. Do not override these without
# explicit instruction.

## PRODUCT IDENTITY
- This is "The Nines Calculator" — part of the DecisionDock portfolio
- It visualizes the exponential cost of incremental perfection across 4 domains
- The PRIMARY output is a screenshot-ready visual artifact, not a computation
- The PRIMARY user is a VP of Engineering preparing a budget justification
- The tool is a COMMUNICATION artifact, not a calculator

## ARCHITECTURE CONSTRAINTS
- NO backend. Zero API routes, zero database, zero authentication
- ALL computation is client-side in the browser
- Exactly TWO state values in the entire app: `activeDomain` and `sliderValue`
- Both state values live in the Calculator component (single owner)
- All derived data (cost, marginal cost, curve data, thresholds) computed via useMemo
- NO state management libraries (no Redux, no Zustand, no Jotai)
- When switching domains, update BOTH states atomically in a single handler
  (NOT via useEffect — this causes intermediate renders)
- Curve data (200 points) is generated once per domain switch and memoized
- Slider movement only recalculates single-point metrics, never regenerates curve

## TECH STACK (exact versions matter)
- Next.js 14 with App Router
- TypeScript in strict mode
- shadcn/ui components (copied into project, not installed as dependency)
- Recharts 2.x for charting
- Framer Motion 11.x for animation
- Tailwind CSS 3.x for styling
- Inter + JetBrains Mono via next/font
- pnpm as package manager
- Deploy target: Vercel static export (output: "export")

## COST MODELS (exact formulas — do not change these)

### Uptime
- Formula: Cost(n) = 5000 * 10^(n - 2) where n = number of nines
- BASE_COST = 5000 (NOT 7500, NOT 10000)
- This represents TOTAL COST OF OWNERSHIP (infra + staffing + overhead)
- Anchor points: 99%=$5K, 99.9%=$50K, 99.99%=$500K, 99.999%=$5M, 99.9999%=$50M
- Downtime: deterministic calc from availability * 525960 minutes/year
- Slider range: 2 to 6 nines, step 0.1, default 3.0

### Marketing
- Hill function: response = x^alpha / (K^alpha + x^alpha)
- alpha = 1.5, K = 50000, MAX_CONVERSIONS = 5000
- CPA = spend / conversions
- Slider range: $5K to $500K monthly, logarithmic scale, default $25K

### Test Coverage
- Effort per point: Math.exp(0.06 * coverage_pct)
- Cumulative effort sums the per-point effort
- Bug detection: 0.4 * Math.log(pct/10 + 1), capped at 0.98
- Slider range: 30% to 100%, step 1%, default 75%

### CSAT
- Annual cost: 50000 * Math.exp(0.08 * (pct - 50))
- Cost per point: csatAnnualCost(pct + 1) - csatAnnualCost(pct)
- Slider range: 50% to 99%, step 1%, default 76.9%

## DESIGN SYSTEM (non-negotiable)

### Spacing: 8px grid
- All dimensions use multiples of 8: 8, 16, 24, 32, 40, 48, 56, 64
- 4px half-steps permitted for tight spaces only
- Card padding: 24px. Section spacing: 48-64px. Element gap: 16px
- Border radius: 8px everywhere (cards, buttons, inputs, tabs)
- Button heights: 32px (small) or 40px (default)

### Typography
- UI font: Inter (loaded via next/font). Yes, Inter is intentional
  for Linear/Stripe aesthetic. Do NOT substitute with other fonts
- Data font: JetBrains Mono (loaded via next/font, weights 400+700)
- CRITICAL: Apply font-variant-numeric: tabular-nums to ALL number displays
- Type scale (1.25 ratio): 12/14/16/20/24/32/48px
- Hero counter: 48px JetBrains Mono bold
- Secondary counter: 32px JetBrains Mono bold
- Body: 16px Inter, line-height 1.6

### Colors (exact hex values)
- Blue (value zone): #3B82F6
- Emerald (savings): #22C55E
- Amber (diminishing returns): #F59E0B
- Red (overspend): #EF4444
- Navy (headings, primary text): #1B2A4A
- Dark gray (body text): #333333
- Medium gray (captions): #555555
- Light gray (page background): #F2F4F7
- Border gray: #D0D5DD
- Page background is gray-50 (#F2F4F7), NOT pure white

### Chart gradient (3 stops)
- Stop 1 (0%): Blue #3B82F6 at 30% opacity
- Stop 2 (50%): Amber #F59E0B at 40% opacity
- Stop 3 (100%): Red #EF4444 at 50% opacity
- Stroke: 2px solid transitioning through same 3 colors

### Color zone thresholds (Uptime)
- Blue zone: 99% to 99.9% (2-3 nines)
- Amber zone: 99.9% to 99.99% (3-4 nines)
- Red zone: 99.99%+ (4+ nines)

## ANIMATION SPECS

### Animated cost counter
- Library: Framer Motion useSpring + useTransform
- Spring config: { mass: 0.8, stiffness: 75, damping: 15 }
- Format: formatCurrency(Math.round(n)) with dollar sign, commas, K/M suffix
- Counter color transitions between zone colors as value crosses thresholds
- MUST respect prefers-reduced-motion: reduce (jump instantly, no spring)

### Chart animation
- Use Recharts built-in: isAnimationActive={true}, animationDuration={300}
- animationEasing="ease-out"
- Tab switch: animationDuration={400} for slower morph

### Threshold annotations
- Framer Motion AnimatePresence
- Enter: slide from right (x: 20 to 0) + fade, 300ms, spring { stiffness: 300, damping: 30 }
- Exit: fade out 200ms

### Micro-interactions
- All transitions: 150ms ease-out
- Slider thumb hover: scale(1.1) + shadow elevation
- Card hover: translateY(-2px) + shadow-sm to shadow-md
- Tab active: bottom border slides horizontally (200ms ease-out)
- Focus rings: 2px blue, 2px offset, :focus-visible only

## LAYOUT RULES

### Desktop (>=1024px)
- Two-column: chart 65% left, results panel 35% right
- Column gap: 32px
- Max content width: 1200px centered
- Chart min-height: 400px

### Above-the-fold guarantee
- Viewport >=900px: chart min-height 400px (full layout)
- Viewport 700-899px: chart min-height 350px
- Viewport <700px: slider moves ABOVE chart, single column stack

### Tablet (768-1023px)
- Single column. Chart full width 350px min. Results panel below.

### Mobile (375-767px)
- Chart: 280px min, abbreviated labels ($5K, $5M)
- Counter: 32px (down from 48px)
- 44px touch targets on slider
- Insight cards: collapsed accordion

## SCREENSHOT-READINESS (critical)
- Chart MUST include its own title INSIDE the chart area (not external UI)
- Source attribution MUST be inside chart boundary (bottom-right, 12px, gray)
- Current slider position value MUST appear as label ON the chart
- Chart background: white (not transparent)
- No UI chrome within natural screenshot boundary

## METHODOLOGY NOTE TEXT (exact copy)
- Uptime: "Total cost of ownership (infrastructure + staffing + operational overhead) modeled as an exponential curve: each additional nine of availability multiplies cost by ~10x. Calibrated to Google SRE Book, AWS Multi-AZ pricing, and industry SRE compensation benchmarks."
- Marketing: "Ad spend saturation modeled using a Hill function (alpha=1.5, K=$50K), the standard model used by Meta's Robyn and Google's Meridian MMM platforms. CPA benchmarks from WordStream (2024) and Saxifrage Blog empirical data."
- Coverage: "Engineering effort per coverage point modeled as an exponential curve, calibrated to Google's published thresholds (60% acceptable, 75% commendable, 90% exemplary) and empirical data from Kochhar et al. (2015) and Bach et al. (2017)."
- CSAT: "Support cost per satisfaction point modeled as an exponential curve. Benchmarked to ACSI national average (76.9), Bain & Company retention-profit research, and industry support cost data ($18-$35/ticket)."

## THRESHOLD ANNOTATIONS (Uptime)
- 3.0 nines: "The 10x threshold" — Each additional nine multiplies total cost by 10x
- 3.5 nines: "Dedicated SRE team" — Beyond ~99.95%, you need 4-8 SREs
- 4.0 nines: "Multi-region required" — 99.99% demands multi-region infrastructure
- 5.0 nines: "Google-scale investment" — 99.999% requires 12-20+ SREs

## WHAT TO NEVER DO
- Never add a backend, API route, or database
- Never add user authentication or accounts
- Never add more than one slider per domain template
- Never add localStorage or sessionStorage
- Never add dark mode (v1 is light mode only)
- Never change the cost model formulas or BASE_COST without explicit instruction
- Never use a state management library
- Never use useEffect to sync domain change with slider reset
- Never add export-to-PNG/SVG functionality
- Never add shareable URL state (P2, explicitly excluded)
- Never add custom data input fields
- Never put the chart title outside the chart area

## ACCESSIBILITY
- WCAG 2.1 AA compliance
- Keyboard-navigable slider (arrow keys step 0.1, Home/End jump to min/max)
- Screen reader announces cost values via aria-live region
- Color is NEVER the sole information channel — double-encode with labels
- All text: 4.5:1 contrast ratio minimum
- Focus rings: :focus-visible only (not on mouse click)

## BUILD SEQUENCE (follow this order)
1. Project scaffolding + fonts + shadcn/ui init
2. Data models (all 4 domains) + types + engine
3. Static chart with uptime data (no slider yet)
4. Slider + Calculator state: chart reference line moves
5. Animated counter (Framer Motion spring)
6. Results panel layout (two-column desktop)
7. Domain tabs (all 4, with atomic state switching)
8. Threshold annotations (AnimatePresence)
9. Visual polish (gradient, colors, spacing, micro-interactions)
10. Responsive + accessibility + deployment
