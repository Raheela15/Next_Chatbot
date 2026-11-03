---
name: Synthetix Intelligence
colors:
  surface: '#131316'
  surface-dim: '#131316'
  surface-bright: '#39393c'
  surface-container-lowest: '#0e0e11'
  surface-container-low: '#1b1b1e'
  surface-container: '#1f1f22'
  surface-container-high: '#2a2a2d'
  surface-container-highest: '#353438'
  on-surface: '#e4e1e6'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#e4e1e6'
  inverse-on-surface: '#303033'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#adc6ff'
  on-secondary: '#002e6a'
  secondary-container: '#0566d9'
  on-secondary-container: '#e6ecff'
  tertiary: '#bdc2ff'
  on-tertiary: '#131e8c'
  tertiary-container: '#7c87f3'
  on-tertiary-container: '#081486'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#e0e0ff'
  tertiary-fixed-dim: '#bdc2ff'
  on-tertiary-fixed: '#000767'
  on-tertiary-fixed-variant: '#2f3aa3'
  background: '#131316'
  on-background: '#e4e1e6'
  surface-variant: '#353438'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Geist
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 30px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.005em
  code-inline:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  code-block:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system embodies the razor-sharp clarity, cognitive calm, and hyper-responsive tactile feedback of frontier conversational AI interfaces. Rooted in purposeful minimalism with subtle computational radiance, it bridges the analytical precision of developer tools with the fluid warmth of consumer computing.

### Target Persona & Mindset
Engineers, researchers, product designers, and knowledge workers who treat LLMs as cognitive extensions. The interface minimizes visual latency and cognitive overhead, prioritizing the synthesis of thought over ornamental chrome.

### Visual Dialect: Precision Luminance
- **Surfaces**: Layered zinc/obsidian sheets with near-zero opacity shifts rather than jarring fills.
- **Accents**: Electric indigo and cold azure beams that appear only when interacting, generating tokens, or indicating AI presence.
- **Ergonomics**: Thread-first typography, fluid viewport framing, zero-flicker message rendering, and frictionless text reproduction across code, equations, and prose.

## Colors

The chromatic structure balances deep light-absorbent foundations with photon-charged conversational cues. The system defaults to dark mode to facilitate extended technical sessions while translating seamlessly to crisp daylight surfaces.

### Dark Mode Architecture (Default)
- **Base Canvas (`surface-0`)**: `#09090b` — Deep true-void obsidian.
- **Elevated Canvas (`surface-1`)**: `#121215` — Contextual sidebar and docked panels.
- **Card / Bubble Canvas (`surface-2`)**: `#18181b` — Assistant message wrappers and container cards.
- **Interactive Surface (`surface-3`)**: `#27272a` — Hover states, code headers, and inputs.
- **Structural Lines / Outlines**: `#27272a` (default), `#3f3f46` (hovered/active).
- **Text & Glyph Hierarchy**:
  - Primary: `#f4f4f5` (96% contrast ratio).
  - Secondary / Metadata: `#a1a1aa`.
  - Muted / Placeholders: `#71717a`.

### Light Mode Architecture
- **Base Canvas (`surface-0`)**: `#ffffff`.
- **Elevated Canvas (`surface-1`)**: `#f8fafc`.
- **Card / Bubble Canvas (`surface-2`)**: `#f1f5f9`.
- **Text Primary**: `#09090b`.
- **Text Secondary**: `#64748b`.
- **Borders**: `#e2e8f0`.

### Spectral & State Accents
- **Primary Indigo (`#6366f1`)**: Primary CTAs, active thread highlights, and user prompt containers.
- **Gemini Azure (`#3b82f6`)**: Generation states, model thinking badges, and citation reference links.
- **Luminous Violet (`#818cf8`)**: Tool execution feedback, sparkling status indicators, and focus rings.
- **Success (`#10b981`)**: Complete tool run, copied clipboard status.
- **Warning / Stream Alert (`#f59e0b`)**: Context-window warnings, rate-limit cues.
- **Destructive (`#ef4444`)**: Deletion, stop-generation triggers, API errors.

## Typography

The typography pairings decouple display-grade modernism from deep long-form readability.

- **Display & Headings (Geist)**: Delivers a clean, geometric silhouette engineered for modern computing software. Tight kerning profiles ensure titles feel compact and architectural.
- **Prose & Conversational Stream (Inter)**: Handles streaming AI content with exceptional legibility across complex lists, long markdown answers, and technical formatting.
- **Code, Data & Labels (JetBrains Mono)**: Applied to all terminal windows, inline symbols, execution badges, model specs, token counts, and telemetry.

### Rendering Directives
- Message text uses `body-lg` on desktop for fluid conversational scanning, shifting to `body-md` on compact screens.
- All code blocks require font ligature activation (`font-variant-ligatures: contextual;`).

## Layout & Spacing

The architecture operates on an adaptive single-column chat focus flanked by a collapsible operational pane.

### Responsive Breakpoints & Composition
- **Mobile (< 768px)**: 
  - Chat feed takes 100% width with `margin: 1rem`.
  - Sidebar folds into an off-canvas drawer with backdrop blur.
  - Composer input docks cleanly above the mobile keyboard with strict `safe-area-inset-bottom` padding.
- **Tablet (768px – 1024px)**: 
  - Sidebar toggles via edge action; thread container rests centered at `max-width: 680px`.
- **Desktop (> 1024px)**: 
  - Dual-panel structural split: Static 260px navigation pane and fluid canvas.
  - The conversational spine is locked to a readable `max-width: 768px` or `48rem` centered lane to prevent wide reading eye-strain.
  - Wide screen (> 1440px): Right utility tray (for artifact view or canvas code runner) slides in as a 50/50 partition.

### Spacing Rhythm
Spacing is anchored to a strict 4px/8px incremental base. Micro paddings (`space-xs`, `space-sm`) manage tag and button interiors, while macro paddings (`space-lg`, `space-xl`) separate conversation turns.

## Elevation & Depth

Visual hierarchy rejects heavy physical drop-shadows, instead leveraging surface luminosity tiers, delicate 1px borders, and frosted translucent overlays.

### Surface Tiers & Border Shimmer
- **Level 0 (App Shell)**: Flat surface, `#09090b`.
- **Level 1 (Sub-Panels & Sidebar)**: `#121215` with a 1px border `rgba(255, 255, 255, 0.06)`.
- **Level 2 (Input Box & Popovers)**: `#18181b` with dual edge definition: an inner ambient outline `rgba(255, 255, 255, 0.08)` and a faint down-cast drop shadow: `0 8px 32px -4px rgba(0, 0, 0, 0.5)`.
- **Focused Composer Elevation**: When typing, the prompt bar gains a subtle radial luminescence: `box-shadow: 0 0 0 1px #6366f1, 0 0 20px -3px rgba(99, 102, 241, 0.2)`.

### Glassmorphism & Translucency
- Sticky headers, scroll-top toolbars, and message floating actions use `backdrop-filter: blur(12px)` over a 75% alpha background (`rgba(9, 9, 11, 0.75)`).
- Model output skeleton loaders use smooth linear-gradient shimmer passes over `#27272a`.

## Shapes

The geometric signature combines organic friendly containers with high-efficiency technical elements. 

- **Level 2 (Rounded - 0.5rem / 8px)**: Applied to structural inputs, dropdown menus, context code blocks, and model response containers.
- **Large Components (1rem / 16px)**: Applied to primary conversational prompt input panels and major floating cards.
- **Pill Geometry (9999px / full-rounded)**: Reserved strictly for micro badges, model selector pills, follow-up suggestion chips, and circle action icon buttons.

## Components

### Chat Message Turns
- **User Message**: Right-aligned or soft-box offset on the right. Dark tinted surface (`#27272a` in dark mode, `#f4f4f5` in light mode) or sleek indigo-rimmed enclosure.
- **Assistant Message**: Borderless left-aligned layout directly against canvas with avatar/sparkle indicator, ensuring uninterrupted reading flow.
- **Streaming State**: Typographic cursor block (`2px` wide, indigo glowing bar) pulsing at 800ms intervals at the text frontier.

### The Omnibar (Input Composer)
- High-priority floating container pinned to the bottom of the viewport with a subtle multi-layered border.
- Includes expandable multi-line textarea, quick attachments (+) icon button, web search toggles, and circular send/stop button.
- Transitions seamlessly to a loading spinner or stop square (`#ef4444`) when generation is active.

### Syntax-Highlighted Code Blocks
- Darkened sub-container with independent top metadata bar displaying language label in `label-sm` font, copy button with icon/text transition, and split-view run action.
- Code area contains line numbering in muted `#52525b`, with an overflow horizontal scroll track hidden until hovered.

### Action Chips & Suggestion Pills
- Fully rounded pills (`border-radius: 9999px`) with 1px border (`#27272a`) and transparent fill.
- Hover interaction introduces gentle background fill `#18181b` and accent text tint (`#818cf8`).

### Buttons & Icon Triggers
- **Primary**: Solid indigo fill (`#6366f1`), crisp white text, hover lift via brightness filter.
- **Ghost/Icon Button**: Borderless, `#71717a` stroke icon, turning to `#f4f4f5` with a subtle circular hover disc (`#27272a`).

### Artifact / Canvas Panel
- Slides smoothly from the right side of the screen on desktop. Houses live previews, editable documents, or rendered charts. Features a split-tab bar (`Code` | `Preview`) and close toggle.