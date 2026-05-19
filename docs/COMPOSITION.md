# Composition Contract

The mechanical contract for how templates compose primitives, so visual consistency holds across pages **without** relying on the page author to remember the rules.

This document gives `docs/SPACING.md` teeth. SPACING.md is the *what* (named buckets, alignment principles); this is the *how* (the only legal way to consume them). The `npm run audit` script enforces this contract.

If a rule below is violated in `src/app/`, the audit fails and the build fails. There's an escape hatch (see end), but it must live inside a primitive, not in a template.

**Companion docs:**
- [`SPACING.md`](./SPACING.md) — the 4px scale + named buckets + alignment rules.
- [`LAYOUT.md`](./LAYOUT.md) — five named structural shells + when to use each.
- [`NAVIGATION.md`](./NAVIGATION.md) — Button vs LinkButton vs Link wiring rules.
- [`COMPONENTS.md`](./COMPONENTS.md) — full inventory of every primitive with Paper sheet IDs.

---

## Why this exists

A grep across 4 hand-rolled templates surfaced **65 instances** of freestyle `text-[Npx]` / raw `<h1>` / raw `<p>` / `flex flex-col gap-N`. The same brand wordmark was written 3 different ways across 3 templates. The H1 was authored at 28px, 32px, and 44px in three different templates — none of those values lived in any token or component. SPACING.md couldn't stop this because SPACING.md has no teeth.

Material UI, IBM Carbon, and Shopify Polaris all prevent this with closed-enum typography + closed-enum layout + canonical patterns + mechanical enforcement. This contract is the same shape.

---

## The seven rules

### 1 · Text rule

**No raw heading tags. No raw `<p>` with font/size classes. No `text-[Npx]` anywhere in `src/app/`.**

Render text through one of these:

| Use case | Component | Source |
|---|---|---|
| Display / page title | `<Heading size="display\|h1\|h2\|h3\|h4">` | `src/components/typography/Heading.tsx` |
| Body paragraph | `<Body size="lead\|body\|small">` | `src/components/typography/Body.tsx` |
| Uppercase mono kicker | `<MetaLabel>` | `src/components/ui/MetaLabel.tsx` |
| Inline mono caption (timestamps, "auto-saved", IDs) | `<MetaText size="sm\|md">` | `src/components/ui/MetaText.tsx` |
| Editorial Fraunces italic flourish | `<Caption size="sm\|md\|lg">` | `src/components/ui/Caption.tsx` |
| Brand wordmark | `<PeerBrand size="sm\|md">` | `src/components/ui/PeerBrand.tsx` |

The components own font-family, size, weight, line-height, and tracking. No `className` escape hatch for font-size on any of them.

### 2 · Spacing rule

**No raw `flex flex-col gap-N` / `flex items-center gap-N` in `src/app/`.**

Render vertical and horizontal rhythm through:

| Use case | Component | Source |
|---|---|---|
| Vertical stack | `<Stack gap="tight\|cozy\|comfortable\|block\|section\|page\|hero">` | `src/components/layout/Stack.tsx` |
| Horizontal row group | `<Cluster gap="…">` | `src/components/layout/Cluster.tsx` |

Both gap vocabularies map directly to the 7 named buckets in `docs/SPACING.md` (Tight 4 / Cozy 8 / Comfortable 12 / Block 16 / Section 24 / Page 40 / Hero 56-64). Picking a gap is a one-word decision, not a px guess.

### 3 · Color rule

**No hex codes in `className` or `style` in `src/app/`.**

Use semantic tokens (`text-ink`, `text-muted`, `text-faint`, `bg-coral`, `border-hairline-strong`, etc.). Tokens are defined in `src/app/globals.css`. If a needed token doesn't exist, add it there — don't inline the hex.

### 4 · Pattern rule

**Recurring page-level compositions live in `src/components/patterns/`, not inlined in template pages.**

Current patterns:

| Use case | Component |
|---|---|
| Page header (kicker + subtitle + Heading + meta) | `<PageHeader>` |
| Bounded reading column (centered, max-w, vertical rhythm) | `<Prose variant="reader\|article\|narrow">` |

If you find yourself writing a header-like or body-like wrapper twice across templates, lift it to `patterns/`. The audit script does not currently detect this, but a code review must.

### 5 · Structural-layout rule

**Templates compose. They do not freestyle structural layout.**

App-shell layouts use `<AppShell>` (`src/components/layout/AppShell.tsx`) with its `topBar` / `leftNav` / `rightRail` / children slots. Document layouts use `<DocFrame>`. Reading-style pages use `<Prose>` inside an AppShell main slot, or inside the longform `<TopNav> + scroll body` outer pattern.

If a page needs a layout the primitives don't support, add the layout primitive — don't invent one inline.

See [`LAYOUT.md`](./LAYOUT.md) for the five named shells and when to reach for each.

### 6 · Navigation rule

**A button that changes route is `<LinkButton href>` or a `<Link>`-wrapped Button. A button that performs an in-page command is `<Button onClick>`.**

A plain `<Button>` renders a `<button>` HTML element with no navigation behavior. Adding an `href` prop to `<Button>` does nothing. Use:

| Need | Primitive |
|---|---|
| Navigate to an internal route | `<LinkButton href="/path" variant="…" size="…">` |
| Navigate to an external URL | `<LinkButton href="https://…" external>` |
| Perform an in-page command (open modal, submit form, toggle state) | `<Button onClick={…}>` |
| Inline text link inside body copy | `<TextLink href tone size>` |
| Whole-card click → route | wrap the card with `<Link href>` (Next.js) |

**Enforced by audit.** `no-button-with-href` flags `<Button href=...>`. `no-link-styled-as-button` flags manually-styled `<a>` tags that should be LinkButton.

See [`NAVIGATION.md`](./NAVIGATION.md) for the full rule set + anti-patterns.

### 7 · Heading-vs-Body rule

**`<Heading>` is for short identifiers. Long content belongs in `<Body>`.**

Heading sizes (display 56px / h1 44px / h2 32px / h3 22px / h4 17px) are display weights. Putting a full sentence or paragraph in `<Heading>` produces a visually broken page even when the audit clears. As a rule of thumb: keep heading content under ~80 characters. If the content is descriptive prose, use `<Body size="lead">` instead.

```tsx
{/* ✓ Right */}
<PageHeader title="Hepatic adverse events" titleSize="h1" />
<Body size="lead">
  Hepatic adverse events occurred in 8.2% of recipients versus 4.1% in
  placebo. Most events were Grade 1–2 transient ALT elevations.
</Body>

{/* ✗ Wrong — full claim as title */}
<PageHeader title={claim.full_text} titleSize="h2" />
```

**Partially enforced by audit.** `no-long-heading-literal` flags `<Heading>` with > 80 characters of literal text on a single line. JSX-interpolated long content (e.g. `<Heading>{longString}</Heading>`) can't be caught by grep; cover via code review and PageHeader usage discipline.

---

## Escape hatch

Some values are genuinely one-off (an SVG path length, a `width: 280` for a fixed-width marginalia column, a citation superscript's `min-width: 16px`). Those are allowed — **but they must live inside a primitive component in `src/components/`**, not in a template under `src/app/`.

If you need a new one-off, the move is: write the primitive that owns it, then consume the primitive from the template.

---

## The audit script

`scripts/audit-composition.mjs` greps `src/app/` for the forbidden patterns above. Run it locally:

```bash
npm run audit
```

It is wired into the build via the `prebuild` hook, so `npm run build` and `npx next build` both fail when violations exist.

Each violation prints `file:line` + the offending snippet + which primitive should replace it. False positives can be silenced by moving the value into a primitive (see escape hatch).

---

## Token quick reference

(Same as `docs/SPACING.md`, repeated here for one-stop reading.)

**Colors**: `ink` `muted` `faint` `faintest` `hairline` `hairline-strong` `soft` `stripe` `paper` `coral` `coral-soft` `green` `green-soft` `gold` `gold-soft` `info` `accent-indigo`.

**Radii**: `rounded-xs` 3 · `rounded-sm` 5 · `rounded-md` 6 · `rounded-lg` 8 · `rounded-input` 10 · `rounded-card` 12.

**Fonts**: `font-sans` (Inter) · `font-mono` (Inconsolata) · `font-display` (Fraunces — only via `<Caption>` or `subtitleVariant="editorial"` in PageHeader).

**Tracking**: `tracking-label` (0.06em uppercase mono) · `tracking-caps` (0.04em).

**Spacing buckets**: Tight 4 · Cozy 8 · Comfortable 12 · Block 16 · Section 24 · Page 40 · Hero 56–64.

---

## How `/build-hifi` consumes this contract

The `/build-hifi` skill (`~/.claude/skills/build-hifi/SKILL.md`) reads `docs/COMPOSITION.md`, `docs/NAVIGATION.md`, and `docs/LAYOUT.md` before generating any screen. Every AI-generated page satisfies the seven rules, and the audit gate prevents regressions when the clone is built.

The flight test against the ClaimVault PRD (2026-05-16) validated that the contract holds across 4,800 LOC from 5 parallel agents on first try — Rules 1-5 produced 0 audit violations end-to-end. Rules 6 and 7 were added afterward to address two bug classes the contract didn't yet catch (unwired navigation buttons, body copy in heading slots).

Future skill versions can add tighter checks (PR-level lint, eslint plugin) — but the contract document + the grep gate is the floor.
