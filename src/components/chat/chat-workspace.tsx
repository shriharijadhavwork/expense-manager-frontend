"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { ChatAttachment } from "@/components/chat/attachment-card";
import { ChatComposer } from "@/components/chat/chat-composer";
import { MessageBubble } from "@/components/chat/message-bubble";
import { ErrorState } from "@/components/shared/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api/client";
import { filesApi } from "@/lib/api/files";
import { messagesApi } from "@/lib/api/messages";
import { threadsApi } from "@/lib/api/threads";
import { isLocalThreadId, isPersistedThreadId } from "@/lib/chat/local-thread";
import { isAllowedAttachment } from "@/lib/files/attachment-policy";
import { shouldPersistReadState } from "@/lib/chat/thread-read-state";
import { notifyThreadsChanged } from "@/lib/chat/thread-events";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { store } from "@/lib/store";
import {
  fetchThread,
  markThreadRead,
  selectThreadById,
  upsertThread,
} from "@/lib/store/thread-slice";
import type { DisplayMessage } from "@/components/chat/types";

import type { Message, Thread, UploadedFile } from "@/types/api";

const MESSAGE_PAGE_SIZE = 30;
const LOAD_OLDER_THRESHOLD_PX = 80;

type PendingSend = {
  clientKey: string;
  content: string;
  file: File | null;
};

function createClientKey(): string {
  return `temp-${crypto.randomUUID()}`;
}

function revokePreview(url: string | undefined) {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

function fallbackMime(fileName: string): string {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".doc")) return "application/msword";
  if (lower.endsWith(".docx")) {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".heic") || lower.endsWith(".heif")) return "image/heic";
  return "image/jpeg";
}

function toChatAttachment(
  file: UploadedFile,
  status: ChatAttachment["status"] = "uploaded",
  progress = 100,
  previewUrl?: string,
): ChatAttachment {
  return {
    id: file.id,
    name: file.name,
    type: file.mimeType,
    size: file.size,
    previewUrl: previewUrl ?? file.thumbnailUrl ?? file.url,
    fileUrl: file.url,
    status,
    progress,
  };
}

function resolveMessageContent(text: string, hasAttachment: boolean): string {
  const trimmed = text.trim();
  if (trimmed) {
    return trimmed;
  }

  return hasAttachment ? "Receipt attached" : trimmed;
}

function createLocalThreadPlaceholder(threadId: string): Thread {
  const now = new Date().toISOString();

  return {
    id: threadId,
    userId: "",
    title: "New conversation",
    lastActivityAt: now,
    readAt: null,
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
    lastMessage: null,
  };
}

type ChatWorkspaceProps = {
  threadId: string;
  onThreadIdChange?: (threadId: string) => void;
  skipInitialLoadRef?: React.MutableRefObject<boolean>;
};

export function ChatWorkspace({
  threadId,
  onThreadIdChange,
  skipInitialLoadRef,
}: ChatWorkspaceProps) {
  const dispatch = useAppDispatch();
  const [persistedThreadId, setPersistedThreadId] = useState<string | null>(() =>
    isPersistedThreadId(threadId) ? threadId : null,
  );
  const activeThreadId = isPersistedThreadId(threadId)
    ? threadId
    : persistedThreadId;
  const storedThread = useAppSelector((state) =>
    activeThreadId ? selectThreadById(state, activeThreadId) : undefined,
  );
  const thread =
    isLocalThreadId(threadId) && !persistedThreadId
      ? createLocalThreadPlaceholder(threadId)
      : (storedThread ?? null);
  const [threadLoadStatus, setThreadLoadStatus] = useState<
    "idle" | "loading" | "error"
  >("idle");
  const [threadError, setThreadError] = useState<string | null>(null);
  const threadStatus =
    isLocalThreadId(threadId) && !persistedThreadId
      ? "success"
      : storedThread
        ? "success"
        : threadLoadStatus === "error"
          ? "error"
          : "loading";
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [messagesStatus, setMessagesStatus] = useState<
    "loading" | "success" | "error"
  >(() => (isLocalThreadId(threadId) ? "success" : "loading"));
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState<ChatAttachment | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const pendingFileRef = useRef<File | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const shouldScrollToBottomRef = useRef(true);
  const isPrependingRef = useRef(false);
  const attachmentCacheRef = useRef<Map<string, ChatAttachment>>(new Map());
  const pendingRetryRef = useRef<Map<string, PendingSend>>(new Map());
  const messagesRef = useRef<DisplayMessage[]>([]);
  const persistPromiseRef = useRef<Promise<string> | null>(null);
  const apiThreadIdRef = useRef<string | null>(
    isPersistedThreadId(threadId) ? threadId : null,
  );

  const persistThreadRead = useCallback(
    (targetThreadId: string, readAt?: string) => {
      if (!shouldPersistReadState(targetThreadId)) {
        return;
      }

      void dispatch(markThreadRead({ threadId: targetThreadId, readAt }));
    },
    [dispatch],
  );

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const hydrateAttachments = useCallback(
    async (items: Message[]): Promise<Map<string, ChatAttachment[]>> => {
      const byMessage = new Map<string, ChatAttachment[]>();
      const missingIds = new Set<string>();

      for (const item of items) {
        const attachments: ChatAttachment[] = [];

        for (const fileId of item.attachmentIds) {
          const cached = attachmentCacheRef.current.get(fileId);
          if (cached) {
            attachments.push(cached);
            continue;
          }

          missingIds.add(fileId);
        }

        byMessage.set(item.id, attachments);
      }

      await Promise.all(
        [...missingIds].map(async (fileId) => {
          try {
            const metadata = await filesApi.getById(fileId);
            const attachment = toChatAttachment(metadata);
            attachmentCacheRef.current.set(fileId, attachment);
          } catch {
            attachmentCacheRef.current.set(fileId, {
              id: fileId,
              name: "Attachment",
              type: "application/octet-stream",
              size: 0,
              previewUrl: "",
              status: "error",
              progress: 0,
              error: "Could not load attachment",
            });
          }
        }),
      );

      for (const item of items) {
        byMessage.set(
          item.id,
          item.attachmentIds
            .map((fileId) => attachmentCacheRef.current.get(fileId))
            .filter((attachment): attachment is ChatAttachment =>
              Boolean(attachment),
            ),
        );
      }

      return byMessage;
    },
    [],
  );

  const mapToDisplayMessages = useCallback(
    async (items: Message[]): Promise<DisplayMessage[]> => {
      const attachmentsByMessage = await hydrateAttachments(items);

      return items.map((item) => ({
        ...item,
        clientKey: item.id,
        sendStatus: "sent" as const,
        attachments: attachmentsByMessage.get(item.id) ?? [],
      }));
    },
    [hydrateAttachments],
  );

  const loadThread = useCallback(async () => {
    if (isLocalThreadId(threadId) && !persistedThreadId) {
      setThreadLoadStatus("idle");
      setThreadError(null);
      return;
    }

    const id = isPersistedThreadId(threadId) ? threadId : persistedThreadId;
    if (!id) {
      return;
    }

    const existing = selectThreadById(store.getState(), id);
    if (existing) {
      setThreadLoadStatus("idle");
      setThreadError(null);
      return;
    }

    setThreadLoadStatus("loading");
    setThreadError(null);

    try {
      await dispatch(fetchThread(id)).unwrap();
      setThreadLoadStatus("idle");
    } catch (err) {
      setThreadError(
        err instanceof ApiError ? err.message : "Failed to load thread.",
      );
      setThreadLoadStatus("error");
    }
  }, [dispatch, persistedThreadId, threadId]);

  const loadLatestMessages = useCallback(async () => {
    const apiThreadId = apiThreadIdRef.current;

    if (!apiThreadId) {
      setMessages([]);
      setHasMore(false);
      setNextCursor(null);
      setMessagesStatus("success");
      setMessagesError(null);
      return;
    }

    setMessagesStatus("loading");
    setMessagesError(null);
    shouldScrollToBottomRef.current = true;

    try {
      const result = await messagesApi.list(apiThreadId, {
        limit: MESSAGE_PAGE_SIZE,
      });
      const display = await mapToDisplayMessages(result.items);
      setMessages(display);
      setHasMore(result.hasMore);
      setNextCursor(result.nextCursor);
      setMessagesStatus("success");

      const latest = display.at(-1);
      persistThreadRead(
        apiThreadId,
        latest?.createdAt ?? new Date().toISOString(),
      );
    } catch (err) {
      setMessagesError(
        err instanceof ApiError ? err.message : "Failed to load messages.",
      );
      setMessages([]);
      setMessagesStatus("error");
    }
  }, [mapToDisplayMessages, persistThreadRead]);

  const loadOlderMessages = useCallback(async () => {
    const apiThreadId = apiThreadIdRef.current;

    if (!apiThreadId || !nextCursor || loadingOlder || !hasMore) {
      return;
    }

    const node = scrollerRef.current;
    const previousScrollHeight = node?.scrollHeight ?? 0;
    const previousScrollTop = node?.scrollTop ?? 0;

    setLoadingOlder(true);
    isPrependingRef.current = true;

    try {
      const result = await messagesApi.list(apiThreadId, {
        limit: MESSAGE_PAGE_SIZE,
        before: nextCursor,
      });
      const display = await mapToDisplayMessages(result.items);

      setMessages((current) => [...display, ...current]);
      setHasMore(result.hasMore);
      setNextCursor(result.nextCursor);

      requestAnimationFrame(() => {
        const scroller = scrollerRef.current;
        if (!scroller) return;
        scroller.scrollTop =
          previousScrollTop + (scroller.scrollHeight - previousScrollHeight);
        isPrependingRef.current = false;
      });
    } catch {
      isPrependingRef.current = false;
    } finally {
      setLoadingOlder(false);
    }
  }, [hasMore, loadingOlder, mapToDisplayMessages, nextCursor]);

  const ensurePersistedThreadId = useCallback(async (): Promise<string> => {
    if (apiThreadIdRef.current) {
      return apiThreadIdRef.current;
    }

    if (!persistPromiseRef.current) {
      persistPromiseRef.current = threadsApi
        .create({})
        .then((created) => {
          apiThreadIdRef.current = created.id;
          dispatch(upsertThread(created));
          setPersistedThreadId(created.id);
          onThreadIdChange?.(created.id);
          return created.id;
        })
        .finally(() => {
          persistPromiseRef.current = null;
        });
    }

    return persistPromiseRef.current;
  }, [dispatch, onThreadIdChange]);

  useEffect(() => {
    if (skipInitialLoadRef?.current) {
      skipInitialLoadRef.current = false;
      return;
    }

    apiThreadIdRef.current = isPersistedThreadId(threadId) ? threadId : null;
    setPersistedThreadId(isPersistedThreadId(threadId) ? threadId : null);
    persistPromiseRef.current = null;
    pendingRetryRef.current.clear();
    setMessage("");
    pendingFileRef.current = null;
    setPending(null);
    setFileError(null);
    setHasMore(false);
    setNextCursor(null);
    setLoadingOlder(false);

    const frame = window.requestAnimationFrame(() => {
      void loadThread();
      void loadLatestMessages();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [loadLatestMessages, loadThread, skipInitialLoadRef, threadId]);

  useEffect(() => {
    const cache = attachmentCacheRef.current;

    return () => {
      revokePreview(pending?.previewUrl);
      cache.forEach((attachment) => {
        revokePreview(attachment.previewUrl);
      });
      for (const item of messagesRef.current) {
        for (const attachment of item.attachments) {
          revokePreview(attachment.previewUrl);
        }
      }
    };
  }, [pending?.previewUrl]);

  useLayoutEffect(() => {
    if (isPrependingRef.current || !shouldScrollToBottomRef.current) {
      return;
    }

    const node = scrollerRef.current;
    if (!node) return;

    node.scrollTop = node.scrollHeight;
    shouldScrollToBottomRef.current = false;
  }, [messages, pending, sending]);

  function onScroll() {
    const node = scrollerRef.current;
    if (!node || loadingOlder || !hasMore) {
      return;
    }

    if (node.scrollTop <= LOAD_OLDER_THRESHOLD_PX) {
      void loadOlderMessages();
    }
  }

  function clearPending() {
    revokePreview(pending?.previewUrl);
    setPending(null);
    pendingFileRef.current = null;
  }

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    setFileError(null);

    if (!selected) {
      return;
    }

    const validation = isAllowedAttachment(selected);
    if (!validation.ok) {
      setFileError(validation.error ?? "Unsupported file.");
      event.target.value = "";
      return;
    }

    revokePreview(pending?.previewUrl);
    pendingFileRef.current = selected;

    setPending({
      id: createClientKey(),
      name: selected.name,
      type: selected.type || fallbackMime(selected.name),
      size: selected.size,
      previewUrl: URL.createObjectURL(selected),
      status: "ready",
      progress: 0,
    });
  }

  const sendMessage = useCallback(
    async (input: PendingSend) => {
      const hasAttachment = Boolean(input.file);
      const content = resolveMessageContent(input.content, hasAttachment);

      if (!content && !hasAttachment) {
        return;
      }

      setSending(true);
      setFileError(null);

      const optimisticAttachment = input.file
        ? {
            id: input.clientKey,
            name: input.file.name,
            type: input.file.type || fallbackMime(input.file.name),
            size: input.file.size,
            previewUrl: URL.createObjectURL(input.file),
            status: "uploading" as const,
            progress: 0,
          }
        : null;

      const optimisticMessage: DisplayMessage = {
        id: input.clientKey,
        clientKey: input.clientKey,
        threadId,
        userId: thread?.userId ?? "",
        role: "user",
        content,
        attachmentIds: [],
        expenseIds: [],
        createdAt: new Date().toISOString(),
        sendStatus: "sending",
        attachments: optimisticAttachment ? [optimisticAttachment] : [],
      };

      pendingRetryRef.current.set(input.clientKey, input);
      shouldScrollToBottomRef.current = true;
      setMessages((current) => [...current, optimisticMessage]);

      try {
        let attachmentIds: string[] = [];
        const apiThreadId = await ensurePersistedThreadId();

        if (input.file) {
          const uploaded = await filesApi.upload(input.file, (progress) => {
            setMessages((current) =>
              current.map((item) => {
                if (item.clientKey !== input.clientKey) return item;
                return {
                  ...item,
                  attachments: item.attachments.map((attachment) => ({
                    ...attachment,
                    status: "uploading" as const,
                    progress,
                  })),
                };
              }),
            );
          });

          const attachment = toChatAttachment(uploaded);
          attachmentCacheRef.current.set(uploaded.id, attachment);
          attachmentIds = [uploaded.id];

          revokePreview(optimisticAttachment?.previewUrl);
        }

        const saved = await messagesApi.create(apiThreadId, {
          content,
          ...(attachmentIds.length > 0 ? { attachmentIds } : {}),
        });

        const savedDisplay = (await mapToDisplayMessages([saved]))[0];

        if (!savedDisplay) {
          throw new ApiError(
            500,
            "INTERNAL_ERROR",
            "Message saved but could not be displayed.",
          );
        }

        pendingRetryRef.current.delete(input.clientKey);
        setMessages((current) =>
          current.map((item) =>
            item.clientKey === input.clientKey
              ? {
                  ...savedDisplay,
                  sendStatus: "sent",
                }
              : item,
          ),
        );
        persistThreadRead(apiThreadId, saved.createdAt);
        notifyThreadsChanged();
      } catch (err) {
        const errorMessage =
          err instanceof ApiError ? err.message : "Failed to send message.";

        setMessages((current) =>
          current.map((item) => {
            if (item.clientKey !== input.clientKey) return item;

            return {
              ...item,
              sendStatus: "failed",
              errorMessage,
              attachments: item.attachments.map((attachment) => ({
                ...attachment,
                status:
                  attachment.status === "uploading"
                    ? ("error" as const)
                    : attachment.status,
                error: errorMessage,
              })),
            };
          }),
        );
      } finally {
        setSending(false);
      }
    },
    [ensurePersistedThreadId, mapToDisplayMessages, persistThreadRead, thread?.userId, threadId],
  );

  async function onSend() {
    const text = message.trim();
    const file = pendingFileRef.current;

    if ((!text && !file) || sending) {
      return;
    }

    const clientKey = createClientKey();
    const payload: PendingSend = {
      clientKey,
      content: text,
      file,
    };

    setMessage("");
    clearPending();
    await sendMessage(payload);
  }

  function onRetry(clientKey: string) {
    const payload = pendingRetryRef.current.get(clientKey);
    if (!payload || sending) {
      return;
    }

    setMessages((current) =>
      current.filter((item) => item.clientKey !== clientKey),
    );
    void sendMessage(payload);
  }

  const canSend =
    Boolean(threadStatus === "success" && (message.trim() || pending)) &&
    !sending;

  if (threadStatus === "loading") {
    return (
      <div className="flex min-h-0 flex-1 flex-col px-4 py-6 sm:px-6">
        <div className="mx-auto w-full max-w-3xl space-y-4">
          <Skeleton className="mx-auto h-5 w-40" />
          <Skeleton className="ml-auto h-12 w-2/3 max-w-sm rounded-[1.25rem]" />
          <Skeleton className="mr-auto h-10 w-1/2 max-w-xs" />
        </div>
      </div>
    );
  }

  if (threadStatus === "error") {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center px-4">
        <ErrorState
          description={threadError ?? "Thread not found."}
          onRetry={() => void loadThread()}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background">
      <header className="flex shrink-0 items-center justify-center px-4 py-3 sm:px-6">
        <h1 className="max-w-[min(100%,680px)] truncate text-sm font-medium text-muted-foreground">
          {thread?.title ?? "Chat"}
        </h1>
      </header>

      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className="min-h-0 flex-1 overflow-y-auto px-4 py-2 sm:px-6"
      >
        {loadingOlder ? (
          <div className="mb-4 flex justify-center">
            <span className="text-xs text-muted-foreground">
              Loading earlier messages…
            </span>
          </div>
        ) : null}

        {messagesStatus === "loading" ? (
          <div className="mx-auto max-w-3xl space-y-4">
            <Skeleton className="ml-auto h-14 w-2/3 max-w-sm rounded-[1.15rem]" />
            <Skeleton className="mr-auto h-12 w-1/2 max-w-xs rounded-[1.15rem]" />
          </div>
        ) : null}

        {messagesStatus === "error" ? (
          <ErrorState
            description={messagesError ?? "Failed to load messages."}
            onRetry={() => void loadLatestMessages()}
          />
        ) : null}

        {messagesStatus === "success" && messages.length === 0 ? (
          <div className="flex h-full min-h-[240px] flex-col items-center justify-center px-4 text-center">
            <h3 className="text-2xl font-medium tracking-tight text-foreground/90">
              What can I help with?
            </h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Track expenses, ask questions, or attach a receipt to get started.
            </p>
          </div>
        ) : null}

        {messagesStatus === "success" && messages.length > 0 ? (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 pb-4">
            {messages.map((item) => (
              <MessageBubble
                key={item.clientKey}
                message={item}
                onRetry={
                  item.sendStatus === "failed"
                    ? () => onRetry(item.clientKey)
                    : undefined
                }
              />
            ))}
          </div>
        ) : null}
      </div>

      <ChatComposer
        message={message}
        pending={pending}
        fileError={fileError}
        sending={sending}
        canSend={canSend}
        onMessageChange={setMessage}
        onSend={() => void onSend()}
        onFileChange={onFileChange}
        onClearPending={clearPending}
      />
    </div>
  );
}
