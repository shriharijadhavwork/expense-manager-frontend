# FLUX design system — color palette

> **Status:** Unified **Mercury-inspired** palette (Onyx / Graphite / Obsidian / Cobalt), applied app-wide. Single source of truth in `src/app/globals.css`.

## Overview

FLUX uses a **Mercury-inspired**, dark-first palette — near-black **Onyx** backgrounds, **Graphite**/**Obsidian** surface tiers, and a single **Cobalt** accent (`#5266eb`) — across the landing page, the signed-in app (light *and* dark mode), and chat. There is one brand accent color used everywhere; nothing in the product uses the old verdigris green anymore.

| Surface | Scope | Modes |
| --- | --- | --- |
| **App** (`/app/**`) | `:root` / `.dark` `--flux-*` → semantic tokens | Light + Dark — user-selectable, Settings → Appearance |
| **Landing** (`/`) | `.landing` pins its own dark palette | Always dark, independent of the app's theme setting |
| **Transactional email** | `expense-manager-backend/src/services/email/templates/layout.ts` | Always light — same values as the app's light mode, hardcoded as literal hex (email HTML can't read CSS custom properties) |

**History:** the app previously ran a separate verdigris-green palette from the landing page's own brand system. Both were unified onto the same Onyx/Graphite/Obsidian/Cobalt system in one pass: first the landing page, then chat + sidebar via a temporary scoped override, then that override's values were promoted directly into `:root`/`.dark` so the *entire* app (dashboard, expenses, settlements, settings, profile) shares one token source. The landing page intentionally remains its own always-dark scope — that's a deliberate product decision (matches the Mercury reference direction), not a leftover.

## Canonical tokens (`--flux-*`)

Defined on `:root` (light) and `.dark` (dark). Exposed to Tailwind as `bg-flux-accent`, `text-flux-chat-user-fg`, etc.

| Token | Light value | Dark value | App usage |
| --- | --- | --- | --- |
| `--flux-accent` | `#5266eb` (Cobalt) | `#5266eb` (Cobalt) | `--primary`, `--info`, `--success`, buttons, links |
| `--flux-accent-fg` | `#ffffff` | `#ffffff` | `--primary-foreground` — text on accent fills |
| `--flux-accent-soft` | `rgb(82 102 235 / .10)` | `rgb(82 102 235 / .16)` | `--accent`, chips, doc-attachment tiles |
| `--flux-bg` | `#f7f7fb` | `#171721` (Onyx) | `--background` |
| `--flux-fg` | `#16161f` | `#ededf3` | `--foreground` |
| `--flux-surface` | `#ffffff` | `#1e1e2a` (Graphite) | `--card`, `--popover`, `--composer-surface` |
| `--flux-elevated` | `#eef0f6` | `#272735` (Obsidian) | `bg-flux-elevated` — nested/interactive surface tier |
| `--flux-muted` | `#6b6b78` | `#c3c3cc` | Secondary text |
| `--flux-border` | `rgb(20 20 31 / .08)` | `rgb(255 255 255 / .08)` | Hairline borders |
| `--flux-bubble` | `#ffffff` | `#1e1e2a` | `--chat-assistant` background |
| `--flux-bubble-border` | `rgb(20 20 31 / .08)` | `rgb(255 255 255 / .1)` | Assistant bubble border |
| `--flux-chat-user` | `#5266eb` | `#5266eb` | `--chat-user` — own message bubble |
| `--flux-chat-user-fg` | `#ffffff` | `#ffffff` | `--chat-user-foreground` |
| `--flux-chat-user-border` | `#4054c9` | `#4054c9` | `--chat-user-border` |
| `--flux-warm` | `#8b8fa3` | `#8b8fa3` | Secondary neutral (multi-series avatars/charts on landing) |
| `--flux-friction` / `--flux-friction-soft` | `#dc4a52` | `#e5646b` | Landing "traditional tracker" problem-panel accent |

`--expense` (`#ef4444` / `#f87171`) and `--destructive`/`--warning` are **not** brand-coupled and are unchanged — red/amber stay red/amber in both palettes.

## Semantic wiring (app)

These map to `--flux-*` in `globals.css`:

- `--primary`, `--info`, `--success`, `--income` → `--flux-accent`
- `--chat-user` → `--flux-chat-user`
- `--chat-assistant` → `--flux-bubble`
- `--sidebar-primary` → `--flux-accent`

Chat components also use explicit Tailwind classes where needed: `text-flux-accent`, `border-flux-bubble-border`, `bg-flux-accent-soft`, `bg-flux-elevated`.

## Landing aliases

Inside `.landing`:

1. Its own dark Mercury values are **pinned** (so the app's light/dark toggle, `html.dark`, does not affect `/`).
2. `--landing-accent` → `var(--flux-accent)`, etc. — same alias mechanism as before, values are just Cobalt now instead of verdigris.

Landing components still use `bg-landing-accent`, `text-landing-muted`, … — no TSX renames were needed to make the switch.

## Chat bubble colors

| Bubble | CSS tokens | Tailwind (examples) |
| --- | --- | --- |
| Own user | `--chat-user` + border | `bg-chat-user border-chat-user-border` — Cobalt fill, white text |
| Group peer | `--chat-peer` | `bg-chat-peer` — neutral Graphite/Obsidian tint, not accent-colored |
| FLUX assistant | `--chat-assistant` + bubble border | `bg-chat-assistant border-flux-bubble-border` — Graphite card, single subtle border (no stacked ring/shadow) |

Landing hero demos use the same hues via `--landing-chat-user` / `--landing-flux-bubble` aliases.

## Typography

**Geist Sans** for everything — headings included. `--font-display` now resolves to Geist Sans app-wide; **Instrument Serif has been removed from the codebase** (font loader deleted from `src/app/layout.tsx`, no component references it). Geist Mono is still used for monospaced amounts (`font-mono tabular-nums`).

> If you're adding a heading and reaching for `font-display`, know that it's an alias for the sans stack now, not a serif — kept as a semantic token in case the display treatment needs to diverge from body copy again later, not because it currently renders differently.

## Shape language

- **Primary/secondary CTAs:** pill-shaped (`rounded-full`) — landing hero, nav, expenses page actions, dialog confirm buttons.
- **Cards/panels:** `--radius-md` (12px) is the default card radius app-wide.
- **Chat bubbles:** keep their own tail-corner radius convention (`rounded-[1.125rem]` with a tighter corner on the "tail" side) — not part of the pill/card system, don't change to match buttons.
- Borders are minimal (hairline, ~8% opacity) and shadows are restrained — avoid stacking border + ring + shadow on the same element (see the Chat bubble note above for the pattern to follow).

## Visual QA checklist

After palette changes, spot-check:

- [ ] **`/`** — Onyx background, Cobalt CTAs/user bubbles, no green or warm-paper remnants
- [ ] **`/app/chat` (light)** — off-white background, white cards, Cobalt user bubbles, Graphite assistant bubbles
- [ ] **`/app/chat` (dark)** — Onyx background, Graphite cards, Cobalt user bubbles (not blue-gray, not green)
- [ ] **`/app`, `/app/expenses`, `/app/settlements`, `/app/settings`, `/app/profile`** — same palette as chat in both modes (all share `:root`/`.dark` now — there is no separate "app" vs "chat" palette anymore)
- [ ] **`/login`, `/register`** — primary submit buttons Cobalt
- [ ] **Sidebar / thread list** — unread dot and active-thread state use Cobalt, not green
- [ ] **Dialogs/popovers opened from chat or the sidebar** (rename/delete conversation, user menu, group members, attachment preview) — Cobalt/Mercury, not the old palette. These render via a portal to `document.body`; if a *new* one is added outside the app's normal token cascade, confirm it isn't accidentally escaping the theme.
- [ ] **Settings → Appearance → Light/Dark/System** — both modes stay on the Mercury/Cobalt system; only the surface lightness changes, not the brand hue

```bash
cd frontend && npm run dev
# Light: default or Settings → Light
# Dark: Settings → Dark
```

## Related docs

- [`landing-page.md`](landing-page.md) — landing sections and `--landing-*` aliases
- [`chat.md`](chat.md) — chat UI and bubble layout
- [`../README.md`](../README.md) — frontend overview
- [`../../expense-manager-backend/docs/email-and-auth-plan.md`](../../expense-manager-backend/docs/email-and-auth-plan.md) — transactional email templates on the same palette
