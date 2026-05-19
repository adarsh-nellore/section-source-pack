# DS manifest (Stage 4)

Generated from `.dress-up/ds-inventory.json`. **Read primitive source before using tone/variant props.**

## Per-primitive tone enums (not interchangeable)

- **Heading** `tone`: `"ink"` | `"muted"`
- **Body** `tone`: `"ink"` | `"muted"` | `"faint"`
- **MetaText** `tone`: `"default"` | `"faint"` | `"faintest"` | `"ink"` — **NO `"muted"`**
- **MetaLabel** `tone`: `"default"` | `"muted"`
- **Pill** `variant`: `"outlined"` | `"filled"` | `"accent"` | `"ghost"`
- **Badge** `tone`: `"neutral"` | `"muted"` | `"accent"` | `"success"` | `"warning"` | `"danger"` | `"info"`

## Semantic colors

DS has `--color-danger-soft`, `--color-success-soft`, `--color-warning-soft`, `--color-info`. Use `Banner`/`Badge`/`Alert` tones rather than raw `zinc-*` or `red-50`.

## Layout shells

- Cornerstone: `AppShell` + `TopNav` + `leftNav` (FeatureManager tree, 288px) + main `Stack`/`Prose`
- List/overview: `PageHeader` + `Stack` + `Card`/`LinkButton`
- Login: `narrow-shell` `Card` + `LinkButton`

## Preserve

- `.source-preview-popover` on hover portal wrapper
- `anim-fade-in`, `scroll-tame`
