/** Shared landing chat surface classes — keep demo UIs visually consistent */

export const landingFluxAvatarClassName =
  "bg-landing-accent-soft text-landing-accent ring-landing-accent/25";

export const landingUserAvatarClassName =
  "bg-landing-fg/8 text-landing-fg ring-landing-border";

export const landingUserBubbleClassName =
  "max-w-[92%] rounded-[1rem] rounded-br-[0.375rem] border border-landing-border bg-landing-surface px-3.5 py-2 text-[14px] leading-relaxed text-landing-fg sm:text-[15px]";

export const landingLinkClassName =
  "rounded-sm text-landing-muted transition-colors hover:text-landing-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-accent focus-visible:ring-offset-2 focus-visible:ring-offset-landing-bg";

/** Fixed hero chat viewport height — do not use min-height (grows with content). */
export const HERO_CHAT_VIEWPORT_CLASS =
  "h-[25.5rem] sm:h-[27rem] lg:h-[28rem]";
