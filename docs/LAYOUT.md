# Layout Playbook

Five named structural shells cover ~95% of page-level layouts in this system. Pick the shell that matches the page's information shape, compose the contents using the typography + spacing + pattern primitives, ship.

This document explains **what to use when**. For the rules that make this possible (closed-enum primitives, mechanical audit), see [`COMPOSITION.md`](./COMPOSITION.md). For the spacing vocabulary the layouts consume, see [`SPACING.md`](./SPACING.md). For routing/navigation discipline inside a layout, see [`NAVIGATION.md`](./NAVIGATION.md).

---

## The five shells

### 1. `full-shell` — chrome + main content + optional rails

The default for any app-style page. TopNav + LeftNav + main + optional RightRail.

**Use when:** the page is part of an authenticated workflow (dashboard, list/detail, document editor, settings, search). Persistent navigation matters.

**Primitives:** `<AppShell topBar leftNav rightRail>{children}</AppShell>` with `<TopNav>` + `<LeftNav>` + (optional) `<RightRail>` slots.

**Reference templates:** `dashboard` · `list-detail` · `browse-library` · `settings` · `search-results`.

```tsx
<AppShell
  topBar={<TopNav brand={<PeerBrand />} breadcrumb={…} trailing={…} />}
  leftNav={<LeftNav sections={…} />}
  rightRail={…}  // optional
  rightRailWidth={400}
>
  <Stack gap="section" className="px-10 py-8 max-w-[1240px]">
    <PageHeader … />
    {/* page content */}
  </Stack>
</AppShell>
```

---

### 2. `doc-shell` — chrome + tabbed document canvas + agent rail

The document-editor layout. TopNav + main DocFrame (with TabBar) + Copilot RightRail.

**Use when:** the user is authoring a long-form document and an AI agent sits beside them. The document fills the main area; the agent panel is anchored persistently to the right.

**Primitives:** `<AppShell>` with `<DocFrame tabBar>{prose}</DocFrame>` in the main slot and a `<RightRail>` for the agent surface.

**Reference template:** `doc-editor`.

```tsx
<AppShell rightRailWidth={360}>
  topBar={<TopNav … />}
  rightRail={<RightRail header={…} footer={<PromptBar />}>…</RightRail>}
>
  <DocFrame padding="none" tabBar={<Cluster>…tabs…</Cluster>}>
    <Prose variant="article">
      <PageHeader … />
      <Body size="lead">…</Body>
      {/* body */}
    </Prose>
  </DocFrame>
</AppShell>
```

---

### 3. `split-shell` — three-pane triage layout

LeftNav (filters) + middle list panel + right detail pane.

**Use when:** the user is triaging a list of items (claims, tickets, alerts, documents) and needs to switch between the list and one selected item without leaving the page.

**Primitives:** `<AppShell>` with main being a flex row of an `<aside w-[380px]>` (the list) and a `<section flex-1>` (the detail Prose).

**Reference template:** `list-detail`.

```tsx
<AppShell leftNavWidth={220}>
  topBar={<TopNav … />}
  leftNav={<LeftNav … />}
>
  <div className="flex flex-1 min-h-0">
    <aside className="w-[380px] shrink-0 border-r border-hairline-strong">
      <Stack>{/* list rows */}</Stack>
    </aside>
    <section className="flex-1 min-w-0">
      <Prose variant="reader">
        <PageHeader … />
        {/* detail */}
      </Prose>
    </section>
  </div>
</AppShell>
```

---

### 4. `prose-shell` — bespoke editorial / longform reading

TopNav (often sticky-glass) + centered article column + optional marginalia.

**Use when:** the page is a reading-style document (longform article, claim detail, public-facing content). Chrome stays out of the way. Maximum reading focus.

**Primitives:** plain `<div absolute inset-0 flex flex-col overflow-y-auto>` with `<TopNav>` (with `sticky top-0 backdrop-blur-md`) + a `<Cluster justify="center" gap="hero">` body of `<Prose variant="reader">` + optional marginalia `<aside w-[280px]>`.

**Reference template:** `longform-reader`.

```tsx
<div className="absolute inset-0 flex flex-col bg-paper overflow-y-auto scroll-tame">
  <TopNav className="sticky top-0 z-20 bg-paper/85 backdrop-blur-md" … />
  <Cluster gap="hero" align="start" justify="center" wrap={false} className="py-16 px-20">
    <Prose variant="reader">
      <PageHeader … />
      <Body size="lead">…</Body>
      {/* body */}
    </Prose>
    <Stack as="aside" gap="section" className="w-[280px] pt-[88px] shrink-0">
      {/* marginalia */}
    </Stack>
  </Cluster>
</div>
```

---

### 5. `narrow-shell` — bounded form / centered card

`<PageContainer size="sm|md">` with a single column of form sections, or a card on a soft background.

**Use when:** the page is a form (settings, profile, billing) or a single focused decision (onboarding step, confirmation).

**Primitives:** `<PageContainer size>` for a centered column, OR a plain `<div absolute inset-0 flex items-center justify-center bg-soft>` with a single elevated Card in the middle.

**Reference templates:** `settings` (form variant) · `onboarding-flow` (card variant).

```tsx
{/* Form variant */}
<AppShell topBar={…} leftNav={…}>
  <PageContainer size="sm">
    <Stack gap="section">
      <PageHeader … />
      <Stack gap="block">
        <FormField label="Display name"><Input … /></FormField>
        <FormField label="Email"><Input … /></FormField>
      </Stack>
      <ActionBar primary={<Button>Save</Button>} secondary={<Button variant="ghost">Cancel</Button>} />
    </Stack>
  </PageContainer>
</AppShell>

{/* Card variant */}
<div className="absolute inset-0 flex flex-col bg-soft overflow-y-auto">
  <TopNav className="bg-soft" … />
  <div className="flex-1 flex items-center justify-center px-6 py-16">
    <Card className="w-[520px] shadow-pop">
      <Stack gap="section" className="p-10">
        <ProgressDots total={4} current={2} />
        <Stack gap="comfortable" align="center">
          <Caption size="md" tone="muted">{kicker}</Caption>
          <Heading size="h2">{title}</Heading>
          <Body size="small" tone="muted">{description}</Body>
        </Stack>
        {/* options */}
        <ActionBar primary={<LinkButton href="/next" variant="primary">Continue</LinkButton>} secondary={<LinkButton href="/back" variant="ghost">Back</LinkButton>} />
      </Stack>
    </Card>
  </div>
</div>
```

---

## Choosing a shell

| Page type | Shell |
|---|---|
| Dashboard, metrics, lists | `full-shell` |
| Document editor with agent | `doc-shell` |
| Triage / queue (list + detail) | `split-shell` |
| Reading / longform / public content | `prose-shell` |
| Forms, settings, onboarding | `narrow-shell` |
| Marketing landing | `narrow-shell` or `prose-shell` |
| Modal-only ephemeral state | `<Modal>` overlaid on any shell |

Don't invent new shells. If the page genuinely doesn't fit, compose two shells (e.g. `full-shell` outer + a `<Drawer>` for filter overlays).

---

## Inside the shell

Once the shell is picked, page content follows the same recipe in every shell:

1. **Page header** — `<PageHeader kicker subtitle title titleSize meta action />`. Always exists. Sets the page's identity and primary action.
2. **Vertical rhythm** — `<Stack gap="section">` wrapping the page's major blocks (header, filter row, content, footer).
3. **Horizontal rhythm** — `<Cluster gap="…">` for any row group (badge + label, primary + secondary actions, kicker + subtitle).
4. **Body content** — primitives + patterns (`<Table>`, `<Card>`, `<Tile>`, `<FilterBar>`, `<DefinitionList>`, etc.).
5. **Page footer or action bar** — `<ActionBar primary secondary>` for primary actions. Sticky variants for long pages.

Every shell + recipe combo is audit-clean by construction if you use closed-enum primitives. The audit gate fails if a page reaches outside the primitive set.

---

## Patterns to reach for first

Before authoring custom JSX, check if a pattern already exists:

| Need | Pattern |
|---|---|
| Page title + kicker + subtitle + meta + actions | `<PageHeader>` |
| Centered reading column with vertical rhythm | `<Prose variant>` |
| Search + tabs + sort + view-toggle | `<FilterBar>` |
| Primary + secondary action group, sticky or inline | `<ActionBar variant>` |
| Label/value display strip or grid | `<DefinitionList>` / `<KeyValue>` |
| Metadata band under a title | `<DefinitionList layout="horizontal">` |

Patterns live in `src/components/patterns/` and compose existing primitives. Add a new pattern when the same composition recurs in ≥3 templates. Until then, inline composition is fine.

---

## Loading, empty, error states

Every shell composes the same state primitives:

| State | Primitive |
|---|---|
| Loading shimmer | `<Skeleton variant="text\|rectangle\|circle" lines>` |
| Inline loading | `<Spinner size tone label>` |
| Progress | `<ProgressBar value tone>` |
| Empty | `<EmptyState title description action>` |
| Error | `<AgentErrorCard>` or `<Banner tone="danger">` |
| Degraded / stale | `<Banner tone="warning">` |

Use these instead of authoring "Loading…" text or empty-state JSX inline. The audit doesn't catch this, but consistency falls out of using the right primitive.

---

## What NOT to do

- **Don't invent new shell shapes.** If your page wants a 4-pane layout, you're almost certainly conflating two screens.
- **Don't nest AppShell inside AppShell.** The outer shell owns the chrome; the inner page owns the content.
- **Don't use `<Modal>` for non-blocking panels.** Use `<Drawer>` instead.
- **Don't put primary actions inside the LeftNav.** LeftNav is for routing; primary actions live in the PageHeader's `action` slot or in a footer `<ActionBar>`.
- **Don't put body copy inside `<Heading>`.** Heading is for short identifiers; body copy lives in `<Body size="lead\|body">`. See [COMPOSITION.md Rule 7](./COMPOSITION.md#7--heading-vs-body-rule).
- **Don't render `<Button>` as a navigation control without LinkButton.** Plain `<Button>` is a `<button>` element; it doesn't navigate. See [NAVIGATION.md](./NAVIGATION.md).

---

## Quick reference — token classes consumed by layouts

| Token | Use |
|---|---|
| `bg-paper` `bg-soft` `bg-stripe` | Surface tones — paper for default surfaces, soft for callouts, stripe for table zebra |
| `border-hairline` `border-hairline-strong` | Inner dividers vs container borders |
| `text-ink` `text-muted` `text-faint` `text-faintest` | 4-tier text hierarchy |
| `shadow-pop` | Floating/elevated surface (Modal, Drawer, Popover) |
| `glass-card` | Frosted background utility (used in floating ActionBar variant) |
| `scroll-tame` | Smooth overflow scrolling for content areas |
| `rounded-card` `rounded-input` `rounded-md` `rounded-lg` | Standard radii — `-card` 12px surfaces, `-input` 10px form fields, `-md` 6px buttons, `-lg` 8px pills |

Full color/radii reference in [`COMPOSITION.md`](./COMPOSITION.md). Spacing buckets in [`SPACING.md`](./SPACING.md).

---

## Desktop resilience

Every layout shell in this design system is desktop-only by intent (the prototype audience is laptop, not phone). "Desktop-only" still means **prototypes must render cleanly down to 1280px wide** — the common 13" laptop floor — without horizontal page scroll or columns crushed below readable widths. The rules below are how that floor is held.

### Supported viewport floor

- **1280px wide minimum.** Below 1280px is out of scope; behavior is undefined and not a bug.
- Above 1280px, every shell composition should remain visually intact: no column overlapping another, no horizontal scroll on the `<body>`, no content silently clipped.

### Rules

1. **No hardcoded layout widths ≥ 300px.** Fixed pixel widths on layout panels (asides, lists, side panels) compete for the viewport budget. At 1280px with `LeftNav` (220px) + `RightRail` (340px) + an aside (380px) + content padding, the main content column collapses to nothing. Use one of:
   - `<SplitFrame ratio={...}>` for two-column splits — it's already fluid.
   - `w-[clamp(min,fluid,max)]` for asides that need a target width with a floor. Example: `w-[clamp(320px,28vw,420px)]` for a list panel.
   - `max-w-[Npx] w-full` for centered cards, search inputs, and any element whose width is a cap, not a load-bearing layout dimension. (The audit explicitly allows `max-w-`.)
2. **Wide content wraps in `overflow-x-auto min-w-0`.** Tables, code blocks, long horizontal scrollers — anything whose intrinsic width can exceed the column — sits inside a `<div className="overflow-x-auto min-w-0">` so horizontal scroll stays scoped to the column, never the page. `AppShell` carries `overflow-x-hidden` as the last-line defense, but content authored without a wrapper will be silently clipped.
3. **Tight columns use responsive padding.** A column squeezed between `LeftNav` + `RightRail` + an aside should not also pay `px-12` (96px). Prefer `px-6 xl:px-12` or `px-8` on detail sections that share viewport budget with two or more siblings. Wide full-bleed columns (dashboards without rails) keep `px-12` freely.
4. **Main column carries `min-w-0`.** `AppShell` already does this; do not remove. Custom shells must include it or flex children won't shrink below their intrinsic content width.

### Audit teeth

- **`no-fixed-wide-width`** in `scripts/audit-composition.mjs` matches `w-[Npx]` where `N ≥ 300`. The negative lookbehind excludes `max-w-[...]` and `min-w-[...]` — those are caps, not load-bearing widths. The rule scans `src/app/` (templates included, `src/app/components` excluded). Build fails on violation.
- The wrap-tables and tight-padding rules are enforced by convention + code review, not regex. `<table>` lives downstream of authoring discipline; per-screen agents under `/build-hifi` receive these rules verbatim in their prompts.

### What good looks like

```tsx
// Good — fluid aside with a floor + ceiling
<aside className="w-[clamp(320px,28vw,420px)] shrink-0 …">…</aside>

// Good — centered card capped by max-w
<Stack className="max-w-[520px] w-full …">…</Stack>

// Good — wide table contained
<div className="overflow-x-auto min-w-0">
  <table>…</table>
</div>

// Bad — fixed aside that compresses content at 1280px
<aside className="w-[380px] shrink-0">…</aside>

// Bad — table that overflows the page
<table>…</table>
```
