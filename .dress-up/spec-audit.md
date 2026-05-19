# Spec Audit — section-source-pack (PRD-seed)

## Brief-fidelity scan

| PRD ask (§) | Met? | Seed observation |
|-------------|------|------------------|
| 5–10 sources per section in one place (§4, §11) | partial | Efficacy shows 4 in-pack + 1 suggested; not ranked list or assemble flow |
| Pin/remove/reorder/curate pack (§11 #2) | partial | Drag reparent between repo folders works; no remove, reorder, or pin UI beyond badges |
| Mark pack curated (§11 #3) | partial | `?modal=mark-curated` dialog exists; no stale blockers, no min-item guard |
| Inherit pack on duplicate (§11 #4) | no | `?modal=inherit-pack` not wired |
| Stale indicators (§11 #5) | partial | Safety has `pack_state: stale` banner + row badge; no review/replace flow |
| Suggested in same tree (§11 #6) | yes | “Suggested · not in pack” folder with `ai` badge |
| Tri-sync tree/overlay/chips (§11 #7) | partial | Deep-link `?source=` works; click-to-update URL flaky (hydration); overlay duplicates hover |
| Move sources folders/sections (§11 #8) | partial | Drag reparent in tree; `?modal=move-source` missing |
| Scoped search (§11 #9) | yes | Filter sources searchbox filters tree leaves |

**PRD-cited gaps (prioritize):** inherit pack, move-source modal, empty-pack assemble CTA, assemble loading state, PackToolbar, promote suggested → pack, remove/reorder/pin actions, curated blockers when stale.

## Surface inventory

| PRD §10 screen | Route in seed | Status |
|----------------|---------------|--------|
| Submissions List | `/submissions` | yes — deep-links to workspace |
| Submission Overview | `/submissions/[submissionId]` | yes — section health hub (repurposed) |
| Document Workspace | `/submissions/.../documents/[documentId]` | yes |
| Login | `/login` | yes (stub) |
| — | `/repository` | extra — mock external preview |
| — | `/sections/[sectionId]` | legacy redirect adds `?pack=open` (drawer param) |

## Intermediate / transition surfaces

| Surface id | PRD type | Implemented | Where in source |
|------------|----------|-------------|-----------------|
| workspace-tree-default | happy | yes | `DocumentWorkspace.tsx` + `DocumentFeatureTree.tsx` |
| source-tree-search | happy | yes | search input in tree |
| tri-sync-selection | happy | partial | URL + highlight; click navigation unreliable |
| source-hover-preview | happy | yes | `source-preview/SourcePreviewContext.tsx` |
| in-doc-overlay | happy | yes | `InDocSourceOverlay.tsx` — **redundant with hover** |
| pack-empty | empty | no | Risk–Benefit shows 0 folders only; no EmptyPackState / assemble CTA |
| pack-assemble-loading | loading | no | no `?state=assembling` handler |
| pack-stale | error | partial | banner on stale section only; not `?state=stale` |
| drag-reparent-repo | happy | yes | `DocumentFeatureTree.tsx` onDrop |
| move-source-section | confirm | no | no modal |
| inherit-pack-modal | confirm | no | no modal |
| mark-curated-confirm | confirm | partial | modal only; no blockers |

## Component inventory gaps

| PRD §14 component | In seed? | Notes |
|-------------------|---------|-------|
| DocumentFeatureTree | yes | monolithic, not split Folder/Row |
| SourceTreeSearch | merged | filter input only |
| SourceTreeFolder / SourceTreeRow | merged | inline in tree |
| PackStatusChip | partial | OK/!/— on section rows |
| SectionEditor | partial | paragraph + citations in workspace |
| CitationChip | yes | `NarrativeCitation.tsx` |
| InDocSourceOverlay | yes | **candidate CUT** |
| PackToolbar | no | no assemble / pack actions in header |
| SourceMoveConfirmModal | no | |
| InheritPackModal | no | |
| MarkCuratedConfirmDialog | partial | simple confirm, no blockers |
| StalePackBanner | partial | inline banner, not component |
| EmptyPackState | no | |
| LoginPage | yes | stub |

### Low-value / redundancy audit

| UI block | Classification | Rationale |
|----------|----------------|-----------|
| `InDocSourceOverlay` | **Redundant** | Duplicates hover preview + tree selection; user direction: hover + tree primary |
| Tree chevron “Expand source detail” + inline excerpt | **Redundant** | Same excerpt in hover `SourcePreviewCard` |
| Overlay “Also in pack” list | **Low value** | Shows other cited sources, not co-citation logic; confusing when source not in narrative |
| Overlay “Open in repository” (new tab) | **MERGE** | Belongs in hover preview footer only |
| `SourcePreviewProvider` + overlay on click | **MERGE** | Keep provider; drop persistent panel, keep hover |
| Submission overview as required hop | **Orphan / low** | Submissions list already opens workspace; overview duplicates section list |
| `/repository` page | **Orphan** | Mock only; OK if link lives in hover |
| Header “Mark curated” without toolbar context | **Partial** | Action without pack state / assemble context |
| `components/layout/Drawer.tsx` (DS) | **Unused** | Dead weight in repo, not mounted |
| Long breadcrumb (4 segments) | **Polish** | Could shorten to doc title only in workspace |

## Agent state coverage

| Pattern | PRD §17 | Seed |
|---------|---------|------|
| Auto-assemble | yes | not implemented |
| Partial success (&lt;5 sources) | yes | not implemented |
| Degraded index | yes | not implemented |
| Hallucination / unverified cite | §13 F1 | not implemented |
| Stale detection | §16 F6 | banner + badge only |

## Edge case coverage (§21)

| Route | empty | error | stress | permission | data | temporal |
|-------|-------|-------|--------|------------|------|----------|
| Workspace | **missing** EmptyPackState | no API error UI | no 10+ stress | no QC read-only | partial tri-sync | stale banner yes |
| Tree search | filter zero — **not implemented** | — | — | — | — | — |
| Overlay | — | — | — | — | “Not cited” copy yes | — |

## PRD-seed drift

| Item | PRD | Seed | Options |
|------|-----|------|---------|
| D-1 | §13 F1 “Sources (N)” / right overlay panel | Tree-first + optional in-doc overlay | (2) conform to PRD tree+overlay wording in docs; cut overlay in UI |
| D-2 | §10 in-doc overlay as primary context | Hover preview added (not in PRD table) | Keep hover; demote overlay per user |
| D-3 | §19 `?section=` / `?source=` only | `/sections/[id]` redirects with `?pack=open` | (2) fix redirect to `?section=` only |
| D-4 | §14 PackToolbar | Missing | (2) add toolbar or merge into tree header |

No other contradictions detected.

## Mock-data depth

- §15 entities present: submissions, documents, sections, sources, narratives, citations, artifacts.
- Missing: `SourcePack` version object surfaced in UI (only “Source pack · v2” label), `PackAuditEvent`, `AiSourceUsage` lane, assemble candidates with scores.
- `artifact_id` + `source-artifacts.ts` added — good for hover; not in original PRD schema table (acceptable extension).
