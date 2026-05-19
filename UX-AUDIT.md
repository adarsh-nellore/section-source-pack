# Full-app UX audit — Section Source Pack

**Date:** 2026-05-18  
**Method:** Route-by-route review against PRD §10–14, persona walkthrough (Jordan Lee), screenshot pass at 1440×900  
**App:** `section-source-pack-dressup-2026-05-18` · http://localhost:3053

## Honest assessment

The first refine pass added data and P0 modals but **did not** do a real visual walkthrough. User-reported issues were valid:

| Issue | Root cause | Fix in this pass |
|-------|------------|------------------|
| Hover preview pills overlap table | Footer `key_pills` stacked under truncated scroll area with mask gradient | Restructured card: scroll body + separate footer; removed fade mask; larger popover |
| Pack toolbar cramped / ghost links | Count + actions on one row, mono titles everywhere | Pack panel card, stacked actions, **Body** for section/source titles |
| `/repository` felt broken | `max-w-md` + recycled popover + "Repository (mock)" title | Full-width artifact page with `layout="page"` and real title |
| Typography mismatch | Section/tree titles used `MetaText` (mono) next to sans narrative | Sans for titles; mono only for labels/meta |

## Route inventory (every page)

| Route | PRD screen | Status after pass |
|-------|------------|-------------------|
| `/` | — | Redirect → `/submissions` OK |
| `/login` | Login | Centered card, AppShell, clearer copy |
| `/submissions` | Submissions list | KPI strip, Heading on cards, hover lift |
| `/submissions/[id]` | Submission overview | Header first, documents list, sections list, audit trail |
| `/submissions/…/documents/[id]` | Document workspace | Cornerstone; pack panel + narrative paragraphs |
| `/submissions/…/sections/[id]` | — | Redirect strips `pack` param OK |
| `/repository` | External preview (mock) | **Rebuilt** as full artifact detail, not orphan stub |

## Document workspace — Jordan walkthrough

| Step | Expected | Result |
|------|----------|--------|
| Open efficacy | Dense tree, long narrative | Pass |
| Hover TFL row | Table fully readable, pills in footer only | **Fixed** (was failing) |
| Click tree row | `?section=` + `?source=` | Pass |
| Click citation | Tri-sync highlight | Pass |
| Safety stale | Banner + row badge | Pass |
| RB empty → Assemble | Skeleton → 5 sources | Pass |
| Lock pack with stale | Blocked in modal | Pass |
| Inherit pack | Modal from header + tree | Pass |
| Repository link | Full page artifact view | **Fixed** |

## PRD gaps remaining (P1)

- Partial assemble banner when &lt;5 candidates
- Stale TFL side-by-side diff
- QC read-only mode
- `AiSourceUsage` lane in UI
- Catalog search to add sources (beyond filter)

## Composition gates

- `npm run audit` — 0 violations (`src/app/`)
- `npx tsc --noEmit` — clean

## Screenshots

`.audit-screenshots/full-audit/` (re-capture after pull)
