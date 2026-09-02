# Chat UI — Implementation Reference

> **Status:** Current as of realtime assistant delivery fix (Batch 7 alignment).

FLUX chat lives at `/app/chat`. Messages are **sent via REST** and **received via Socket.IO** (user messages from others, system messages, and **FLUX assistant replies**).

Backend AI pipeline: [`../../expense-manager-backend/docs/ai-implementation.md`](../../expense-manager-backend/docs/ai-implementation.md).

---

## Architecture

```text
Send:    POST /threads/:id/messages  → optimistic bubble in UI
Receive: Socket.IO message.created   → append if not duplicate

AI reply (async, ~2–20s after send):
  backend debounce → LangGraph → createAssistant → message.created
```

Socket is **notify-only** — never used to send chat content.

---

## Key source files

| File | Role |
| --- | --- |
| `src/components/chat/chat-workspace.tsx` | Thread UI, optimistic send, realtime subscribe, pagination |
| `src/components/chat/message-bubble.tsx` | Role-based layout (user / assistant / system) |
| `src/components/chat/assistant-markdown-content.tsx` | Read-only BlockNote renderer for assistant Markdown |
| `src/components/chat/chat-composer.tsx` | Input, attachments, send |
| `src/lib/realtime/client.ts` | Socket.IO singleton, join/leave, `message.created` handler |
| `src/lib/auth/auth-provider.tsx` | Connects/disconnects realtime on login/logout |
| `src/lib/api/messages.ts` | REST message API |

---

## Connection lifecycle

1. **Login:** `AuthProvider` calls `realtimeClient.connect(token, appConfig.wsUrl)`.
2. **Open thread:** `ChatWorkspace` calls `realtimeClient.joinThread(threadId)` (with ack).
3. **Leave / unmount:** `leaveThread` + unsubscribe handler.
4. **Reconnect:** `RealtimeClient` re-joins `joinedThreadId` on `connect` event.
5. **Logout:** `disconnect()` clears socket and handlers.

**Env:** `NEXT_PUBLIC_WS_URL` optional; defaults to API host (`deriveWsUrl` from `NEXT_PUBLIC_API_URL`).

---

## Optimistic send

When the user sends a message:

1. A local bubble appears immediately with `sendStatus: "sending"` and a `clientKey`.
2. Optional file: blob preview → upload with progress → `attachmentIds` on create.
3. `POST /threads/:id/messages` persists the message.
4. On success, local bubble is replaced with server `id` and `sendStatus: "sent"`.
5. On failure, `sendStatus: "failed"` with retry via `onRetry`.

Own user messages arriving over Socket.IO are **skipped** — already shown optimistically.

---

## Realtime receive handler

In `chat-workspace.tsx`:

```typescript
// Skip own USER messages — already shown optimistically on send.
// Assistant replies share the same userId in personal threads.
if (user && event.message.role === "user" && event.message.userId === user.id) {
  return;
}
```

**Important:** Filtering by `userId` alone incorrectly drops FLUX assistant replies (they use the thread owner's `userId`). Always check `role === "user"` for the skip.

Additional guards:

- Ignore events for a different `threadId` than the active thread.
- Dedupe by `message.id` before append.
- Scroll to bottom; update read cursor (personal threads); `notifyThreadsChanged()` for sidebar.

---

## Local vs persisted thread IDs

New chats start with `local-{uuid}` in the URL. On first send:

1. `threadsApi.create` persists the thread.
2. URL is replaced with the MongoDB thread id.
3. Realtime join switches to the persisted id.

Realtime subscription requires a persisted thread id (`isPersistedThreadId`).

---

## Message roles and layout

| Role | Alignment | Avatar |
| --- | --- | --- |
| `user` | Right (own) / left (group member) | User or member |
| `assistant`, `tool` | Left | FLUX |
| `system` | Centered pill | None |

---

## Brand colors (chat bubbles)

Chat uses the unified **FLUX verdigris** palette (`docs/design-system.md`). Semantic tokens in `globals.css`:

| Element | Tokens / classes |
| --- | --- |
| Your messages | `bg-chat-user` → `--flux-chat-user` (green, white text) |
| FLUX replies | `bg-chat-assistant` → `--flux-bubble`; border `border-flux-bubble-border` |
| FLUX avatar ring | `ring-flux-bubble-border/40` |
| Links in attachments | `text-flux-accent` |

Landing hero demos use the same hues via `--landing-chat-user` / `--landing-flux-bubble` aliases.

---

## Pagination

- Page size: `30` (`MESSAGE_PAGE_SIZE`), max `50` on API.
- Initial load: latest page via `GET /threads/:id/messages`.
- Scroll up (threshold ~80px): load older with `before=<nextCursor>`.
- Messages stored chronologically in component state.

---

## Read state

- **Personal threads:** `markThreadRead` / `persistThreadRead` on new messages.
- **Group threads:** read receipts not implemented server-side; FE skips mark-read calls.

---

## AI assistant behavior (backend contract)

| Behavior | Status |
| --- | --- |
| Auto-reply after user message (debounced) | **Live** when `GEMINI_API_KEY` set |
| Multi-expense from one message | **Live** (Batch 7) |
| Reply delivered via `message.created` | **Live** |
| Rich assistant Markdown rendering | **Live** — BlockNote read-only viewer (`tryParseMarkdownToBlocks`) |
| Typing / "FLUX is thinking…" indicator | **Not implemented** |
| Expense cards from `message.expenseIds` | **Not implemented** (ids stored; UI shows text only) |
| Structured clarification UI | **Not implemented** (plain text bubbles) |

Typical latency: debounce (`AI_DEBOUNCE_MS`, default 1.5s) + 2 LLM calls + DB writes (~5–20s total).

---

## Attachments

1. Validate type/size client-side.
2. Upload via `filesApi.upload` (Cloudinary).
3. Pass `attachmentIds` on message create.
4. Hydrate attachment metadata when loading history.

---

## Sidebar refresh

Thread list does not subscribe to Socket.IO directly. Chat calls `notifyThreadsChanged()` (custom DOM event) after send/receive so the sidebar refetches last-message previews.

---

## Known gaps (planned / not started)

- Agent processing spinner while debounce + graph run
- Inline expense preview linked from `expenseIds`
- SSE fallback client (backend batch R5)
- Settlement / split UI (`/app/settlements` placeholder)
