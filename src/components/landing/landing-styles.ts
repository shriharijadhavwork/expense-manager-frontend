/** Shared landing chat surface classes — keep demo UIs visually consistent */

export const landingFluxAvatarClassName =
  "bg-landing-accent-soft text-landing-accent ring-landing-accent/25";

export const landingUserAvatarClassName =
  "bg-landing-fg/8 text-landing-fg ring-landing-border";

export const landingUserBubbleClassName =
  "max-w-[92%] rounded-[1rem] rounded-br-[0.375rem] border border-landing-border bg-landing-surface px-3.5 py-2 text-[14px] leading-relaxed text-landing-fg sm:text-[15px]";

export const landingLinkClassName =
  "rounded-sm text-landing-muted transition-colors hover:text-landing-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-accent focus-visible:ring-offset-2 focus-visible:ring-offset-landing-bg";

/** Secondary CTA — shared by nav + hero (“See how it works”) */
export const landingSecondaryButtonClassName =
  "inline-flex items-center justify-center rounded-[var(--radius-md)] border border-landing-border bg-landing-surface px-5 text-sm font-medium text-landing-fg shadow-[0_1px_2px_rgb(0_0_0/0.04)] transition-[color,background-color,border-color,box-shadow] hover:border-landing-accent/40 hover:bg-landing-accent-soft hover:text-landing-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-accent focus-visible:ring-offset-2 focus-visible:ring-offset-landing-bg";

export const landingSecondaryButtonSmClassName =
  "h-9 px-3 max-sm:px-2 max-sm:text-xs";

export const landingSecondaryButtonLgClassName = "h-11 px-5";

/** Nav text action (Sign in) — subtle hover, no app ghost/muted tokens */
export const landingNavLinkClassName =
  "inline-flex h-9 items-center rounded-[var(--radius-md)] px-3 text-sm font-medium text-landing-muted transition-colors hover:bg-landing-accent-soft/50 hover:text-landing-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-accent focus-visible:ring-offset-2 focus-visible:ring-offset-landing-bg";

/** Fixed hero chat viewport height — do not use min-height (grows with content). */
export const HERO_CHAT_VIEWPORT_CLASS =
  "h-[25.5rem] sm:h-[27rem] lg:h-[28rem]";
