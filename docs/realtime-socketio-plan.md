# Realtime messaging (Socket.IO)

Canonical plan:

→ `expense-manager-backend/docs/realtime-socketio-plan.md`

**Confirmed approach:** in-process Socket.IO, publish-after-persist gateway (SSE-ready), REST create + notify-only socket, `message.created` → `thread:{id}`.

Frontend work starts in **Batch R3** of that plan.
