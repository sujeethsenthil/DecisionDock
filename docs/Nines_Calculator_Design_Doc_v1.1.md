**DESIGN DOCUMENT**

**The Nines Calculator**

*Interaction model, visual system, and layout architecture*

  --------------------- -------------------------------------------------
  **Product**           The Nines Calculator (DecisionDock)

  **Author**            Product Manager

  **Date**              February 28, 2026

  **Status**            Draft v1.1 (revised from review)

  **Depends On**        Problem Brief v1.0, PRD v1.1
  --------------------- -------------------------------------------------

  -----------------------------------------------------------------------
  **v1.1 changelog:** (1) Added wireframe diagram in Section 4. (2) Fixed
  tab switching contradiction: counter animates to cost at new default,
  not \"equivalent position.\" (3) Added above-the-fold responsive
  adaptation for viewports \<800px tall.

  -----------------------------------------------------------------------

**1. Design Philosophy**

This document translates the PRD's requirements into concrete visual and
interaction decisions. Every choice traces back to the five design
principles established in the PRD: interaction over explanation, the
output is the product, polish over breadth, credibility through data,
and zero friction.

The overarching design philosophy can be stated simply: **the interface
should feel like a tool made by a company that charges for software,
even though this one is free.** That means no rounded-corner toy
aesthetic, no gratuitous gradients, no \"made with AI\" energy. The
visual language should read as *Linear meets Stripe*---clean, confident,
data-dense where it matters, and generous with whitespace everywhere
else.

  -----------------------------------------------------------------------
  **Design test:** If a hiring manager screenshots this tool and puts it
  next to the Stripe pricing page and the Linear dashboard, does it
  belong in that company? That's the bar.

  -----------------------------------------------------------------------

**2. Information Architecture**

**2.1 Page structure**

The entire tool lives on a single page. There is no routing, no
navigation, no second page. The user lands and the tool is immediately
interactive. The page has five vertical zones, from top to bottom:

-   **Zone 1 --- Hero headline (48px).** One line: \"What does the next
    nine actually cost?\" This is the only text above the fold besides
    the tab labels. It earns attention without requiring reading.

-   **Zone 2 --- Domain tabs.** Horizontal tab bar: Uptime \| Marketing
    \| Coverage \| CSAT. The Uptime tab is active by default. Tabs
    switch the chart's data, labels, and annotations without a page
    transition.

-   **Zone 3 --- The calculator (primary content).** This is the core:
    slider + chart + animated counters. Occupies 60--70% of the
    viewport. Detailed layout in Section 4.

-   **Zone 4 --- Insight annotations.** Below the chart: 2--3 key
    insight cards that contextualize the current slider position (e.g.,
    \"At 99.99%, you need a team of 4--8 SREs\"). These update as the
    slider moves.

-   **Zone 5 --- Methodology footer.** Source attribution, expandable
    methodology note, DecisionDock branding, and portfolio link.
    Minimal. Builds credibility without competing for attention.

**2.2 Content hierarchy**

The visual weight hierarchy must enforce a strict reading order. The
user's eye should follow this path:

*Chart (largest, most colorful) → Animated cost counter (large number,
high contrast) → Slider (interactive affordance) → Tabs (navigation) →
Insight cards (supporting context) → Methodology (fine print).*

If the user never reads a word of body text and only interacts with the
slider while watching the chart and counter, they should still get the
full insight. Every piece of text on the page is optional context, not
required comprehension.

**3. The Interaction Model**

**3.1 The core loop**

The entire product is one interaction loop: **drag → see → understand**.
This loop must complete in under 3 seconds for a first-time user.

  --------------------- -------------------------------------------------
  **Property**          **Specification**

  **User action**       Drag the slider from left (low target) to right
                        (high target). Or: click anywhere on the slider
                        track to jump. Or: use arrow keys for precise
                        stepping.

  **Immediate response  Slider thumb moves to new position. Chart
  (0--16ms)**           reference line moves in sync. No perceptible
                        delay.

  **Animation response  Area chart redraws with new gradient fill. Cost
  (16--300ms)**         counter spring-animates to new value. Secondary
                        metrics update.

  **Threshold response  If the slider crosses a key threshold (e.g., from
  (300--500ms)**        3 to 4 nines), an annotation callout animates in
                        via Framer Motion AnimatePresence. Example: \"⚡
                        Beyond this point, each nine costs 10× more.\"

  **Settling (500ms+)** All animations settle. The view is now stable and
                        screenshot-ready. This is the moment the user
                        reaches for Cmd+Shift+4.
  --------------------- -------------------------------------------------

**3.2 The slider in detail**

The slider is the single most important UI element. It must feel
*physically satisfying* to drag---responsive, smooth, with just enough
resistance to feel intentional.

  --------------------- -------------------------------------------------
  **Property**          **Specification**

  **Component**         shadcn/ui Slider (Radix-based). Customized track
                        and thumb styling.

  **Track height**      6px (default shadcn is 4px; slightly thicker
                        improves drag target and visual weight).

  **Thumb size**        20px diameter circle. White fill, 2px border in
                        the current zone color (blue/amber/red). Subtle
                        shadow-sm.

  **Track gradient**    The track fill changes color as the thumb moves:
                        blue (#3b82f6) in the value zone → amber
                        (#f59e0b) in the diminishing zone → red (#ef4444)
                        in the overspend zone.

  **Zone thresholds     Blue: 99%--99.9%. Amber: 99.9%--99.99%. Red:
  (Uptime)**            99.99%+.

  **Step size**         0.1 nines (Uptime). Smooth enough for fluid
                        dragging, discrete enough for keyboard stepping.

  **Labels**            Min and max labels at track ends. Current value
                        displayed above or beside the thumb in bold.

  **Keyboard**          Left/Right arrows step by 0.1. Home/End jump to
                        min/max. Fully WCAG 2.1 AA compliant.

  **Touch**             Enlarged hit target on mobile (44px minimum per
                        WCAG). Smooth touch-drag with no jank.
  --------------------- -------------------------------------------------

**3.3 Tab switching**

When a user clicks a different domain tab, the transition must feel
seamless, not like navigating to a new page. The chart morphs rather
than replaces:

-   The area chart's Y-axis labels crossfade to new values (200ms).

-   The X-axis labels crossfade to the new domain scale (200ms).

-   The area path animates to the new curve shape via Recharts' built-in
    transition (300ms ease-out).

-   **The slider resets to the new domain's default value** (e.g., 99.9%
    for Uptime, \$25K for Marketing). Both state values (activeDomain
    and sliderValue) update atomically in a single event handler to
    prevent intermediate render states.

-   The cost counter spring-animates to the cost at the new domain's
    default value (not an \"equivalent\" position --- domains have
    different scales, so equivalence is meaningless).

-   Insight cards below the chart crossfade to new domain-specific
    content (200ms).

The goal is that the user perceives one chart *shape-shifting* between
domains, reinforcing the universality insight: \"It's the same curve
everywhere.\"

**4. Layout Architecture**

**4.1 Wireframe reference**

The following diagram shows the spatial relationships between all five
zones on desktop. All subsequent layout specifications refer back to
this structure.

  -----------------------------------------------------------------------
  ZONE 1: Hero Headline --- \"What does the next nine actually cost?\"
  (\~80px)

  -----------------------------------------------------------------------

  -----------------------------------------------------------------------
  ZONE 2: Domain Tabs --- \[ Uptime \| Marketing \| Coverage \| CSAT \]
  (\~48px)

  -----------------------------------------------------------------------

+---------------------------------------------+------------------------+
| **ZONE 3a: Cost Curve Chart (65%)**         | **ZONE 3b: Results     |
|                                             | Panel (35%)**          |
| Recharts AreaChart with gradient fill       |                        |
|                                             | **\$500,000**          |
| Internal title + source attribution         |                        |
|                                             | ─── Slider ───         |
| Min height: 350--400px                      |                        |
|                                             | Secondary metrics      |
+---------------------------------------------+------------------------+

  -----------------------------------------------------------------------
  ZONE 4: Insight Cards --- 2--3 threshold-aware annotation cards
  (animate on slider cross)

  -----------------------------------------------------------------------

  -----------------------------------------------------------------------
  ZONE 5: Methodology Footer --- Source attribution + DecisionDock
  branding

  -----------------------------------------------------------------------

**4.2 Desktop layout (≥1024px)**

  --------------------- -------------------------------------------------
  **Property**          **Specification**

  **Left column (65%)** The chart. Full-width Recharts AreaChart with
                        gradient fill, reference lines, and zone shading.
                        Minimum height: 400px. Aspect ratio approximately
                        16:9.

  **Right column        The results panel. Contains: animated cost
  (35%)**               counter (hero number, 40--48px JetBrains Mono),
                        secondary metrics (downtime saved, marginal
                        cost), and the slider. Stacked vertically in a
                        shadcn Card.

  **Column gap**        32px (4 grid units).

  **Max content width** 1200px, centered. Prevents the chart from
                        stretching absurdly wide on ultrawide monitors.

  **Horizontal          64px on each side at ≥1440px. 32px at
  padding**             1024--1439px.
  --------------------- -------------------------------------------------

**Why the slider is in the right column, not below the chart:** When the
slider is beside the chart, the user's eye can track the cause (slider
position) and effect (curve shape + cost number) simultaneously without
vertical scanning. This spatial proximity is critical for the
instant-feedback loop.

**4.3 Tablet layout (768--1023px)**

Single-column layout. Chart on top (full width, 350px min height),
followed by the results panel (slider + counters) directly below. The
insight cards stack into a single column. Tab bar remains horizontal.

**4.4 Mobile layout (375--767px)**

  --------------------- -------------------------------------------------
  **Property**          **Specification**

  **Chart**             Full-width, 280px min height. Y-axis labels
                        abbreviated (\$5K, \$500K, \$5M). Touch-optimized
                        tooltip on tap.

  **Results panel**     Full-width below chart. Cost counter at 32px font
                        (down from 48px). Slider at full width with 44px
                        touch target.

  **Tabs**              Horizontal scrollable tab bar if needed. Active
                        tab indicator visible.

  **Insight cards**     Collapsed by default; expandable accordion on
                        mobile to save vertical space.

  **Horizontal          16px on each side.
  padding**             
  --------------------- -------------------------------------------------

**4.5 Above-the-fold guarantee**

The PRD's zero-friction principle requires the full interaction loop
(slider + chart + counter) to be visible without scrolling. On a 13\"
MacBook (the most common screen at FAANG companies), the usable viewport
is approximately 680px after browser chrome.

Budget: Zone 1 (\~80px) + Zone 2 (\~48px) + Zone 3 padding (\~24px) =
\~152px of overhead. This leaves \~528px for the chart + results panel.
At the desktop chart minimum of 400px, the slider and counter in the
sidebar comfortably fit.

However, on viewports shorter than 800px (e.g., 13\" laptop with
DevTools open, or an iPad in landscape), the chart minimum height must
adapt:

  --------------------- -------------------------------------------------
  **Property**          **Specification**

  **Viewport ≥900px     Chart min-height: 400px. Full layout as
  tall**                specified.

  **Viewport 700--899px Chart min-height: 350px. Insight cards (Zone 4)
  tall**                start partially below fold. This is
                        acceptable---they're supporting context, not core
                        interaction.

  **Viewport \<700px    Chart min-height: 280px. Slider moves above the
  tall**                chart (between tabs and chart) to guarantee the
                        full interaction loop is visible without
                        scrolling. The sidebar layout breaks down at this
                        height and switching to a vertical stack (slider
                        → chart → counter) preserves the interaction.
  --------------------- -------------------------------------------------

  -----------------------------------------------------------------------
  **The rule:** The slider, the chart, and the cost counter must all be
  visible without scrolling on any viewport where the tool is expected to
  be used. If we have to sacrifice something to fit, sacrifice chart
  height first, insight cards second. Never sacrifice the slider or
  counter.

  -----------------------------------------------------------------------

**4.6 The 8px grid**

Every spatial dimension in the interface uses multiples of 8px: 8, 16,
24, 32, 40, 48, 56, 64. Half-steps of 4px are permitted for tight
spaces.

  --------------------- -------------------------------------------------
  **Property**          **Specification**

  **Card padding**      24px (3 units).

  **Section spacing**   48--64px (6--8 units).

  **Element gap (within 16px (2 units).
  card)**               

  **Button height**     40px (5 units). Small variant: 32px (4 units).

  **Input height**      40px.

  **Border radius**     8px universally. Cards, buttons, inputs,
                        tabs---all 8px.
  --------------------- -------------------------------------------------

**5. Typography**

**5.1 Font stack**

  --------------------- -------------------------------------------------
  **Property**          **Specification**

  **Primary UI font**   Inter. Loaded via Google Fonts or self-hosted.
                        Used for all body text, labels, headings, and
                        navigation.

  **Data font**         JetBrains Mono. Used exclusively for: the
                        animated cost counter, chart axis tick labels,
                        and any large numerical display.

  **Critical CSS**      font-variant-numeric: tabular-nums applied to all
                        numerical displays.

  **Fallback stack**    Inter, -apple-system, BlinkMacSystemFont, \"Segoe
                        UI\", sans-serif. JetBrains Mono, \"SF Mono\",
                        \"Fira Code\", monospace.
  --------------------- -------------------------------------------------

**5.2 Type scale**

Based on a 1.25 ratio (Major Third), anchored at 16px body:

  --------------------- -------------------------------------------------
  **Property**          **Specification**

  **12px / 0.75rem**    Fine print: methodology attribution, chart source
                        notes, footer. Color: MED (#555555).

  **14px / 0.875rem**   Labels: axis labels, slider min/max, badge text,
                        secondary metrics. Color: DARK (#333333).

  **16px / 1rem**       Body: insight card text, tab labels,
                        descriptions. Color: DARK. Line-height: 1.6.

  **20px / 1.25rem**    Subheadings: insight card titles, section labels.
                        Semi-bold. Color: NAVY.

  **24px / 1.5rem**     Section headings: domain template name within the
                        calculator. Bold. Color: NAVY.

  **32px / 2rem**       Secondary counter: downtime saved, marginal cost.
                        JetBrains Mono. Bold.

  **48px / 3rem**       Hero counter: the animated cost number. JetBrains
                        Mono. Bold. Color by zone.
  --------------------- -------------------------------------------------

**6. Color System**

**6.1 The diverging palette**

The color system serves one purpose: to encode the cost-benefit position
on the diminishing returns curve.

  ------ --------------- ---------- ---------------------------------------
         **Name**        **Hex**    **Usage**

         **Blue**        #3B82F6    Value zone. Chart area fill in low-cost
                                    region. Slider track. Links.

         **Emerald**     #22C55E    Savings/benefit. Positive deltas.
                                    Savings badges.

         **Amber**       #F59E0B    Diminishing returns zone. Chart
                                    gradient mid-section. Warnings.

         **Red**         #EF4444    Overspend/waste zone. Chart gradient at
                                    high-cost end.

         **Navy**        #1B2A4A    Primary text. Headings. High-contrast
                                    data labels.

         **Dark Gray**   #333333    Body text. Secondary headings.

         **Med Gray**    #555555    Tertiary text. Captions. Methodology
                                    notes.

         **Light Gray**  #F2F4F7    Page background. Alternating table
                                    rows.

         **Border Gray** #D0D5DD    Card borders. Dividers. Chart grid
                                    lines.

         **White**       #FFFFFF    Card backgrounds. Chart background.
  ------ --------------- ---------- ---------------------------------------

**6.2 Chart gradient specification**

  --------------------- -------------------------------------------------
  **Property**          **Specification**

  **Stop 1 (0%)**       Blue #3B82F6 at 30% opacity. Value zone.

  **Stop 2 (50%)**      Amber #F59E0B at 40% opacity. Transition zone.

  **Stop 3 (100%)**     Red #EF4444 at 50% opacity. Overspend zone.

  **Stroke**            2px solid line transitioning through the same
                        three colors.

  **Below-threshold     Area left of slider uses full gradient. Area
  shading**             right is desaturated (gray at 10% opacity).
  --------------------- -------------------------------------------------

**6.3 Accessibility rules**

-   Never use color as the sole information channel. Every zone is
    double-encoded with labels or patterns.

-   All text meets WCAG 2.1 AA contrast ratio: 4.5:1 for body text, 3:1
    for large text.

-   Blue/amber/red palette remains distinguishable for deuteranopia and
    protanopia.

-   Interactive elements have visible focus rings (2px offset, blue
    #3B82F6) for keyboard navigation.

**7. Animation Specifications**

**7.1 The animated cost counter**

  --------------------- -------------------------------------------------
  **Property**          **Specification**

  **Library**           Framer Motion useSpring + useTransform.

  **Spring config**     { mass: 0.8, stiffness: 75, damping: 15 }.
                        \~600--800ms to settle.

  **Format transform**  useTransform(spring, n =\>
                        formatCurrency(Math.round(n))).

  **Color transition**  Counter text color spring-transitions between
                        zone colors.

  **Reduced motion**    Respect prefers-reduced-motion: reduce. Counter
                        jumps instantly if set.
  --------------------- -------------------------------------------------

**7.2 Chart animations**

  --------------------- -------------------------------------------------
  **Property**          **Specification**

  **Area path           Recharts built-in: isAnimationActive={true},
  transition**          animationDuration={300},
                        animationEasing=\"ease-out\".

  **Reference line**    Position bound directly to slider state (no
                        additional animation).

  **Zone shading**      ReferenceArea boundaries update instantly.

  **Tab switch**        animationDuration={400} for slightly slower,
                        deliberate morphing.
  --------------------- -------------------------------------------------

**7.3 Threshold annotations**

  --------------------- -------------------------------------------------
  **Property**          **Specification**

  **Trigger**           Slider crosses a predefined threshold.

  **Enter animation**   AnimatePresence. Slide in from right (x: 20→0)
                        with fade. 300ms. Spring: { stiffness: 300,
                        damping: 30 }.

  **Exit animation**    Fade out in 200ms when slider moves away.

  **Position**          Below chart in insight cards zone. Pushes other
                        content down smoothly.
  --------------------- -------------------------------------------------

**7.4 Micro-interactions**

  --------------------- -------------------------------------------------
  **Property**          **Specification**

  **Slider thumb        Scale to 110%. Shadow elevates. 150ms ease-out.
  hover**               

  **Tab hover**         Background fades to blue at 5% opacity. 150ms.

  **Tab active**        Bottom border indicator slides horizontally.
                        200ms ease-out.

  **Card hover**        translateY(-2px) + shadow elevation. 150ms
                        ease-out.

  **Button click**      scale(0.98). 100ms.

  **Focus rings**       2px blue ring, 2px offset. :focus-visible only.
  --------------------- -------------------------------------------------

**8. Component Inventory**

  ------------------------- -------------------------------------------------
  **Property**              **Specification**

  **Tabs**                  shadcn/ui Tabs, TabsList, TabsTrigger,
                            TabsContent. Blue active indicator.

  **Slider**                shadcn/ui Slider (Radix). Custom track gradient,
                            enlarged thumb, zone color logic.

  **Card**                  shadcn/ui Card. 24px padding, 8px radius,
                            shadow-sm.

  **Badge**                 shadcn/ui Badge. Zone labels and savings
                            percentages.

  **ChartContainer**        shadcn/ui chart wrapper around Recharts.

  **AreaChart**             Recharts AreaChart with Area, XAxis, YAxis,
                            CartesianGrid, ReferenceLine, ReferenceArea,
                            Tooltip.

  **AnimatedCounter**       Custom. Framer Motion useSpring + useTransform +
                            motion.span. JetBrains Mono.

  **ThresholdAnnotation**   Custom. Framer Motion AnimatePresence +
                            motion.div.

  **MethodologyNote**       Custom. Collapsible section. Contains
                            domain-specific methodology text from PRD Section
                            5.3.
  ------------------------- -------------------------------------------------

**9. Screenshot-Readiness**

The chart, when screenshotted and pasted into a slide deck, must be
comprehensible without surrounding context:

-   Chart includes its own title (e.g., \"Annual Cost of Uptime
    Targets\") inside the chart area.

-   Axis labels fully legible at \~2x Retina, pasted at 50--75% size.

-   Source attribution visible within the chart's visual boundary.

-   Current slider position's value displayed as a prominent label on
    the chart.

-   White chart background (not transparent) for clean paste onto any
    slide.

-   No UI chrome within the natural screenshot boundary.

  -----------------------------------------------------------------------
  **The screenshot test:** Print the chart at 50% size on a letter-page
  slide. Can a CFO who has never seen the tool understand what it shows?
  If yes, the design works.

  -----------------------------------------------------------------------

**10. Key Design Decisions and Rationale**

  --------------------- -------------------------------------------------
  **Property**          **Specification**

  **Slider in sidebar,  Spatial proximity eliminates vertical scanning.
  not below chart**     Peripheral vision catches chart morphing while
                        hands are on slider.

  **One slider per      Multiple sliders require explanation. One slider
  template**            forces a single, clear interaction path.
                        Customization is P2.

  **Spring animation,   Springs incorporate drag velocity, making the
  not tween**           counter feel physically real.

  **JetBrains Mono for  Monospace digits prevent counter shifting during
  numbers**             animation. Signals \"this is data.\"

  **Gray-50 page        Gives cards subtle lift without aggressive
  background**          shadows. Used by Linear, Vercel, Notion.

  **Tabs, not           Tabs are immediately visible. User must see other
  dropdown**            domain names to be tempted to click.

  **No dark mode in     Doubles design surface area. Ship light mode
  v1**                  polished; dark mode is v2.

  **Chart title inside  External titles get cropped during screenshot.
  chart area**          Internal titles travel with the artifact.

  **Atomic tab switch   Both activeDomain and sliderValue update in a
  state update**        single handler to prevent intermediate render
                        with stale slider value on new domain config.
  --------------------- -------------------------------------------------

**11. Next Steps**

-   **Technical Plan** --- Component tree, state management, Recharts
    configuration, build sequence, and deployment pipeline.

After Technical Plan approval, build begins immediately against a 1.5--2
week timeline.

*End of Design Document v1.1 • Next step: Technical Plan*
