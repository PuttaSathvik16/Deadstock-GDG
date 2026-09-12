# DEADSTOCK LIVE LAB — RESPONSIVE DESIGN / DEVICE ADAPTATION / FRONTEND SKILLS

## 0. Purpose

This file is the responsive implementation contract for **Deadstock Live Lab**.

It extends the existing **UI / Motion / Awwwards-Level Frontend Skills** specification and defines how the same art-directed product experience must adapt from the smallest practical phone to large desktop and ultra-wide displays without becoming a compressed desktop website.

The visual identity remains:

> **DESIGN WITH WHAT EXISTS.**

The responsive goal is NOT to make every desktop element smaller.

The goal is to preserve the product's visual hierarchy, material-first storytelling, premium motion, and functional clarity while **changing composition, interaction model, density, and navigation according to available space**.

The product should feel intentionally designed at every size:

- small phone → focused, tactile, one-handed, cinematic;
- large phone → editorial with enough breathing room;
- tablet → hybrid creative workspace;
- laptop → full studio workflow;
- desktop → maximum visual richness + multi-panel productivity;
- ultra-wide → expansive composition without stretching content into empty space.

Never create a "desktop site squeezed into a phone".

---

# 1. RESPONSIVE DESIGN NORTH STAR

## 1.1 Primary rule

**Content hierarchy stays stable. Layout hierarchy changes.**

The following must remain recognizably consistent across devices:

- brand identity;
- headline language;
- material IDs;
- material provenance;
- AI states;
- constraint status;
- design traceability;
- collaboration state;
- primary CTA;
- system feedback.

What is allowed to change:

- number of columns;
- panel placement;
- navigation style;
- amount of simultaneous information;
- animation complexity;
- hover interactions;
- video layout;
- control density;
- image crop;
- scrolling direction;
- fixed vs flowing UI.

---

# 2. DEVICE TIERS

Use **content-driven breakpoints**, not device-brand breakpoints.

Recommended implementation tiers:

```text
XS  = 320–374px      small phones
SM  = 375–479px      normal phones
MD  = 480–767px      large phones / compact tablets
LG  = 768–1023px     tablets / small landscape
XL  = 1024–1279px    laptops
2XL = 1280–1535px    large desktops
3XL = 1536–1919px    premium desktop
4XL = 1920px+        ultra-wide
```

Do not create separate designs for every breakpoint.

Use a fluid system between these thresholds.

### Core CSS strategy

Prefer:

- `clamp()` for type and spacing;
- CSS Grid for editorial composition;
- Flexbox for local alignment;
- `min()`, `max()`, and `minmax()` for adaptive sizing;
- container queries for reusable studio components where practical;
- `aspect-ratio` for media stability;
- CSS variables for design tokens.

Avoid excessive media-query overrides.

---

# 3. RESPONSIVE DESIGN PRINCIPLES

## 3.1 Mobile is not an afterthought

Design the mobile interaction model first for critical flows:

1. Enter lab
2. Scan material
3. Review material
4. Set constraints
5. Generate concept
6. Inspect material trace
7. Join live studio
8. Review final collection

Then expand those structures for larger screens.

## 3.2 Preserve the hero idea, not the desktop geometry

Desktop hero may be:

```text
headline + image + floating material metadata + grid + CTA
```

Mobile hero should become:

```text
headline
↓
material visual
↓
one-sentence explanation
↓
primary CTA
↓
secondary action
```

Do not attempt to preserve all desktop overlays.

## 3.3 Information density must be progressive

```text
Phone      = essential
Tablet     = essential + contextual
Laptop     = workflow
Desktop    = workflow + simultaneous overview
Ultra-wide = workflow + visual atmosphere
```

---

# 4. GLOBAL RESPONSIVE TOKENS

## 4.1 Page gutters

```css
--page-gutter-xs: 16px;
--page-gutter-sm: 18px;
--page-gutter-md: 22px;
--page-gutter-lg: 28px;
--page-gutter-xl: 36px;
--page-gutter-2xl: 48px;
--page-gutter-3xl: 56px;
```

Recommended fluid implementation:

```css
padding-inline: clamp(16px, 3vw, 56px);
```

Do not allow content to touch viewport edges unless the section is intentionally edge-to-edge.

## 4.2 Content max widths

Editorial shell:

```text
max-width: 1600px
```

Reading content:

```text
max-width: 760–900px
```

Studio workspace:

```text
max-width: 1800px
```

On 4K/ultra-wide screens, center the active system rather than stretching every card to the screen edges.

---

# 5. TYPOGRAPHY RESPONSIVENESS

Typography must remain dramatic without causing overflow.

## Hero title

Recommended:

```css
font-size: clamp(3.25rem, 10vw, 10.5rem);
line-height: .84;
letter-spacing: -0.055em;
```

### Device intent

XS:
- 52–62px equivalent;
- 3–5 lines allowed;
- never force a single-line desktop headline.

SM:
- 60–76px equivalent;
- 2–4 lines.

MD:
- 76–96px;
- 2–3 lines.

LG:
- 88–112px;
- editorial two-column options.

XL and above:
- 110–170px depending on composition.

4XL:
- cap headline size;
- increase surrounding whitespace rather than endlessly scaling type.

## Studio headings

```css
font-size: clamp(1.6rem, 3vw, 3.8rem);
line-height: .92;
```

## Body

```css
font-size: clamp(.95rem, .2vw + .9rem, 1.15rem);
line-height: 1.5;
```

## Technical labels

Keep mono labels readable on small screens:

```text
10–12px
letter-spacing: .08–.14em
```

Never go below approximately 10px for meaningful interface content.

---

# 6. NAVIGATION — RESPONSIVE BEHAVIOR

## Desktop / large laptop

Use a refined floating or semi-fixed navigation:

```text
DEADSTOCK        LAB     MATERIALS     COLLECTION     LIVE STUDIO       [ START ]
```

Can become a pill/chrome bar after the hero.

## Tablet

Collapse less important navigation items into a menu.

Keep:

- brand;
- current workspace;
- primary action;
- menu button.

## Phone

Use:

```text
[logo]                         [menu]
```

When inside the studio, switch to a task-oriented top bar:

```text
[←]  MATERIAL SCAN                  [•••]
```

Bottom navigation may be used inside the authenticated/workspace experience:

```text
LAB   INVENTORY   DESIGNS   LIVE   PROJECT
```

Do not use a bottom nav on the cinematic marketing hero.

## Navigation transition

On scroll down:

- nav contracts;
- background becomes more opaque;
- border appears;
- blur increases slightly;
- shadow remains subtle.

On upward scroll:

- restore the expanded state where appropriate.

---

# 7. HERO — RESPONSIVE COMPOSITION

## XS / SM

The hero is a single-column cinematic composition.

Order:

1. small brand label;
2. headline;
3. material macro visual;
4. supporting line;
5. primary CTA;
6. secondary CTA;
7. tiny scroll cue.

Hide:

- complex floating annotations;
- secondary decorative windows;
- nonessential orbit lines.

Keep only one or two signature overlays.

### Mobile hero image

Use `aspect-ratio` around `4/5` or `3/4` depending on the art direction.

Use a separate mobile crop where necessary.

Do NOT simply squeeze the desktop hero image.

## Large phone / tablet

Allow image and headline to overlap slightly.

Introduce one side label and one floating material tag.

## Desktop

Return to the full art-directed composition:

- oversized headline;
- hero material image;
- floating IDs;
- grid;
- thread/line animation;
- secondary CTA;
- scroll progress.

## Ultra-wide

Do not stretch the headline or hero artwork across 2400–3000px.

Use a centered creative stage:

```text
ambient space | 1600–1800px core composition | ambient space
```

Peripheral space can contain slow decorative elements, but the primary hierarchy remains inside the central stage.

---

# 8. PREMIUM SCROLLING — RESPONSIVE RULES

The product should still have high-end scrolling on mobile, but **not the same amount of scroll choreography as desktop**.

## Desktop

Allowed:

- sticky scenes;
- pinned sections;
- horizontal gallery sequences;
- scrubbed timeline;
- layered parallax;
- oversized typography reveals;
- image-mask transitions.

## Tablet

Reduce:

- simultaneous parallax layers;
- horizontal scroll distance;
- pinned scene duration.

## Mobile

Prefer:

- vertical storytelling;
- short sticky scenes;
- transform/opacity reveals;
- lightweight scale transitions;
- horizontal carousels only where content benefits from horizontal browsing.

Avoid:

- giant pinned scenes that trap the user;
- multi-second scrub sequences that make touch scrolling feel sticky;
- heavy full-screen WebGL scenes on low-end phones.

### Responsive scroll principle

Desktop:

> User scroll controls the composition.

Mobile:

> User scroll reveals the composition.

That distinction is critical.

---

# 9. SCROLL PROGRESS INDICATOR

## Desktop

Use a side rail:

```text
01
●
02
○
03
○
04
○
```

Could show:

`01 / 07 — INVENTORY`

## Mobile

Replace the side rail with a tiny top progress bar:

```text
██████░░░░
```

or:

```text
01 / 07
```

Do not create a vertical side rail that steals horizontal space from a 320px phone.

---

# 10. MATERIAL SCANNER — RESPONSIVE UI

## Desktop

Three-zone scanner:

```text
┌──────────────┬───────────────────────┬──────────────┐
│ instructions │ camera / material     │ live analysis│
│              │                       │              │
│ scan state   │       VIDEO           │ MAT-001      │
│ tips         │                       │ confidence   │
└──────────────┴───────────────────────┴──────────────┘
```

## Tablet

Two-zone:

```text
┌──────────────────────────────┐
│ camera                       │
├──────────────────────────────┤
│ analysis / detected material │
└──────────────────────────────┘
```

Tips become a collapsible sheet.

## Phone

Camera-first.

```text
┌──────────────────────┐
│ MAT SCAN       01/05 │
│                      │
│       CAMERA         │
│                      │
│                      │
│    [ SCAN ]          │
├──────────────────────┤
│ Denim                │
│ confidence 94%       │
│ [Approve] [Edit]     │
└──────────────────────┘
```

The camera must occupy most of the first viewport.

Do not force users to scroll before reaching the capture action.

### Camera controls on mobile

Use thumb-reachable controls near the lower third:

- capture;
- retake;
- flashlight where supported;
- switch camera if needed;
- close.

Avoid tiny icon buttons in the top corners.

---

# 11. MATERIAL INVENTORY — RESPONSIVE GRID

## Desktop

4–6 cards per row depending on viewport.

Each card can show:

- image;
- material ID;
- type;
- confidence;
- estimated quantity;
- status;
- miniature trace preview.

## Tablet

2–4 cards.

## Phone

1 card per row for review mode, or 2-column compact cards for browsing mode.

Recommended mobile card:

```text
┌────────────────────┐
│ [material image]   │
│ MAT-001            │
│ NAVY DENIM         │
│ 94% • APPROVED     │
└────────────────────┘
```

Tap opens detail as a full-screen sheet, not a desktop-style side panel.

---

# 12. MATERIAL DETAIL — RESPONSIVE SHEET

## Desktop

Use a right-side inspector panel.

```text
canvas                    inspector
───────────┬─────────────────────────
material   │ MAT-001                 │
preview    │ DENIM                   │
           │ confidence              │
           │ quantity                │
           │ observations            │
           │ edit / approve          │
```

## Phone

Use a bottom sheet that can expand to full screen.

Collapsed:

```text
MAT-001 · DENIM · 94%
```

Expanded:

- image;
- observations;
- quantity;
- confidence;
- correction controls;
- provenance.

Do not use a fixed desktop side panel on narrow screens.

---

# 13. CONSTRAINT BUILDER — RESPONSIVE UX

Constraints include:

- available materials only;
- number of looks;
- event/use case;
- preferred silhouette;
- material restrictions;
- quantity restrictions;
- designer instructions.

## Desktop

Use a wide two-column editor:

```text
CONSTRAINTS                 LIVE SUMMARY
──────────────────────      ─────────────
Material rules              3 looks
Design goal                 5 approved mats
Quantity limits             no new fabric
Human notes                 dinner collection
```

## Phone

Convert to a vertical task flow:

```text
01 MATERIAL RULES
02 DESIGN GOAL
03 QUANTITY
04 OPTIONAL NOTES
05 REVIEW
```

Use progressive disclosure.

Do not show 20 controls at once.

### Mobile interaction

Use segmented controls, chips, toggles, sliders and short fields.

Long-form instruction can open a focused full-screen editor.

---

# 14. GENERATION SCREEN — RESPONSIVE

## Desktop

Use a cinematic generation scene.

Left:

constraint summary.

Center:

large design preview.

Right:

material trace / generation reasoning.

Footer:

status timeline.

## Phone

The generation screen becomes a vertical narrative:

```text
REQUEST
↓
CONSTRAINTS
↓
GENERATING
↓
DESIGN
↓
MATERIAL TRACE
↓
VALIDATION
```

Never force three narrow desktop columns onto a phone.

### AI processing state

Use concise step messages:

```text
READING MATERIALS
RESOLVING CONSTRAINTS
GENERATING LOOK
CHECKING MATERIAL USAGE
VALIDATING
```

Each step should occupy only a small visual area.

---

# 15. DESIGN GRID — RESPONSIVE

## Desktop

3 large editorial cards.

Each card can include:

- generated visual;
- look title;
- material IDs;
- validity state;
- feasibility summary.

## Tablet

2 cards per row.

## Phone

One card per row with snap scrolling as an optional browsing interaction.

Mobile card should feel like a fashion editorial panel, not a generic AI result card.

Use:

- large image;
- bold title;
- one-line material summary;
- clear status.

Secondary metadata appears after tapping.

---

# 16. MATERIAL TRACE — RESPONSIVE

Material Trace is a signature interaction and must remain visible on every device.

## Desktop

Use an interactive visual map:

```text
MAT-001 ─────► JACKET BODY
MAT-002 ─────► SLEEVE
MAT-003 ─────► COLLAR
```

Hover a material → highlight garment region.

Hover garment region → highlight source material.

## Tablet

Use tap-to-highlight.

## Phone

Use a bottom drawer:

```text
MATERIAL TRACE
───────────────
MAT-001  → BODY
MAT-002  → SLEEVE
MAT-003  → COLLAR
```

Tap an item:

```text
MAT-002
USED IN: SLEEVE
STATUS: VALID
```

Do not rely on hover for any essential information.

---

# 17. CONSTRAINT INVALIDATION — RESPONSIVE SIGNATURE ANIMATION

This is one of the most important motion moments in the entire product.

Scenario:

```text
MAT-003 removed
↓
LOOK 02 affected
↓
LOOK 02 becomes INVALID
↓
AI recalculates
↓
LOOK 02 repaired
```

## Desktop motion

Use a full composition sequence:

1. material card lifts;
2. material fades / moves out;
3. trace connections turn warning yellow;
4. affected garment region pulses;
5. invalid badge appears;
6. AI progress indicator sweeps across design;
7. updated design crossfades/morphs in;
8. trace lines reconnect;
9. status becomes `VALID`.

## Phone motion

Compress to:

```text
MAT-003 REMOVED
        ↓
LOOK 02 INVALID
        ↓
RECALCULATING
        ↓
VALID
```

Use 2–4 key transitions only.

Do not keep the phone locked in a 7-second animation.

---

# 18. LIVE STUDIO — THE MOST IMPORTANT RESPONSIVE WORKSPACE

## Desktop layout

Ideal large screen:

```text
┌──────────────────────────────────────────────────────────────┐
│ TOP BAR                                                      │
├──────────────────────────────┬───────────────────────────────┤
│                              │ MATERIAL INVENTORY            │
│       VIDEO STAGE             ├───────────────────────────────┤
│                              │ DESIGN / TRACE                │
│                              ├───────────────────────────────┤
│                              │ DECISIONS / ACTIVITY          │
├──────────────────────────────┴───────────────────────────────┤
│ CHAT / ACTION BAR                                             │
└──────────────────────────────────────────────────────────────┘
```

## Laptop

Reduce right-side panel density.

Collapse activity stream into a tab.

## Tablet

Use tabbed workspace:

```text
VIDEO | MATERIALS | DESIGN | DECISIONS
```

Only one auxiliary panel is expanded at once.

## Phone

Do NOT show all panels simultaneously.

Use:

```text
┌──────────────────────┐
│ LIVE STUDIO     2 ●  │
├──────────────────────┤
│                      │
│      VIDEO           │
│                      │
├──────────────────────┤
│ MATERIALS  DESIGN    │
│ DECISIONS  CHAT      │
├──────────────────────┤
│ [mute] [cam] [more]  │
└──────────────────────┘
```

Tabs or bottom sheets reveal secondary content.

The current speaker/video remains the main visual priority.

---

# 19. VONAGE VIDEO — RESPONSIVE RULES

## Desktop

Grid:

```text
main speaker 70%
secondary participants 30%
```

Or:

```text
1 large video + 2–4 floating mini videos
```

## Tablet

2-up or speaker-focused layout.

## Phone

Use speaker-first mode.

Main video:

```text
16:9 or 4:3
```

Participant strip:

horizontal, swipeable.

Do not shrink six video feeds into tiny squares.

### Connection state

Always show clear compact status:

`LIVE`
`CONNECTING`
`RECONNECTING`
`MUTED`

Avoid large disruptive connection banners unless necessary.

---

# 20. ACTIVITY / DECISION FEED — RESPONSIVE

Desktop:

right panel or bottom timeline.

Phone:

bottom sheet.

Each event:

```text
SUJITH
removed MAT-003
2m ago
```

or:

```text
AI
marked LOOK 02 invalid
12s ago
```

Do not put verbose AI logs into the primary mobile feed.

Keep technical detail behind `View reasoning`.

---

# 21. BUTTONS AND TOUCH TARGETS

Minimum recommended interactive size:

```text
44 × 44px
```

Prefer:

```text
48 × 48px
```

for primary mobile actions.

Avoid:

- text links that are too close together;
- icons smaller than their effective touch target;
- tightly packed material controls.

Mobile primary CTA should generally be full width or near-full width when it is the central task.

---

# 22. HOVER → TOUCH ADAPTATION

Never depend on hover for meaning.

Desktop:

- hover card;
- highlight trace;
- magnetic button;
- cursor distortion;
- tooltip.

Touch:

- tap;
- press-and-hold only when genuinely useful;
- bottom sheet;
- explicit state.

Example:

Desktop:

```text
Hover MAT-001 → garment region glows
```

Mobile:

```text
Tap MAT-001 → garment region glows + trace drawer opens
```

---

# 23. CURSOR EFFECTS — RESPONSIVE

Custom cursor systems are allowed only on pointer-capable devices.

```css
@media (hover: hover) and (pointer: fine) { ... }
```

Disable custom cursor on:

- touch phones;
- most tablets;
- hybrid devices when touch is the primary input.

Never reproduce desktop cursor trails on touch screens.

---

# 24. MAGNETIC BUTTONS — RESPONSIVE

Desktop:

A primary CTA may have a subtle magnetic movement of approximately 4–12px toward the pointer.

Tablet/phone:

Disable magnetic behavior.

Replace with:

- press scale `0.98`;
- shadow change;
- small background shift.

The button should feel tactile, not jumpy.

---

# 25. PARALLAX — RESPONSIVE PERFORMANCE

Desktop:

3–5 meaningful layers may be used:

- background grid;
- material texture;
- garment cutout;
- annotation lines;
- foreground badge.

Tablet:

2–3 layers.

Phone:

1–2 layers.

Prefer transform-only animation:

```text
transform: translate3d(...)
```

Avoid animating layout properties such as:

- top;
- left;
- width;
- height;

when a transform can achieve the same result.

---

# 26. PINNED SECTIONS — RESPONSIVE

## Desktop

Pinned scenes can span 120–250vh depending on narrative.

## Tablet

Reduce to approximately 100–180vh.

## Mobile

Keep most pinned scenes around 90–140vh.

If the content is naturally sequential, remove pinning entirely on small phones.

### Never pin

- the main camera capture screen for long periods;
- live video controls;
- long forms;
- data-heavy inventory lists.

Users must always feel that the page can continue scrolling.

---

# 27. HORIZONTAL SCROLL — RESPONSIVE

Horizontal scrolling is appropriate for:

- lookbook;
- material swatches;
- participant strip;
- inspiration references.

Avoid horizontal scrolling for:

- core settings;
- critical form fields;
- constraint review;
- error states.

On mobile, add a visual cue:

```text
01 02 03  →
```

or a partial next-card reveal.

Never hide horizontal scroll without a visual affordance.

---

# 28. COLLECTION / LOOKBOOK — RESPONSIVE

## Desktop

Editorial masonry or asymmetric grid.

Example:

```text
┌───────────────┐ ┌───────┐
│ LOOK 01       │ │ LOOK 02
│               │ └───────┘
│               │ ┌───────┐
└───────────────┘ │ LOOK03│
                  └───────┘
```

## Tablet

2-column grid.

## Phone

Single-column editorial stack or swipe carousel.

Keep a deliberate rhythm between:

- image;
- look title;
- material usage;
- validation state.

---

# 29. FULL-SCREEN SHEETS — MOBILE SYSTEM

On phone, use sheets for:

- material detail;
- constraint detail;
- design trace;
- AI reasoning;
- collaboration participants;
- activity log.

Recommended behavior:

1. sheet enters from bottom;
2. drag handle visible;
3. supports partial height;
4. expands to full height;
5. background content becomes inert;
6. close/escape is always available.

Don't build modal dialogs designed for 1440px screens and merely reduce their width.

---

# 30. SAFE AREAS / NOTCHES / MOBILE BROWSERS

Support:

```css
padding-top: env(safe-area-inset-top);
padding-bottom: env(safe-area-inset-bottom);
```

Critical on:

- iPhone-style devices;
- fullscreen PWA mode;
- camera screen;
- live video screen;
- bottom action bars.

Never place primary controls underneath the browser/home gesture region.

---

# 31. LANDSCAPE MOBILE

Landscape phone is a valid special case for:

- camera scanning;
- live studio;
- presentation/demo mode.

When height is severely constrained:

- reduce hero typography;
- hide secondary metadata;
- keep camera/video dominant;
- move controls into compact bars;
- never create giant vertical spacing.

Use height-aware logic such as:

```css
@media (max-height: 620px) { ... }
```

only where genuinely needed.

---

# 32. ULTRA-WIDE SCREENS

The biggest danger at 1920px+ is a beautiful design becoming an enormous empty dashboard.

Use:

- central max-width workspace;
- side visual atmosphere;
- floating material indexes;
- ambient textures;
- restrained oversized type;
- large art panels.

Do NOT make a single 2400px-wide row of tiny cards.

For the Live Studio, a good strategy is:

```text
left: 10–15% atmospheric rail
center: 65–75% active workspace
right: 15–20% contextual rail
```

subject to actual content needs.

---

# 33. 4K / HIGH-DPI MEDIA STRATEGY

Use responsive image loading.

Requirements:

- AVIF/WebP where supported;
- responsive `srcset`;
- lazy-load below-the-fold artwork;
- avoid shipping a 3000px image to a 360px phone;
- define image dimensions to prevent CLS;
- use lower-resolution previews while generating AI designs.

For high-end hero art:

- desktop gets large optimized source;
- mobile receives dedicated crop or alternate composition.

---

# 34. MOTION RESPONSIVENESS

The project should use a **motion budget**.

## Desktop

High:
- 4–8 simultaneous animated elements in cinematic scenes;
- layered motion;
- subtle parallax;
- scrubbed sequences.

## Tablet

Medium:
- 2–5 animated elements;
- shorter sequences.

## Mobile

Low:
- 1–3 simultaneous meaningful animations;
- faster transitions;
- no continuous ornamental motion unless it reinforces state.

### Core durations

Micro interaction:

```text
120–220ms
```

Panel/card transition:

```text
220–420ms
```

Editorial reveal:

```text
450–900ms
```

Hero cinematic sequence:

```text
900–1800ms per beat
```

Mobile should usually stay at the lower end of these ranges.

---

# 35. EASING

Preferred:

- `easeOutCubic` for entrances;
- `easeInOutCubic` for transformation;
- gentle spring for tactile controls;
- no excessive elastic bounce for premium sections.

Avoid:

- constant linear motion for UI state;
- bouncy animations everywhere;
- random stagger values.

The product should feel editorial and intentional.

---

# 36. REDUCED MOTION

Respect:

```css
@media (prefers-reduced-motion: reduce) { ... }
```

When enabled:

- remove parallax;
- remove cursor distortions;
- remove long pinned choreography;
- replace scrubbing with instant scene changes;
- keep opacity/focus transitions where useful;
- never hide content because animation was removed.

---

# 37. PERFORMANCE BUDGET

Responsive quality is partly performance quality.

Target:

- smooth scrolling at 60fps on capable devices;
- avoid main-thread spikes during scroll;
- defer nonessential graphics;
- lazy-load below-fold heavy content;
- avoid huge uncompressed PNGs;
- avoid unnecessary WebGL on mobile;
- pause offscreen video/animation where practical.

Use Chrome performance tools and real device testing.

Do not assume a MacBook performance profile represents mobile hardware.

---

# 38. MOBILE AI GENERATION PERFORMANCE

AI generation can create long waits.

Use staged feedback:

```text
Reading materials
        ↓
Building constraints
        ↓
Designing
        ↓
Validating
```

Don't show a blank loader.

If generation takes longer than expected:

- retain visible project context;
- show current constraints;
- show materials being considered;
- allow navigation to another non-blocking screen when safe.

---

# 39. OFFLINE / DEGRADED NETWORK STATES

The product is online-first, but UI must gracefully handle:

- weak Wi-Fi;
- camera permission denial;
- Gemini timeout;
- Vonage reconnect;
- image upload failure.

Never show:

`Something went wrong.`

Prefer:

> **Material scan interrupted**
> Your image did not finish uploading.
> `[Try Again]`

For a Vonage reconnect:

> **Reconnecting to Live Studio…**

Keep the current material/design state intact.

---

# 40. ACCESSIBILITY RESPONSIVENESS

The premium aesthetic must never damage usability.

Requirements:

- visible focus states;
- keyboard navigation on desktop;
- logical tab order;
- semantic buttons and landmarks;
- labels for icon-only controls;
- adequate color contrast;
- status communicated without color alone;
- captions/transcripts for live collaboration where available;
- touch targets at least 44×44px;
- reduced-motion mode;
- text remains readable at increased browser zoom.

### Important

A yellow warning cannot be represented only by yellow.

Use:

```text
[!] INVALID
```

plus visual color.

---

# 41. RESPONSIVE STATE DESIGN

Every important state must have a mobile and desktop representation.

## Material states

```text
SCANNING
DETECTED
UNCERTAIN
APPROVED
EDITED
REJECTED
```

## Design states

```text
DRAFT
GENERATING
VALIDATING
VALID
INVALID
REGENERATING
ARCHIVED
```

## Live states

```text
CONNECTING
LIVE
MUTED
RECONNECTING
ENDED
```

Do not invent extra layouts for states. Reuse a stable state language.

---

# 42. RESPONSIVE COMPONENT ARCHITECTURE

Recommended component structure:

```text
app/
  (marketing)/
  lab/
  studio/
components/
  layout/
    ResponsiveShell.tsx
    ResponsiveNav.tsx
    MobileHeader.tsx
    DesktopNav.tsx
  hero/
  materials/
    MaterialCard.tsx
    MaterialGrid.tsx
    MaterialSheet.tsx
    MaterialTrace.tsx
  scanner/
    ScannerView.tsx
    ScanControls.tsx
  constraints/
    ConstraintBuilder.tsx
    ConstraintSummary.tsx
  designs/
    DesignCard.tsx
    DesignGrid.tsx
    DesignTrace.tsx
  live/
    LiveStudio.tsx
    ParticipantStrip.tsx
    ActivitySheet.tsx
  motion/
    ScrollScene.tsx
    Reveal.tsx
    ParallaxLayer.tsx
```

Use the same content components at different breakpoints wherever possible.

The layout wrapper decides whether a component is:

- grid;
- stack;
- rail;
- drawer;
- tab;
- full-screen sheet.

---

# 43. CONTAINER QUERY STRATEGY

For reusable components like MaterialCard, DesignCard and ActivityItem, prefer container-aware adaptation where possible.

Example mental model:

```text
small card → compact metadata
medium card → normal metadata
large card → full trace + status + actions
```

This avoids hard-coding every adaptation only to viewport width.

---

# 44. RESPONSIVE DESIGN RULES FOR THE AWARD-LEVEL AESTHETIC

Do:

- preserve asymmetry where useful;
- let images break the grid intentionally;
- use generous mobile whitespace;
- treat materials as visual objects;
- use large type sparingly but confidently;
- keep transitions coherent;
- maintain strong art direction.

Do not:

- stack every desktop section into generic cards;
- remove all personality on mobile;
- make every section centered;
- use tiny typography to fit content;
- create a wall of shadows;
- add motion to everything;
- use horizontal overflow accidentally;
- allow decorative elements to block interaction.

---

# 45. MOBILE FIRST IMPLEMENTATION ORDER

Implement in this exact order:

### Phase 1 — XS / SM

Build and test:

- landing hero;
- mobile nav;
- scan flow;
- inventory;
- constraints;
- generation result;
- trace;
- live studio;
- sheets;
- error states.

### Phase 2 — MD / LG

Add:

- 2-column layouts;
- hybrid panels;
- expanded navigation;
- richer studio composition.

### Phase 3 — XL / 2XL

Add:

- editorial desktop grid;
- pinned scenes;
- side inspectors;
- multi-panel live studio;
- full hover interactions.

### Phase 4 — 3XL / 4XL

Tune:

- max widths;
- large imagery;
- typography caps;
- ambient side space;
- presentation mode.

Never build desktop first and then try to repair mobile at the end.

---

# 46. TEST MATRIX

Every critical screen must be tested at minimum at:

```text
320 × 568
360 × 800
390 × 844
430 × 932
768 × 1024
834 × 1194
1024 × 768
1280 × 800
1440 × 900
1536 × 864
1920 × 1080
2560 × 1440
```

Also test:

- portrait;
- landscape;
- browser zoom 200%;
- reduced motion;
- slow network;
- camera permission denied;
- no microphone;
- reconnecting video.

---

# 47. RESPONSIVE ACCEPTANCE CRITERIA

A screen passes only when:

### Layout
- no unintended horizontal overflow;
- no clipped essential text;
- no overlapping interactive controls;
- primary action is obvious.

### Typography
- headline does not collide with critical artwork;
- body remains readable;
- technical labels are not microscopic.

### Interaction
- all essential actions work with touch;
- no essential hover-only behavior;
- sheets are dismissible;
- controls remain reachable with one hand where appropriate.

### Motion
- no long, blocking mobile sequences;
- reduced-motion version works;
- animation does not cause visible jank.

### Performance
- hero loads progressively;
- images are responsive;
- below-fold content is deferred;
- live video remains usable.

### Visual quality
- the product still feels like Deadstock Live Lab;
- mobile is not visually generic;
- desktop is not overcrowded;
- ultra-wide is not empty or stretched.

---

# 48. FINAL RESPONSIVE DESIGN PRINCIPLE

The final product should feel like the same creative system, not the same layout.

Remember:

> **Phone = focused instrument.**
>
> **Tablet = collaborative canvas.**
>
> **Laptop = production workstation.**
>
> **Desktop = cinematic studio.**
>
> **Ultra-wide = immersive command center.**

And the most important product rule remains:

> **The material is always the hero.**

Every responsive decision should help the user understand:

**what exists → what the AI understands → what constraints apply → what can be designed → what humans decide together.**

That is the responsive design system for Deadstock Live Lab.
