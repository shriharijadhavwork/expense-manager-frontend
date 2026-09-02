# FLUX design system — color palette

> **Status:** Unified verdigris brand (Batches 1–5). Single source of truth in `src/app/globals.css`.

## Overview

FLUX uses a **verdigris green** brand (oklch hue ~165) across the landing page and signed-in app. Previously the app chat used a separate blue palette; semantic tokens now reference canonical `--flux-*` variables.

| Surface | Scope | Dark mode |
| --- | --- | --- |
| **App** (`/app/**`) | `:root` / `.dark` `--flux-*` → semantic tokens | Yes |
| **Landing** (`/`) | `.landing` pins light `--flux-*`; `--landing-*` aliases | Always light |

## Canonical tokens (`--flux-*`)

Defined on `:root` (light) and `.dark` (dark). Exposed to Tailwind as `bg-flux-accent`, `text-flux-chat-user-fg`, etc.

| Token | Light role | App usage |
| --- | --- | --- |
| `--flux-accent` | Verdigris primary | `--primary`, `--info`, buttons, links |
| `--flux-accent-fg` | Text on accent | `--primary-foreground` |
| `--flux-accent-soft` | Soft green fill | `--accent`, doc attachment chips |
| `--flux-bubble` | FLUX reply surface | `--chat-assistant` background |
| `--flux-bubble-border` | Assistant ring/border | Assistant bubble border, avatar ring |
| `--flux-chat-user` | User message bubble (soft tint) | `--chat-user` |
| `--flux-chat-user-fg` | User bubble text | `--chat-user-foreground` |
| `--flux-chat-user-border` | User bubble outline | `--chat-user-border` |
| `--flux-bg` / `--flux-fg` | Warm paper / ink | Landing backgrounds (via aliases) |
| `--flux-muted` / `--flux-border` / `--flux-surface` | Surfaces | Panels, borders |
| `--flux-warm` | Warm highlight | Landing gradients |
| `--flux-friction` / `--flux-friction-soft` | Problem/contrast accent | Landing “traditional tracker” sections |

## Semantic wiring (app)

These map to `--flux-*` in `globals.css` (Batch 2):

- `--primary`, `--info`, `--success`, `--income` → `--flux-accent`
- `--chat-user` → `--flux-chat-user`
- `--chat-assistant` → `--flux-bubble`
- `--sidebar-primary` → `--flux-accent`

Chat components also use explicit Tailwind classes where needed: `text-flux-accent`, `border-flux-bubble-border`, `bg-flux-accent-soft` (Batch 3).

## Landing aliases (Batch 4)

Inside `.landing`:

1. Light `--flux-*` values are **re-pinned** (so `html.dark` does not affect `/`).
2. `--landing-accent` → `var(--flux-accent)`, etc.

Landing components still use `bg-landing-accent`, `text-landing-muted`, … — no TSX renames required.

## Chat bubble colors

| Bubble | CSS tokens | Tailwind (examples) |
| --- | --- | --- |
| Own user | `--chat-user` + border | `bg-chat-user border-chat-user-border` (content-width, compact padding) |
| Group peer | `--chat-peer` | `bg-chat-peer` (neutral gray, unchanged) |
| FLUX assistant | `--chat-assistant` + bubble border | `bg-chat-assistant border-flux-bubble-border/40` |

Matches landing demo bubbles (`--landing-chat-user`, `--landing-flux-bubble`).

## Visual QA checklist

After palette changes, spot-check:

- [ ] **`/`** — verdigris CTAs, green user bubbles in hero demo, warm paper background (unchanged from pre-unification)
- [ ] **`/app/chat` (light)** — green user bubbles, soft-green FLUX replies, verdigris primary buttons
- [ ] **`/app/chat` (dark)** — green user bubbles (not blue), dark green assistant bubbles
- [ ] **`/login`, `/register`** — primary submit buttons verdigris
- [ ] **Sidebar / thread list** — unread dot `bg-flux-accent`; active states use brand green
- [ ] **Settings theme toggle** — landing `/` still light when app is dark

```bash
cd frontend && npm run dev
# Light: default or Settings → Light
# Dark: Settings → Dark, then revisit /app/chat
```

## Related docs

- [`landing-page.md`](landing-page.md) — landing sections and `--landing-*` aliases
- [`chat.md`](chat.md) — chat UI and bubble layout
- [`../README.md`](../README.md) — frontend overview
