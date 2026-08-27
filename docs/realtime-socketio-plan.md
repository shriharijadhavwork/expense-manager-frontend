# Realtime messaging (Socket.IO)

Canonical plan:

→ `expense-manager-backend/docs/realtime-socketio-plan.md`

**Status:** **R1–R4 done** — live group chat via Socket.IO. **R5** (SSE) not started.

**Env:** `NEXT_PUBLIC_WS_URL` optional; defaults to API host (`http://localhost:5050` when API is `http://localhost:5050/api/v1`). Backend `FRONTEND_URL` must match this app's origin for CORS.
