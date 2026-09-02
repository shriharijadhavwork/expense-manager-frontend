"use client";

import { cn } from "@/utils/cn";
import {
  getDisplayInitials,
  type DisplayInitialsSource,
} from "@/utils/display-initials";

export type EntityAvatarVariant =
  | "user-own"
  | "user-peer"
  | "assistant"
  | "neutral";

export type EntityAvatarSize = "xs" | "chat" | "sm" | "md";

const sizeClasses: Record<EntityAvatarSize, string> = {
  xs: "h-6 w-6 text-[11px]",
  chat: "h-7 w-7 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
};

const variantClasses: Record<EntityAvatarVariant, string> = {
  "user-own":
    "bg-flux-accent text-flux-accent-fg ring-flux-accent/30",
  "user-peer":
    "bg-chat-peer text-chat-peer-foreground ring-chat-peer-border",
  assistant:
    "bg-chat-assistant text-chat-assistant-foreground ring-flux-bubble-border/40",
  neutral: "bg-foreground/10 text-foreground/80 ring-border/60",
};

export type EntityAvatarProps = {
  name?: string | null;
  email?: string | null;
  initials?: string;
  variant?: EntityAvatarVariant;
  size?: EntityAvatarSize;
  className?: string;
  "aria-label"?: string;
};

export function EntityAvatar({
  name,
  email,
  initials,
  variant = "neutral",
  size = "sm",
  className,
  "aria-label": ariaLabel,
}: EntityAvatarProps) {
  const source: DisplayInitialsSource = { name, email };
  const label = initials ?? getDisplayInitials(source);

  return (
    <span
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold ring-1",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
    >
      {label}
    </span>
  );
}

export type EntityAvatarLabelProps = {
  avatar: EntityAvatarProps;
  label: string;
  emphasizeLabel?: boolean;
  reverse?: boolean;
  className?: string;
};

/** Avatar + display name row — chat senders, member lists, etc. */
export function EntityAvatarLabel({
  avatar,
  label,
  emphasizeLabel = false,
  reverse = false,
  className,
}: EntityAvatarLabelProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-0.5",
        reverse && "flex-row-reverse",
        className,
      )}
    >
      <EntityAvatar {...avatar} size={avatar.size ?? "xs"} />
      <span
        className={cn(
          "text-xs font-medium",
          emphasizeLabel ? "text-foreground/80" : "text-muted-foreground",
        )}
      >
        {label}
      </span>
    </div>
  );
}
