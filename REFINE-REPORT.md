# Refine Report — full-app pass (2026-05-18)

## What this pass fixed

Honest full-app refine after user feedback: prior pass was checklist-driven, not visual.

### Every route

| File | Changes |
|------|---------|
| `src/app/login/page.tsx` | AppShell, centered card, clearer subtitle |
| `src/app/submissions/page.tsx` | KPI stats, Heading on program cards, spacing |
| `src/app/submissions/[submissionId]/page.tsx` | Documents list, all sections, reordered header, grid links |
| `src/app/repository/page.tsx` | **Rebuilt** — full-width artifact page, no "mock" title |
| `src/app/page.tsx` | (unchanged redirect) |

### Shared workspace UI

| File | Changes |
|------|---------|
| `SourcePreviewCard.tsx` | No overlap: scroll body + footer; `layout="page"`; removed mask |
| `SourcePreviewContext.tsx` | Popover 400×440 |
| `DocumentFeatureTree.tsx` | Pack toolbar card, Body titles, button stack |
| `SourceTreeLeaf.tsx` | Body for source titles (sans) |

## Gates

- `npx tsc --noEmit` — pass
- `npm run audit` — 0 violations

## Cornerstone

http://localhost:3053/submissions/8f3a2c1b-9d4e-4a1f-b2c3-d4e5f6a7b8c9/documents/d1111111-2222-3333-4444-555555555551?section=s-efficacy

See `UX-AUDIT.md` for route matrix and remaining P1 items.
