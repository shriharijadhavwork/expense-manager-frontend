# Expense Manager Frontend

Next.js web client for the expense-manager backend. Follows `docs/plan.md`: the frontend is a REST API client only (no direct MongoDB / Gemini / LangGraph / Slack access).

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
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

Ensure the backend is running and `FRONTEND_URL=http://localhost:3000` is set for CORS.

**Realtime (Socket.IO):** connects to `NEXT_PUBLIC_WS_URL` or the API host (`http://localhost:5050`). See `docs/realtime-socketio-plan.md`.

## Scripts

```bash
npm run dev
npm run build
npm start
npm run lint
```

## Routes

| Path | Notes |
| --- | --- |
| `/login`, `/register` | Auth (Bearer token stored locally) |
| `/app` | Overview dashboard from live expenses |
| `/app/expenses` | Create / list / search / edit / delete |
| `/app/chat` | Agent UI shell (send disabled until messaging API exists) |
| `/app/threads` | Thread list shell |
| `/app/settlements` | Settlement shell |
| `/app/settings` | Account, theme, security, integrations placeholder |

## Architecture

```text
Next.js
  ↓ REST
Node.js API
```

API calls go through `src/lib/api/` — not raw `fetch` in page components.
