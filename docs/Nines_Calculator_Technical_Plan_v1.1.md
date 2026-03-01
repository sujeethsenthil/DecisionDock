**TECHNICAL PLAN**

**The Nines Calculator**

*Component architecture, data models, and build sequence*

  --------------------- -------------------------------------------------
  **Product**           The Nines Calculator (DecisionDock)

  **Author**            Product Manager

  **Date**              February 28, 2026

  **Status**            Draft v1.1 (revised from review)

  **Depends On**        Problem Brief, PRD, Design Doc (all v1.0)

  **Build Timeline**    10 working days (2 weeks)
  --------------------- -------------------------------------------------

**1. Technology Stack**

Every technology choice traces to a requirement in the PRD or a design
decision in the Design Doc. No technology is chosen for novelty.

  --------------------- -------------------------------------------------
  **Property**          **Specification**

  **Framework**         Next.js 14 (App Router). Provides: static export
                        for Vercel deployment, file-based routing (though
                        we use one page), built-in font optimization for
                        Inter and JetBrains Mono, and image optimization
                        if needed later.

  **UI components**     shadcn/ui. Not a dependency---components are
                        copied into the project and customized. Gives us
                        Radix-based Slider, Tabs, Card, Badge,
                        Collapsible, and the ChartContainer wrapper
                        around Recharts.

  **Charting**          Recharts 2.x. The only charting library with
                        official shadcn/ui integration. Provides
                        AreaChart, ReferenceLine, ReferenceArea, Tooltip,
                        and built-in animation. \~40kB gzipped.

  **Animation**         Framer Motion 11.x. Used for: useSpring (animated
                        counter), AnimatePresence (threshold
                        annotations), and layout animations (tab switch
                        morphing). \~32kB gzipped.

  **Styling**           Tailwind CSS 3.x (via shadcn/ui defaults). All
                        custom styles use Tailwind utility classes. No
                        custom CSS files except for the chart gradient
                        SVG definition.

  **Fonts**             Inter (Google Fonts, variable weight). JetBrains
                        Mono (Google Fonts, 400 and 700 weights). Both
                        loaded via next/font for zero layout shift.

  **Deployment**        Vercel. Static export (next export or output:
                        \"export\" in next.config). No server-side
                        rendering needed---all computation is
                        client-side.

  **Package manager**   pnpm. Faster installs, strict dependency
                        resolution.

  **TypeScript**        Strict mode. All components, models, and
                        utilities are fully typed.
  --------------------- -------------------------------------------------

  -----------------------------------------------------------------------
  **No backend.** The entire application runs client-side. No API routes,
  no database, no authentication. This is a deliberate architectural
  decision that eliminates signup friction, ensures sub-second load
  times, and keeps the deployment surface minimal. All cost model
  computation happens in the browser.

  -----------------------------------------------------------------------

**2. Project Structure**

The file structure follows Next.js App Router conventions with a flat
component hierarchy. Deeply nested folders are avoided in favor of
clear, scannable naming.

+-----------------------------------------------------------------------+
| nines-calculator/                                                     |
|                                                                       |
| ├── app/                                                              |
|                                                                       |
| │ ├── layout.tsx \# Root layout: fonts, metadata, global styles       |
|                                                                       |
| │ ├── page.tsx \# Single page: assembles all zones                    |
|                                                                       |
| │ └── globals.css \# Tailwind base + chart gradient CSS               |
|                                                                       |
| ├── components/                                                       |
|                                                                       |
| │ ├── ui/ \# shadcn/ui primitives (slider, tabs, card, etc.)          |
|                                                                       |
| │ ├── calculator/                                                     |
|                                                                       |
| │ │ ├── Calculator.tsx \# Main orchestrator component                 |
|                                                                       |
| │ │ ├── CostCurveChart.tsx \# Recharts AreaChart (parameterized)      |
|                                                                       |
| │ │ ├── ResultsPanel.tsx \# Right column: counter + slider + metrics  |
|                                                                       |
| │ │ ├── AnimatedCounter.tsx \# Framer Motion spring counter           |
|                                                                       |
| │ │ ├── DomainTabs.tsx \# Tab navigation across 4 domains             |
|                                                                       |
| │ │ ├── InsightCards.tsx \# Threshold-aware annotation cards          |
|                                                                       |
| │ │ └── MethodologyNote.tsx \# Collapsible source attribution         |
|                                                                       |
| │ ├── hero/                                                           |
|                                                                       |
| │ │ └── HeroHeadline.tsx \# Zone 1: headline + subtitle               |
|                                                                       |
| │ └── footer/                                                         |
|                                                                       |
| │ └── SiteFooter.tsx \# DecisionDock branding + portfolio link        |
|                                                                       |
| ├── lib/                                                              |
|                                                                       |
| │ ├── models/                                                         |
|                                                                       |
| │ │ ├── types.ts \# DomainConfig, DataPoint, ThresholdAnnotation      |
|                                                                       |
| │ │ ├── uptime.ts \# Uptime cost model + anchor data                  |
|                                                                       |
| │ │ ├── marketing.ts \# Hill function model + CPA benchmarks          |
|                                                                       |
| │ │ ├── coverage.ts \# Logarithmic effort model                       |
|                                                                       |
| │ │ └── csat.ts \# Exponential staffing model                         |
|                                                                       |
| │ ├── engine.ts \# generateCurveData(config, sliderValue)             |
|                                                                       |
| │ ├── format.ts \# Currency, percentage, duration formatters          |
|                                                                       |
| │ └── constants.ts \# Colors, thresholds, spring configs              |
|                                                                       |
| ├── public/                                                           |
|                                                                       |
| │ └── og-image.png \# Open Graph preview image                        |
|                                                                       |
| ├── tailwind.config.ts                                                |
|                                                                       |
| ├── next.config.js                                                    |
|                                                                       |
| ├── tsconfig.json                                                     |
|                                                                       |
| └── package.json                                                      |
+-----------------------------------------------------------------------+

**3. Component Architecture**

**3.1 Component tree**

The component tree is intentionally shallow. Three levels maximum from
the page root to any leaf component. Deep nesting creates prop-drilling
complexity without architectural benefit at this scale.

+-----------------------------------------------------------------------+
| page.tsx                                                              |
|                                                                       |
| ├── HeroHeadline                                                      |
|                                                                       |
| ├── Calculator \# State owner                                         |
|                                                                       |
| │ ├── DomainTabs \# Tab selection                                     |
|                                                                       |
| │ ├── CostCurveChart \# Recharts AreaChart                            |
|                                                                       |
| │ ├── ResultsPanel \# Right column                                    |
|                                                                       |
| │ │ ├── AnimatedCounter \# Spring-animated \$                         |
|                                                                       |
| │ │ ├── Slider (shadcn) \# Input control                              |
|                                                                       |
| │ │ └── SecondaryMetrics \# Downtime, marginal cost                   |
|                                                                       |
| │ ├── InsightCards \# Threshold annotations                           |
|                                                                       |
| │ └── MethodologyNote \# Source attribution                           |
|                                                                       |
| └── SiteFooter                                                        |
+-----------------------------------------------------------------------+

**3.2 State management**

The application has exactly **two pieces of state**. No state management
library is needed. React's built-in useState handles everything.

  --------------------- -------------------------------------------------
  **Property**          **Specification**

  **activeDomain**      Type: DomainKey (\"uptime\" \| \"marketing\" \|
                        \"coverage\" \| \"csat\"). Default: \"uptime\".
                        Owned by Calculator. Updated atomically with
                        sliderValue via handleDomainChange handler.
                        Passed to DomainTabs (for selection UI),
                        CostCurveChart (for data + labels), ResultsPanel
                        (for metrics), InsightCards (for annotations).

  **sliderValue**       Type: number. Default: domain-specific (3.0 for
                        uptime = 99.9%, 25000 for marketing, 75 for
                        coverage, 76.9 for CSAT). Owned by Calculator.
                        Passed to CostCurveChart (for reference line),
                        ResultsPanel (for counter value), InsightCards
                        (for threshold logic).
  --------------------- -------------------------------------------------

All derived data (cost at current position, curve data points, marginal
cost, downtime saved, active thresholds) is computed via **useMemo**
from these two state values plus the domain configuration object. No
derived state is stored.

  -----------------------------------------------------------------------
  **Why no state library:** Two state values, one owner component, three
  levels of prop passing. Both values update atomically in a single event
  handler when switching domains, preventing intermediate renders. Redux,
  Zustand, or Jotai would add bundle weight and conceptual overhead for
  zero benefit. If future versions add customizable parameters (base
  cost, team size), a lightweight store like Zustand becomes justified.
  Not before.

  -----------------------------------------------------------------------

**3.3 Data flow**

The data flow is unidirectional and synchronous. No async operations, no
loading states, no error boundaries needed for the core interaction.

+-----------------------------------------------------------------------+
| User drags slider                                                     |
|                                                                       |
| → onChange fires, setSliderValue(newValue)                            |
|                                                                       |
| → Calculator re-renders                                               |
|                                                                       |
| → useMemo recomputes:                                                 |
|                                                                       |
| \- curveData = generateCurveData(domainConfig, sliderValue)           |
|                                                                       |
| \- currentCost = domainConfig.costFn(sliderValue)                     |
|                                                                       |
| \- marginalCost = domainConfig.marginalCostFn(sliderValue)            |
|                                                                       |
| \- secondaryMetric = domainConfig.secondaryFn(sliderValue)            |
|                                                                       |
| \- activeThresholds = domainConfig.thresholds.filter(\...)            |
|                                                                       |
| → Props flow down to children:                                        |
|                                                                       |
| \- CostCurveChart receives curveData + sliderValue                    |
|                                                                       |
| \- AnimatedCounter receives currentCost                               |
|                                                                       |
| \- InsightCards receives activeThresholds                             |
|                                                                       |
| → Recharts animates chart path (internal)                             |
|                                                                       |
| → Framer Motion spring-animates counter (internal)                    |
|                                                                       |
| → AnimatePresence shows/hides threshold cards (internal)              |
+-----------------------------------------------------------------------+

**4. Data Model Implementation**

**4.1 Core types**

+-----------------------------------------------------------------------+
| // lib/models/types.ts                                                |
|                                                                       |
| interface DomainConfig {                                              |
|                                                                       |
| key: DomainKey;                                                       |
|                                                                       |
| label: string; // \"Uptime\", \"Marketing\", etc.                     |
|                                                                       |
| description: string; // Tab subtitle                                  |
|                                                                       |
| sliderConfig: {                                                       |
|                                                                       |
| min: number;                                                          |
|                                                                       |
| max: number;                                                          |
|                                                                       |
| step: number;                                                         |
|                                                                       |
| default: number;                                                      |
|                                                                       |
| format: (v: number) =\> string; // \"99.99%\" or \"\$25K\"            |
|                                                                       |
| };                                                                    |
|                                                                       |
| xAxis: { label: string; format: (v: number) =\> string };             |
|                                                                       |
| yAxis: { label: string; format: (v: number) =\> string };             |
|                                                                       |
| costFn: (x: number) =\> number; // Total cost at x                    |
|                                                                       |
| marginalCostFn: (x: number) =\> number; // Marginal cost at x         |
|                                                                       |
| secondaryFn: (x: number) =\> number; // Domain-specific metric        |
|                                                                       |
| secondaryLabel: string; // \"Downtime saved\"                         |
|                                                                       |
| secondaryFormat: (v: number) =\> string;                              |
|                                                                       |
| thresholds: ThresholdAnnotation\[\];                                  |
|                                                                       |
| source: string; // Attribution text                                   |
|                                                                       |
| zones: { value: number; caution: number }; // Color zone boundaries   |
|                                                                       |
| }                                                                     |
|                                                                       |
| interface DataPoint {                                                 |
|                                                                       |
| x: number; // Domain input (nines, spend, coverage%, CSAT%)           |
|                                                                       |
| cost: number; // Total annual cost                                    |
|                                                                       |
| label: string; // Formatted x value for tooltip                       |
|                                                                       |
| }                                                                     |
|                                                                       |
| interface ThresholdAnnotation {                                       |
|                                                                       |
| trigger: number; // Slider value that triggers this                   |
|                                                                       |
| direction: \"above\" \| \"below\";                                    |
|                                                                       |
| icon: string; // Emoji                                                |
|                                                                       |
| title: string;                                                        |
|                                                                       |
| body: string;                                                         |
|                                                                       |
| }                                                                     |
+-----------------------------------------------------------------------+

**4.2 Uptime model**

+-----------------------------------------------------------------------+
| // lib/models/uptime.ts                                               |
|                                                                       |
| const BASE_COST = 5000; // \$/year TCO at 2 nines                     |
|                                                                       |
| export function uptimeCost(nines: number): number {                   |
|                                                                       |
| return BASE_COST \* Math.pow(10, nines - 2);                          |
|                                                                       |
| }                                                                     |
|                                                                       |
| export function uptimeDowntimeMinutes(nines: number): number {        |
|                                                                       |
| const availability = 1 - Math.pow(10, -nines);                        |
|                                                                       |
| return (1 - availability) \* 525960; // minutes per year              |
|                                                                       |
| }                                                                     |
|                                                                       |
| export function uptimeMarginalCost(nines: number): number {           |
|                                                                       |
| const delta = 0.1;                                                    |
|                                                                       |
| return (uptimeCost(nines + delta) - uptimeCost(nines)) / delta;       |
|                                                                       |
| }                                                                     |
|                                                                       |
| // Anchor validation (total cost of ownership):                       |
|                                                                       |
| // uptimeCost(2) = \$5,000 (single AZ, basic monitoring)              |
|                                                                       |
| // uptimeCost(3) = \$50,000 (multi-AZ, load balancing, 1-2 DevOps)    |
|                                                                       |
| // uptimeCost(4) = \$500,000 (observability, SRE team 4-8)            |
|                                                                       |
| // uptimeCost(5) = \$5,000,000 (multi-region, 12-20 SREs)             |
|                                                                       |
| // uptimeCost(6) = \$50,000,000 (fault-tolerant, 20-50+ SREs + NOC)   |
+-----------------------------------------------------------------------+

**4.3 Marketing model**

+-----------------------------------------------------------------------+
| // lib/models/marketing.ts                                            |
|                                                                       |
| const ALPHA = 1.5; // Hill function shape (Meta Robyn range: 0.5-3)   |
|                                                                       |
| const K = 50000; // Half-saturation at \$50K/month                    |
|                                                                       |
| const MAX_CONV = 5000; // Max monthly conversions at saturation       |
|                                                                       |
| export function marketingConversions(spend: number): number {         |
|                                                                       |
| return MAX_CONV \* Math.pow(spend, ALPHA) /                           |
|                                                                       |
| (Math.pow(K, ALPHA) + Math.pow(spend, ALPHA));                        |
|                                                                       |
| }                                                                     |
|                                                                       |
| export function marketingCPA(spend: number): number {                 |
|                                                                       |
| const conv = marketingConversions(spend);                             |
|                                                                       |
| return conv \> 0 ? spend / conv : 0;                                  |
|                                                                       |
| }                                                                     |
|                                                                       |
| export function marketingMarginalCPA(spend: number): number {         |
|                                                                       |
| const delta = 500;                                                    |
|                                                                       |
| const deltaConv = marketingConversions(spend + delta)                 |
|                                                                       |
| \- marketingConversions(spend);                                       |
|                                                                       |
| return deltaConv \> 0 ? delta / deltaConv : Infinity;                 |
|                                                                       |
| }                                                                     |
+-----------------------------------------------------------------------+

**4.4 Coverage model**

+-----------------------------------------------------------------------+
| // lib/models/coverage.ts                                             |
|                                                                       |
| // Effort per percentage point rises exponentially                    |
|                                                                       |
| export function coverageEffort(pct: number): number {                 |
|                                                                       |
| if (pct \<= 0) return 0;                                              |
|                                                                       |
| // Cumulative engineering-months to reach pct%                        |
|                                                                       |
| const k = 0.06; // Calibrated so 95-100% is 10-50x baseline           |
|                                                                       |
| let total = 0;                                                        |
|                                                                       |
| for (let i = 1; i \<= pct; i++) {                                     |
|                                                                       |
| total += Math.exp(k \* i);                                            |
|                                                                       |
| }                                                                     |
|                                                                       |
| return total;                                                         |
|                                                                       |
| }                                                                     |
|                                                                       |
| export function coverageMarginalEffort(pct: number): number {         |
|                                                                       |
| return Math.exp(0.06 \* pct); // Effort for next 1%                   |
|                                                                       |
| }                                                                     |
|                                                                       |
| // Bug detection: logarithmic, flattens after \~85%                   |
|                                                                       |
| export function bugDetectionRate(pct: number): number {               |
|                                                                       |
| return Math.min(0.98, 0.4 \* Math.log(pct / 10 + 1));                 |
|                                                                       |
| }                                                                     |
+-----------------------------------------------------------------------+

**4.5 CSAT model**

+-----------------------------------------------------------------------+
| // lib/models/csat.ts                                                 |
|                                                                       |
| const BASE_SUPPORT_COST = 50000; // \$/year at 50% CSAT               |
|                                                                       |
| export function csatAnnualCost(pct: number): number {                 |
|                                                                       |
| const k = 0.08; // Calibrated: 1x at 60%, 25-100x at 95%+             |
|                                                                       |
| return BASE_SUPPORT_COST \* Math.exp(k \* (pct - 50));                |
|                                                                       |
| }                                                                     |
|                                                                       |
| export function csatCostPerPoint(pct: number): number {               |
|                                                                       |
| return csatAnnualCost(pct + 1) - csatAnnualCost(pct);                 |
|                                                                       |
| }                                                                     |
|                                                                       |
| // Retention impact: Bain 5% retention = 25-95% profit                |
|                                                                       |
| export function retentionImpact(pct: number): number {                |
|                                                                       |
| // Diminishing: big gains 60-80, small gains 90+                      |
|                                                                       |
| return 100 \* (1 - Math.exp(-0.05 \* (pct - 40)));                    |
|                                                                       |
| }                                                                     |
+-----------------------------------------------------------------------+

**4.6 Curve data generator**

+-----------------------------------------------------------------------+
| // lib/engine.ts                                                      |
|                                                                       |
| export function generateCurveData(                                    |
|                                                                       |
| config: DomainConfig,                                                 |
|                                                                       |
| numPoints: number = 200                                               |
|                                                                       |
| ): DataPoint\[\] {                                                    |
|                                                                       |
| const { min, max } = config.sliderConfig;                             |
|                                                                       |
| const step = (max - min) / numPoints;                                 |
|                                                                       |
| return Array.from({ length: numPoints + 1 }, (\_, i) =\> {            |
|                                                                       |
| const x = min + i \* step;                                            |
|                                                                       |
| return {                                                              |
|                                                                       |
| x,                                                                    |
|                                                                       |
| cost: config.costFn(x),                                               |
|                                                                       |
| label: config.sliderConfig.format(x),                                 |
|                                                                       |
| };                                                                    |
|                                                                       |
| });                                                                   |
|                                                                       |
| }                                                                     |
+-----------------------------------------------------------------------+

The curve data is generated once per domain switch (200 points, \~0.1ms
computation) and memoized. Slider movement does not regenerate the
curve---it only moves the reference line and recalculates the
single-point metrics (cost, marginal cost, secondary metric).

**5. Key Component Implementations**

**5.1 CostCurveChart**

This is the most complex component. It wraps Recharts' AreaChart with
the gradient definitions, reference lines, and zone shading specified in
the Design Doc.

  --------------------- -------------------------------------------------
  **Property**          **Specification**

  **Data input**        Array of DataPoint objects from
                        generateCurveData. Memoized---regenerated only on
                        domain change.

  **Gradient**          SVG \<linearGradient\> defined in \<defs\>. Three
                        \<stop\> elements: blue at 0%, amber at 50%, red
                        at 100%. Opacity values per Design Doc (30%, 40%,
                        50%).

  **Reference line**    Recharts \<ReferenceLine x={sliderValue}\> with
                        custom label component showing the current value.
                        Stroke: 2px dashed, color matches current zone.

  **Zone shading**      Three \<ReferenceArea\> components covering
                        value, caution, and overspend zones. Fill opacity
                        0.05 (subtle background tinting, not competing
                        with the main gradient).

  **Tooltip**           shadcn/ui ChartTooltipContent. Shows exact cost,
                        formatted value, and marginal cost at the hovered
                        point.

  **Responsive**        Recharts \<ResponsiveContainer width=\"100%\"
                        height={400}\>. Aspect ratio maintained via
                        parent container min-height.

  **Chart title**       Rendered inside the chart area (not external) as
                        a custom Recharts label at the top-left, per the
                        Design Doc screenshot-readiness requirement.

  **Source text**       Small text rendered inside the chart area at
                        bottom-right: \"Based on Google SRE Book cost
                        models.\"

  **Animation**         isAnimationActive={true},
                        animationDuration={300},
                        animationEasing=\"ease-out\".
  --------------------- -------------------------------------------------

**5.2 AnimatedCounter**

The counter uses Framer Motion's spring physics to animate between
values. The implementation is minimal but the effect is the most
impactful visual element in the tool.

+-----------------------------------------------------------------------+
| // components/calculator/AnimatedCounter.tsx                          |
|                                                                       |
| import { useSpring, useTransform, motion } from \"framer-motion\";    |
|                                                                       |
| import { useEffect } from \"react\";                                  |
|                                                                       |
| import { formatCurrency } from \"@/lib/format\";                      |
|                                                                       |
| interface Props {                                                     |
|                                                                       |
| value: number;                                                        |
|                                                                       |
| className?: string;                                                   |
|                                                                       |
| }                                                                     |
|                                                                       |
| export function AnimatedCounter({ value, className }: Props) {        |
|                                                                       |
| const spring = useSpring(value, {                                     |
|                                                                       |
| mass: 0.8,                                                            |
|                                                                       |
| stiffness: 75,                                                        |
|                                                                       |
| damping: 15,                                                          |
|                                                                       |
| });                                                                   |
|                                                                       |
| const handleDomainChange = (newDomain: DomainKey) = useEffect(() =\>  |
| {gt; { spring.set(value); }, \[spring, value\]);                      |
|                                                                       |
| const display = useTransform(spring, (v) =\>                          |
|                                                                       |
| formatCurrency(Math.round(v))                                         |
|                                                                       |
| );                                                                    |
|                                                                       |
| return (                                                              |
|                                                                       |
| \<motion.span                                                         |
|                                                                       |
| className={className}                                                 |
|                                                                       |
| style={{ fontVariantNumeric: \"tabular-nums\" }}                      |
|                                                                       |
| \>                                                                    |
|                                                                       |
| {display}                                                             |
|                                                                       |
| \</motion.span\>                                                      |
|                                                                       |
| );                                                                    |
|                                                                       |
| }                                                                     |
+-----------------------------------------------------------------------+

**5.3 Calculator (orchestrator)**

The Calculator component owns the two state values and computes all
derived data via useMemo. It passes only what each child needs.

+-----------------------------------------------------------------------+
| // components/calculator/Calculator.tsx (simplified)                  |
|                                                                       |
| export function Calculator() {                                        |
|                                                                       |
| const \[domain, setDomain\] = useState\<DomainKey\>(\"uptime\");      |
|                                                                       |
| const \[slider, setSlider\] =                                         |
| useState(DOMAINS.uptime.sliderConfig.default);                        |
|                                                                       |
| const config = DOMAINS\[domain\];                                     |
|                                                                       |
| // Atomic tab switch: both states update in one handler               |
|                                                                       |
| const handleDomainChange = (newDomain: DomainKey) = useEffect(() =\>  |
| {gt; {                                                                |
|                                                                       |
| setDomain(newDomain);                                                 |
|                                                                       |
| setSlider(DOMAINS\[newDomain\].sliderConfig.default); };              |
|                                                                       |
| const curveData = useMemo(                                            |
|                                                                       |
| () =\> generateCurveData(config),                                     |
|                                                                       |
| \[config\]                                                            |
|                                                                       |
| );                                                                    |
|                                                                       |
| const currentCost = useMemo(() =\> config.costFn(slider), \[config,   |
| slider\]);                                                            |
|                                                                       |
| const marginal = useMemo(() =\> config.marginalCostFn(slider),        |
| \[config, slider\]);                                                  |
|                                                                       |
| const secondary = useMemo(() =\> config.secondaryFn(slider),          |
| \[config, slider\]);                                                  |
|                                                                       |
| const thresholds = useMemo(                                           |
|                                                                       |
| () =\> config.thresholds.filter(t =\>                                 |
|                                                                       |
| t.direction === \"above\" ? slider \>= t.trigger : slider \<=         |
| t.trigger                                                             |
|                                                                       |
| ),                                                                    |
|                                                                       |
| \[config, slider\]                                                    |
|                                                                       |
| );                                                                    |
|                                                                       |
| return ( /\* Layout: DomainTabs + CostCurveChart + ResultsPanel +     |
| InsightCards \*/ );                                                   |
|                                                                       |
| }                                                                     |
+-----------------------------------------------------------------------+

**6. Performance Budget**

The PRD requires first meaningful paint under 2 seconds on 4G and 60fps
slider interaction. Here is the budget that achieves this.

**6.1 Bundle size budget**

  ------------------ ------------------------------- ---------------------
  **Package**        **Estimated Size (gzipped)**    **Justification**

  **Next.js          \~70kB                          Framework baseline.
  runtime**                                          App Router shared
                                                     chunks.

  **React +          \~42kB                          Included in Next.js.
  ReactDOM**                                         Non-negotiable.

  **Recharts**       \~40kB                          Charting.
                                                     Tree-shaking reduces
                                                     if only AreaChart is
                                                     imported.

  **Framer Motion**  \~32kB                          Animation. Only
                                                     useSpring,
                                                     useTransform,
                                                     AnimatePresence
                                                     imported.

  **shadcn/ui        \~8kB                           Copied into project.
  components**                                       Only Slider, Tabs,
                                                     Card, Badge,
                                                     Collapsible.

  **Tailwind CSS**   \~10kB                          Purged in production.
                                                     Only used classes
                                                     ship.

  **Application      \~15kB                          Components, models,
  code**                                             utilities, constants.

  **Total**          \~217kB                         Target: under 250kB.
                                                     Comfortable margin.
  ------------------ ------------------------------- ---------------------

**6.2 Runtime performance**

  --------------------- -------------------------------------------------
  **Property**          **Specification**

  **Slider update       setState (slider) → useMemo (3 cost calculations)
  cycle**               → React re-render (6 components) → Recharts
                        reference line move → Framer Motion spring kick.
                        Target: complete within 16ms (one frame).

  **Cost computation**  Single Math.pow call: \~0.001ms. Negligible.

  **Curve data          200 points × 1 Math.pow each: \~0.1ms. Run only
  generation**          on domain switch, memoized.

  **React re-render**   6 components, shallow prop comparison: \~2--4ms.
                        Well within budget.

  **Recharts            Built-in requestAnimationFrame loop. Reference
  animation**           line position update: \~1ms.

  **Framer Motion       Runs on separate animation frame. Counter update:
  spring**              \~0.5ms per frame.

  **Total per slider    Estimated 4--8ms. Budget: 16ms. Headroom:
  tick**                50--75%.
  --------------------- -------------------------------------------------

**6.3 Loading strategy**

  --------------------- -------------------------------------------------
  **Property**          **Specification**

  **Fonts**             next/font preloads Inter and JetBrains Mono with
                        display: swap. No layout shift.

  **Above-fold          HeroHeadline + DomainTabs + chart skeleton render
  content**             on first paint. Chart data computes synchronously
                        (\~0.1ms) so no loading state needed.

  **Below-fold          InsightCards and MethodologyNote can lazy-load
  content**             (React.lazy + Suspense) but at \~2kB each, the
                        benefit is marginal. Include in main bundle.

  **Preconnect**        \<link rel=\"preconnect\"\> for Google Fonts CDN
                        in layout.tsx.
  --------------------- -------------------------------------------------

**7. Threshold Annotations**

These annotations appear via AnimatePresence when the slider crosses
specific values. Each is calibrated to published data.

**Uptime thresholds**

  ------------------ ------------------------------- ---------------------
  **Trigger**        **Title**                       **Body**

  **3.0 nines**      ⚡ The 10× threshold            Each additional nine
                                                     roughly multiplies
                                                     your total cost by
                                                     10×. Going from 3 to
                                                     4 nines takes you
                                                     from \$75K to
                                                     \$750K/year.

  **3.5 nines**      👥 Dedicated SRE team           Beyond \~99.95%, you
                                                     need a dedicated SRE
                                                     team (4--8
                                                     engineers). Google's
                                                     minimum on-call team
                                                     is 8 SREs across two
                                                     time zones.

  **4.0 nines**      🌍 Multi-region required        99.99% demands
                                                     multi-region
                                                     infrastructure with
                                                     active-active or hot
                                                     standby. This roughly
                                                     doubles your entire
                                                     cloud bill.

  **5.0 nines**      🚨 Google-scale investment      99.999% requires
                                                     12--20+ SREs, formal
                                                     verification, and
                                                     \>90% of dev time on
                                                     testing. Google
                                                     targets this for only
                                                     their most critical
                                                     services.
  ------------------ ------------------------------- ---------------------

**Marketing thresholds**

  ------------------ ------------------------------- ---------------------
  **Trigger**        **Title**                       **Body**

  **\$25K/mo**       📉 Marginal CPA rising          Your average CPA is
                                                     \~\$30, but each
                                                     additional \$1K of
                                                     spend now costs \$38+
                                                     per conversion.
                                                     Average ROAS masks
                                                     marginal waste.

  **\$100K/mo**      ⚠️ Deep saturation              Marginal CPA has
                                                     doubled. You're
                                                     paying \$85+ for each
                                                     additional
                                                     conversion. Consider
                                                     reallocating to
                                                     underinvested
                                                     channels.

  **\$250K/mo**      🛑 ROAS below breakeven         At this spend level,
                                                     marginal ROAS
                                                     approaches 1.0× or
                                                     below. Each new
                                                     dollar may cost more
                                                     than the revenue it
                                                     generates.
  ------------------ ------------------------------- ---------------------

**Coverage thresholds**

  ------------------ ------------------------------- ---------------------
  **Trigger**        **Title**                       **Body**

  **60%**            ✅ Google's \"acceptable\"      Google considers 60%
                                                     coverage the minimum
                                                     acceptable level.
                                                     You're testing happy
                                                     paths and core
                                                     functions.

  **75%**            🏅 Google's \"commendable\"     75% is commendable.
                                                     Google's internal
                                                     median project is at
                                                     78%. Edge cases and
                                                     error paths are
                                                     covered.

  **90%**            🏆 Google's \"exemplary\"       90% is exemplary.
                                                     Beyond this, Google
                                                     says gains are
                                                     logarithmic. You're
                                                     now testing generated
                                                     code and timing
                                                     issues.

  **95%**            ⚠️ Extreme diminishing returns  95--100% requires
                                                     10--50× more effort
                                                     per point than the
                                                     0--60% range. You're
                                                     covering dead code
                                                     and exception
                                                     handlers.
  ------------------ ------------------------------- ---------------------

**CSAT thresholds**

  ------------------ ------------------------------- ---------------------
  **Trigger**        **Title**                       **Body**

  **76.9%**          🏠 National average             The US ACSI average
                                                     is 76.9/100. You're
                                                     at baseline. Basic
                                                     improvements
                                                     (response time,
                                                     staffing) are
                                                     high-ROI.

  **85%**            💰 Cost acceleration begins     Above 85%, each point
                                                     costs 3--5× more. You
                                                     need personalization,
                                                     proactive outreach,
                                                     and omnichannel
                                                     support.

  **90%**            🚀 Premium territory            90%+ requires
                                                     dedicated account
                                                     management and
                                                     near-instant
                                                     response. Cost per
                                                     point is 10--25×
                                                     baseline.

  **95%**            💎 Luxury experience            Above 95% demands
                                                     custom solutions per
                                                     customer. Cost per
                                                     point is 25--100×.
                                                     Only justifiable for
                                                     high-LTV accounts.
  ------------------ ------------------------------- ---------------------

**8. Build Sequence**

The build is sequenced so that **each day produces a working,
demonstrable increment**. Nothing is built in isolation for days before
connecting to the rest. The tool is launchable (if rough) by end of Day
4.

**Phase 1: Foundation (Days 1--2)**

  --------------------- -------------------------------------------------
  **Property**          **Specification**

  **Day 1 morning**     Project scaffolding: Next.js + Tailwind +
                        shadcn/ui init. Install Recharts + Framer Motion.
                        Set up project structure. Configure Inter +
                        JetBrains Mono via next/font.

  **Day 1 afternoon**   Data models: Implement all four domain models
                        (uptime.ts, marketing.ts, coverage.ts, csat.ts)
                        with types.ts and engine.ts. Write quick
                        validation tests (does uptimeCost(3) return
                        \~\$75K?).

  **Day 2 morning**     Core chart: Build CostCurveChart with the Uptime
                        model. Static first---no slider yet. Get the
                        gradient, axes, and grid lines right. Verify
                        screenshot-readiness (title inside chart area).

  **Day 2 afternoon**   Slider + state: Build Calculator orchestrator
                        with useState for domain and slider. Wire slider
                        to chart via ReferenceLine. First interactive
                        moment: drag slider, reference line moves.
  --------------------- -------------------------------------------------

**Phase 2: Core Experience (Days 3--4)**

  --------------------- -------------------------------------------------
  **Property**          **Specification**

  **Day 3 morning**     Animated counter: Build AnimatedCounter with
                        Framer Motion useSpring. Wire to Calculator
                        state. First aha moment: drag slider, cost
                        counter animates from \$75K to \$750K.

  **Day 3 afternoon**   Results panel layout: Build ResultsPanel with
                        counter, slider, and secondary metrics. Implement
                        the two-column desktop layout per Design Doc.
                        Test responsive breakpoints.

  **Day 4 morning**     Domain tabs: Build DomainTabs. Wire tab switching
                        to domain state. Implement slider reset on domain
                        change. Verify chart morphs between domains
                        (Recharts animation).

  **Day 4 afternoon**   Visual polish pass 1: Apply color system
                        (gradient stops, zone shading, slider track
                        color). Implement 8px grid spacing. Test that the
                        chart looks correct at all slider positions.
  --------------------- -------------------------------------------------

  -----------------------------------------------------------------------
  **Milestone --- End of Day 4:** The tool is functional. A user can drag
  a slider, see the cost curve, watch the counter animate, and switch
  between four domains. It is launchable if needed, though unpolished.

  -----------------------------------------------------------------------

**Phase 3: Polish (Days 5--7)**

  --------------------- -------------------------------------------------
  **Property**          **Specification**

  **Day 5**             Threshold annotations: Build InsightCards with
                        AnimatePresence. Implement all threshold data
                        from Section 7. Test enter/exit animations at
                        each threshold crossing.

  **Day 6**             Micro-interactions: Slider thumb hover/active
                        states. Tab sliding indicator. Card hover
                        elevation. Focus rings. Reduced-motion media
                        query support. Mobile touch optimization.

  **Day 7**             Typography + spacing audit: Walk every screen at
                        every breakpoint. Verify 8px grid compliance.
                        Verify font-variant-numeric: tabular-nums on all
                        numbers. Fix any alignment or spacing
                        inconsistencies.
  --------------------- -------------------------------------------------

**Phase 4: Ship Prep (Days 8--10)**

  --------------------- -------------------------------------------------
  **Property**          **Specification**

  **Day 8**             Responsive hardening: Test on iPhone SE (375px),
                        iPad (768px), laptop (1366px), desktop (1920px).
                        Fix any chart clipping, slider touch target, or
                        text overflow issues.

  **Day 9**             Accessibility audit: Keyboard navigation through
                        all interactive elements. Screen reader test
                        (VoiceOver). Color contrast check (all text
                        passes 4.5:1). aria-labels on slider and chart.

  **Day 10**            Deployment: Vercel deploy. Open Graph meta tags +
                        og-image. Final visual QA on production URL. Add
                        MethodologyNote content. Add SiteFooter with
                        DecisionDock branding and portfolio link.
  --------------------- -------------------------------------------------

**9. Deployment Configuration**

  --------------------- -------------------------------------------------
  **Property**          **Specification**

  **Platform**          Vercel. Free tier supports custom domain + edge
                        CDN + automatic HTTPS.

  **Build command**     next build (static export via output: \"export\"
                        in next.config.js).

  **Output**            Static HTML + JS + CSS in /out directory. No
                        server functions.

  **Domain**            nines.decisiondock.com (or similar subdomain).
                        DNS CNAME to Vercel.

  **Environment         None. No secrets, no API keys, no backend.
  variables**           

  **CI/CD**             Vercel GitHub integration: push to main →
                        automatic build + deploy. Preview deployments on
                        PRs.

  **Monitoring**        Vercel Analytics (free tier) for page views and
                        Web Vitals. No custom analytics in v1.
  --------------------- -------------------------------------------------

**10. Testing Strategy**

The testing approach matches the tool's architecture: heavy on model
validation (where correctness matters most), light on UI testing (where
visual QA is more effective than automated tests at this scale).

  --------------------- -------------------------------------------------
  **Property**          **Specification**

  **Model unit tests**  Every cost function validated against published
                        anchor points. Example: uptimeCost(3) should
                        return approximately \$50,000 (±20%).
                        marketingCPA(10000) should return approximately
                        \$25 (±30%). Run via Jest or Vitest.

  **Format tests**      formatCurrency, formatPercentage, formatDuration
                        tested with edge cases: zero, very large numbers,
                        negative numbers (should not occur but should not
                        crash).

  **Threshold logic     Verify correct thresholds activate at correct
  tests**               slider positions. Boundary testing: slider at
                        exactly the trigger value, 0.01 above, 0.01
                        below.

  **Visual QA**         Manual testing at four breakpoints (375px, 768px,
                        1024px, 1920px). Screenshot comparison
                        before/after each polish pass. This catches
                        layout issues that automated tests miss.

  **Accessibility       Manual keyboard navigation walkthrough. axe
  audit**               DevTools extension scan. VoiceOver test on macOS
                        Safari.

  **Performance check** Lighthouse performance score target: \>90. Check
                        slider FPS with Chrome DevTools Performance panel
                        (target: 60fps sustained).
  --------------------- -------------------------------------------------

**11. Document Chain Summary**

This Technical Plan completes the four-document product development
sequence. Each document answered a specific question that earned the
right to proceed to the next:

  ------------------ ------------------------------- ---------------------
  **Document**       **Question Answered**           **Key Decision**

  **Problem Brief**  Should this exist, and for      VP of Engineering in
                     whom?                           a budget
                                                     justification moment.
                                                     Communication tool,
                                                     not calculator.

  **PRD**            What exactly are we building?   One slider, one
                                                     chart, four domains.
                                                     P0 scope: Uptime
                                                     template at full
                                                     polish. Zero signup
                                                     friction.

  **Design Doc**     How will the user experience    Slider beside chart
                     it?                             (not below). Spring
                                                     animation.
                                                     Screenshot-ready
                                                     chart with internal
                                                     title. Tabs visible
                                                     to enable
                                                     cross-domain
                                                     discovery.

  **Technical Plan** How do we implement it?         Two state values.
                                                     Client-side only.
                                                     200-point memoized
                                                     curve. 10-day build
                                                     in four phases.
                                                     Static Vercel deploy.
  ------------------ ------------------------------- ---------------------

  -----------------------------------------------------------------------
  **What happens next:** Build starts immediately. Day 1 deliverable:
  project scaffolding + all four data models implemented and validated
  against anchor points. By end of Day 4, the tool is functional. By Day
  10, it ships.

  -----------------------------------------------------------------------

*End of Technical Plan • Next step: Build (Day 1)*
