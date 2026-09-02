"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { AttachmentCard } from "@/components/chat/attachment-card";
import { EntityAvatar, type EntityAvatarProps } from "@/components/ui/entity-avatar";
import { Tooltip } from "@/components/ui/tooltip";
import type { DisplayMessage } from "@/components/chat/types";
import { cn } from "@/utils/cn";

const AssistantMarkdownContent = dynamic(
  () =>
    import("@/components/chat/assistant-markdown-content").then(
      (mod) => mod.AssistantMarkdownContent,
    ),
  {
    ssr: false,
    loading: () => (
      <span
        className="inline-block h-4 min-w-[6rem] animate-pulse rounded bg-muted/50"
        aria-hidden
      />
    ),
  },
);

type MessageBubbleProps = {
  message: DisplayMessage;
  isOwn?: boolean;
  senderName?: string;
  senderAvatarName?: string | null;
  senderAvatarEmail?: string | null;
  timeLabel?: string;
  compactTop?: boolean;
  compactBottom?: boolean;
  onRetry?: () => void;
};

type BubbleAlign = "left" | "right" | "center";

/** Human messages on the right; Flux AI on the left; system centered. */
function resolveAlign(message: DisplayMessage): BubbleAlign {
  if (message.role === "system") {
    return "center";
  }

  if (message.role === "assistant" || message.role === "tool") {
    return "left";
  }

  return "right";
}

const SIDE_AVATAR_SIZE = "chat" as const;
const SIDE_AVATAR_SLOT = "h-7 w-7 shrink-0";

function resolveAvatarTooltip(
  isAssistant: boolean,
  isOwnMessage: boolean,
  senderAvatarName?: string | null,
  senderName?: string,
): string {
  if (isAssistant) {
    return "Flux";
  }

  if (isOwnMessage) {
    const profileName = senderAvatarName?.trim();
    return profileName || "You";
  }

  return senderName?.trim() || senderAvatarName?.trim() || "Member";
}

export function ChatDayDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-3" role="separator" aria-label={label}>
      <div className="h-px flex-1 bg-border" />
      <span className="shrink-0 text-[11px] font-medium tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function SideAvatarSlot({
  show,
  children,
}: {
  show: boolean;
  children: ReactNode;
}) {
  if (show) {
    return <>{children}</>;
  }

  return <span aria-hidden className={SIDE_AVATAR_SLOT} />;
}

function MessageSideAvatar({
  show,
  tooltip,
  tooltipSide,
  avatar,
}: {
  show: boolean;
  tooltip: string;
  tooltipSide: "left" | "right";
  avatar: EntityAvatarProps;
}) {
  return (
    <SideAvatarSlot show={show}>
      <Tooltip content={tooltip} side={tooltipSide} align="end">
        <button
          type="button"
          className="inline-flex shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={tooltip}
        >
          <EntityAvatar {...avatar} size={SIDE_AVATAR_SIZE} aria-hidden />
        </button>
      </Tooltip>
    </SideAvatarSlot>
  );
}

export function MessageBubble({
  message,
  isOwn,
  senderName,
  senderAvatarName,
  senderAvatarEmail,
  timeLabel,
  compactTop = false,
  compactBottom = false,
  onRetry,
}: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isOwnMessage = isOwn ?? isUser;
  const isAssistant = message.role === "assistant" || message.role === "tool";
  const align = resolveAlign(message);
  const showSideAvatar = !compactBottom && (isAssistant || isUser);
  const avatarTooltip = resolveAvatarTooltip(
    isAssistant,
    isOwnMessage,
    senderAvatarName,
    senderName,
  );
  const avatarTooltipSide = align === "right" ? "left" : "right";

  if (message.role === "system") {
    return (
      <div className="flex w-full justify-center px-2 py-1">
        <div className="flex max-w-[min(90%,520px)] flex-col items-center gap-1">
          <p className="rounded-full bg-muted/70 px-3 py-1.5 text-center text-xs leading-relaxed text-muted-foreground">
            {message.content}
          </p>
          {timeLabel ? (
            <time className="text-[10px] tabular-nums text-muted-foreground/80">
              {timeLabel}
            </time>
          ) : null}
        </div>
      </div>
    );
  }

  const bubbleRadius = cn(
    "rounded-[1.125rem]",
    align === "right" &&
      compactTop &&
      !compactBottom &&
      "rounded-tr-[0.375rem] rounded-br-[1.125rem]",
    align === "right" &&
      compactBottom &&
      !compactTop &&
      "rounded-tr-[1.125rem] rounded-br-[0.375rem]",
    align === "right" &&
      compactTop &&
      compactBottom &&
      "rounded-tr-[0.375rem] rounded-br-[0.375rem]",
    align === "left" &&
      compactTop &&
      !compactBottom &&
      "rounded-tl-[0.375rem] rounded-bl-[1.125rem]",
    align === "left" &&
      compactBottom &&
      !compactTop &&
      "rounded-tl-[1.125rem] rounded-bl-[0.375rem]",
    align === "left" &&
      compactTop &&
      compactBottom &&
      "rounded-tl-[0.375rem] rounded-bl-[0.375rem]",
  );

  const bubbleClassName = cn(
    bubbleRadius,
    isUser &&
      isOwnMessage &&
      "w-fit max-w-full px-3 py-1.5 text-[0.9375rem] leading-snug border border-chat-user-border/70 bg-chat-user text-chat-user-foreground",
    isUser &&
      !isOwnMessage &&
      "w-fit max-w-full px-3 py-1.5 text-[0.9375rem] leading-snug border border-chat-peer-border bg-chat-peer text-chat-peer-foreground",
    isAssistant &&
      "px-3.5 py-2 text-[0.9375rem] leading-relaxed shadow-sm border border-flux-bubble-border/40 bg-chat-assistant text-chat-assistant-foreground ring-1 ring-flux-bubble-border/20",
  );

  const messageBody = (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-1",
        align === "right" && "items-end",
        align === "left" && "items-start",
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
        <div className={bubbleClassName}>
          {isAssistant ? (
            <AssistantMarkdownContent markdown={message.content} />
          ) : (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          )}
          {timeLabel ? (
            <time
              dateTime={message.createdAt}
              className={cn(
                "mt-0.5 block text-right text-[10px] leading-none tabular-nums",
                isUser && isOwnMessage && "text-muted-foreground/80",
                isUser && !isOwnMessage && "text-chat-peer-foreground/75",
                isAssistant && "mt-1 text-muted-foreground",
              )}
            >
              {timeLabel}
            </time>
          ) : null}
          {isOwnMessage &&
          (message.sendStatus === "sending" || message.sendStatus === "failed") ? (
            <span className="mt-1 block text-[11px] opacity-60">
              {message.sendStatus === "sending" ? "Sending…" : "Failed to send"}
            </span>
          ) : null}
        </div>
      ) : null}

      {message.sendStatus === "failed" && onRetry ? (
        <div className={cn(align === "right" ? "text-right" : "text-left")}>
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
  );

  return (
    <div
      className={cn(
        "flex w-full",
        align === "right" && "justify-end",
        align === "left" && "justify-start",
      )}
    >
      <div
        className={cn(
          "flex items-end gap-1.5",
          align === "right" && "max-w-[min(78%,520px)] flex-row-reverse",
          align === "left" && "max-w-[min(85%,680px)] flex-row",
        )}
      >
        {isAssistant ? (
          <MessageSideAvatar
            show={showSideAvatar}
            tooltip={avatarTooltip}
            tooltipSide={avatarTooltipSide}
            avatar={{
              name: "Flux",
              variant: "assistant",
            }}
          />
        ) : null}

        {isUser ? (
          <MessageSideAvatar
            show={showSideAvatar}
            tooltip={avatarTooltip}
            tooltipSide={avatarTooltipSide}
            avatar={{
              name: senderAvatarName,
              email: senderAvatarEmail,
              variant: isOwnMessage ? "user-own" : "user-peer",
            }}
          />
        ) : null}

        {messageBody}
      </div>
    </div>
  );
}
