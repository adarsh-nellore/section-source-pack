# Navigation Contract

How routing and link/button wiring works in this system. Three rules, each enforceable.

For the underlying composition contract, see [`COMPOSITION.md`](./COMPOSITION.md). For the shells that frame navigation, see [`LAYOUT.md`](./LAYOUT.md).

---

## Why this doc exists

The `/build-hifi` flight-test against a real PRD surfaced a specific bug class: AI-generated screens rendered `<Button>` as primary navigation actions, with no `onClick` handler and no `<Link>` wrapper, so the buttons rendered correctly but didn't navigate when clicked. The composition contract caught style drift but not wiring drift.

This document codifies the three rules that make navigation wiring correct by construction, plus the audit rules that enforce a subset of them automatically.

---

## Rule 1 — Navigation uses `<LinkButton href>` or `<Link>`-wrapped Button

A button that changes route is not a `<button>`. It's an `<a>`. Use:

```tsx
import { LinkButton } from "@/components/layout/LinkButton";

// Internal route — wraps Next.js <Link>
<LinkButton href={`/documents/${id}`} variant="primary" size="md">
  Open document
</LinkButton>

// External URL — auto-detects http(s):// and renders <a target="_blank">
<LinkButton href="https://docs.example.com" external>
  Read documentation
</LinkButton>
```

`<LinkButton>` accepts every prop `<Button>` accepts (variant, size, leadingIcon, trailingIcon, disabled, className, etc.). The only difference is `href` is required; `onClick` is not accepted (use plain `<Button onClick>` for that).

For more complex link content (whole card → route), wrap with Next.js `<Link>` directly:

```tsx
import Link from "next/link";

<Link href={`/claims/${claimId}`} className="block rounded-card border border-hairline-strong p-5 hover:bg-soft">
  <Stack gap="cozy">
    <Heading size="h4">{claim.title}</Heading>
    <Body size="small" tone="muted">{claim.summary}</Body>
  </Stack>
</Link>
```

**Enforced by audit.** `no-button-with-href` flags `<Button href=...>` (plain Button doesn't navigate). `no-link-styled-as-button` flags `<a className="… bg-coral …">` (a manually-styled anchor that should be LinkButton).

---

## Rule 2 — Page commands use `<Button onClick>`

A button that performs an in-page action (open a modal, submit a form, copy text, expand an accordion, mark resolved) stays a plain `<Button>` with an `onClick` handler. No href, no Link wrapping.

```tsx
<Button variant="primary" onClick={() => setModalOpen(true)}>
  Edit profile
</Button>

<Button variant="secondary" type="submit">
  Save changes
</Button>

<Button variant="destructive" onClick={() => deleteClaim(id)}>
  Delete
</Button>
```

For prototype-stage onClick handlers (where the action isn't wired yet), use `onClick={() => {}}` rather than omitting it. Even an empty handler signals intent — "this is a command, not a nav."

**Not currently enforced by audit** (an empty `onClick={}` is impossible to distinguish from a forgotten one via grep). Cover this in code review.

---

## Rule 3 — Modal and Drawer triggers use `onClick`, not `href`

Modals and Drawers are in-page state, not route changes. They open via `onClick`:

```tsx
const [drawerOpen, setDrawerOpen] = useState(false);

<Button onClick={() => setDrawerOpen(true)}>
  Filter
</Button>

<Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} side="right" size="md">
  {/* drawer content */}
</Drawer>
```

If the drawer represents a discoverable state worth bookmarking (e.g., "search results with filter X applied"), put it on a route and use `<LinkButton>` to reach it. But default to in-page state.

---

## Anti-patterns

### `<Button href="/path">` — doesn't navigate

`<Button>` renders a `<button>` HTML element. HTML buttons have no native navigation. Adding an `href` prop does nothing in this system.

**Fix:** use `<LinkButton href="/path">`.

### `<a className="bg-coral text-white rounded-md px-3 py-2">Click</a>` — bypasses Button's style API

A manually-styled anchor drifts from `<Button>`'s canonical styles. When Button's hover/focus/disabled states evolve, the manual anchor doesn't.

**Fix:** use `<LinkButton href variant="primary" size="md">Click</LinkButton>`.

### `<Button onClick={() => router.push('/path')}>` — works but verbose

Functional but bypasses the LinkButton wrapper that handles internal vs external + new-tab semantics.

**Fix:** use `<LinkButton href="/path">` unless you specifically need to run logic before navigating (in which case the `onClick + router.push` pattern is fine).

### Empty `<Button>` with no `onClick` and no Link parent

If the button is a command, add an explicit `onClick={() => {}}` to signal intent. If the button is navigation, use `<LinkButton href>`.

**Fix:** decide whether it's nav (LinkButton) or command (Button + onClick). Both are valid; the dead Button isn't.

---

## When LinkButton isn't enough

Some navigation needs are richer than a button:

- **Whole-card click** — wrap the entire card in `<Link href>`. See [LAYOUT.md "Inside the shell"](./LAYOUT.md#inside-the-shell).
- **Inline text links** — use `<TextLink href tone size>` (see `src/components/ui/TextLink.tsx`). Inline links in body copy should not be Buttons.
- **Breadcrumb segments** — wrap each `<MetaText>` in a `<Link href>`. The breadcrumb itself is a Cluster of MetaText / `/` separators; only the segments that point to a route get wrapped.
- **TopNav brand** — wrap `<PeerBrand>` in `<Link href="/">` to make the wordmark clickable.

---

## Implementation note

In Next.js App Router, the canonical way to link client-side is `import Link from "next/link"`. `<LinkButton>` uses this for internal routes and falls back to `<a target="_blank">` for external URLs (anything matching `^https?://`). The detection is automatic but can be overridden with the `external` prop:

```tsx
<LinkButton href="mailto:hello@example.com" external>
  Email us
</LinkButton>
```

---

## Audit coverage

The audit script (`scripts/audit-composition.mjs`) currently enforces:

- ✓ `no-button-with-href` — flags `<Button href=...>` 
- ✓ `no-link-styled-as-button` — flags `<a className="… bg-coral …">`

It does NOT currently enforce:

- `<Button>` without `onClick` or Link wrapper — would false-positive on prototype-stage stub handlers and on form-submit buttons. Cover in code review.
- `<TextLink>` with content longer than a sentence — would require AST analysis. Cover in code review.

When the audit can't catch a navigation bug, the fix is in this document and in `/build-hifi`'s SKILL.md prompt rules.
