# Component Inventory

Every primitive in the system, organized by family. Use this as the single source of truth for "what's available" before authoring new JSX. The Paper file `PeerAIDesign_DesignSystem+Components` carries the canonical visual for each; the node ID in each row links to the Paper sheet.

For the contract on how to USE these components, see [`COMPOSITION.md`](./COMPOSITION.md). For shell-level layouts, see [`LAYOUT.md`](./LAYOUT.md). For navigation wiring, see [`NAVIGATION.md`](./NAVIGATION.md).

---

## Typography (`src/components/typography/`)

| Component | Purpose | Paper |
|---|---|---|
| `Heading` | Closed-enum display headlines (display / h1 / h2 / h3 / h4). The only legal way to render a heading. | — (closed enum) |
| `Body` | Closed-enum paragraph (lead / body / small). The only legal way to render a paragraph. | — (closed enum) |

---

## Atomic UI (`src/components/ui/`)

### Identity + meta

| Component | Purpose | Paper |
|---|---|---|
| `Avatar` | Initials or image, three sizes, optional ring | 5K7-0 |
| `Badge` | Tone-driven label (neutral/success/warning/danger/info) | 5K4-0 |
| `Caption` | Display-serif italic kicker, Fraunces | 5KA-0 |
| `Dot` | Small status indicator (5 colors × 3 sizes, optional pulse) | 5K5-0 |
| `Glyph` | 14 hand-coded SVG icons with per-glyph stroke defaults | 5EH-0 |
| `MetaLabel` | Uppercase mono section/category label | 5K8-0 |
| `MetaText` | Mono caption — timestamps, IDs, status text | 5K9-0 |
| `PeerBrand` | Peer SVG mark + wordmark; canonical brand primitive | — |

### Surface

| Component | Purpose | Paper |
|---|---|---|
| `Card` | Paper/soft/outline/elevated container with optional header + footer | 5A4-0 |
| `Tile` | Featured square card with hero glyph, label, value, body | 60M-0 |
| `Modal` | Overlay dialog, three sizes, dimmed backdrop | 60Q-0 |
| `Alert` | Inline persistent banner with optional action | 60O-0 |
| `Toast` | Transient notification (four tones) | 60N-0 |
| `EmptyState` | Centered guidance card for empty containers | 60P-0 |
| `Banner` | Full-width announcement strip (four tones) | 8EX-0 |
| `Hairline` | Horizontal solid/fade or vertical divider, optional label | 5KB-0 |

### Action

| Component | Purpose | Paper |
|---|---|---|
| `Button` | Primary / secondary / ghost / destructive × sm/md/lg | 5UX-0 |
| `IconButton` | Square icon-only Button (requires aria-label) | 5UY-0 |
| `Pill` | Outlined / filled / accent / ghost chip | 5UW-0 |
| `Tag` | Closeable label (distinct from Badge — interactive) | 8EZ-0 |
| `TextLink` | Inline styled link (Coral or muted, three sizes) | 8DZ-0 |
| `KeyChip` | Keyboard shortcut display, solo + paired | 5KC-0 |

### Form input

| Component | Purpose | Paper |
|---|---|---|
| `Input` | Single-line with leading/trailing slots | 68L-0 |
| `SearchInput` | Input + leading search + ⌘K hint | 68M-0 |
| `Textarea` | Multi-line, resize-y | 68N-0 |
| `Select` | Dropdown wrapping native `<select>` | 68Q-0 |
| `Checkbox` | Checked / indeterminate state | 68R-0 |
| `Radio` | Single-select within a name group | 68S-0 |
| `Switch` | Binary on/off toggle, three sizes | 8DU-0 |
| `Slider` | Range input with thumb + value | 8DV-0 |
| `FormField` | Label + control + hint + error wrapper | 8F1-0 |

### Navigation / sectioning

| Component | Purpose | Paper |
|---|---|---|
| `Tab` + `TabBar` | Document tab strip with indigo active edge | 68O-0 |
| `Tabs` (segmented) | Inline filter control | 68P-0 |
| `Pagination` | Page nav with prev/next + page numbers | 8F0-0 |
| `Stepper` | Multi-step process chrome, horizontal or vertical | 8F8-0 |
| `ProgressDots` | Step indicator dots (done/current/upcoming) | 5K6-0 |
| `Tooltip` | Hover popover (dark + glass variants) | 68T-0 |
| `DropdownMenu` | Composable action menu | 68U-0 |
| `Accordion` | Expandable disclosure sections (single + multi) | 8EY-0 |

### Data display

| Component | Purpose | Paper |
|---|---|---|
| `Row` | Multi-column data row (zebra / muted / total variants) | 6KO-0 |
| `Table<T>` | Typed columns + rows + optional total | 6KP-0 |
| `Stat` | KPI tile with label + value + delta + Sparkline | 6KR-0 |

### Feedback / loading

| Component | Purpose | Paper |
|---|---|---|
| `Skeleton` | Loading placeholder (text lines / rect / circle) | 8DW-0 |
| `Spinner` | Inline loading indicator (3 sizes × tone) | 8DX-0 |
| `ProgressBar` | Horizontal progress track with optional label + percentage | 8DY-0 |

---

## Layout primitives (`src/components/layout/`)

| Component | Purpose | Paper |
|---|---|---|
| `AppShell` | Top-level shell — topBar / leftNav / rightRail / main slots | — (manifested in templates) |
| `TopNav` | 56px chrome bar — brand / breadcrumb / trailing | 6OU-0 |
| `LeftNav` | Collapsible sidebar with section headers + items | 6OV-0 |
| `RightRail` | Header + scrollable body + footer slots | 6OW-0 |
| `DocFrame` | Tab bar + scrollable content canvas | 6OX-0 |
| `SplitFrame` | Two-column with hairline divider | 6OY-0 |
| `PageContainer` | Bounded centered column (sm 640 / md 800 / lg 1024) | 6OZ-0 |
| `Stack` | Vertical rhythm primitive — closed-enum gap buckets | — (closed enum) |
| `Cluster` | Horizontal rhythm primitive — closed-enum gap + align + justify | — (closed enum) |
| `Drawer` | Slide-in panel from right/left, non-blocking | 8FI-0 |
| `Popover` | Rich click/hover-revealed surface (4 placements + arrow) | 8UI-0 |
| `LinkButton` | Button paired with Next.js Link — canonical nav-button wrapper | — (composition) |

---

## Patterns (`src/components/patterns/`)

| Pattern | Purpose | Composes |
|---|---|---|
| `PageHeader` | Kicker + subtitle + Heading + meta + action slot | MetaLabel · Caption · Heading · Cluster · Stack |
| `Prose` | Bounded centered reading column with vertical rhythm | Stack |
| `FilterBar` | SearchInput + Tabs + sort + view-toggle row | Tabs · SearchInput · Cluster |
| `ActionBar` | Sticky / inline / floating action row | Cluster |
| `KeyValue` + `DefinitionList` | Label/value pairs in a grid or strip | MetaLabel · Hairline |

---

## Charts (`src/components/charts/`)

| Component | Purpose | Paper |
|---|---|---|
| `Sparkline` | Inline monotone-cubic line chart | 6KQ-0 |
| `LineChart` | Multi-series line chart with axes + grid + legend | 8H6-0 |
| `BarChart` | Vertical or horizontal bar chart (1 or 2 series, grouped) | 8H7-0 |
| `DonutChart` | Single-value or multi-segment donut with center label | 8H8-0 |

---

## Agent atoms (`src/components/agent/`)

| Component | Purpose | Paper |
|---|---|---|
| `AgentAvatar` | Branded coral identity for an AI agent (4 states) | 6WS-0 |
| `ThinkingIndicator` | Three pulsing dots | 6WT-0 |
| `StreamingCursor` | Blinking caret at end of streaming text | 6WU-0 |
| `CitationLink` | Inline numbered citation with hover popover | 6WV-0 |
| `SourceChip` | KindBadge + filename + section pointer | 6WW-0 |
| `SuggestionPill` | Sparkle-prefixed AI suggestion chip | 6WX-0 |
| `ReasonedChip` | Accepted-with-reason badge, expands to trace + sources | 6WY-0 |
| `ConfidenceBadge` | Percentage with badge or bar variant | 6WZ-0 |
| `HallucinationFlag` | Review-needed marker (inline badge + block callout) | 6X0-0 |

---

## Agent molecules (`src/components/agent/`)

| Component | Purpose | Paper |
|---|---|---|
| `MessageBubble` | Chat turn (user / assistant / thinking / streaming) | 75Q-0 |
| `ToolCallCard` | Tool invocation card (running / completed / failed) | 75R-0 |
| `ReasoningTrace` | Collapsible step-by-step reasoning display | 75S-0 |
| `DiffView` | Before/after AI edit (token + block layouts) | 75T-0 |
| `CarouselCard` | Multi-variant pick-one pattern | 75U-0 |
| `MultiStepFlow` | Clarifying-question card with progress dots | 75V-0 |
| `AcceptRejectBar` | Sticky bottom action bar (default + dark inverted) | 75W-0 |
| `AgentErrorCard` | Error / rate-limited / refusal tone cards | 75X-0 |
| `PromptBar` | Chat input with attachments, slash hint, ⌘↵ | 75Y-0 |

---

## Discovery tips

When you need to render something and aren't sure if a primitive exists:

1. Check this doc by family (Atomic UI → Form Input → "do I need an Input or Select or Switch?").
2. Check `src/components/{ui,layout,agent,charts,typography,patterns}/index.ts` — barrel exports list everything reachable.
3. Open the Paper file and look for `sheet · *` artboards — every component has one (except the closed-enum primitives Heading / Body / Stack / Cluster).
4. Run the showcase (`npm run dev` → `/components`) for visual reference.
5. Read `LAYOUT.md` for how primitives compose into pages.

If a primitive truly doesn't exist, author it Paper-first then port to React. Don't inline custom JSX that should be a primitive.
