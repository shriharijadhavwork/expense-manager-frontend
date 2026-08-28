# FLUX landing page

> **Status:** Implemented (v1). Public marketing surface at `/`.

## Product

| Item | Value |
| --- | --- |
| **Name** | FLUX (`appConfig.appName` in `src/config/env.ts`) |
| **Tagline** | Go live. Spend. — We'll keep score. |
| **Positioning** | AI-first personal finance — talk naturally about money instead of maintaining spreadsheets |

The landing page sells the **product vision**. Several demos are explicitly labeled *illustrative* because the corresponding backend capabilities are not fully built yet (see [Capability matrix](#capability-matrix)).

## Route

| Path | Auth | Description |
| --- | --- | --- |
| `/` | Public | Marketing landing page |
| `/register`, `/login` | Guest | Auth entry; CTAs from landing point here |
| `/app/**` | Required | Signed-in product (dashboard, chat, expenses, …) |

Previously `/` redirected to `/app`. It now renders the landing page for all visitors. Nav uses **Start with FLUX** / **Open app**; the hero primary CTA uses **Talk to FLUX**.

## Page structure

Sections render top-to-bottom in `src/app/page.tsx`:

| # | Section component | `id` anchor | Notes |
| --- | --- | --- | --- |
| 1 | `LandingNav` | — | Sticky header, auth-aware CTAs |
| 2 | `LandingHero` | `how-it-works` | Copy + macOS-style animated demo carousel |
| 3 | `SectionProblem` | `the-problem` | Traditional vs FLUX flow comparison |
| 4 | `SectionConversation` | `conversational-tracking` | Four static NL → record examples |
| 5 | `SectionTogether` | `track-together` | Group / household / quarterly insight threads |
| 6 | `SectionMemory` | `memory` | Flat vs contextual record + follow-up Q |
| 7 | `SectionMoneyFlow` | `money-flow` | Typographic income → balance flow |
| 8 | `SectionAskFlux` | `ask-flux` | Interactive question tabs + answers |
| 9 | `SectionInsights` | `insights` | Example insight lines |
| 10 | `SectionTrust` | `trust` | Factual security copy (matches backend) |
| 11 | `SectionFinalCta` | `get-started` | Closing CTA |
| 12 | `LandingFooter` | — | Links + tagline |

Hero demo anchor: `#conversation-demo` (used by nav).

## Hero demo

The hero product preview (`hero-product-preview.tsx`) is a **tilted macOS window** with:

- Dark title bar + traffic lights
- **Fixed-height** chat viewport (`HERO_CHAT_VIEWPORT_CLASS` in `landing-styles.ts`) — messages scroll inside; the frame never grows
- **Swiper carousel** with three looping scenarios (`conversation-scenarios.ts`):
  1. **Weekend trip** — group splits + who owes whom
  2. **Home · with Arjun** — household splits + shared spend summary
  3. **Insights** — quarterly in/out, ranked categories, email summary
- **Carousel controls** (`hero-carousel-controls.tsx`): dot navigation + pause auto-advance
  - **Play:** conversation ends → swipe to next slide
  - **Pause auto-advance:** conversation ends → replay same slide (chat keeps animating)
- Message types: user bubble, `flux-structured`, `flux-breakdown`, `flux-text`
- Animation engine: `conversation-demo-animation.ts` + staged reveals in `conversation-demo.tsx`
- Dependencies: `swiper`, `react-parallax-tilt`

Hero copy order: headline → tagline → description → CTAs. Copy and preview columns share a fixed min-height for vertical alignment.

## File layout

```text
src/app/page.tsx
src/app/globals.css              # --landing-* tokens, hero carousel + chat scroll CSS
src/components/landing/
  landing-shell.tsx
  landing-nav.tsx
  landing-footer.tsx
  landing-cta.tsx                # Auth-aware CTA (hero overrides labels)
  landing-hero.tsx
  landing-section.tsx
  hero-product-preview.tsx       # macOS frame + tilt
  hero-conversation-carousel.tsx
  hero-carousel-controls.tsx
  conversation-demo.tsx
  conversation-demo-animation.ts
  conversation-scenarios.ts
  conversation-exchange.tsx
  flux-reply-card.tsx
  ask-flux-interactive.tsx
  section-*.tsx
  landing-disclaimer.tsx
  landing-tagline.tsx
  landing-styles.ts
  use-prefers-reduced-motion.ts
```

## Design system (landing-scoped)

Tokens live on `.landing` in `globals.css` so the signed-in app (`/app`) palette is unchanged.

| Token | Role |
| --- | --- |
| `--landing-bg` | Warm paper background |
| `--landing-fg` | Ink text |
| `--landing-muted` | Secondary copy |
| `--landing-border` | Hairline borders |
| `--landing-surface` | Elevated panels |
| `--landing-accent` | Verdigris — CTAs, user chat bubbles |
| `--landing-accent-soft` | FLUX reply bubbles |
| `--landing-accent-fg` | Text on accent fills |
| `--landing-warm` | Tagline em-dash highlight |

Typography: **Instrument Serif** (headlines), **Geist Sans** (body), **Geist Mono** (amounts).

## SEO

Defined in `src/app/page.tsx` `metadata`:

- Title: `FLUX — Go live. Spend. We'll keep score.`
- Meta description, Open Graph, Twitter card
- `applicationName: "Flux"`

OG image is not generated yet — add later (`@vercel/og` or static asset).

## Capability matrix

Use this when updating copy or demos. **Do not claim features as live unless the backend supports them.**

| Landing claim | Backend / app status |
| --- | --- |
| Account-scoped expenses, threads, messages | **Live** — JWT auth, per-user data |
| bcrypt passwords, email verification | **Live** — see `expense-manager-backend/README.md` |
| Manual expense CRUD + category filters | **Live** — `/app/expenses`, dashboard aggregates |
| Chat threads + messages + Socket.IO realtime | **Live** — no AI assistant replies yet |
| Natural language → structured expense | **Not implemented** — demos are illustrative |
| Income / transfers / balance flow | **Not implemented** — money-flow section is illustrative |
| Conversational Q&A (“How much with Rahul?”) | **Not implemented** — ask-flux section is illustrative |
| Group splits / shared balances | **Not implemented** — together + hero demos illustrative |
| Quarterly summaries / email reports | **Not implemented** — hero + ask-flux illustrative |
| Comparative / pattern insights | **Partial** — month/category totals on dashboard; comparative insights illustrative |
| Settlements / balances | **Not implemented** — placeholder page |

## Development

```bash
cd frontend
npm run dev
# http://localhost:3000/
```

No extra env vars for the landing page. Auth-aware CTAs use the existing `AuthProvider`.

## Editing guidelines

1. **Keep disclaimers** on any demo that exceeds current API capabilities (`LandingDisclaimer`).
2. **Trust section** — only state what the backend actually does (see `section-trust.tsx` and backend README auth section).
3. **No decorative icons** — avatars only where they aid chat comprehension; pause/play on carousel controls is allowed.
4. **Prefer landing tokens** over app `--primary` inside `src/components/landing/`.
5. **Server components by default** — client only for animation/interaction (hero carousel, `conversation-demo`, `ask-flux-interactive`, `landing-nav`, `landing-cta`).
6. **Hero chat height** — use `HERO_CHAT_VIEWPORT_CLASS`; never `min-height` on the embedded demo (content scrolls inside).

## Related docs

- Backend integration & trust claims: `../expense-manager-backend/docs/frontend-integration.md`
- Auth flows: `docs/email-and-auth-plan.md`
- Product plan: `docs/plan.md`
