# Section Source Pack

Regulatory writing workspace prototype: medical writers curate versioned **source packs** (5–10 evidence items per section) alongside AI-generated module narrative. Built on the Peer design system with composition-audit gates.

**Design exercise:** Peer AI — Section Source Pack (Module 2.5 clinical overview).

## Quick start

```bash
npm install
npm run dev          # http://localhost:3053
```

**Cornerstone demo URL (after dev server starts):**

```
http://localhost:3053/submissions/8f3a2c1b-9d4e-4a1f-b2c3-d4e5f6a7b8c9/documents/d1111111-2222-3333-4444-555555555551?section=s-efficacy
```

## Routes

| Route | Purpose |
|-------|---------|
| `/login` | Mock sign-in |
| `/submissions` | Program list |
| `/submissions/[id]` | Submission overview, pack health |
| `/submissions/.../documents/[id]` | **Document workspace** — tree, narrative, hover preview |
| `/repository?source=` | Full-page artifact preview (eTMF / stats deep link mock) |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server on port **3053** |
| `npm run audit` | Composition contract check (`src/app/`) |
| `npm run build` | Production build (runs manifest + audit) |

## Docs

- [UX-AUDIT.md](./UX-AUDIT.md) — Full-app UX audit
- [REFINE-REPORT.md](./REFINE-REPORT.md) — Refine pass summary
- [DRESS-UP-REPORT.md](./DRESS-UP-REPORT.md) — Dress-up pipeline notes

## Stack

Next.js 16 · React 19 · Tailwind CSS 4 · TypeScript
