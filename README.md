# FLUX — Frontend

Next.js web client for the expense-manager backend. The product is branded **FLUX** (*Go live. Spend. — We'll keep score.*).

Public visitors land on a marketing page at `/`. Signed-in users use `/app` for expenses, chat, and settings. The frontend is a REST (+ Socket.IO) client only — no direct MongoDB, Gemini, or LangGraph access. See `docs/plan.md`.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4 + shadcn/Base UI components
- Socket.IO client (realtime chat)
- Vercel-ready (`NEXT_PUBLIC_API_URL`)

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Default API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:5050/api/v1
```

Ensure the backend is running with `FRONTEND_URL=http://localhost:3000` for CORS and Socket.IO.

**Realtime:** connects to `NEXT_PUBLIC_WS_URL` or the API host (`http://localhost:5050`). See `docs/realtime-socketio-plan.md`.

## Scripts

```bash
npm run dev
npm run build
npm start
npm run lint
npm test
```

## Routes

| Path | Auth | Notes |
| --- | --- | --- |
| `/` | Public | **FLUX landing page** — marketing, illustrative demos |
| `/login`, `/register` | Guest | Auth; Bearer token stored locally |
| `/forgot-password`, `/reset-password`, `/verify-email` | Guest / partial | Email flows |
| `/invites/[token]` | Public preview | Group invite |
| `/app` | Required | Dashboard (live expense aggregates) |
| `/app/expenses` | Required | Create / list / search / edit / delete |
| `/app/chat` | Required | Threads + messages + Socket.IO realtime |
| `/app/threads` | Required | Thread list |
| `/app/settlements` | Required | Placeholder (no settlement API yet) |
| `/app/settings`, `/app/profile` | Required | Preferences, account |

## Landing page

Implemented in `src/components/landing/`. Full documentation:

**[`docs/landing-page.md`](docs/landing-page.md)**

Includes section map, design tokens, capability matrix (what is live vs illustrative), and editing guidelines.

Backend alignment for trust copy and feature claims: `../expense-manager-backend/docs/frontend-integration.md`.

## Architecture

```text
Browser
  ↓ REST + Socket.IO
Node.js API (expense-manager-backend)
  ↓
MongoDB / Cloudinary
```

API calls go through `src/lib/api/` — avoid raw `fetch` in page components.

## Docs

| Doc | Purpose |
| --- | --- |
| `docs/landing-page.md` | FLUX marketing page |
| `docs/plan.md` | Frontend implementation plan |
| `docs/email-and-auth-plan.md` | Auth UI + email flows |
| `docs/groups-and-threads-plan.md` | Group chat |
| `docs/realtime-socketio-plan.md` | Live messages |
