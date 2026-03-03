# Slidemason — AI Agent Instructions

> These instructions are for **any AI coding agent** (Claude Code, Cursor, GitHub Copilot, Windsurf, etc.)
> working inside this repository. This file is symlinked to `.cursorrules`, `.windsurfrules`, and
> `.github/copilot-instructions.md` so all platforms read the same source.
> Read this file completely before generating or modifying any presentation content.

---

## What This Project Is

Slidemason is a local-first, open-source presentation builder. The monorepo is structured as follows:

| Path | Purpose |
|---|---|
| `packages/renderer/` | Presentation engine with slide transitions |
| `packages/themes/` | 12 CSS themes with 31 variables each |
| `apps/studio/` | Vite-based studio with sidebar workflow |
| `decks/` | Each deck is a folder (e.g. `decks/my-pitch/`) |
| `decks/<slug>/data/` | Source documents (PDFs, markdown, text, etc.) |
| `decks/<slug>/data/assets/` | Content images for slides |
| `decks/<slug>/data/branding/` | Logo file (auto-rendered, don't touch) |
| `decks/<slug>/generated/brief.json` | Brief file produced by the studio |
| `decks/<slug>/slides.tsx` | The deck's slide content |

---

## How to Generate a Presentation

### Step 1: Read All Source Documents

Read **every file** in `decks/<slug>/data/`. Synthesize key themes, metrics, decisions, quotes, and takeaways. Do not skip any file — the user placed it there for a reason.

### Step 2: Read the Brief

Read `decks/<slug>/generated/brief.json` for audience, goal, tone, theme, fonts, and constraints. The brief tells you **who** you are presenting to and **what** the deck should accomplish.

### Step 2b: Check Branding & Images

**Logo and footer are handled automatically by the renderer.** Do NOT manually place logos or footer text in your slides — the framework reads `brief.branding` and overlays them on every slide in the correct position. The logo file is stored in `decks/<slug>/data/branding/` (separate from content images). You can ignore branding entirely when writing slides.

Check `brief.images[]` for content images the user uploaded. Each entry has a `filename` (file in `decks/<slug>/data/assets/`) and a `description` explaining what it is and how the user wants it used. **Also list the `decks/<slug>/data/assets/` directory** — if there are image files (`.png`, `.jpg`, `.svg`, `.webp`) not listed in `brief.images[]`, include them in the deck anyway. They may have been uploaded without a description. Only use images that actually exist on disk — do not invent filenames. Note: `data/assets/` contains only content images — logos are in `data/branding/` and handled automatically.

**VIEW every image before using it.** If you have multimodal capabilities, read/view each image file in `decks/<slug>/data/assets/` so you understand its content, layout, and visual style. This lets you:
- Design the slide layout to complement the image (use `<Split>` to pair image with text, or give the image its own full slide)
- Add primitives alongside the image — headings, captions, callout cards that reference specific elements in the image
- Choose the right sizing — a detailed infographic needs more space than a simple logo or icon

**Image sizing rules — images must NEVER overflow:**

```tsx
// ALWAYS constrain images to fit within the slide
<img
  src="/decks/my-pitch/assets/diagram.svg"
  alt="Architecture diagram"
  style={{
    width: '100%',
    maxHeight: '60cqb',
    objectFit: 'contain',
  }}
/>
```

- **Always set `objectFit: 'contain'`** — this scales the image to fit without cropping
- **Always set `maxHeight`** using `cqb` units (e.g., `60cqb` = 60% of slide height) to prevent vertical overflow
- **Use `width: '100%'`** so the image fills available width but respects its aspect ratio via `object-fit`
- **Leave room for a heading** — if a slide has a heading + image, use `maxHeight: '55cqb'` or less
- **Never set fixed `width` and `height` in pixels** — this breaks on different screen sizes

**Image URLs in slides:** All asset images are served at `/decks/<slug>/assets/<filename>`. Use this URL pattern for all `<img>` tags:

```tsx
// Correct — served by the studio middleware
<img src="/decks/my-pitch/assets/chart.png" alt="Revenue chart"
     style={{ width: '100%', maxHeight: '60cqb', objectFit: 'contain' }} />

// WRONG — filesystem path, not served by Vite
<img src="/decks/my-pitch/data/assets/chart.png" />

// WRONG — API path works but is ugly
<img src="/__api/decks/my-pitch/assets/chart.png" />
```

### Step 3: Plan the Narrative Arc

Plan the deck structure **BEFORE** writing any code. Use this framework:

1. **Hook** — Open with something compelling (a bold stat, provocative question, or surprising insight)
2. **Context** — Set the stage (background, current state, why this matters now)
3. **Problem** — Define the pain points (what is broken, what is at stake)
4. **Vision** — Paint the desired future (where we want to be)
5. **Solution** — Present the approach (how we get there)
6. **Evidence** — Support with data and metrics (proof it works or will work)
7. **Roadmap** — Show the path forward (phases, milestones, timeline)
8. **Ask** — Close with a clear call to action (what you need from the audience)

Not every deck needs all eight beats. Adapt based on the source material and the brief's stated goal.

### Step 3a: Read Creative License Level

Read `brief.agentLatitude` to determine how much creative freedom you have. This controls your entire approach to interpreting the source material:

- **Faithful** — Use the source material's own language, structure, and framing. Organize and design the content but do not rewrite arguments, add new angles, or editorialize. The user's words are the deck's words. Your job is layout, visual design, and clear presentation — not content creation.

- **Collaborative** (default) — Synthesize across source documents, fill logical gaps, and strengthen weak arguments. Add context the audience needs that may not be explicit in the sources. Suggest better framing where you see opportunity. The user's intent drives the deck, but you improve the delivery.

- **Expert** — Take strong editorial ownership. Reframe arguments for the target audience. Challenge weak points, cut fluff, restructure for maximum persuasive impact, and add industry context that strengthens the case. The user's goal drives the deck, but you own the storytelling. You may reorganize the narrative arc significantly if it serves the goal better.

**Regardless of creative license level — data sourcing rules:**

1. **Source documents are your primary source of truth.** Numbers, metrics, and claims from `decks/<slug>/data/` can be used directly. Do NOT cite them with `<Source>` — they are the user's own material and linking to local file paths is meaningless in an exported PDF.
2. **You are encouraged to research externally** to strengthen the story. Use your web search, documentation lookup, or any other tools available to you to find supporting industry data, market stats, benchmarks, or context that makes the deck more compelling.
3. **Only cite external web sources with `<Source>`.** The `<Source>` primitive is exclusively for data you found via search tools — it must have a real `href` to a public web URL. Never use `<Source>` to link to local files, repo paths, or the user's uploaded documents.
   ```tsx
   <StatBox value="340%" label="Agent adoption YoY" />
   <Source href="https://gartner.com/report-2026">Gartner Emerging Tech Report, Jan 2026</Source>
   ```
4. **Never invent data.** If you can't find a real source for a number, use qualitative language instead ("significant growth", "industry-leading") rather than fabricating a figure. An unsourced number destroys credibility.

### Step 3b: Plan Animation & Interaction

After planning the narrative arc, decide where animation and interaction serve the story:

- **Animation budget:** Aim for 3-5 animated moments per 15-slide deck. Each should have a reason.
- **Interaction budget:** 1-3 interactive slides per deck. Each should let the presenter control pacing or reveal depth.
- **Write this plan as comments at the top of slides.tsx** before writing any JSX.

Most slides should be static — instant, confident, and let the content speak. Reserve animation for moments that need emphasis: a key stat landing, a reveal that builds tension, a transition that signals a shift in the narrative.

### Step 4: Design and Write the Slides

Edit `decks/<slug>/slides.tsx`. Each slide is **bespoke JSX** — a unique design tailored to its specific content. Import from `@slidemason/primitives`, `lucide-react`, and optionally `framer-motion`. Use primitives for layout and typography. Use the animation toolkit when animation serves the narrative. Use the interaction toolkit when the presenter needs to control pacing. Use Tailwind classes and theme CSS variables for any custom styling.

```tsx
import {
  Slide, Heading, Text, Badge, Card, GradientText,
  GhostNumber, Divider, IconCircle, StatBox, Step, List, Rating, Pipeline,
  Grid, Split, Stack, Row, Spacer, ColorBar, Source,
  Animate, CountUp, Stagger, TypeWriter, ProgressReveal,
  Tooltip, ClickReveal, Tabs, Flipcard,
} from '@slidemason/primitives';
import { Radio, Brain, Bell, ShieldCheck } from 'lucide-react';

const slides = [
  // Static slide — no animation needed, content speaks for itself
  <Slide key="s1" layout="center" bg="mesh">
    <Badge>Company · Stage · Context</Badge>
    <GradientText size="hero">Product Name</GradientText>
    <Text muted style={{ maxWidth: '28ch' }}>
      Tagline goes here
    </Text>
  </Slide>,

  // Animated stat — CountUp lands the number with impact
  <Slide key="s2" layout="center">
    <Animate effect="fade-up">
      <Heading>Revenue Growth</Heading>
    </Animate>
    <CountUp to={2.3} prefix="$" suffix="M" decimals={1} />
  </Slide>,

  // Interactive — presenter clicks to reveal each point
  <Slide key="s3" layout="free">
    <Heading>Three Pillars</Heading>
    <ClickReveal prompt="Click to reveal first pillar">
      <Card><Text>Platform reliability</Text></Card>
    </ClickReveal>
  </Slide>,
];

export default slides;
```

> **Key principle:** Nothing animates by default. Animation and interaction are narrative tools — use them to direct attention, build tension, or let the presenter control pacing.

### Step 5: Validate the Deck

After writing `slides.tsx`, validate that all slides render without errors:

```bash
curl http://localhost:4200/__api/decks/<slug>/validate
```

A successful response looks like `{ "valid": true, "slideCount": 15 }`. If any slide fails, the response includes an `errors` array with the slide index and error message. Fix the errors and re-validate.

**Common validation failures:**
- Invalid `ratio` on `<Split>` — the primitive falls back to `50/50`, but fix the source to use a valid value
- Invalid `effect` on `<Animate>` or `<Stagger>` — falls back to `fade-up`
- Missing required array props on `<Accordion>`, `<DataTable>`, `<Tabs>`, etc.
- Using `framer-motion` features that don't work in SSR (avoid `useMotionValue` at module scope)

### Step 6: Report Completion

After validation passes, tell the user their deck is ready using this exact format:

```
Your deck is ready! Refresh the browser to see it:

  http://localhost:4200/#<slug>

**Deck summary:**
- <N> slides, theme: <theme name>
- Narrative arc: <1-line summary of the story flow>
- Animated moments: <count> (list which slides)
- Interactive elements: <count> (list which slides)

**To review your deck properly:**
1. Close the sidebar (click ✕ or collapse it) — slides render at ~70% width with it open
2. Click the expand icon (⤢) in the top-right corner of the slide area to enter fullscreen
3. Use arrow keys or the nav controls to browse slides at true presentation size
This is how the PDF export and presented mode will look. Text or layouts that seem small in the sidebar view are often fine at full size — always check fullscreen before requesting changes.

**What you can do next:**
- Browse slides in fullscreen to review the full deck
- Reopen the sidebar to click "Export PPTX" or "Export PDF" to download
- Ask me to tweak wording, visuals, or layout on any slide
```

Always use this format so users get a consistent, actionable completion message regardless of which AI tool built the deck.

---

## Design Principles — FOLLOW THESE

**Think like a cinematic director, not a report writer.** Every slide should feel hand-designed for its content. No two slides should look the same.

1. **Every slide is bespoke.** Design a unique layout for each slide's specific content. Never reuse the same layout pattern on consecutive slides.
2. **Cinematic typography.** Headlines at `text-6xl` to `text-8xl`. Generous whitespace. Let content breathe. Use `clamp()` with `cqi` units for responsive sizing.
3. **Glass cards for grouped content.** Use `var(--sm-glass-bg)` background + `backdrop-blur-sm` + `1px solid var(--sm-border)` for card containers. Round with `var(--sm-radius)`.
4. **Gradient text for short phrases only.** `<GradientText>` is for punchy titles and short statements (max 6-8 words). NEVER use it for sentences or paragraphs — the large font size will overflow the slide. For longer text, use `<GradientText>` for the short title and `<Text>` for the explanation below it.
5. **Animation with purpose.** Nothing animates by default. Use `<Animate>` wrapper or `<Stagger>` only when animation serves the narrative — to land a stat, build tension, or signal a shift. A static slide is often stronger than an animated one.
6. **Icons as visual anchors.** Lucide icons at 32-48px, colored with theme variables. Every content slide should have icons to break up text.
7. **Theme variables only — never hardcode colors.** All colors come from `var(--sm-*)` CSS variables. This ensures every theme works.
8. **Color must carry meaning.** When using accent colors on cards (via `<ColorBar>`, `borderTop`, `borderLeft`, etc.), every color must communicate something intentional. Three valid strategies:
   - **Status**: `--sm-success` = good/positive, `--sm-warning` = caution/at-risk, `--sm-danger` = bad/negative
   - **Uniform**: All items the same color (e.g., all `--sm-primary`) when they are equal/parallel concepts
   - **Category**: Different colors to show groupings (e.g., `--sm-primary` for infrastructure items, `--sm-secondary` for platform items, `--sm-accent` for semantic items)
   Never mix colors arbitrarily. If 6 of 8 cards are blue and 2 are purple with no reason, that's confusing — make them all blue or group them by meaning. Use `--sm-chart-1` through `--sm-chart-6` when you need 3+ distinct category colors.
9. **Ghost numbers on section dividers.** A massive faded number (text-[12rem], opacity 5-10%) positioned behind the section title. Creates depth.
9. **Lists when they work, cards when they don't.** Use `<List>` for bullet-heavy content — it handles spacing, markers, and density automatically. Use icon card grids for feature comparisons and visual breakdowns. Use `<List ordered>` for sequential steps. Choose the format that best serves the content.
10. **Container query sizing.** All text uses `clamp(min, Ncqi, max)` with container query units. Never use `vw`/`vh` — always use `cqi` (width-relative) or `cqb` (height-relative) so sizing works in any container.
11. **Alternate layout density.** Follow a dense, data-heavy slide with a spacious, breathing slide. Rhythm matters.
12. **Maximum visual variety.** Never repeat the same layout pattern on consecutive slides. Alternate between centered, split, grid, and asymmetric layouts.
13. **Interaction with intent.** Interactive elements serve the presenter's flow. Use `<ClickReveal>` to let them build an argument piece by piece. Use `<Tooltip>` to hide detail until needed. Use `<Tabs>` when one slide has multiple angles. Most slides won't need interaction.
14. **Full React power in deck files.** You can import `framer-motion`, use `useState`/`useEffect`, and build custom interactive components. The primitive toolkit covers common cases; write custom React when it doesn't.

---

## Readability & Accessibility Rules

Every slide must be readable at a glance. If a viewer has to squint, the slide has failed.

### Minimum Font Sizes — 14px (0.875rem) Absolute Floor

**Every primitive enforces a minimum of `0.875rem` (14px).** Nothing on any slide renders below this size. All `clamp()` values in the primitives have `0.875rem` as the first parameter.

| Element | Minimum | Recommended | Example |
|---|---|---|---|
| Hero / title text | `clamp(2rem, 7cqi, 5rem)` | `text-6xl` to `text-8xl` | Slide titles, section headers |
| Body / content text | `clamp(0.875rem, 1.7cqi, 1.2rem)` | `text-lg` to `text-xl` | Bullet points, descriptions |
| Captions / labels | `clamp(0.875rem, 1.1cqi, 0.95rem)` | `text-sm` to `text-base` | Badges, footnotes, presenter name |
| **Absolute minimum** | **`0.875rem` (14px)** | — | Nothing on any slide may render below this |

**Text size selection rule:** Use `size="sm"` (not `"xs"`) for all card body text, descriptions, and supporting content. `size="xs"` is reserved for truly decorative labels — badge text, pipeline sub-labels, footnote annotations. If the text communicates information the audience needs to read, it must be `"sm"` or larger. When in doubt, use `"sm"`.

### Writing Concise Content for Readability

Because the 14px floor means text takes up more space, **write shorter**. The primitives enforce readability — your job is to make content fit at that readable size.

- **Card descriptions:** 1-2 short sentences max. Cut filler words. Lead with the key point.
- **Bullet points:** 8-12 words each. No complete sentences — use fragments that scan fast.
- **Stat labels:** 2-3 words (e.g., "Monthly Revenue", "Active Users", "Churn Rate").
- **Badge text:** 3-5 words max (e.g., "Pre-Seed · Q1 2026").
- **Table cells:** Keep cell content to 2-4 words. Use abbreviations where clear (e.g., "Y" / "N", "$2.1M").
- **Pipeline sub-labels:** 2-3 words max per step.

**If content doesn't fit at 14px, the content is too long — not the font too large.** Edit the text down rather than trying to shrink fonts. Split across two slides if needed.

### Gradient Text Readability

- **Both** gradient endpoint colors must have WCAG AA contrast (4.5:1) against the slide background.
- Never gradient from a readable color to one that blends into the background (e.g. cyan → dark blue on a dark slide).
- Test by imagining each color rendered as solid text — if either is unreadable, pick a different gradient.

### Color Contrast

- All text must pass WCAG AA contrast (4.5:1) against its immediate background.
- `var(--sm-muted)` text must still be clearly readable — if it's not, use `var(--sm-text)` instead.
- Text on glass cards (`var(--sm-glass-bg)`) must contrast against both the glass tint and whatever is behind it.

### Footer & Attribution

- Presenter name: use `<Text size="sm">` minimum, never raw inline styles with tiny font sizes.
- Classification / footer text: `0.875rem` minimum, `var(--sm-muted)` color, never below 14px.
- These elements should be small but comfortably readable, not microscopic.

### Reviewing & Exporting Your Deck

**Always expand slides before reviewing.** The studio sidebar takes ~30% of the viewport, so slides render at ~70% width in the default view. Content that looks clipped or too small in the sidebar view may be fine at presentation size — and vice versa. Click the expand button (⤢) on any slide to see it at true presentation dimensions. This is what the PDF and presented mode will look like.

**When iterating with an AI agent:** Tell the agent what you see in the *expanded* view, not the sidebar thumbnail. The agent designs for presentation-size containers, not sidebar-width panels. If text looks too small, expand first — it may be fine at full size.

**PDF export** captures the current runtime state — theme, fonts, and all slide content as rendered in the browser. If you've changed the theme via the picker, the PDF reflects that change immediately. The export renders each slide at 2x resolution (192 DPI effective) via headless Chromium, so what you see in fullscreen is what the PDF will look like.

---

## Responsive Design — CSS Container Queries

Slides use **CSS Container Query units** (`cqi`/`cqb`) so all sizing resolves against the slide container, not the browser viewport. `SlideLayout` sets `container-type: size`, making every child's `cqi` (container inline/width) and `cqb` (container block/height) units relative to the slide's actual dimensions. This works correctly whether the slide is fullscreen, in a studio panel beside a sidebar, or in a small preview thumbnail.

**Why not `vw`/`vh`?** Viewport units resolve against the browser window. In the studio, slides render in a panel that's narrower than the full window — `vw` would make fonts too large for the actual available space. Container query units solve this by measuring the slide container itself.

### How Sizing Works

All primitives use `clamp(min, preferred-cqi, max)`:
- **`min`** — absolute floor (`0.875rem` / 14px for all text) so text is always readable
- **`preferred`** — scales with container width (e.g., `1.7cqi` = 1.7% of container width)
- **`max`** — cap so text doesn't grow too large on big screens
- **`cqb`** — used for height-dependent values (e.g., `<Spacer>` vertical spacing)

### Responsive-by-Default Primitives

Layout primitives automatically adapt to narrow containers — no opt-in props needed:

| Primitive | Default Behavior |
|---|---|
| `<Grid>` | `responsive={true}` — columns auto-collapse via `auto-fit` |
| `<Split>` | `stackOnNarrow={true}` — panels stack vertically when narrow |
| `<Pipeline>` | `responsive={true}` — items wrap on narrow containers |
| `<Spacer>` | Compresses when space is tight (`flex-shrink` enabled) |
| `<DataTable>` | Horizontal scroll if content overflows |

Set `responsive={false}` or `stackOnNarrow={false}` only when you explicitly need fixed columns/panels.

### Content Density Rules — CRITICAL

**Overflowing a slide is a bug.** If content exceeds the slide boundary it gets clipped and looks broken. The slide is rendered in a panel that may be narrower than you expect (sidebar open = ~70% of viewport). Design for that narrower width, not fullscreen.

| Constraint | Hard Limit |
|---|---|
| Cards in a grid | Max 4 per row — use `cols={3}` or `cols={4}`. For 5+ items, use two rows (e.g., `cols={3}` with 6 items) |
| Items in a pipeline | Max 5 steps |
| Text lines per card | Max 3 lines (title + 1-2 description lines) at `size="sm"` |
| StatBoxes per slide | Max 4 in a single row |
| Charts per slide | Max 1 chart — never combine a chart with stat cards on the same slide |
| Heading size for content-heavy slides | Use `"lg"` not `"hero"` |
| Card padding for dense layouts | Use `pad="sm"` |
| Split slide total elements | Max 1 heading + 1 text block + 1 visual per panel |
| Spacers on dense slides | Use `"sm"` or omit entirely — never `"lg"` or `"xl"` |

**Use available width AND height.** Body text, subtitles, and descriptions should use the full slide width. Do not set `maxWidth` below `70cqi` on body text — narrow text columns waste space and push content below the fold. Let text flow naturally to 2 lines across the full width rather than wrapping to 4+ lines in a narrow column. Similarly, use the vertical space — if a slide has a large empty gap at the bottom, the text is too small or the layout is too compressed. Use `size="sm"` or `size="md"` text (not `"xs"`) so content fills the slide naturally.

**Prefer horizontal layouts.** Cards, stats, and steps should be in a single horizontal row (`<Grid cols={N}>` or `<Row>`) rather than stacked vertically. Vertical stacking eats height fast. A `<Grid cols={4}>` row of compact cards fits easily; the same 4 cards stacked vertically will overflow. But don't pack more than 4 items in a single row — 6+ items in one row shrinks each too small. Use `<Grid cols={3}>` or `<Grid cols={4}>` with two rows instead.

**Minimize Spacers.** The `<Slide>` component already provides gap between flex children. Only add `<Spacer size="sm">` when you need an intentional visual break between sections. Never use Spacers inside cards (the card's own padding handles spacing). Unnecessary Spacers steal vertical space from content.

**The #1 slide layout mistake:** putting a heading + body text + spacer + cards + another spacer + a second content block on one slide. This ALWAYS overflows. Instead:
- **Slide A:** Heading + the primary content block (cards or stats)
- **Slide B:** The secondary content block with its own heading

A second slide is always better than clipped or scrolling content.

**Split layout golden rule:** Each panel in a `<Split>` gets roughly half the slide height. Do not put more than 3-4 elements (heading + text + one visual component) in a single panel. If you need a heading, stat boxes, AND a chart — use a full-width slide layout instead of Split.

**Slide self-check:** Before writing each slide, mentally count the vertical elements. Heading + text + spacer + 3 cards + spacer + another card = 7 vertical blocks. That will overflow. Either remove a spacer and flatten to a single grid, or split into two slides.

---

## Slide Primitives (`@slidemason/primitives`)

When generating slides, **always use primitives** instead of raw `<div>` + inline styles. This dramatically reduces code size and ensures consistent theming.

### Visual Atoms (no animation — instant render)

| Component | Purpose | Example |
|---|---|---|
| `<Slide layout bg?>` | Slide wrapper | `<Slide layout="center" bg="mesh">` |
| `<Heading size?>` | Themed heading | `<Heading size="hero">Title</Heading>` |
| `<Text size? muted?>` | Body paragraph | `<Text muted>Subtitle</Text>` |
| `<Badge>` | Glass pill label | `<Badge>Pre-Seed · Q1 2026</Badge>` |
| `<Card glass? pad?>` | Glass card container | `<Card pad="lg">content</Card>` |
| `<StatBox icon? value label color?>` | Metric display | `<StatBox icon={Wifi} value="200K+" label="Signals" />` |
| `<IconCircle icon size? active? color?>` | Icon in circle | `<IconCircle icon={Brain} size="lg" />` |
| `<GradientText size? as?>` | Gradient-clipped text | `<GradientText size="hero">Title</GradientText>` |
| `<GhostNumber n>` | Faded background number | `<GhostNumber n={3} />` |
| `<Divider width?>` | Gradient horizontal rule | `<Divider />` |
| `<Step n active?>` | Numbered step | `<Step n={1} active>First</Step>` |
| `<List items ordered? icon? size? gap?>` | Themed bullet/ordered list | `<List items={[{text: 'First', sub: 'Detail'}]} />` |
| `<Rating label value max? color?>` | Inline score with bar | `<Rating label="Ease of Use" value={4} max={5} />` |
| `<Pipeline items responsive?>` | Horizontal process flow | `<Pipeline items={[{icon, label, sub}]} />` |
| `<Chart type data>` | Bar/line/area/pie chart | `<Chart type="bar" data={[...]} series={['rev']} />` |
| `<DataTable headers rows>` | Themed data table | `<DataTable headers={['Q','Rev']} rows={[['Q1','$2M']]} />` |
| `<Source href?>` | Citation / attribution | `<Source href="https://...">Gartner, 2025</Source>` |

### Layout Atoms

| Component | Purpose | Example |
|---|---|---|
| `<Grid cols gap? responsive?>` | CSS grid shorthand | `<Grid cols={3} gap="md">` |
| `<Split ratio? reverse? stackOnNarrow?>` | Two-panel flex layout | `<Split ratio="40/60">` |
| `<Stack gap? align?>` | Flex column | `<Stack gap="lg" align="center">` |
| `<Row gap? align? wrap?>` | Flex row | `<Row gap="sm">` |
| `<Spacer size?>` | Intentional whitespace | `<Spacer size="lg" />` |
| `<ColorBar color? position?>` | Accent stripe on cards | `<ColorBar color="var(--sm-primary)" />` |

### Animation Toolkit (opt-in — use only when narratively warranted)

| Component | Purpose | Example |
|---|---|---|
| `<Animate effect? delay? duration?>` | Wrap any element to animate it | `<Animate effect="fade-up" delay={0.3}>` |
| `<CountUp to prefix? suffix?>` | Animated number counter | `<CountUp to={500} prefix="$" suffix="M" />` |
| `<TypeWriter text speed?>` | Character-by-character text | `<TypeWriter text="We need to act now." />` |
| `<Stagger interval? effect?>` | Stagger children entrance | `<Stagger interval={0.15}>` |
| `<ProgressReveal value label?>` | Animated progress bar | `<ProgressReveal value={73} label="Done" />` |

### Interaction Toolkit (presenter-driven — use when interaction serves the story)

| Component | Purpose | Example |
|---|---|---|
| `<Tooltip content>` | Hover tooltip | `<Tooltip content="$2.3M ARR">` |
| `<HoverCard hoverContent>` | Card with hover detail | `<HoverCard hoverContent={<Text>...</Text>}>` |
| `<HoverHighlight>` | Dims siblings on hover | Wraps a group of children |
| `<ClickReveal prompt?>` | Hidden until click | `<ClickReveal prompt="Click to see">` |
| `<Tabs items>` | Tabbed panels | `<Tabs items={[{label, content}]}>` |
| `<Accordion items>` | Expandable sections | `<Accordion items={[{title, content}]}>` |
| `<Flipcard front back>` | Click to flip | `<Flipcard front={...} back={...}>` |
| `<BeforeAfter before after>` | Toggle two states | `<BeforeAfter before={...} after={...}>` |
| `<Sortable items>` | Draggable reorder list | `<Sortable items={[{id, content}]}>` |
| `<Spotlight>` | Click through focused items | Wraps a group of children |

### Slide Layouts

- `free` — **top-aligned** flex column (default — use for all content slides: headings, cards, grids, data)
- `center` — **vertically centered** flex column (hero slides, section breaks, statement slides)
- `split` — two-panel 35/65 split
- `grid` — auto-grid based on children, vertically centered
- `statement` — centered with extra breathing room

**Layout choice rule:** If the slide has a heading + content flowing downward, use `layout="free"`. If the slide is a title card, section break, or single statement, use `layout="center"`. Content slides should **never** use `layout="center"` — it creates gaps above and below the content that waste vertical space.

### Size Props

| Component | Sizes |
|---|---|
| `Heading` | `"md"` \| `"lg"` \| `"hero"` |
| `Text` | `"xs"` \| `"sm"` \| `"md"` |
| `GradientText` | `"md"` \| `"lg"` \| `"hero"` \| `"stat"` |
| `Card` pad | `"sm"` \| `"md"` \| `"lg"` |
| `IconCircle` | `"sm"` \| `"md"` \| `"lg"` |
| `List` size | `"sm"` \| `"md"` |
| `List` gap | `"xs"` \| `"sm"` \| `"md"` |
| `Rating` max | default `5` (any positive number) |
| `Chart` type | `"bar"` \| `"line"` \| `"area"` \| `"pie"` |
| `DataTable` | default \| `compact` |

### Valid Constrained Props

These props only accept specific values. Invalid values fall back to the default but should be fixed.

| Component | Prop | Valid Values | Default |
|---|---|---|---|
| `Split` | `ratio` | `'35/65'` `'40/60'` `'50/50'` `'60/40'` `'65/35'` | `'35/65'` |
| `Animate` | `effect` | `'fade-up'` `'fade-down'` `'fade-left'` `'fade-right'` `'scale'` `'blur-in'` `'slide-left'` `'slide-right'` | `'fade-up'` |
| `Stagger` | `effect` | `'fade-up'` `'fade-down'` `'scale'` | `'fade-up'` |
| `Slide` | `layout` | `'center'` `'split'` `'grid'` `'statement'` `'free'` | `'free'` |
| `Slide` | `bg` | `'none'` `'mesh'` | `'none'` |
| `Grid` | `gap` | `'sm'` `'md'` `'lg'` | `'md'` |
| `Stack` | `gap` | `'xs'` `'sm'` `'md'` `'lg'` `'xl'` | `'md'` |
| `Row` | `gap` | `'xs'` `'sm'` `'md'` `'lg'` | `'md'` |
| `Spacer` | `size` | `'sm'` `'md'` `'lg'` `'xl'` | `'md'` |

### Rules for Primitives

1. **Animation is opt-in** — wrap elements in `<Animate>` or `<Stagger>` only when narratively warranted
2. **You CAN import `framer-motion`** — for custom animations beyond what the toolkit provides
3. **You CAN use React hooks** — `useState`, `useEffect`, etc. for custom interactions
4. **`style` prop for overrides only** — most styling is handled by props
5. **Still use `var(--sm-*)` for colors** — primitives use theme vars internally
6. **Use layout atoms** — prefer `<Grid>`, `<Split>`, `<Stack>`, `<Row>` over manual CSS flex/grid

---

## Theme Variable Reference

All 12 themes define these CSS custom properties. Use them for ALL colors:

| Variable | Purpose | Sunset Example |
|---|---|---|
| `--sm-bg` | Page background | `#1e1b4b` |
| `--sm-surface` | Card/container background | `#312e81` |
| `--sm-text` | Primary text color | `#fef3c7` |
| `--sm-muted` | Secondary/subtle text | `#a5b4fc` |
| `--sm-primary` | Brand/accent color | `#f97316` |
| `--sm-secondary` | Second accent color | `#ec4899` |
| `--sm-accent` | Highlight color | `#fbbf24` |
| `--sm-border` | Border color | `#3730a3` |
| `--sm-glass-bg` | Glassmorphic background | `rgba(49,46,129,0.7)` |
| `--sm-gradient-start` | Gradient start | `#f97316` |
| `--sm-gradient-end` | Gradient end | `#ec4899` |
| `--sm-gradient-mesh-1/2/3/4` | Mesh gradient colors | (theme-specific) |
| `--sm-chart-1` through `--sm-chart-6` | Data visualization colors | (theme-specific) |
| `--sm-success` | Positive status | `#22c55e` |
| `--sm-warning` | Caution status | `#fbbf24` |
| `--sm-danger` | Negative status | `#ef4444` |
| `--sm-shadow-sm/md/lg` | Shadow values | (theme-specific) |
| `--sm-radius` | Border radius | `0.5rem` |
| `--sm-mono-font` | Monospace font | `JetBrains Mono` |

---

## Animation & Interaction Recipes

> **Note:** The animation and interaction toolkits cover most common cases. These recipes are for **custom animations** when you import `framer-motion` directly in deck files.

**When to use the toolkit vs. custom:**
- Toolkit `<Animate effect="fade-up">` — standard entrance effects, no boilerplate
- Toolkit `<CountUp>`, `<TypeWriter>` — purpose-built effects
- Custom `motion.div` — complex choreography, physics springs, layout animations, or anything the toolkit doesn't cover

```tsx
// Custom spring entrance (for playful moments)
<motion.div
  initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
  animate={{ opacity: 1, scale: 1, rotate: 0 }}
  transition={{ type: 'spring', damping: 15 }}
>

// Custom stagger with different effects per child
{items.map((item, i) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: i * 0.2 }}
  />
))}

// Layout animation (for interactive reordering)
<motion.div layout transition={{ type: 'spring', damping: 25 }}>

// Custom interaction (timer, calculator, etc.)
function LiveTimer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return <Heading>{seconds}s</Heading>;
}
```

---

## Research & Data-Heavy Decks

Not every presentation follows a pitch narrative. Research, analysis, and status decks need a different structure and heavier use of data primitives.

### Alternative Narrative Arc

For research and data-driven decks, use this arc instead of the pitch framework:

1. **Context** — Why this research matters now
2. **Hypothesis** — What we set out to prove or discover
3. **Data** — Key metrics and measurements (use `<Chart>` and `<DataTable>`)
4. **Analysis** — What the data tells us (use `<StatBox>` for callout metrics)
5. **Findings** — Conclusions drawn from the analysis
6. **Implications** — What this means for the audience
7. **Recommendations** — Concrete next steps

### When to Use Each Data Primitive

| Primitive | Best for | Example |
|---|---|---|
| `<Chart type="bar">` | Comparing categories | Revenue by region, feature usage counts |
| `<Chart type="line">` | Showing trends over time | Monthly growth, performance over quarters |
| `<Chart type="area">` | Cumulative trends | Total users, stacked revenue streams |
| `<Chart type="pie">` | Part-of-whole breakdown | Market share, budget allocation |
| `<DataTable>` | Exact comparisons | Feature matrices, quarterly metrics, pricing tiers |
| `<StatBox>` | Single headline metric | "45% growth", "$2.3M ARR", "99.9% uptime" |
| `<Rating>` | Inline score with bar (compact) | "Technology: 4/5", "Ease of Use: 3/5" |
| `<List>` | Bullet/ordered text lists | Pros/cons, findings, requirements |
| `<ProgressReveal>` | Single percentage | Completion rate, goal progress |

### Data Density Rules

- **Max 1 chart + 1 supporting element per slide** (e.g., chart + a row of StatBoxes)
- **Max 1 table per slide** — tables need room to breathe
- **Use `<Chart>` for trends and patterns**, `<DataTable>` for exact values and comparisons
- **Follow a data-heavy slide with a breathing slide** — a key takeaway or implication slide
- **Use `highlight` on DataTable rows** to draw attention to the most important data points

### Chart Usage

```tsx
// Bar chart — comparing categories
<Chart
  type="bar"
  data={[
    { quarter: 'Q1', revenue: 2.1, costs: 1.4 },
    { quarter: 'Q2', revenue: 3.2, costs: 1.8 },
    { quarter: 'Q3', revenue: 4.1, costs: 2.0 },
  ]}
  xKey="quarter"
  series={['revenue', 'costs']}
/>

// Line chart with axes — showing a trend
<Chart type="line" data={monthlyData} xKey="month" series={['users']} showAxes />

// Pie chart — part of whole
<Chart
  type="pie"
  data={[
    { label: 'Enterprise', value: 45 },
    { label: 'SMB', value: 35 },
    { label: 'Consumer', value: 20 },
  ]}
/>
```

### DataTable Usage

```tsx
// Simple comparison table
<DataTable
  headers={['Metric', 'Q1', 'Q2', 'Q3', 'Q4']}
  rows={[
    ['Revenue', '$2.1M', '$3.2M', '$4.1M', '$5.0M'],
    ['Users', '12K', '28K', '45K', '67K'],
    ['Churn', '4.2%', '3.1%', '2.8%', '2.1%'],
  ]}
  highlight={[0]}
/>

// Compact table for dense data
<DataTable
  headers={['Feature', 'Us', 'Competitor A', 'Competitor B']}
  rows={[
    ['API Access', 'Yes', 'Yes', 'No'],
    ['SSO', 'Yes', 'Enterprise only', 'No'],
    ['Custom Reports', 'Yes', 'No', 'Yes'],
  ]}
  compact
/>
```

---

## Evaluation & Comparison Decks

When `brief.contentFocus` is "Evaluation", the deck is a structured assessment — not a narrative. PoC reports, vendor evaluations, option comparisons, and audit findings all follow this pattern. The key difference: **repeated layouts are expected and intentional** so the audience can compare options apples-to-apples. Design principles #1 and #12 ("never repeat layouts") are suspended for evaluation slides.

### Evaluation Narrative Arc

1. **Agenda** — What's being evaluated, structure of the deck, and evaluation criteria
2. **Executive Summary** — Top-line findings and overall recommendation (1 slide)
3. **Criteria** — The evaluation framework — what's being measured and why (optional — can be folded into Agenda)
4. **Evaluation 1…N** — One slide per option/tool/candidate. Use the **same layout** for each so the audience can compare. Each evaluation slide typically has:
   - A heading with the option name + an overall score (`<StatBox>`)
   - A two-column pros/cons layout (`<Split ratio="50/50">`)
   - Bullet lists in each column (`<List>` primitive)
   - A rating grid at the bottom (`<Rating>` rows in a `<Stack>`)
5. **Comparison** — Side-by-side summary of all options (`<DataTable>` or `<Grid>` of `<Rating>` stacks)
6. **Recommendation** — Final verdict, reasoning, and next steps

### Evaluation Slide Recipe

```tsx
// Standard evaluation slide — reuse this layout for each option
<Slide key="eval-1" layout="free">
  <Row gap="md" align="center">
    <Heading size="lg">Option A: Aible</Heading>
    <StatBox value="75%" label="Overall" style={{ padding: '0.5rem 1rem' }} />
  </Row>
  <Spacer size="sm" />
  <Split ratio="50/50">
    <Card pad="sm" glass>
      <Text size="sm"><strong>What went well</strong></Text>
      <List size="sm" gap="xs" items={[
        { text: <><strong>PDF handling</strong> — Works well with document sets</> },
        { text: <><strong>Serverless scaling</strong> — Vector DB handles growth</> },
        { text: <><strong>Ease of use</strong> — No GenAI expertise needed</> },
      ]} />
    </Card>
    <Card pad="sm" glass>
      <Text size="sm"><strong>What didn't go well</strong></Text>
      <List size="sm" gap="xs" items={[
        { text: <><strong>Performance</strong> — 2-3 min response times</> },
        { text: <><strong>Errors</strong> — Unexplained LLM processing failures</> },
        { text: <><strong>Format limits</strong> — .doc/.docx not supported well</> },
      ]} />
    </Card>
  </Split>
  <Spacer size="sm" />
  <Grid cols={4} gap="sm">
    <Rating label="Technology" value={4} />
    <Rating label="Ease of Use" value={5} />
    <Rating label="Accuracy" value={4} />
    <Rating label="Performance" value={3} />
  </Grid>
</Slide>
```

### Relaxed Density Rules for Evaluation / Text-Forward Decks

When `brief.visualStyle` is "Text-forward" or `brief.contentFocus` is "Evaluation", the standard content density limits are relaxed:

| Constraint | Standard Limit | Relaxed Limit |
|---|---|---|
| Cards in a grid | Max 4 | Up to 6 (3x2) |
| Text lines per card | Max 2 | Up to 5 |
| `<List>` items per card | N/A | Up to 6 items |
| `<Rating>` rows per slide | N/A | Up to 8 |
| Repeated layouts | Never consecutive | Expected for evaluation slides |

**Use `<List>` for bullet-heavy content** instead of stacking multiple `<Text>` elements — it handles spacing, markers, and density automatically.

**Use `<Rating>` for inline scores** instead of `<StatBox>` — StatBox is designed for hero metrics and takes too much space for dense rating grids. Rating rows are compact enough to stack 6-8 per slide.

**Minimum text sizes on dense slides.** When using relaxed limits (6 cards, 5 lines per card), body text in cards must use `<Text size="sm">` or `<List size="sm">` — never `size="xs"`. The `xs` size is designed for single-line captions, not multi-line card content. On a 6-card grid, `xs` body text becomes unreadable in PDF export. Similarly, avoid `<DataTable compact>` with more than 5 columns — the header and cell text shrinks below comfortable reading size. Split wide tables across two slides or use a non-compact DataTable.

---

## Layout Patterns

These are **examples to inspire**, not rigid templates. Combine and remix freely.

**Hero** — Centered stack, gradient title, optional badge above, subtitle below. Full breathing room.

**Split** — 50/50 flex layout. Content (text + bullets as icon rows) on one side, visual panel (icon grid, illustration, or decorative element) on the other. Alternate left/right between slides.

**Card Grid** — 2x2 or 3-column grid of glass cards. Each card has an icon (32-48px), a title, and 1-2 lines of description. Stagger the entrance animation.

**Statement** — Single large number or quote, centered, with a decorative background effect (radial gradient, mesh, or geometric pattern using CSS).

**Data Wall** — 3-4 large metric boxes in a row. Each box shows a big number (text-5xl+) with a label below. Color-coded using `--sm-chart-*` variables.

**Section Break** — Ghost number (text-[12rem], 5-10% opacity) positioned absolutely behind the title. Small subtitle below. Creates visual rhythm between sections.

**Timeline** — Horizontal or vertical connected steps. Each step is a glass card with a status indicator (colored dot or icon). Connected by a thin line using `--sm-border`.

**Comparison** — Two columns with contrasting accent colors (e.g., `--sm-danger` for "before" and `--sm-success` for "after"). Each column is a glass card.

---

## Available Themes

The following themes can be specified in the brief. They are applied automatically by the renderer:

`midnight` · `slate` · `canvas` · `signal` · `noir` · `dawn` · `boardroom` · `neon` · `forest` · `glacier` · `sunset` · `paper`

---

## Critical Rules

1. **NEVER modify files in `packages/renderer/`, `packages/primitives/`, or `packages/themes/`** — these are framework internals.
2. **ALL presentation content goes in `decks/<slug>/slides.tsx`** — this is the only file you should create or edit per deck.
3. **Import from `@slidemason/primitives`, `lucide-react`, and optionally `framer-motion`** — use React hooks (`useState`, `useEffect`, etc.) freely for custom interactions. **Do NOT `import React from 'react'`** — the automatic JSX transform handles this.
4. **Every slide needs a unique `key` prop** — React requires this for arrays.
5. **Do not add new dependencies** — everything you need is already installed.
6. **Read ALL files in `decks/<slug>/data/` before generating** — do not skip any source material.
7. **Use TypeScript** — the project is fully typed.
8. **Icon names are PascalCase Lucide icons** — e.g., `Database`, `Shield`, `Zap`, `BarChart3`, `Globe`.
9. **All colors via `var(--sm-*)` variables** — never hardcode hex values like `#fff` or `#000`.
10. **Use `style={{}}` for theme variables** — Tailwind can't read CSS variables at build time. Use `className` for layout (flex, grid, padding) and `style` for colors and dynamic values.
11. **Image URLs use `/decks/<slug>/assets/<filename>`** — never use filesystem paths like `/decks/<slug>/data/assets/` or API paths like `/__api/`.
12. **Only cite external web sources.** Use `<Source href="https://...">` only for data found via search tools with a real public URL. Never cite the user's uploaded source documents — they are internal material. Never invent numbers.
13. **Do NOT manually place logos or footer text in slides.** Branding is handled automatically by the renderer based on `brief.branding`. Any logo `<img>` tags or footer elements you add will duplicate the automatic overlay.
