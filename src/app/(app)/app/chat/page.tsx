"use client";

import { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  AttachmentCard,
  type ChatAttachment,
} from "@/components/chat/attachment-card";
import {
  attachmentPolicy,
  isAllowedAttachment,
} from "@/lib/files/attachment-policy";
import { cn } from "@/utils/cn";

type ChatMessage = {
  id: string;
  role: "user";
  text: string;
  createdAt: string;
  attachment?: ChatAttachment;
};

function createId(): string {
  return crypto.randomUUID();
}

function revokePreview(url: string | undefined) {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState<ChatAttachment | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<ChatMessage[]>([]);
  const pendingRef = useRef<ChatAttachment | null>(null);

  useEffect(() => {
    pendingRef.current = pending;
  }, [pending]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    return () => {
      revokePreview(pendingRef.current?.previewUrl);
      for (const item of messagesRef.current) {
        revokePreview(item.attachment?.previewUrl);
      }
    };
  }, []);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages, pending, sending]);

  function clearPending() {
    revokePreview(pending?.previewUrl);
    setPending(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
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

    const previewUrl = URL.createObjectURL(selected);
    setPending({
      id: createId(),
      name: selected.name,
      type: selected.type || fallbackMime(selected.name),
      size: selected.size,
      previewUrl,
      status: "ready",
      progress: 0,
    });
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

  async function simulateUpload(
    messageId: string,
    attachmentId: string,
  ): Promise<void> {
    const steps = [12, 28, 47, 63, 78, 91, 100];

    for (const progress of steps) {
      await new Promise((resolve) => window.setTimeout(resolve, 120));
      setMessages((current) =>
        current.map((item) => {
          if (item.id !== messageId || !item.attachment) return item;
          if (item.attachment.id !== attachmentId) return item;
          return {
            ...item,
            attachment: {
              ...item.attachment,
              status: "uploading",
              progress,
            },
          };
        }),
      );
    }

    // No upload API yet — finish local preview UX, then mark pending server upload.
    setMessages((current) =>
      current.map((item) => {
        if (item.id !== messageId || !item.attachment) return item;
        if (item.attachment.id !== attachmentId) return item;
        return {
          ...item,
          attachment: {
            ...item.attachment,
            status: "uploaded",
            progress: 100,
          },
        };
      }),
    );
  }

  async function onSend() {
    const text = message.trim();
    if ((!text && !pending) || sending) {
      return;
    }

    setSending(true);
    setFileError(null);

    const attachment = pending
      ? {
          ...pending,
          status: "uploading" as const,
          progress: 0,
        }
      : undefined;

    const nextMessage: ChatMessage = {
      id: createId(),
      role: "user",
      text,
      createdAt: new Date().toISOString(),
      ...(attachment ? { attachment } : {}),
    };

    setMessages((current) => [...current, nextMessage]);
    setMessage("");
    setPending(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    try {
      if (attachment) {
        await simulateUpload(nextMessage.id, attachment.id);
      }
      // Message API is not available yet — no assistant replies are fabricated.
    } finally {
      setSending(false);
    }
  }

  const canSend = Boolean(message.trim() || pending) && !sending;

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-6 lg:h-[calc(100vh-4rem)]">
      <PageHeader
        title="Chat"
        description="Receipts and messages are prepared here. Upload progress is shown on the file itself."
      />

      <Card
        padding="none"
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <div ref={scrollerRef} className="flex-1 overflow-y-auto px-4 py-5 sm:px-5">
          {messages.length === 0 ? (
            <div className="flex h-full min-h-56 flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                ⌕
              </div>
              <h3 className="text-base font-semibold tracking-tight">
                Start a conversation
              </h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Attach a receipt to preview it instantly. Supports images
                (JPG, PNG, WebP, HEIC), PDF, and Word docs.
              </p>
            </div>
          ) : (
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
              {messages.map((item) => (
                <div key={item.id} className="flex justify-end">
                  <div className="max-w-[85%] space-y-2">
                    {item.attachment ? (
                      <AttachmentCard
                        attachment={item.attachment}
                        variant="bubble"
                      />
                    ) : null}
                    {item.text ? (
                      <div className="rounded-2xl rounded-br-md bg-primary px-3.5 py-2.5 text-sm text-primary-foreground shadow-[var(--shadow-sm)]">
                        {item.text}
                      </div>
                    ) : null}
                    <p className="text-right text-[11px] text-muted-foreground">
                      {new Date(item.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {item.attachment?.status === "uploaded"
                        ? " · Receipt ready"
                        : null}
                      {item.attachment?.status === "uploading"
                        ? " · Uploading"
                        : null}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-border bg-card/80 p-4 backdrop-blur sm:p-5">
          <div className="mx-auto w-full max-w-2xl space-y-3">
            {pending ? (
              <AttachmentCard
                attachment={pending}
                variant="composer"
                onRemove={clearPending}
              />
            ) : null}

            {fileError ? (
              <p className="rounded-[var(--radius-md)] bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {fileError}
              </p>
            ) : null}

            <Textarea
              label="Message"
              placeholder="Describe an expense or ask a question…"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void onSend();
                }
              }}
              hint={`Supports ${attachmentPolicy.allowedLabel}. Enter to send · Shift+Enter for a new line.`}
            />

            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={inputRef}
                type="file"
                accept={attachmentPolicy.acceptAttr}
                className="sr-only"
                onChange={onFileChange}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => inputRef.current?.click()}
                disabled={sending}
              >
                Attach receipt
              </Button>
              <Button
                type="button"
                className={cn("ml-auto")}
                onClick={() => void onSend()}
                disabled={!canSend}
                loading={sending}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
