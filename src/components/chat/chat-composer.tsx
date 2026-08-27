"use client";

import { useEffect, useRef, useState } from "react";
import { AttachmentCard, type ChatAttachment } from "@/components/chat/attachment-card";
import { attachmentPolicy } from "@/lib/files/attachment-policy";
import { cn } from "@/utils/cn";

type ChatComposerProps = {
  message: string;
  pending: ChatAttachment | null;
  fileError: string | null;
  sending: boolean;
  canSend: boolean;
  disabled?: boolean;
  onMessageChange: (value: string) => void;
  onSend: () => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearPending: () => void;
};

export function ChatComposer({
  message,
  pending,
  fileError,
  sending,
  canSend,
  disabled = false,
  onMessageChange,
  onSend,
  onFileChange,
  onClearPending,
}: ChatComposerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const attachButtonRef = useRef<HTMLButtonElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [attachmentHintVisible, setAttachmentHintVisible] = useState(false);

  function focusComposerInput() {
    attachButtonRef.current?.blur();
    textareaRef.current?.focus();
  }

  useEffect(() => {
    if (pending) {
      focusComposerInput();
    }
  }, [pending]);

  const showAttachmentHint =
    attachmentHintVisible || Boolean(pending) || Boolean(fileError);

  useEffect(() => {
    const node = textareaRef.current;
    if (!node) return;

    node.style.height = "auto";
    node.style.height = `${Math.min(node.scrollHeight, 160)}px`;
  }, [message]);

  useEffect(() => {
    if (!attachmentHintVisible) {
      return;
    }

    const onWindowFocus = () => {
      window.setTimeout(() => {
        focusComposerInput();
        if (!inputRef.current?.files?.length && !pending) {
          setAttachmentHintVisible(false);
        }
      }, 0);
    };

    window.addEventListener("focus", onWindowFocus);
    return () => window.removeEventListener("focus", onWindowFocus);
  }, [attachmentHintVisible, pending]);

  function openFilePicker() {
    setAttachmentHintVisible(true);
    inputRef.current?.click();
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    onFileChange(event);
    if (event.target.files?.[0]) {
      setAttachmentHintVisible(true);
      event.target.value = "";
    }

    requestAnimationFrame(() => {
      focusComposerInput();
    });
  }

  return (
    <div className="shrink-0 px-4 pb-4 pt-2 sm:px-6">
      <div className="mx-auto w-full max-w-3xl space-y-2">
        {pending ? (
          <AttachmentCard
            attachment={pending}
            variant="composer"
            onRemove={() => {
              onClearPending();
              setAttachmentHintVisible(false);
            }}
          />
        ) : null}

        {fileError ? (
          <p className="px-1 text-sm text-destructive">{fileError}</p>
        ) : null}

        {showAttachmentHint ? (
          <p className="px-1 text-xs text-muted-foreground">
            {attachmentPolicy.allowedLabel}. Max 8 MB.
          </p>
        ) : null}

        <div
          className="flex items-end gap-1 rounded-[1.75rem] bg-composer-surface px-2 py-2"
          style={{ boxShadow: "var(--shadow-composer)" }}
        >
          <input
            ref={inputRef}
            type="file"
            accept={attachmentPolicy.acceptAttr}
            className="sr-only"
            onChange={handleFileChange}
          />

          <button
            ref={attachButtonRef}
            type="button"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
            onClick={openFilePicker}
            disabled={sending || disabled}
            aria-label="Attach receipt"
            title="Attach receipt"
            onKeyDown={(event) => {
              if (event.key !== "Enter") {
                return;
              }

              event.preventDefault();
              focusComposerInput();
            }}
          >
            <PaperclipIcon />
          </button>

          <textarea
            ref={textareaRef}
            rows={1}
            value={message}
            placeholder={disabled ? "Restore to continue" : "Ask anything"}
            disabled={sending || disabled}
            className={cn(
              "composer-textarea max-h-40 min-h-9 flex-1 resize-none border-0 bg-transparent px-1 py-2 text-[0.9375rem] leading-relaxed text-foreground",
              "placeholder:text-muted-foreground/70",
              "outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
            )}
            onChange={(event) => onMessageChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                if (!disabled) {
                  onSend();
                }
              }
            }}
          />

          <button
            type="button"
            className={cn(
              "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors",
              canSend
                ? "bg-foreground text-background hover:opacity-90"
                : "bg-muted text-muted-foreground",
            )}
            onClick={onSend}
            disabled={!canSend}
            aria-label="Send message"
            title="Send"
          >
            {sending ? (
              <span className="h-4 w-4 animate-pulse rounded-full bg-current/40" />
            ) : (
              <SendIcon />
            )}
          </button>
        </div>

        <p className="pt-2 text-center text-xs text-muted-foreground/75">
          Expense Manager can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}

function PaperclipIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 8.5V17a3 3 0 1 1-6 0V7.5a4.5 4.5 0 1 1 9 0V16a2.5 2.5 0 1 1-5 0V8" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 19V5" />
      <path d="m7 10 5-5 5 5" />
    </svg>
  );
}
