import { EntityAvatar } from "@/components/ui/entity-avatar";
import {
  FluxReplyCard,
  type FluxReplyData,
} from "@/components/landing/flux-reply-card";
import {
  landingFluxAvatarClassName,
  landingUserAvatarClassName,
  landingUserBubbleClassName,
} from "@/components/landing/landing-styles";
import { cn } from "@/utils/cn";

export type ConversationExchangeProps = {
  userMessage: string;
  fluxReply: FluxReplyData;
  className?: string;
};

export function ConversationExchange({
  userMessage,
  fluxReply,
  className,
}: ConversationExchangeProps) {
  return (
    <article
      className={cn(
        "flex h-full min-h-[13.5rem] flex-col rounded-[var(--radius-lg)] border border-landing-border bg-landing-bg p-4",
        className,
      )}
    >
      <div className="flex flex-1 flex-col justify-between gap-4">
        <div className="flex justify-end gap-2">
          <p className={landingUserBubbleClassName}>{userMessage}</p>
          <EntityAvatar
            name="You"
            variant="neutral"
            size="chat"
            className={landingUserAvatarClassName}
            aria-hidden
          />
        </div>

        <div className="flex items-end gap-2">
          <EntityAvatar
            name="Flux"
            variant="neutral"
            size="chat"
            initials="Fx"
            className={landingFluxAvatarClassName}
            aria-hidden
          />
          <div className="min-w-0 max-w-[92%]">
            <FluxReplyCard data={fluxReply} stage={3} />
          </div>
        </div>
      </div>
    </article>
  );
}
