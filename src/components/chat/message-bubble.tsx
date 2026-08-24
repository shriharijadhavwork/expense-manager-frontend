"use client";

import { AttachmentCard } from "@/components/chat/attachment-card";
import type { DisplayMessage } from "@/components/chat/types";
import { cn } from "@/utils/cn";

type MessageBubbleProps = {
  message: DisplayMessage;
  onRetry?: () => void;
};

export function MessageBubble({ message, onRetry }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "min-w-0 max-w-[min(85%,680px)]",
          isUser ? "space-y-1" : "space-y-2",
        )}
      >
        {message.attachments.map((attachment) => (
          <AttachmentCard
            key={attachment.id}
            attachment={attachment}
            variant="bubble"
            onRetry={onRetry}
          />
        ))}

        {message.content ? (
          isUser ? (
            <div className="rounded-[1.25rem] bg-chat-user px-4 py-2.5 text-[0.9375rem] leading-relaxed text-chat-user-foreground">
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
              {message.sendStatus === "sending" || message.sendStatus === "failed" ? (
                <span className="mt-1 block text-[11px] opacity-60">
                  {message.sendStatus === "sending" ? "Sending…" : "Failed to send"}
                </span>
              ) : null}
            </div>
          ) : (
            <div className="px-1 py-1 text-[0.9375rem] leading-relaxed text-foreground">
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
            </div>
          )
        ) : null}

        {message.sendStatus === "failed" && onRetry ? (
          <div className={cn(isUser ? "text-right" : "text-left")}>
            <button
              type="button"
              onClick={onRetry}
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Retry
            </button>
            {message.errorMessage ? (
              <p className="mt-1 text-xs text-destructive">{message.errorMessage}</p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
