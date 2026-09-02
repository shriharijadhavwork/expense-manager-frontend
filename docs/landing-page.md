# FLUX landing page

> **Status:** Implemented (v1). Public marketing surface at `/`.

## Product

| Item | Value |
| --- | --- |
| **Name** | FLUX (`appConfig.appName` in `src/config/env.ts`) |
| **Tagline** | Go live. Spend. — We'll keep score. |
| **Positioning** | AI-first personal finance — talk naturally about money instead of maintaining spreadsheets |

The landing page sells the **product vision**. Demos for unshipped capabilities use `LandingDisclaimer` with an optional **Coming soon** badge (see [Capability matrix](#capability-matrix)).

## Route

| Path | Auth | Description |
| --- | --- | --- |
| `/` | Public | Marketing landing page |
| `/register`, `/login` | Guest | Auth entry; CTAs from landing point here |
| `/app/**` | Required | Signed-in product (dashboard, chat, expenses, …) |

Previously `/` redirected to `/app`. It now renders the landing page for all visitors. Primary CTA label is **Talk to FLUX** (guests → `/register`; signed-in → `/app`).

## Page structure

Sections render top-to-bottom in `src/app/page.tsx`:

| # | Section component | `id` anchor | Notes |
| --- | --- | --- | --- |
| 1 | `LandingNav` | — | Sticky header; **See how it works** → `#the-problem` |
| 2 | `LandingHero` | — | Copy + macOS-style animated demo carousel |
| 3 | `SectionProblem` | `the-problem` | Traditional form vs FLUX chat + timeline |
| 4 | `SectionConversation` | `conversational-tracking` | Three-step pipeline (mention → structure → move on) |
| 5 | `SectionTogether` | `track-together` | Thread rail + bento (trip, household, quarterly radar) |
| 6 | `SectionMemory` | `memory` | Memory layers + structured recall panel |
| 7 | `SectionAskFlux` | `ask-flux` | Category filters + interactive answer cards |
| 8 | `SectionInsights` | `insights` | Pattern layer bento with mini charts |
| 9 | `SectionFinalCta` | `get-started` | Closing CTA |
| 10 | `LandingFooter` | — | Links + copyright |

Hero carousel element: `#conversation-demo` on `hero-product-preview.tsx` (deep-link only; nav does not use it).

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
- Dependencies: `swiper`, `react-parallax-tilt`, `lenis` (smooth scroll via `landing-smooth-scroll.tsx`)

Hero copy order: headline → tagline → description → CTAs. Copy and preview columns share a fixed min-height for vertical alignment.

## File layout

```text
src/app/page.tsx
src/app/opengraph-image.tsx       # Generated OG/Twitter card image
src/app/globals.css               # --landing-* tokens, scroll reveals, section panels
src/components/landing/
  landing-shell.tsx
  landing-smooth-scroll.tsx
  landing-nav.tsx
  landing-footer.tsx
  landing-cta.tsx
  landing-secondary-cta.tsx
  landing-hero.tsx
  landing-section.tsx
  landing-disclaimer.tsx
  hero-product-preview.tsx
  hero-conversation-carousel.tsx
  hero-carousel-controls.tsx
  conversation-demo.tsx
  conversation-demo-animation.ts
  conversation-scenarios.ts
  conversation-exchange.tsx
  flux-reply-card.tsx
  spending-radar-chart.tsx
  ask-flux-interactive.tsx
  section-problem.tsx
  section-conversation.tsx
  section-together.tsx
  section-memory.tsx
  section-ask-flux.tsx
  section-insights.tsx
  section-final-cta.tsx
  landing-tagline.tsx
  landing-styles.ts
  use-prefers-reduced-motion.ts
```

## Design system (landing-scoped)

Tokens live on `.landing` in `globals.css`. The landing page **always uses the light palette** — it does not follow app/system dark mode (`/app` still respects theme).

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
| `--landing-friction` | Problem / traditional tracker accent |

Typography: **Instrument Serif** (`font-display`, headlines), **Geist Sans** (body), **Geist Mono** (amounts).

Scroll: Lenis smooth scroll with `prefers-reduced-motion` fallback; section reveals via CSS `animation-timeline: view()`.

## SEO

Defined in `src/app/page.tsx` `metadata` plus `src/app/opengraph-image.tsx`:

- Title: `FLUX — Go live. Spend. We'll keep score.`
- Meta description, Open Graph, Twitter `summary_large_image`
- `applicationName: "Flux"`
- OG image: auto-generated 1200×630 PNG from `opengraph-image.tsx`

## Capability matrix

Use this when updating copy or demos. **Do not claim features as live unless the backend supports them.**

| Landing claim | Backend / app status |
| --- | --- |
| Account-scoped expenses, threads, messages | **Live** — JWT auth, per-user data |
| bcrypt passwords, email verification | **Live** — see `expense-manager-backend/README.md` |
| Manual expense CRUD + category filters | **Live** — `/app/expenses`, dashboard aggregates |
| Chat threads + messages + Socket.IO realtime + FLUX assistant replies | **Live** — assistant arrives via `message.created` after debounced AI turn |
| Natural language → structured expense (chat) | **Live** — backend AI extracts and creates expenses; landing demos remain illustrative |
| Conversational Q&A (“How much with Rahul?”) | **Partially live** — `query_expenses` intent in chat; landing ask-flux section still “Coming soon” |
| Group splits / shared balances | **Not implemented** — together section (Coming soon) |
| Quarterly summaries / pattern insights | **Not implemented** — insights section (Coming soon) |
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
2. **No decorative icons** — avatars only where they aid chat comprehension; pause/play on carousel controls is allowed.
3. **Prefer landing tokens** over app `--primary` inside `src/components/landing/`.
4. **Server components by default** — client only for animation/interaction (hero carousel, `conversation-demo`, `ask-flux-interactive`, `landing-nav`, `landing-cta`, `landing-smooth-scroll`, `spending-radar-chart`).
5. **Hero chat height** — use `HERO_CHAT_VIEWPORT_CLASS`; never `min-height` on the embedded demo (content scrolls inside).
6. **Section variety** — avoid duplicating the same UI pattern across sections (comparison cards only in Problem; animated chat only in Hero).

## Related docs

- Backend integration: `../expense-manager-backend/docs/frontend-integration.md`
- Auth flows: `docs/email-and-auth-plan.md`
- Product plan: `docs/plan.md`
