# Phase 1 Scope — Stage 3 build contract

**Approved direction (user, 2026-05-18):** Hover + tree only; richer hover (real content + key-data pills + bottom fade); lighter overview; sleek pack controls (delete, reorder, pin within folder); drift cleanup; clarify/reframe Mark curated.

**Do not run Stage 3 until you edit/approve this file.**

---

## Simplification (CUT / MERGE)

### [F-1] CUT — In-doc overlay panel
- **Action:** CUT
- **Target:** `src/components/screens/document-workspace/InDocSourceOverlay.tsx`, remove usage from `DocumentWorkspace.tsx`
- **What changes:** Remove persistent floating source panel. Selection = tree highlight + URL `?source=`. Detail = hover only. Keep deep-link `?source=` for highlight. Repository link moves to hover footer (F-14).

### [F-1b] CUT — Tree chevron inline expand (the gray “excerpt” box)
- **Action:** CUT
- **Target:** `source-preview/SourceTreeLeaf.tsx` (chevron + `{expanded && … excerpt}` block), `DocumentWorkspace.tsx` `expandedSourceId` state, `DocumentFeatureTree.tsx` expand props
- **What changes:** Remove the box under “CSR Section 9.2” that only shows `item.excerpt` placeholder text. That UI is what the screenshot shows — not real artifact content. All preview content lives in hover card.

### [F-13] CUT — Overlay “Also in pack”
- **Action:** CUT (bundled with F-1)

### [F-14] MERGE — Open in repository
- **Action:** MERGE
- **Target:** `source-preview/SourcePreviewCard.tsx` footer
- **What changes:** Single “Open in repository” link in hover footer (mock `/repository?source=&from=`). No duplicate in removed overlay.

---

## Hover enrichment (KEEP + MERGE)

### [F-25] MERGE — Hover card = sole preview surface
- **Action:** MERGE
- **Target:** `source-preview/SourcePreviewCard.tsx`, `lib/source-artifacts.ts`
- **What changes:**
  - **Real content only** — use artifact paragraphs/tables (already in hover); never a lone bordered box with generic excerpt string.
  - **Key data pills** — bottom of card: 2–4 small pills (e.g. `HR 0.72`, `n=412`, `Phase 3`, `v2.1`) from mock metadata / artifact summary fields.
  - **Bottom gradient fade** — `mask-image` or overlay gradient on scroll body so pills sit on a soft fade (opacity 0→100 at bottom 24–32px).
  - Footer row: pills + optional “In narrative →” + repository link.

### [F-26] MERGE — Sleek row controls (delete, reorder, pin)
- **Action:** MERGE
- **Target:** `SourceTreeLeaf.tsx` and/or tree folder header in `DocumentFeatureTree.tsx`
- **What changes:**
  - On hover/focus of a pack source row: compact icon actions (delete, drag handle for reorder, pin).
  - **Pin** scopes to **current repo folder** (Stats / eTMF / etc.) — pinned sources sort to top within that folder only, not globally across the tree.
  - **Reorder** via drag handle within folder (existing drag-reparent stays for cross-folder moves; confirm modal F-9 when crossing section/folder boundaries if needed).
  - **Delete** removes from pack (confirm for in-text cited sources per PRD edge case).
  - Visual style: low-contrast icons, show on row hover — not permanent chrome clutter.

---

## Navigation (MERGE)

### [F-4] MERGE — Submission overview slimmer
- **Action:** MERGE
- **Target:** `src/app/submissions/[submissionId]/page.tsx`
- **What changes:** List remains primary entry to workspace. Overview = activity feed + stale/empty section callouts + links into workspace `?section=` — not a second full duplicate of the tree/section picker.

---

## Critical path (ADD)

### [F-2] ADD — EmptyPackState
- **Target:** `DocumentFeatureTree.tsx` (empty section branch)
- **What changes:** Risk–Benefit (and any `pack_state: empty`) shows illustration/copy + primary **Assemble pack** CTA.

### [F-3] ADD — Assemble loading `?state=assembling`
- **Target:** `DocumentWorkspace.tsx` + tree header skeleton
- **What changes:** Brief loading skeleton in tree header when assembling; clears to populated folders.

### [F-5] ADD — Tree click → URL `?source=` sync
- **Target:** `DocumentWorkspace.tsx` selection handler
- **What changes:** Clicking a source row updates `?section=` + `?source=` like citation click (fix tri-sync gap found in walkthrough).

### [F-6] ADD — Pack toolbar (minimal)
- **Target:** tree header area in `DocumentFeatureTree.tsx`
- **What changes:** Section label, source count, Assemble (when empty/draft), version chip — not a second drawer.

### [F-7] ADD — Promote suggested → pack
- **Target:** suggested folder rows in `DocumentFeatureTree.tsx`
- **What changes:** “Add to pack” on suggested rows (moves to appropriate repo folder).

### [F-8] ADD — InheritPackModal
- **Target:** new modal component + `?modal=inherit-pack`

### [F-9] ADD — SourceMoveConfirmModal
- **Target:** new modal + `?modal=move-source` on cross-section/cross-folder drop

### [F-10] MERGE — Mark curated (see product note below)
- **Target:** `DocumentWorkspace.tsx` header CTA + dialog
- **What changes:**
  - Honor `?modal=mark-curated` on load.
  - Block or warn if section has **stale** sources or pack &lt; min items.
  - Copy: “Lock this source pack” / “Pack reviewed for this section version” — not vague “curated” without context.
  - **Placement review:** keep in header only if toolbar doesn’t duplicate; else move to pack toolbar as primary lock action.

### [F-11] ADD — Delete / reorder / pin (user-required)
- Covered in F-26; implement in Stage 3, not deferred.

### [F-12] ADD — Modal deep links
- Wire `?modal=mark-curated`, `inherit-pack`, `move-source` on mount.

---

## Drift / cleanup (CUT)

### [F-20] CUT — Legacy `?pack=open` redirect
- **Target:** `src/app/submissions/.../sections/[sectionId]/page.tsx`
- **What changes:** Redirect to workspace with `?section={id}` only.

### [F-22] CUT — Unused Drawer layout (if unreferenced)
- **Target:** `src/components/layout/Drawer.tsx` or equivalent — remove if grep shows zero imports.

---

## Product note — “Mark curated” (for Jordan)

**What it means:** Jordan is saying “I’ve reviewed the sources in this section’s pack and I’m locking it for this document version.” Collaborators/QC see the section as **OK / locked** instead of draft. It’s a **workflow checkpoint**, not “AI curated text.”

**When it makes sense:** After pack is complete, nothing stale, sources match what’s cited. **When it doesn’t:** Empty pack, stale rows, or mid-assemble — button should disable with reason.

**Stage 3:** Keep the action but improve label + guardrails; consider moving next to pack version in tree header.

---

## Explicitly deferred (Phase 1)

| ID | Item |
|----|------|
| F-21 | Breadcrumb shorten |
| F-23 | Search zero-results empty state |
| Full QC read-only persona | Out of scope |

---

## Success check after Stage 3

- [ ] No inline excerpt box under tree rows
- [ ] No in-doc overlay panel
- [ ] Hover shows real artifact + bottom pills + gradient
- [ ] Row actions: delete, reorder, pin (folder-scoped)
- [ ] Tree click sets `?source=`
- [ ] Empty section shows assemble CTA
- [ ] Mark curated has clear copy + blockers

---

## Next command (after you approve edits)

```text
@dress-up --from-mockup /Users/adarshnellore/Documents/peerAI-final_run --analyze
# Stage 3 scaffolding only — not auto-run from this audit
```
