# Realtime messaging (Socket.IO)

Canonical plan:

→ `expense-manager-backend/docs/realtime-socketio-plan.md`

**Status:** **R1–R4 done** — live chat (personal + group) via Socket.IO. **R5** (SSE) not started.

**Env:** `NEXT_PUBLIC_WS_URL` optional; defaults to API host (`http://localhost:5050` when API is `http://localhost:5050/api/v1`). Backend `FRONTEND_URL` must match this app's origin for CORS.

---

## Frontend implementation

| Concern | Implementation |
| --- | --- |
| Client | `src/lib/realtime/client.ts` — singleton, JWT handshake, `message.created` listener |
| Connect | `AuthProvider` on login; disconnect on logout |
| Thread rooms | `ChatWorkspace` calls `joinThread` / `leaveThread` on active thread change |
| Send path | Always REST `POST /threads/:id/messages` — socket is notify-only |
| Receive path | Append on `message.created` if `message.id` not already in list |

### Own-message vs assistant filtering

User messages are shown **optimistically** on send. The realtime handler skips events where `role === "user"` and `userId === currentUser.id`.

**FLUX assistant replies** use `role: "assistant"` (same `userId` as the thread owner in personal threads) — they must **not** be filtered by `userId` alone. See `docs/chat.md` for details.

### Files

- `src/lib/realtime/client.ts`
- `src/components/chat/chat-workspace.tsx`
- `src/lib/auth/auth-provider.tsx`

**Chat UI (full flow):** [`docs/chat.md`](chat.md)
