**PRODUCT REQUIREMENTS DOCUMENT**

**The Nines Calculator**

*v1.1 --- Scope, user stories, and requirements for initial launch*

  --------------------- -------------------------------------------------
  **Product**           The Nines Calculator (DecisionDock)

  **Author**            Product Manager

  **Date**              February 28, 2026

  **Status**            Draft v1.1 (revised from review)

  **Depends On**        Problem Brief v1.0 (approved)

  **Target Ship**       2 weeks from start of build
  --------------------- -------------------------------------------------

  -----------------------------------------------------------------------
  **v1.1 changelog:** (1) US-12 moved from P1 to P2 to resolve scope
  exclusion contradiction. (2) Cost model recalibrated: BASE_COST set to
  \$5K, all figures now represent total cost of ownership. (3) Success
  metrics rewritten into measurable quantitative and qualitative
  categories. (4) Methodology note text specified for all four domains.

  -----------------------------------------------------------------------

**1. Product Overview**

**1.1 One-line description**

An interactive web tool that makes the exponential cost of incremental
perfection viscerally obvious through a single slider interaction,
designed to produce shareable visual artifacts for executive budget
conversations.

**1.2 Problem recap (from Problem Brief)**

Engineering leaders systematically overspend on reliability because they
cannot make the exponential cost structure visible to the non-technical
stakeholders who approve budgets. The core problem is communicational,
not computational. No free, interactive tool exists that visualizes
diminishing returns with cost implications across multiple domains.

**1.3 Solution summary**

A user drags a single slider (target level) and watches an exponential
cost curve steepen in real-time while an animated dollar counter shows
cost exploding. Four domain templates---Uptime, Marketing Spend, Test
Coverage, and CSAT---share one parameterized visualization component.
The output is a screenshot-ready chart designed to travel into executive
decks, Slack threads, and budget proposals.

**1.4 Design principles**

These principles resolve ambiguity whenever we face tradeoff decisions
during build. When in doubt, refer back here.

-   **Interaction over explanation.** The user should understand the
    insight by dragging the slider, not by reading text. If we need a
    paragraph to explain something, we've failed.

-   **The output is the product.** The screenshot or shared link that
    travels to a CFO's inbox matters more than the on-screen experience.
    Design for how the artifact looks when extracted from context.

-   **Polish over breadth.** One domain template that feels
    production-grade beats four that feel like prototypes. Ship quality,
    not quantity.

-   **Credibility through data.** Every default value must trace back to
    a published source (Google SRE Book, Gartner, WordStream, ACSI). The
    calculator earns trust by showing its work.

-   **Zero friction.** No signup, no configuration, no onboarding. The
    tool works above the fold in under 3 seconds. If a user needs
    instructions, the interaction design has failed.

**2. User Stories**

User stories are prioritized P0 (must ship in v1), P1 (should ship in v1
if time allows), or P2 (future --- explicitly out of scope for v1).

**2.1 Core interaction stories**

  -------- ------------------------------------------------------ --------------
  **ID**   **User Story**                                         **Priority**

  US-1     As a VP of Engineering, I can drag a slider to set a   **P0**
           target availability level (e.g., 99.99%) and instantly 
           see the estimated annual cost update in real-time, so  
           I can grasp the exponential cost relationship without  
           reading anything.                                      

  US-2     As a VP of Engineering, I can see an animated cost     **P0**
           curve that steepens visually as I increase my target,  
           so the diminishing returns pattern is self-evident     
           through the shape of the chart.                        

  US-3     As a VP of Engineering, I can see a large, animated    **P0**
           dollar counter that counts up as I drag the slider, so 
           the cost explosion is visceral and immediate.          

  US-4     As a VP of Engineering, I can see the downtime saved   **P0**
           (in minutes/hours per year) alongside the cost, so I   
           can evaluate whether the marginal improvement          
           justifies the marginal cost.                           

  US-5     As a VP of Engineering, I can see contextual           **P1**
           annotations at key thresholds (e.g., \"Beyond this     
           point, each nine costs 10× more\") that appear as I    
           cross them, so the insight is reinforced at critical   
           moments.                                               
  -------- ------------------------------------------------------ --------------

**2.2 Cross-domain stories**

  -------- ------------------------------------------------------ --------------
  **ID**   **User Story**                                         **Priority**

  US-6     As a VP of Engineering, I can switch between domain    **P0**
           tabs (Uptime, Marketing, Test Coverage, CSAT) and see  
           the same curve shape with domain-appropriate labels    
           and data, so I realize the diminishing returns pattern 
           is universal.                                          

  US-7     As a marketing director, I can see my ad spend         **P1**
           saturation curve with CPA and ROAS metrics, so I can   
           identify where my marginal dollar stops working.       

  US-8     As a QA lead, I can see the effort-vs-coverage curve   **P1**
           with Google's published thresholds (60%/75%/90%)       
           marked, so I can justify my team's coverage target     
           with data.                                             

  US-9     As a PM, I can see the CSAT cost curve showing that    **P1**
           moving from 80% to 90% costs 3--5× per point while     
           90%+ costs 10--25×, so I can scope support investments 
           rationally.                                            
  -------- ------------------------------------------------------ --------------

**2.3 Communication and sharing stories**

  -------- ------------------------------------------------------ --------------
  **ID**   **User Story**                                         **Priority**

  US-10    As a VP of Engineering, I can screenshot the chart and **P0**
           it looks clean, self-contained, and professional with  
           no UI chrome polluting the visual, so it works when    
           pasted into a Google Slides deck.                      

  US-11    As a VP of Engineering, I can see a brief methodology  **P0**
           note (e.g., \"Based on Google SRE Book cost models\")  
           that gives the chart credibility when shared without   
           me present.                                            

  US-12    As a user, I can share a URL that preserves my slider  **P2**
           position, so a colleague sees the exact view I         
           intended.                                              

  US-13    As a user, I can export the chart as a PNG or SVG      **P2**
           image with one click, so I can embed it in documents.  

  US-14    As a user, I can customize the base cost to match my   **P2**
           organization's actual spend, so the chart reflects our 
           reality rather than generic defaults.                  
  -------- ------------------------------------------------------ --------------

**2.4 Portfolio and discovery stories**

  -------- ------------------------------------------------------ --------------
  **ID**   **User Story**                                         **Priority**

  US-15    As a hiring manager viewing the portfolio, I can see   **P0**
           the tool immediately works without loading delays, so  
           it demonstrates the candidate's technical execution    
           quality.                                               

  US-16    As a portfolio visitor, I can see a subtle             **P1**
           DecisionDock branding and link to the broader          
           portfolio, so the tool serves as an entry point to     
           other work.                                            

  US-17    As a search user, I can find this tool when searching  **P2**
           \"cost of nines calculator\" or \"diminishing returns  
           calculator,\" so the SEO positioning captures organic  
           traffic.                                               
  -------- ------------------------------------------------------ --------------

**3. Functional Requirements**

**3.1 The slider**

  ------------------- ------------------------------------------ ---------
  **Requirement**     **Specification**                          **Pri**

  **Input type**      Single continuous slider (shadcn/ui Slider **P0**
                      component, Radix-based). Keyboard          
                      navigable, accessible.                     

  **Uptime range**    99% to 99.9999% (2 to 6 nines). Step: 0.1  **P0**
                      nines. Default: 99.9% (3 nines).           

  **Marketing range** \$5K to \$500K monthly spend. Logarithmic  **P1**
                      scale. Default: \$25K.                     

  **Coverage range**  30% to 100%. Linear scale. Step: 1%.       **P1**
                      Default: 75%.                              

  **CSAT range**      50% to 99%. Linear scale. Step: 1%.        **P1**
                      Default: 76.9% (ACSI national average).    

  **Visual feedback** Slider thumb changes color from blue →     **P1**
                      amber → red as it enters the diminishing   
                      returns zone.                              
  ------------------- ------------------------------------------ ---------

**3.2 The chart**

  ------------------- ------------------------------------------ ---------
  **Requirement**     **Specification**                          **Pri**

  **Chart type**      Recharts AreaChart with gradient fill.     **P0**
                      Gradient transitions from blue/green       
                      (value zone) through amber (caution) to    
                      red (overspend).                           

  **Reference line**  Vertical reference line at current slider  **P0**
                      position with label showing the exact      
                      nines/level.                               

  **Y-axis            Total annual cost in dollars. Formatted    **P0**
  (primary)**         with \$, commas, and K/M abbreviations.    

  **X-axis**          Target level (nines for uptime, dollars    **P0**
                      for marketing, percentage for              
                      coverage/CSAT).                            

  **Secondary         Downtime saved (uptime), marginal CPA      **P1**
  Y-axis**            (marketing), bug detection rate            
                      (coverage), retention impact (CSAT). Faded 
                      line overlaid.                             

  **Cost zone         ReferenceArea components shade the         **P1**
  shading**           background in green (value), amber         
                      (diminishing), and red (waste) zones.      

  **Animation**       Recharts built-in animation on area path.  **P0**
                      Duration: 300ms. Easing: ease-out.         
  ------------------- ------------------------------------------ ---------

**3.3 The animated counter**

  ------------------- ------------------------------------------ ---------
  **Requirement**     **Specification**                          **Pri**

  **Primary counter** Large animated dollar figure showing total **P0**
                      annual cost at current slider position.    
                      Uses Framer Motion useSpring.              

  **Animation feel**  Spring physics: mass 0.8, stiffness 75,    **P0**
                      damping 15. Must feel responsive but not   
                      jittery.                                   

  **Format**          Dollar sign, commas, no decimals. K/M      **P0**
                      suffix for large numbers (e.g., \$2.5M).   

  **Secondary         Smaller animated figure showing the        **P1**
  counter**           marginal metric: downtime saved, marginal  
                      CPA, effort multiplier, or cost per point. 

  **Font**            JetBrains Mono for counter digits.         **P0**
                      font-variant-numeric: tabular-nums for     
                      stable digit alignment.                    
  ------------------- ------------------------------------------ ---------

**3.4 Domain templates**

  ------------------- ------------------------------------------ ---------
  **Requirement**     **Specification**                          **Pri**

  **Tab navigation**  shadcn/ui Tabs component across top of     **P0**
                      calculator. Uptime \| Marketing \|         
                      Coverage \| CSAT.                          

  **Uptime template** Cost model: BaseCost × 10\^(n-2) where n = **P0**
                      nines. BaseCost calibrated to \$5K/yr at 2 
                      nines. Represents total cost of ownership  
                      (infrastructure + staffing + operational   
                      overhead). Anchored to Google SRE Book,    
                      AWS pricing, SRE salary data (\$236K avg   
                      total comp).                               

  **Marketing         Hill function: response = x\^α / (K\^α +   **P1**
  template**          x\^α). α = 1.5, K = \$50K. CPA starting at 
                      \$25 (e-commerce). Anchored to WordStream  
                      benchmarks and Saxifrage case study.       

  **Coverage          Logarithmic effort model. Anchored to      **P1**
  template**          Google's thresholds: 60% acceptable, 75%   
                      commendable, 90% exemplary. Effort         
                      multipliers: 1× baseline (0--60%), scaling 
                      to 10--50× (95--100%).                     

  **CSAT template**   Exponential staffing model. Anchored to    **P1**
                      ACSI national avg (76.9), Bain             
                      retention-profit research. Cost per point: 
                      1× at 60%, 3--5× at 80--85%, 10--25× at    
                      90--95%, 25--100× above 95%.               

  **Shared            All four templates use the same            **P0**
  component**         parameterized CostCurveChart component.    
                      Only axis labels, scale factors, color     
                      thresholds, and annotations change per     
                      template.                                  
  ------------------- ------------------------------------------ ---------

**3.5 Methodology and credibility**

  ------------------- ------------------------------------------ ---------
  **Requirement**     **Specification**                          **Pri**

  **Source            Small text below chart stating the         **P0**
  attribution**       specific methodology. Exact text specified 
                      in Section 5.3.                            

  **Tooltip detail**  Hovering on chart data points shows exact  **P1**
                      values: cost, formatted value, and         
                      marginal cost delta.                       

  **Methodology       \"How we calculated this\" expandable      **P2**
  link**              section containing the formula and source  
                      list for each template.                    
  ------------------- ------------------------------------------ ---------

**4. Non-Functional Requirements**

  ------------------- ------------------------------------------ ---------
  **Requirement**     **Specification**                          **Pri**

  **Initial load**    First meaningful paint (interactive chart  **P0**
                      visible) in under 2 seconds on 4G          
                      connection.                                

  **Slider            Chart and counter must update within 16ms  **P0**
  responsiveness**    of slider input (60fps). No perceptible    
                      lag between drag and visual response.      

  **Mobile            Full functionality on screens ≥375px wide. **P0**
  responsive**        Chart remains readable. Slider remains     
                      draggable with touch. Single-column layout 
                      on mobile.                                 

  **Accessibility**   WCAG 2.1 AA. Keyboard-navigable slider     **P0**
                      (arrow keys). Screen reader announces cost 
                      values. Color is never the sole            
                      information channel.                       

  **Browser support** Chrome, Firefox, Safari, Edge (latest 2    **P0**
                      versions). No IE support.                  

  **Screenshot        Chart renders at sufficient resolution for **P0**
  quality**           copy-paste into presentation tools. Clean  
                      visual with no clipped elements at any     
                      slider position.                           

  **SEO**             Semantic HTML, meta tags, Open Graph tags  **P2**
                      for social sharing previews. Target        
                      keywords: \"cost of nines calculator,\"    
                      \"diminishing returns calculator.\"        
  ------------------- ------------------------------------------ ---------

**5. Data Model**

**5.1 Approach: synthetic models calibrated to published benchmarks**

The calculator uses mathematical models with parameters tuned to match
published industry data. No real user data, no external API calls, no
backend required. All computation runs client-side in the browser. This
is intentional: it eliminates signup friction, ensures instant load
times, and makes the tool work like a mortgage calculator---trusted
because the math is sound and the defaults match reality.

**5.2 Model specifications by domain**

  -----------------------------------------------------------------------
  **Total cost of ownership:** All cost figures across all domains
  represent total cost of ownership, not any single line item. For
  uptime, this includes infrastructure, staffing, operational overhead,
  and opportunity cost. For marketing, this is total ad spend. For
  coverage, this is engineering time. For CSAT, this is total support
  operation cost. The methodology note on each chart makes this explicit.

  -----------------------------------------------------------------------

**Uptime**

**Formula:** Cost(n) = BaseCost × 10\^(n−2), where n = number of nines.

**Base cost:** \$5,000/year at 2 nines (99%). This covers a single-AZ
instance with basic monitoring and no dedicated reliability staff.

**Anchor points (total cost of ownership):** 99% = \~\$5K (single AZ,
basic monitoring, zero SRE headcount); 99.9% = \~\$50K (multi-AZ, load
balancing, 1--2 DevOps at partial allocation); 99.99% = \~\$500K
(observability stack, SRE team of 4--8, canary deployments); 99.999% =
\~\$5M (multi-region active-active, 12--20 SREs, formal incident
management); 99.9999% = \~\$50M (fault-tolerant hardware, 20--50+ SREs +
NOC, \>90% dev time on testing).

**Sources:** Google SRE Book (\"Embracing Risk\" chapter), Expedia
engineering blog (10× per nine validation), AWS Multi-AZ pricing,
Glassdoor/Levels.fyi SRE compensation data (\$236K avg total comp).

**Marketing**

**Formula:** Conversions = a × Spend\^β where β = 0.5--0.7.
Alternatively: Hill function response = x\^α / (K\^α + x\^α) with α =
1.5, K = \$50K.

**Anchor points:** \$10K/mo = \$25 avg CPA; \$50K/mo = \$37 avg CPA
(\$55 marginal); \$100K/mo = \$48 avg CPA (\$85 marginal); \$500K/mo =
\$85 avg CPA (\$250+ marginal).

**Sources:** WordStream CPA benchmarks (\$48.96 Google Ads average,
\$18.68 Meta average), Saxifrage Blog Facebook Ads case study, Meta
Robyn parameter recommendations (α bounds 0.5--3.0).

**Test coverage**

**Formula:** Effort(c) = baseline × e\^(k×c) where c = coverage
percentage and k calibrated so effort rises 10--50× from 90% to 100%.

**Anchor points:** 0--60% = 1× effort/point (happy paths); 60--75% =
1.5--2× (edge cases); 75--85% = 2--3× (integrations); 85--90% = 3--5×
(mocking); 90--95% = 5--10× (generated code); 95--100% = 10--50× (dead
code, exception handlers).

**Sources:** Google Testing Blog (60/75/90 thresholds), Google FSE 2019
paper (78% median internal coverage), Kochhar et al. 2015, Bach et al.
2017 (SAP HANA).

**CSAT**

**Formula:** CostPerPoint(s) = BaseCost × e\^(k×(s−60)) where s = CSAT
percentage, calibrated so cost per point rises from 1× at 60% to
25--100× above 95%.

**Anchor points:** 60% = 1× (basic fixes); 76.9% = national ACSI
average; 80--85% = 3--5× (personalization, omnichannel); 90--95% =
10--25× (dedicated account mgmt); 95%+ = 25--100× (custom solutions per
customer).

**Sources:** ACSI Q4 2025 (76.9 national average), Bain & Company (5%
retention → 25--95% profit increase), KPMG (delighting customers
diminishing returns), industry support cost benchmarks
(\$18--\$35/ticket SaaS).

**5.3 Methodology note text (exact copy for each domain)**

The following text is rendered inside the chart area (bottom-right,
12px, medium gray) and in the expandable methodology section. This is P0
content required by US-11.

**Uptime:** \"Total cost of ownership (infrastructure + staffing +
operational overhead) modeled as an exponential curve: each additional
nine of availability multiplies cost by \~10×. Calibrated to Google SRE
Book, AWS Multi-AZ pricing, and industry SRE compensation benchmarks.\"

**Marketing:** \"Ad spend saturation modeled using a Hill function
(α=1.5, K=\$50K), the standard model used by Meta's Robyn and Google's
Meridian MMM platforms. CPA benchmarks from WordStream (2024) and
Saxifrage Blog empirical data.\"

**Coverage:** \"Engineering effort per coverage point modeled as an
exponential curve, calibrated to Google's published thresholds (60%
acceptable, 75% commendable, 90% exemplary) and empirical data from
Kochhar et al. (2015) and Bach et al. (2017).\"

**CSAT:** \"Support cost per satisfaction point modeled as an
exponential curve. Benchmarked to ACSI national average (76.9), Bain &
Company retention-profit research, and industry support cost data
(\$18--\$35/ticket).\"

**6. Scope Boundaries**

**6.1 What v1 includes (P0 scope)**

-   Interactive slider-to-chart interaction with animated cost counter.

-   Uptime domain template as the lead (fully polished).

-   Tab structure for all four domains (Marketing, Coverage, CSAT can
    show the chart with calibrated data but need not have full
    annotation polish).

-   Source attribution text inside chart area for credibility.

-   Mobile-responsive layout.

-   Production-grade visual design: 8px grid, Inter + JetBrains Mono,
    diverging color palette, spring animations.

**6.2 What v1 explicitly excludes**

-   User accounts, login, or saved state.

-   Custom data input (users cannot upload their own cost data in v1).

-   Backend or API (all computation is client-side).

-   Export to PNG/SVG (users screenshot instead).

-   Shareable URLs with preserved slider state (US-12, P2).

-   Embeddable widget or iframe mode.

-   Comparison mode (side-by-side views of two targets).

**6.3 Sequencing rationale**

The v1 scope is deliberately narrow. The Uptime template is the sharpest
domain (deterministic math, most dramatic numbers, cleanest competitive
positioning) and serves the primary persona (VP of Engineering in a
budget conversation). The other three tabs reinforce the cross-domain
aha moment but don't need the same depth of annotation in v1. We ship a
polished Uptime experience first, then deepen the other templates based
on usage signals.

  -----------------------------------------------------------------------
  **Scoping principle:** If we can only ship one thing, it's the Uptime
  slider-to-chart interaction with the animated cost counter. Everything
  else is enhancement. The core interaction is the product.

  -----------------------------------------------------------------------

**7. Risks and Mitigations**

  ------------------- ------------------------------------------ ---------
  **Requirement**     **Specification**                          **Pri**

  **Credibility of    Users may distrust the cost figures        **---**
  synthetic data**    because they're not from their own         
                      systems. Mitigate: source attribution on   
                      every chart, published anchor points,      
                      explicit TCO framing, and expandable       
                      methodology note. Frame as \"industry      
                      benchmark\" not \"your exact cost.\"       

  **Slider-to-chart   Complex chart animations may lag on        **---**
  performance**       low-power devices. Mitigate: use Recharts  
                      built-in animation (not custom), debounce  
                      slider at 16ms, test on mid-tier Android   
                      devices.                                   

  **Scope creep into  Pressure to add user-editable parameters   **---**
  customization**     (base cost, team size, etc.) will delay    
                      ship. Mitigate: hard boundary in this PRD. 
                      v1 uses smart defaults only. Customization 
                      is P2.                                     

  **Cross-domain      Users may expect the four tabs to be       **---**
  confusion**         connected (e.g., total org cost).          
                      Mitigate: each tab is clearly independent. 
                      Header text on each tab states \"Explore   
                      \[domain\] diminishing returns.\"          

  **Portfolio vs.     Temptation to over-engineer for production **---**
  real product        at the expense of shipping within 2-week   
  tension**           timeline. Mitigate: the design principles  
                      prioritize polish over breadth. Ship the   
                      Uptime tab at full quality first.          
  ------------------- ------------------------------------------ ---------

**8. Success Metrics**

**8.1 Quantitative (testable pre-launch)**

-   Lighthouse performance score: \>90 on mobile and desktop.

-   First meaningful paint: \<2 seconds on simulated 4G (Chrome DevTools
    throttling).

-   Slider interaction: sustained 60fps during continuous drag (Chrome
    DevTools Performance panel).

-   Bundle size: total JavaScript payload \<250kB gzipped.

-   Accessibility: zero critical or serious violations in axe DevTools
    scan. All interactive elements keyboard-navigable.

**8.2 Qualitative (validated via guerrilla usability testing)**

Before launch, show the tool to 3--5 people without context or
explanation. Record the following:

-   **Time to first interaction:** Does the user drag the slider within
    10 seconds of landing? If 4/5 do, the zero-friction principle is
    validated.

-   **Comprehension without walkthrough:** Can the user articulate what
    the chart shows without being told? Target: 4/5 correctly describe
    \"cost goes up exponentially as you increase the target.\"

-   **Cross-domain discovery:** Does the user click a second tab
    unprompted? Target: 3/5 do.

-   **Screenshot clarity:** Show a screenshot of the chart (not the
    tool) to a different person. Can they explain it? Target: 3/5 can.

**8.3 Portfolio-facing success**

-   Hiring manager impression: within 30 seconds of opening the tool, a
    reviewer can articulate what product sense the candidate
    demonstrated.

-   Technical execution signal: the animation, responsiveness, and
    visual polish meet the standard of a production SaaS tool, not a
    side project.

-   Conversation starter: the tool generates questions in PM interviews
    about tradeoff thinking, data modeling, and cross-functional
    communication design.

**9. Next Steps**

With the PRD approved, the following documents complete the product
development sequence:

1.  **Design Doc** --- Information architecture, interaction model,
    layout wireframe, color system, typography scale, and the specific
    design decisions that shape how the product feels.

2.  **Technical Plan** --- Component architecture (React component
    tree), data model implementation, Recharts configuration, Framer
    Motion animation specs, and the build sequence.

3.  **Build** --- Execute against the technical plan. Estimated 1.5--2
    weeks.

4.  **Launch** --- Deploy on Vercel, submit to Product Hunt, share in
    SRE and FinOps communities, integrate into DecisionDock portfolio.

*End of PRD v1.1 • Next step: Design Doc*
