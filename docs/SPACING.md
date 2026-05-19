# Spacing & Alignment Guide

The underlying 4px scale + named buckets + alignment rules. This document is the *vocabulary*. See [`COMPOSITION.md`](./COMPOSITION.md) for the *grammar* — the closed-enum components (`<Stack gap="bucket">`, `<Cluster gap="bucket">`) that mechanically enforce these buckets in templates, plus the `npm run audit` gate that fails the build when raw `gap-N` / `text-[Npx]` / raw `<h1>` slip through.

If you're authoring a new component, read this for the scale; if you're composing a template page, read COMPOSITION.md for the contract.

---

## The scale

We use Tailwind v4's default 4px scale. No custom spacing tokens. Memorize seven named buckets — they cover ~95% of real decisions.

| Bucket | px | Tailwind | Use it for |
|---|---|---|---|
| **Tight** | 4 | `gap-1` `p-1` | Inside a Pill or chip; gap between a Badge and its label |
| **Cozy** | 8 | `gap-2` `p-2` | Inside a row between an icon and its label; between a MetaLabel and its value |
| **Comfortable** | 12 | `gap-3` `p-3` | Stack of related rows; between a status row and the body it describes |
| **Block** | 16 | `gap-4` `p-4` | Inside a Card; gap between cards in a grid; default Tile internal padding |
| **Section** | 24 | `gap-6` `py-6` | Between sections on a page; between the page header and the first content block |
| **Page** | 40 | `gap-10` `py-10` | Outer padding of a page-content area |
| **Hero** | 56–64 | `gap-14` `py-16` | Marketing pages, onboarding cards, anything that wants to feel spacious |

Pick the named bucket first. Only drop to in-between values (`gap-2.5`, `py-1.75`) when you've extracted them from a Paper sheet.

---

## Three alignment rules

### 1 · Top-anchor variable content

When a component renders in a row or grid with siblings (Tile, Stat, Card), fixed-position elements (hero, label, value) **must sit at the same vertical position across instances**. Variable-length bodies extend *downward*, never push other elements down.

**Anti-pattern (the Tile bug we hit):**
```tsx
<div className="flex flex-col gap-1 mt-auto">   {/* pushes content to bottom */}
  <Label />
  <Value />
  <Body />  {/* longer body in one tile shifts label/value up */}
</div>
```

**Pattern:**
```tsx
<div className="flex flex-col gap-1.5">   {/* anchored top-down */}
  <Label />
  <Value />
  <Body />  {/* longer body extends downward only */}
</div>
```

Reach for `mt-auto` only when you're intentionally pinning a footer to the bottom of a fixed-height container, *and* the rest of the content has bounded height so nothing shifts.

### 2 · One slot, one job

Header is header. Footer is footer. Body is body. Don't conditionally render slots that change vertical rhythm.

If you build a Card with an optional header that disappears when empty, two cards next to each other will misalign whenever one has a header and the other doesn't. Either:
- Always render the slot (with a placeholder), or
- Make the parent grid `items-start` so they don't try to match heights.

### 3 · Stretch vs anchor

When siblings should match heights (4 Tiles in a row, all same height regardless of content): `items-stretch` on the parent.

When each sibling sizes to its own content (a list of MessageBubbles, an inline group of Pills): `items-start`.

Don't mix. Pick one per row.

---

## Common pitfalls (with fixes)

Real anti-patterns this codebase has hit. Reference when reviewing.

| Pitfall | Why it bites | Fix |
|---|---|---|
| `mt-auto` on inner content block | Variable bodies misalign labels across siblings | Drop `mt-auto`; anchor content top-down |
| Inner `<aside>` setting its own width when AppShell wraps it | Width fight between outer and inner; content clips or overflows | Inner layout components consume parent width (`w-full`); semantic `<aside>` lives in the outer slot |
| `text-[11px] text-faint` for metadata | Too small (11px) + too low contrast (#858585) — reads as broken | Bump to `text-[12px] text-muted` for any metadata in dense layouts |
| Hover state without focus equivalent | Keyboard users see no affordance | Always pair `hover:` with `focus-visible:` |
| `flex` + `flex-wrap` for a card grid | Wrap creates ragged rows; siblings don't match heights | Use `grid` with explicit columns (`grid-cols-3 gap-4`) |
| Hardcoded hex in className | Bypasses tokens; drifts over time | Use semantic tokens (`bg-coral`, `border-hairline-strong`) |
| Conditional slot that collapses height | Cards next to each other misalign when one has the slot and the other doesn't | Always render the slot OR use `items-start` |

---

## When in doubt

- Default to **Block (16px)** between distinct visual elements.
- Default to **Section (24px)** between groups of those.
- Default to **Page (40px)** for outer container padding.
- Use `gap` over `margin`. Gap is predictable; margin collapses and surprises.
- Use Tailwind named utilities (`gap-4`) over arbitrary values (`gap-[16px]`). Arbitrary values only when extracted from a Paper sheet that doesn't fit the scale.
- When in real doubt, screenshot two instances side-by-side and check that the fixed elements (hero, label, value) align.

---

## Token quick reference

### Colors
| Token | Hex | Use |
|---|---|---|
| `ink` | `#1A1B1F` | Primary text |
| `muted` | `#525252` | Body copy, dense-layout metadata |
| `faint` | `#858585` | Tertiary text, table column headers |
| `faintest` | `#A6A6A6` | Quaternary text |
| `hairline` | `#E9E9E9` | Inner dividers |
| `hairline-strong` | `#D5DDE3` | Card / pill borders |
| `soft` | `#F6F6F6` | Filled badge bg, page background for focused-card layouts |
| `stripe` | `#FAFBFC` | Zebra stripes, subtle fills |
| `paper` | `#FFFFFF` | Default surface |
| `coral` | `#FF4E49` | Primary accent |
| `coral-soft` | `#FFF5F4` | Coral fill on small surfaces |
| `green` | `#43DD9C` | Success, positive deltas |
| `gold` | `#F6A600` | Warning |
| `info` | `#4FA8E4` | Informational |
| `accent-indigo` | `#3935FF` | Tab active edge |

### Radii
| Token | px | Use |
|---|---|---|
| `rounded-xs` | 3 | Badge |
| `rounded-sm` | 5 | Small inline action |
| `rounded-md` | 6 | Standard button |
| `rounded-lg` | 8 | Pill chip |
| `rounded-input` | 10 | Input field |
| `rounded-card` | 12 | Card surface |

### Typography
| Token | Family | Use |
|---|---|---|
| `font-sans` | Inter | Body, headings, UI labels |
| `font-mono` | Inconsolata | Captions, badges, IDs, KeyChips, metadata |
| `font-display` | Fraunces | Editorial kickers, Caption component, marketing prose |

### Letter-spacing
| Token | em | Use |
|---|---|---|
| `tracking-label` | 0.06 | Uppercase mono labels (MetaLabel) |
| `tracking-caps` | 0.04 | Uppercase badges |

---

## How to use this guide

- **Authoring a new component:** read rules 1-3 before writing the layout. Pick the right bucket from the scale. Check against the pitfalls table.
- **Reviewing an existing component:** run the alignment rules against it. If it can render in a row, do labels align across instances?
- **Composing a page:** default to the named buckets. Only deviate when extracting from a specific Paper sheet.
- **`/build-hifi` agents:** treat this guide as a hard contract. Don't invent values; pick from the scale.

The Paper file is the visual source of truth. This document is the layout contract. Code must satisfy both.
