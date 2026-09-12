# DEADSTOCK LIVE LAB — UI / MOTION / AWWWARDS-LEVEL FRONTEND SKILLS

## 0. Purpose

This document is the implementation skill/spec for building the Deadstock Live Lab interface as a premium, high-graphic, editorial fashion-tech experience rather than a conventional SaaS dashboard.

The supplied visual reference establishes the visual attitude: oversized typography, electric cobalt/royal blue, fluorescent yellow, lavender/blue framing, collage-style photography, cutout graphics, irregular shapes, editorial layouts, bold labels, and a strong art-directed composition. Use that visual language as inspiration, but do NOT copy the reference layout one-to-one. Deadstock needs its own identity built around materials, fabric swatches, inventory, constraint visualization, AI reasoning, and live collaboration.

Core product statement:

> DESIGN WITH WHAT EXISTS.

The interface should make the product feel like a cross between:
- a high-end fashion editorial site;
- a creative-direction studio;
- a cinematic interactive portfolio;
- a real production/material intelligence tool.

The product must never feel like a generic AI chatbot with a few fashion images attached.

---

# 1. DESIGN NORTH STAR

### Primary emotional response

The first five seconds should communicate:

"This is a serious creative tool, but it is playful, tactile, experimental, and visually expensive."

### The three design principles

1. **Material-first**
   Fabrics, swatches, labels, textures, stitching, tags and physical inventory are the visual language.

2. **Editorial, not dashboard-first**
   Use dramatic typography, asymmetry, oversized imagery, overlapping layers and strong section transitions. Functional screens can become structured workspaces after the user enters the studio.

3. **AI must feel grounded**
   Every generated design should visibly reference real materials and constraints. The UI should communicate where an idea came from.

### The visual rule

Do not decorate for decoration's sake. Every visual effect must reinforce one of:
- material discovery;
- transformation;
- constraint;
- collaboration;
- provenance;
- design evolution.

---

# 2. VISUAL IDENTITY

## 2.1 Color system

Use a deliberately small palette.

### Base

- Ink / Night: `#080A18`
- Deep Blue: `#10184A`
- Royal Cobalt: `#263CFF`
- Electric Blue: `#4D74FF`
- Lavender: `#9097FF`
- Fluorescent Yellow: `#F2FF55`
- Warm White: `#F7F7EE`
- Paper: `#F1F0E8`
- Charcoal: `#151515`

### Semantic accents

- AI active: Electric Blue
- Constraint / warning: Fluorescent Yellow
- Verified: mint/green used sparingly
- Human decision: warm white / pale lavender
- Error / blocked: muted coral, never bright red everywhere

### Rule

Use fluorescent yellow as an accent and storytelling device, not as a giant background on every screen.

A strong ratio:
- 60% dark/neutral base
- 25% paper/white
- 10% cobalt/blue
- 5% fluorescent signal colors

For editorial landing sections, temporarily invert this ratio and use yellow as the visual field.

---

# 3. TYPOGRAPHY

The reference uses giant display typography. Deadstock should keep this characteristic but choose a clearer fashion-tech family.

Recommended:
- Display: `Space Grotesk`, `Archivo`, `Sora`, or `Inter Tight`
- Mono / technical labels: `IBM Plex Mono` or `JetBrains Mono`
- Body: `Inter`

### Type hierarchy

Display hero:
- 8–13vw clamp
- line-height 0.82–0.94
- weight 700–900
- aggressive tracking only on short labels

Section titles:
- 4–8vw
- line-height 0.9

Studio heading:
- 32–64px desktop

Body:
- 15–18px

Micro labels:
- 10–12px
- uppercase
- letter spacing 0.10–0.18em

Technical values:
- mono
- 12–14px

Do not use more than 3 font families.

---

# 4. LAYOUT SYSTEM

## Landing / marketing layout

Use a 12-column grid on desktop.

Desktop:
- max-width: 1440–1600px
- horizontal gutter: 28–56px
- section spacing: 120–220px

Tablet:
- 24–36px gutters

Mobile:
- 18–22px gutters

### The composition should frequently break the grid

Examples:
- a material card spanning 7 columns;
- an image spanning 6 columns and drifting outside the grid;
- technical annotations crossing over images;
- large headline partially overlapping an image;
- a vertical material index pinned to the viewport.

Do not make every section a centered card.

---

# 5. LANDING PAGE — EXACT UI DIRECTION

## Section 01 — Intro / Hero

Visual concept:

A nearly black/blue field.

At the top-left:
`DEADSTOCK / LIVE LAB`

At the top-right:
`MATERIAL-CONSTRAINED CO-DESIGN / 01`

Center:

> DESIGN
> WITH
> WHAT
> EXISTS.

The word `EXISTS.` should be fluorescent yellow or outlined cobalt.

Behind the type:
- slow-moving fabric macro texture;
- thin measurement lines;
- small material IDs;
- a faint grid;
- one large cutout garment silhouette;
- floating thread/line paths.

CTA:

`START A LIVE LAB` — filled cobalt/yellow contrast
`SEE HOW IT WORKS` — text link

Bottom-left:
`GEMINI × VONAGE × MATERIAL INTELLIGENCE`

Bottom-right:
scroll indicator: `01 / 07`

### Hero animation

Initial 0–1600ms:
- background grid fades from opacity 0 to 0.18;
- material fragments rise 20–40px with slight rotation;
- hero title enters line-by-line using y: 90px -> 0 and opacity 0 -> 1;
- `EXISTS.` arrives 150ms later with a tiny scale overshoot;
- subtitle enters with 300ms delay;
- CTA slides in from x:-24px;
- final material scan-line sweeps vertically through the composition.

Avoid a generic fade-in everything at once.

---

# 6. HERO SCROLL STORY

The hero should be a pinned narrative scene.

As the user scrolls:

### Beat A — Inventory

Material fragments float into a camera frame.

Text:
`FIRST, WE LOOK.`

### Beat B — Understanding

Fragments get tagged:
- MAT-001
- MAT-002
- MAT-003

Text:
`THEN WE UNDERSTAND.`

### Beat C — Constraint

A ring/box locks around the materials.

Text:
`THEN WE RESTRICT THE AI.`

### Beat D — Co-design

Fabric pieces rearrange into a garment silhouette.

Text:
`THEN WE DESIGN.`

### Beat E — Collaboration

The composition splits into live video + material board + design.

Text:
`THEN HUMANS DECIDE.`

Final:
`DESIGN WITH WHAT EXISTS.`

This should feel like a short interactive film.

---

# 7. SCROLL ANIMATION SYSTEM

For premium scroll storytelling, prefer GSAP ScrollTrigger for pinned, scrubbed, sequenced narrative scenes. Motion's `scroll()` is excellent for smaller scroll-linked interactions and is lightweight. GSAP ScrollTrigger supports scrub, pin, snap, callbacks and optimized scroll synchronization. Use native scrolling; do not build a fake scrollbar. citeturn995123search0turn995123search2

### Rule of thumb

Use Framer Motion / Motion for:
- entrance animations;
- modal transitions;
- hover states;
- layout changes;
- cards;
- small state transitions;
- presence/exit animations;
- in-view reveals.

Use GSAP ScrollTrigger for:
- pinned storytelling;
- long timelines driven by scroll;
- horizontal sections;
- complex parallax;
- scene choreography;
- progress-controlled garment/material transformations.

Motion's `inView` is appropriate for simple viewport-triggered reveals; GSAP is better when an entire sequence must be tied to scroll progress. citeturn995123search4turn995123search0

---

# 8. SPECIFIC PREMIUM SCROLL EFFECTS TO IMPLEMENT

## 8.1 Kinetic headline

Large headline slowly changes tracking and vertical position as the user scrolls.

Do not make the text spin.

Example:
`DESIGN WITH WHAT EXISTS.`

At scroll progress 0:
- scale 1
- letter spacing 0
- opacity 1

At progress 0.5:
- scale 0.92
- letter spacing -0.03em
- x: -3vw

At progress 1:
- scale 0.82
- x: -8vw

Use restrained motion.

## 8.2 Material parallax

Foreground fabric moves at 1.0x.
Midground moves at 0.65x.
Background texture moves at 0.3x.

Never exceed roughly 100px visual displacement on desktop.

## 8.3 Pin + transform

Pin a material specimen panel while the right side changes:

1. raw fabric
2. detected labels
3. inventory data
4. constraints
5. garment concept

This is one of the highest-value effects in the site.

## 8.4 Horizontal materials rail

A horizontal inventory strip moves horizontally while the page scrolls vertically.

Cards can be:
- denim;
- linen;
- satin;
- trim;
- zipper;
- button.

As each material crosses center, its metadata becomes active.

## 8.5 Image reveal with masking

Use a clipped image or SVG-like shape.

The material photo starts behind a narrow slit and expands to full width as it enters the viewport.

Avoid excessive rounded cards.

## 8.6 Typography wipe

A headline enters from below a clip-path and reveals one line at a time.

## 8.7 Constraint locking

At the moment the inventory becomes authoritative, animate:
- outline draw-on;
- tiny lock icon;
- UI label changes `DRAFT` -> `LOCKED`;
- yellow pulse;
- all rejected material tags move out of the active set.

This animation communicates product logic rather than decoration.

## 8.8 Design transformation

Use a 4-step morph-like sequence:

material swatch -> flat composition -> silhouette -> editorial garment render.

Where a literal image morph is not available, fake the transformation using layered images with masked opacity/scale/position transitions.

---

# 9. MATERIAL SCANNER UI

Screen title:
`SCAN THE MATERIAL.`

Subline:
`Show us what exists. The lab will do the rest.`

Main panel:
large live camera viewport.

Overlay:
- four technical corner brackets;
- moving scan line;
- current confidence;
- detected count;
- capture button.

Right rail:
`LIVE DETECTIONS`

Example:

MAT-001
DENIM
94% confidence

MAT-002
LINEN
81% confidence

MAT-003
SATIN
73% confidence

Each card has:
`APPROVE` / `EDIT`

### Scanner animation

Idle:
- faint moving scan line every 2.8s;
- corner markers gently breathe.

Detection:
- scan line stops;
- bounding shape draws around material;
- label snaps into position;
- confidence ring animates from 0 to value.

Approval:
- yellow tick draws with SVG path animation;
- label changes from `UNVERIFIED` to `VERIFIED`.

---

# 10. INVENTORY UI

This screen should feel like a fashion archive / material library.

Header:
`MATERIAL LIBRARY`

Top metrics:
- 09 Materials
- 03 Verified
- 02 Low Confidence
- 14.8m Estimated Usable Stock

Main layout:
Asymmetric masonry/grid.

Every material tile includes:
- actual image;
- material code;
- material name;
- color chip;
- estimated quantity;
- confidence;
- tags;
- usage count;
- verification state.

Hover:
- image zoom 1.04;
- technical overlay appears;
- metadata slides up;
- background remains stable.

Do not use huge shadows.

Use borders, texture, depth and composition instead.

---

# 11. MATERIAL DETAIL DRAWER

Clicking material opens a full-height drawer.

Left:
large image + crop details.

Right:

`MAT-004`
`NAVY DENIM`

Confidence: 94%

Properties:
- visual weight
- texture
- pattern
- color
- estimated quantity

Source:
`Captured 21:42`

Actions:
`EDIT MATERIAL`
`REMOVE`
`USE IN DESIGN`

Include:
`WHY THE AI THINKS THIS`

This makes AI reasoning visible but concise.

---

# 12. CONSTRAINT BUILDER

This is one of the most important product screens.

Title:
`CONSTRAIN THE CREATIVE.`

Left side:
material inventory.

Center:
constraint stack.

Right:
AI preview.

Constraint types:

### HARD CONSTRAINTS
Must never be violated.
- use only verified inventory;
- no new material;
- max number of looks;
- required garment type.

### SOFT CONSTRAINTS
Prefer when possible.
- minimal waste;
- keep color harmony;
- favor existing trims;
- evening wear;
- gender-neutral silhouette.

Each hard constraint should have a visible lock.
Soft constraints use a slider or preference weight.

Important: do not pretend an LLM can guarantee physical manufacturability from images alone. Label estimates and assumptions clearly.

---

# 13. DESIGN GENERATION SCREEN

Title:
`MAKE SOMETHING REAL.`

User prompt is secondary.

Primary visual should be the live material inventory.

Generation flow:

`INVENTORY -> CONSTRAINTS -> CONCEPTS`

Show a small progress rail:

01 Understand
02 Constrain
03 Compose
04 Verify
05 Reveal

### AI generation state

Don't use a generic spinner.

Use status messages:

`MAPPING MATERIALS`
`CHECKING AVAILABLE STOCK`
`BUILDING SILHOUETTE`
`ALLOCATING PANELS`
`VERIFYING TRACE`
`READY`

This makes the system feel computationally meaningful.

---

# 14. DESIGN RESULT UI

Each concept should feel like a fashion editorial plate.

Large image.

Under image:

`LOOK 01 / NIGHT SHIFT`

Material trace:
- body → MAT-002
- sleeve → MAT-001
- trim → MAT-004

Validity state:
`CONSTRAINT PASS`

Confidence:
`HIGH`

Buttons:
`OPEN TRACE`
`EDIT CONSTRAINTS`
`ADD TO COLLECTION`

### Material trace interaction

Click a garment region.

The corresponding material card highlights.

Material card pulses.

A thin animated line connects the garment region to the physical swatch.

This connection is a signature interaction of the product.

---

# 15. LIVE STUDIO — VONAGE

This screen should look like a creative war room, not Zoom.

Layout:

Top:
`LIVE MATERIAL REVIEW`

Main:
left 55% video/collaboration area.
right 45% project context.

Right area contains tabs:
- MATERIALS
- CURRENT LOOK
- CONSTRAINTS
- DECISIONS

Bottom:
participant chips.

### AI moderator panel

Small translucent panel:
`AI SUMMARY`

Example:

> Mara suggested removing the satin panel.
> Look 02 depends on MAT-003.
> Two designs are affected.

Buttons:
`APPLY DECISION`
`KEEP AS DISCUSSION`

This turns conversation into structured project state.

---

# 16. COLLABORATION MICROINTERACTIONS

Participant joins:
- avatar rises from bottom;
- name appears;
- connection dot transitions gray -> green;
- no giant modal.

Participant speaks:
- subtle audio ring;
- never flash the entire tile.

Shared decision:
- decision event appears in activity rail;
- yellow accent;
- timestamp.

Material removed:
- swatch slides out;
- affected designs receive a yellow warning pulse;
- invalid state appears.

Decision accepted:
- warning collapses;
- affected designs revalidate.

---

# 17. THE SIGNATURE “MATERIAL REMOVED” ANIMATION

This should be one of the judge-demo moments.

Starting state:

MAT-003 / BURGUNDY SATIN / VERIFIED

User clicks `REMOVE FROM INVENTORY`.

Animation:

0–150ms:
card darkens slightly.

150–450ms:
material swatch lifts 12px and shifts toward the edge.

450–700ms:
status label changes to `UNAVAILABLE`.

700–1000ms:
thin connection lines from the material to affected garment zones illuminate.

1000–1250ms:
affected concept cards pulse once.

1250–1700ms:
AI status changes:
`RECHECKING CONSTRAINTS`

1700–2400ms:
invalid look transitions into a regeneration state.

2400–3200ms:
updated look enters with a masked reveal.

Final:
`CONSTRAINT PASS`

The point is that the animation tells the story of the product logic.

---

# 18. COLLECTION BOARD

After generating multiple looks, users can create a collection.

Screen title:
`THE MATERIALS BECAME A COLLECTION.`

Use an editorial artboard.

Allow:
- drag/reorder;
- material trace;
- notes;
- constraints;
- collaborator decision log.

Visual treatment:
large images, paper labels, mono annotations, crop marks, small measurement marks.

Think fashion lookbook + engineering sheet.

---

# 19. SCROLL STORY FOR COLLECTION

Use a pinned horizontal lookbook.

Scroll vertically.

Three looks move horizontally.

Each look enters center frame.

Metadata changes synchronously:

LOOK 01
materials: 3
estimated stock used: 72%
constraint status: PASS

Then LOOK 02.
Then LOOK 03.

At the end:

`100% TRACEABLE COLLECTION`

Do not make the horizontal scroll too long. Around 1800–2800px of scroll space is usually enough for three strong states.

---

# 20. AWWWARDS-STYLE INTERACTION LANGUAGE

Use these techniques selectively:

- pinned hero storytelling;
- horizontal scroll chapters;
- mask reveals;
- oversized kinetic typography;
- asymmetrical grid;
- image parallax;
- sticky metadata rails;
- cursor-following micro-elements;
- magnetic CTA buttons;
- subtle grain/noise;
- animated SVG line drawings;
- masked video transitions;
- variable typography scaling;
- section color inversion;
- editorial number systems;
- page progress indicator;
- viewport-aware text reveal;
- soft depth shifts;
- floating technical annotations.

Do NOT use all of them on every section.

Premium design comes from choreography, not effect count.

---

# 21. CURSOR SYSTEM

Desktop only.

Default cursor can become a small custom ring.

Interactive object:
ring expands from 10px to 28px.

CTA:
ring changes to a filled magnetic blob.

Material:
cursor displays:
`INSPECT`

Design image:
`TRACE`

Live Studio:
`JOIN`

Disable or simplify on touch devices.

Never make the cursor necessary for understanding the site.

---

# 22. MAGNETIC BUTTONS

Use on primary CTAs only.

Max displacement:
12–18px.

Input range:
80px.

Spring:
roughly 300–450 stiffness / low damping equivalent.

The button should follow subtly, never wobble wildly.

Primary button example:

`START A LIVE LAB  ↗`

On hover:
- internal arrow translates 4–6px;
- label tracks slightly;
- background changes;
- button expands 2–4px.

---

# 23. IMAGE BEHAVIOR

Images should not simply scale on hover.

Prefer:
- slow zoom 1.02–1.05;
- crop position shift;
- overlay metadata;
- mask expansion;
- subtle grain shift.

Do not use aggressive 1.2x zoom.

Fashion photography should remain premium.

---

# 24. BACKGROUND SYSTEM

Use a layered background:

Layer 01:
solid dark blue/black.

Layer 02:
very subtle grid.

Layer 03:
grain/noise at very low opacity.

Layer 04:
large blurred color glow.

Layer 05:
technical annotation lines.

Layer 06:
material fragments.

All layers should move at different speeds in hero storytelling.

Keep texture subtle enough that text stays readable.

---

# 25. PREMIUM SECTION TRANSITIONS

Do NOT use simple fade-between-sections.

Recommended transitions:

### Dark -> Yellow
A large yellow panel slides vertically from below and becomes the next section background.

### Material -> Garment
Swatch strip stretches horizontally and becomes the border/background of a garment image.

### Inventory -> Design
Cards collapse into a single composition, then expand into the final lookbook.

### Studio -> Proof
The video interface recedes into a small live preview while the final collection takes over the viewport.

Each transition should have a narrative reason.

---

# 26. FRAMER MOTION / MOTION IMPLEMENTATION RULES

Use variants for repeated patterns.

Example conceptual variant model:

```ts
const reveal = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
}
```

Use AnimatePresence for:
- drawer open/close;
- material status changes;
- generation states;
- design invalidation;
- participant join/leave.

Use layout animations for:
- material cards reordering;
- inventory changes;
- constraint chips;
- activity log updates.

Do not animate every DOM node individually. Prefer parent orchestration with children staggered by small offsets.

---

# 27. STAGGER SYSTEM

Default:
60–90ms between list items.

Premium editorial reveal:
100–140ms.

Fast utility update:
30–50ms.

Never use a 500ms stagger between 15 cards.

---

# 28. EASING SYSTEM

Recommended visual language:

UI response:
`easeOut`

Editorial reveal:
custom cubic-bezier around:
`[0.22, 1, 0.36, 1]`

Elastic only for tiny playful elements.

Physics/spring:
use for cards, cursor, drawers and interactive controls.

Avoid linear animation except:
- progress;
- scanning lines;
- ambient loops.

---

# 29. ANIMATION DURATIONS

Instant feedback:
120–220ms

Small UI:
220–360ms

Cards:
400–650ms

Editorial reveal:
650–1000ms

Major scene transition:
1000–1600ms

Hero choreography:
1600–3500ms total

Ambient animation:
5–12 seconds

Never make ordinary UI interactions take 2 seconds.

---

# 30. AMBIENT MOTION

Good:
- fabric texture drifting 1–3px;
- light noise movement;
- small floating labels;
- slow glow breathing;
- scan line;
- thread paths.

Bad:
- spinning everything;
- constant pulsing cards;
- parallax on every element;
- shaking text;
- infinite floating buttons.

Ambient movement should disappear into the visual atmosphere.

---

# 31. REDUCED MOTION

Respect `prefers-reduced-motion`.

When enabled:
- remove parallax;
- remove cursor following;
- reduce scale transforms;
- replace scrubbed motion with simple opacity/position transitions;
- disable ambient loops where possible.

The product must remain fully usable without animation.

---

# 32. PERFORMANCE RULES

Premium means smooth, not merely flashy.

Prefer transforms and opacity.

Avoid animating:
- width;
- height;
- top/left;
- large box-shadow changes;
- expensive filters on huge layers.

Use:
- transform;
- opacity;
- clip-path carefully;
- will-change only when needed;
- lazy-loaded images;
- responsive image sizes.

Do not autoplay large videos on mobile.

Do not stream camera frames continuously to Gemini.

Capture intentional frames.

GSAP ScrollTrigger is designed to calculate trigger positions up front and synchronize updates efficiently; use it rather than attaching raw scroll listeners to many elements. citeturn995123search0

---

# 33. MOBILE EXPERIENCE

Do not simply shrink desktop.

Mobile should become a vertical editorial story.

Rules:
- remove horizontal scrollytelling where it hurts usability;
- convert pinned sections to shorter sequences;
- keep hero typography large but controlled;
- simplify decorative layers;
- disable custom cursor;
- keep camera scanner full-width;
- keep material cards swipeable;
- preserve material trace interactions.

Primary mobile navigation:
`LAB`
`MATERIALS`
`DESIGNS`
`LIVE`

---

# 34. NAVIGATION

Marketing nav:

`DEADSTOCK` logo / wordmark

`HOW IT WORKS`
`THE LAB`
`ABOUT`

CTA:
`START LAB`

Once inside the application:

`PROJECT`
`MATERIALS`
`CONSTRAINTS`
`DESIGNS`
`LIVE STUDIO`
`COLLECTION`

Keep navigation quiet while the content is loud.

---

# 35. PAGE TRANSITION

Use a thin material-colored wipe.

Before navigation:
current page darkens slightly.

A vertical yellow/cobalt strip moves across the viewport.

New page content enters behind it.

Duration:
500–750ms.

Do not create a long cinematic transition for every click.

---

# 36. LOADING STATES

Never show:
`Loading...`

Use meaningful language.

Scanner:
`READING MATERIAL SURFACE`

Inventory:
`BUILDING MATERIAL INDEX`

Constraint validation:
`CHECKING MATERIAL AVAILABILITY`

Design generation:
`COMPOSING WITH AVAILABLE STOCK`

Vonage:
`CONNECTING TO LIVE STUDIO`

Saving:
`ARCHIVING DECISION`

This reinforces the product story.

---

# 37. ERROR STATES

Errors should explain the cause.

Bad:
`Something went wrong.`

Better:

`MATERIAL DATA INCOMPLETE`

`We cannot confidently identify this textile. Confirm the material manually before using it as a hard constraint.`

Actions:
`EDIT MATERIAL`
`CONTINUE WITH LOW CONFIDENCE`

---

# 38. EMPTY STATES

Material library empty:

Large text:
`NOTHING EXISTS YET.`

Subtext:
`Show us the materials on your table.`

CTA:
`SCAN MATERIALS`

Do not use generic empty-state illustrations.

---

# 39. ACCESSIBILITY

Minimum:
- keyboard navigation;
- visible focus state;
- semantic buttons/links;
- alt text for meaningful images;
- contrast suitable for text;
- reduced motion mode;
- captions/transcript support for live/video functionality where applicable;
- no color-only status communication.

For example:
`CONSTRAINT PASS` should have a check icon and text, not green alone.

---

# 40. DESIGN TOKENS

Create tokens instead of hardcoding values everywhere.

```css
--ink: #080A18;
--blue: #263CFF;
--electric: #4D74FF;
--lavender: #9097FF;
--yellow: #F2FF55;
--paper: #F1F0E8;
--white: #F7F7EE;

--radius-sm: 8px;
--radius-md: 14px;
--radius-lg: 24px;

--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 24px;
--space-6: 32px;
--space-7: 48px;
--space-8: 72px;
--space-9: 96px;
--space-10: 144px;
```

Do not over-round everything.

Fashion/editorial interface often feels stronger with hard edges, thin borders and occasional irregular clipping.

---

# 41. COMPONENT INVENTORY

Required reusable components:

### Brand
- LogoMark
- Wordmark
- SectionIndex
- PageProgress

### Editorial
- KineticHeadline
- ImageReveal
- MaterialSpecimen
- EditorialFrame
- TechnicalLabel
- GrainLayer
- ParallaxImage

### Materials
- MaterialCard
- MaterialGrid
- MaterialScanner
- MaterialConfidenceRing
- MaterialDetailDrawer
- MaterialTrace
- MaterialBadge

### Constraints
- ConstraintCard
- ConstraintChip
- HardConstraint
- SoftConstraint
- ConstraintStatus
- ValidationResult

### AI
- AIStatusRail
- GenerationProgress
- AIExplanation
- DesignCard
- DesignTrace

### Collaboration
- LiveStudio
- ParticipantTile
- ParticipantRail
- CollaborationEvent
- DecisionCard
- AIConversationSummary

### Navigation / utility
- MagneticButton
- CommandMenu
- Toast
- Drawer
- Modal
- Tooltip

---

# 42. SIGNATURE UI ELEMENT: TRACE LINE

This should become one of Deadstock's own visual trademarks.

A thin animated line connects:

physical material -> inventory card -> garment region -> collection output.

Color:
use electric blue or yellow depending on state.

Motion:
small traveling dot moves along the path.

On hover:
line becomes brighter and associated objects receive a subtle outline.

On click:
line animation runs from source to output.

This communicates traceability visually rather than through tables alone.

---

# 43. SIGNATURE UI ELEMENT: CONSTRAINT BADGE

Example:

`MAT-ONLY`
`NO NEW FABRIC`
`03 LOOKS`
`STOCK 82%`

Make these look like industrial/fashion production labels.

Use mono text, tiny borders, clipped corners or barcode-style details.

---

# 44. SIGNATURE UI ELEMENT: MATERIAL DNA

Each material can have a small visual identity block:

color strip
texture thumbnail
pattern fingerprint
confidence ring
estimated usable stock

Do not pretend this is a scientifically accurate material fingerprint. Present it as a visualized AI observation/estimate.

---

# 45. AWARD-LEVEL HERO RECIPE

Hero viewport:

LEFT 42%:
large headline

CENTER 35%:
interactive physical-material composition

RIGHT 23%:
technical metadata / project status

Bottom:
scroll progress line

As user scrolls:
headline compresses;
materials move;
metadata changes;
central composition transforms;
next section takes over.

The visitor should feel like they are moving through the product's reasoning process.

---

# 46. WHAT TO AVOID

Do not build:

- generic purple AI SaaS gradients;
- endless glassmorphism;
- rounded cards everywhere;
- dashboard with 8 columns of widgets;
- giant chatbot as the primary interaction;
- excessive neon;
- random 3D blobs;
- meaningless particle fields;
- excessive cursor effects;
- every element animated on page load;
- huge video files above the fold;
- animations that block interaction;
- fake “AI magic” without visible reasoning;
- generic stock fashion imagery unrelated to the material workflow.

The supplied reference is energetic because its visual decisions are art-directed. Do not reproduce its exact composition.

---

# 47. FRONTEND FILE STRUCTURE

Recommended:

```text
src/
  app/
    (marketing)/
      page.tsx
      how-it-works/page.tsx
    lab/
      page.tsx
      scan/page.tsx
      materials/page.tsx
      constraints/page.tsx
      designs/page.tsx
      live/page.tsx
      collection/page.tsx
  components/
    brand/
    editorial/
    materials/
    constraints/
    ai/
    collaboration/
    navigation/
  animations/
    hero.ts
    materialReveal.ts
    collectionScroll.ts
    transitions.ts
  hooks/
    useMaterialScan.ts
    useConstraintState.ts
    useLiveSession.ts
  lib/
    gemini/
    vonage/
    supabase/
    constraints/
  stores/
    projectStore.ts
    uiStore.ts
  types/
    material.ts
    constraint.ts
    design.ts
    collaboration.ts
```

---

# 48. ANIMATION OWNERSHIP RULE

Each animation needs an owner.

### UI state animation
Framer Motion / Motion.

### Scroll narrative
GSAP ScrollTrigger.

### CSS ambient loop
CSS keyframes.

### Canvas/WebGL
Only if a specific visual genuinely requires it.

Do not mix three animation systems for the same element.

---

# 49. FIRST-HOUR IMPLEMENTATION PLAN

### 0–20 min
Create tokens, typography, root layout, dark background, grid.

### 20–40 min
Build hero composition and typography.

### 40–60 min
Add hero scroll choreography.

### 60–90 min
Build MaterialScanner and MaterialCard.

### 90–120 min
Build Inventory + MaterialDetailDrawer.

Do not start with auth or database screens before the visual system exists.

---

# 50. HACKATHON PRIORITY MATRIX

## P0 — must feel excellent

- landing hero;
- material scan;
- inventory;
- constraints;
- AI generation;
- constraint invalidation;
- Vonage live studio;
- final collection;
- signature trace interaction.

## P1

- sophisticated hover states;
- cursor effects;
- advanced page transitions;
- activity history;
- richer material metadata.

## P2

- WebGL fabric simulation;
- advanced 3D garment viewer;
- complicated shader effects;
- deep personalization.

If time is low, cut P2 before touching P0.

---

# 51. 3-MINUTE DEMO CHOREOGRAPHY

### 0:00–0:20
Landing hero.

Headline:
`DESIGN WITH WHAT EXISTS.`

Scroll through the hero transformation.

### 0:20–0:55
Open scanner.

Show 3–5 real materials.

Gemini identifies them.

Approve inventory.

### 0:55–1:20
Lock constraints.

`NO NEW FABRIC`
`03 LOOKS`
`USE VERIFIED STOCK`

Generate concepts.

### 1:20–1:45
Show the best look.

Open Material Trace.

Click jacket body -> MAT-001.
Click trim -> MAT-004.

### 1:45–2:20
Enter Live Studio.

Second participant joins through Vonage.

Human says:
`Remove the satin.`

Record/apply decision.

### 2:20–2:45
MAT-003 disappears.

Affected design lights up.

Constraint engine invalidates it.

Gemini regenerates.

### 2:45–3:00
Show final collection.

Finish with:

> `THE AI DIDN'T IMAGINE NEW MATERIAL.`
> `IT DESIGNED WITH WHAT WE HAD.`

---

# 52. AWWWARDS-LEVEL QUALITY CHECKLIST

Before calling the UI finished, ask:

### Visual
- Does the first viewport have a strong art-directed composition?
- Is the typography confident enough?
- Are materials visually prominent?
- Are the colors distinctive without becoming noisy?
- Does the site still look good with no animation?

### Motion
- Does every animation have a reason?
- Do scroll sequences reveal product logic?
- Are transitions staggered rather than simultaneous?
- Does reduced motion still work?
- Do animations feel physical rather than generic?

### Product
- Can a user understand the core concept in 10 seconds?
- Can the user see what Gemini actually did?
- Can the user see what Vonage actually did?
- Can the user understand constraints?
- Can the user trace a design back to a material?

### Performance
- Is the hero fast?
- Are images optimized?
- Are offscreen sections lazy?
- Are scroll handlers minimal?
- Are animations transform/opacity based where possible?

### Judge test
Show the hero to someone who knows nothing about the project.

After 10 seconds ask:

`What do you think this product does?`

A good answer is:

> “It uses AI to design clothes from real leftover materials.”

If they say:

> “Some kind of AI fashion site.”

the UI failed.

---

# 53. FINAL DESIGN PRINCIPLE

The website is not supposed to merely SAY:

> design with what exists.

The interface should DEMONSTRATE it.

The materials are the inputs.

The constraints are the rules.

The AI is the creative engine.

The humans are the decision-makers.

The design is the output.

The trace is the proof.

The animation should make that entire chain visible.

That is the visual identity of Deadstock Live Lab.

---

# 54. RECOMMENDED TECHNICAL MOTION STACK

Use:

- Next.js + React + TypeScript
- Tailwind CSS
- shadcn/ui for accessible primitives
- Framer Motion / Motion for component interactions and state transitions
- GSAP + ScrollTrigger for premium scroll narratives and pinned scenes
- CSS keyframes for low-cost ambient effects
- SVG for technical lines, trace paths and icon animation

GSAP ScrollTrigger supports scrubbed timelines, pinning, snapping, callbacks and horizontal/vertical modes, which directly maps to the pinned storytelling and material-to-design scenes specified above. citeturn995123search0 Motion provides lightweight scroll-linked and in-view animation primitives for smaller effects. citeturn995123search2turn995123search4

Do not add WebGL merely because award-winning sites sometimes use it. Add it only for a clearly justified hero/material interaction and only after the core experience is complete.

---

# 55. BUILD PHILOSOPHY

The implementation target is:

`AWWWARDS-LEVEL VISUAL IMPACT`
+
`REAL PRODUCT UTILITY`
+
`FAST HACKATHON DEVELOPMENT`
+
`VISIBLE AI REASONING`
+
`REAL COLLABORATION`

The result should look like a premium experimental fashion-tech product while behaving like a trustworthy production tool.
