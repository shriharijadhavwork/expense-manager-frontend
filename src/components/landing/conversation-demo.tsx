"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { EntityAvatar } from "@/components/ui/entity-avatar";
import {
  landingFluxAvatarClassName,
  landingUserAvatarClassName,
} from "@/components/landing/landing-styles";
import {
  buildAnimEvents,
  buildAnimTimeline,
  getDisplayState,
} from "@/components/landing/conversation-demo-animation";
import type {
  ConversationMessage,
  ConversationScenario,
  FluxBreakdownReply,
  FluxStructuredReply,
  FluxTextPart,
} from "@/components/landing/conversation-scenarios";
import { usePrefersReducedMotion } from "@/components/landing/use-prefers-reduced-motion";
import { cn } from "@/utils/cn";

const HOLD_BEFORE_ADVANCE_MS = 2800;
const REDUCED_MOTION_HOLD_MS = 5000;

type ConversationDemoProps = {
  scenario: ConversationScenario;
  className?: string;
  embedded?: boolean;
  macOS?: boolean;
  active?: boolean;
  onComplete?: () => void;
};

function TypingIndicator({
  side,
  macOS,
}: {
  side: "left" | "right";
  macOS?: boolean;
}) {
  const bubbleClass = macOS
    ? side === "right"
      ? "rounded-[1.25rem] rounded-br-[0.25rem] bg-landing-chat-user px-3.5 py-3"
      : "rounded-[1.25rem] rounded-bl-[0.25rem] border border-landing-flux-bubble-border/30 bg-landing-flux-bubble px-3.5 py-3"
    : cn(
        "rounded-[1.125rem] border border-landing-border bg-landing-bg px-3.5 py-3",
        side === "right" && "rounded-br-[0.375rem]",
        side === "left" && "rounded-bl-[0.375rem]",
      );

  const dotClass = macOS
    ? side === "right"
      ? "bg-white/70"
      : "bg-landing-accent/40"
    : "bg-landing-muted";

  return (
    <div
      className={cn(
        "flex items-end gap-2",
        side === "right" ? "justify-end" : "justify-start",
      )}
      aria-hidden
    >
      {!macOS && side === "left" ? (
        <EntityAvatar
          name="Flux"
          variant="neutral"
          size="chat"
          initials="Fx"
          className={landingFluxAvatarClassName}
        />
      ) : null}
      <div className={cn("flex items-center gap-1", bubbleClass)}>
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className={cn(
              "landing-typing-dot h-1.5 w-1.5 rounded-full",
              dotClass,
            )}
            style={{ animationDelay: `${index * 140}ms` }}
          />
        ))}
      </div>
      {!macOS && side === "right" ? (
        <EntityAvatar
          name="You"
          variant="neutral"
          size="chat"
          className={landingUserAvatarClassName}
        />
      ) : null}
    </div>
  );
}

function UserMessage({
  children,
  macOS,
}: {
  children: string;
  macOS?: boolean;
}) {
  if (macOS) {
    return (
      <div className="flex justify-end landing-enter">
        <div className="max-w-[88%] rounded-[1.25rem] rounded-br-[0.25rem] bg-landing-chat-user px-3.5 py-2 text-[15px] leading-relaxed text-white shadow-[0_1px_2px_rgba(0,0,0,0.12)]">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end gap-2 landing-enter">
      <div className="max-w-[90%] rounded-[1.125rem] rounded-br-[0.375rem] border border-landing-border bg-landing-surface px-3.5 py-2.5 text-[14px] leading-relaxed text-landing-fg sm:text-[15px]">
        {children}
      </div>
      <EntityAvatar
        name="You"
        variant="neutral"
        size="chat"
        className={landingUserAvatarClassName}
        aria-hidden
      />
    </div>
  );
}

function FluxBubble({
  children,
  macOS,
}: {
  children: React.ReactNode;
  macOS?: boolean;
}) {
  if (macOS) {
    return (
      <div className="flex justify-start landing-enter">
        <div className="max-w-[88%] rounded-[1.25rem] rounded-bl-[0.25rem] border border-landing-flux-bubble-border/30 bg-landing-flux-bubble px-3.5 py-3 text-landing-fg shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2 landing-enter">
      <EntityAvatar
        name="Flux"
        variant="neutral"
        size="chat"
        initials="Fx"
        className={landingFluxAvatarClassName}
        aria-hidden
      />
      <div className="max-w-[90%] rounded-[1.125rem] rounded-bl-[0.375rem] border border-landing-accent/20 bg-landing-bg px-3.5 py-3 text-landing-fg">
        {children}
      </div>
    </div>
  );
}

function FluxStructuredMessage({
  reply,
  macOS,
}: {
  reply: FluxStructuredReply;
  macOS?: boolean;
}) {
  return (
    <FluxBubble macOS={macOS}>
      <p className="text-[15px] leading-relaxed">{reply.lead}</p>
      <div
        className={cn(
          "mt-2.5 rounded-lg px-3 py-2",
          macOS
            ? "border border-landing-flux-bubble-border/40 bg-landing-surface"
            : "border border-landing-border bg-landing-surface",
        )}
      >
        <p className="font-mono text-[15px] font-medium tabular-nums tracking-tight text-landing-fg">
          {reply.amount}
          <span className="mx-1.5 font-sans font-normal text-landing-fg/60">
            ·
          </span>
          <span className="font-sans font-normal">{reply.category}</span>
        </p>
      </div>
      <p
        className={cn(
          "mt-2.5 text-sm leading-snug",
          macOS ? "text-landing-fg/75" : "text-landing-muted",
        )}
      >
        {reply.context}
      </p>
    </FluxBubble>
  );
}

function FluxTextMessage({
  parts,
  macOS,
}: {
  parts: FluxTextPart[];
  macOS?: boolean;
}) {
  return (
    <FluxBubble macOS={macOS}>
      <p className="text-[15px] leading-relaxed">
        {parts.map((part, index) => (
          <span
            key={index}
            className={cn(
              part.variant === "amount" && "font-mono font-semibold tabular-nums text-landing-accent",
              part.variant === "muted" && (macOS ? "text-landing-fg/75" : "text-landing-muted"),
            )}
          >
            {part.text}
          </span>
        ))}
      </p>
    </FluxBubble>
  );
}

function FluxBreakdownMessage({
  reply,
  macOS,
}: {
  reply: FluxBreakdownReply;
  macOS?: boolean;
}) {
  return (
    <FluxBubble macOS={macOS}>
      {reply.lead ? (
        <p className="text-[15px] leading-relaxed">{reply.lead}</p>
      ) : null}
      <dl
        className={cn(
          "space-y-1.5",
          reply.lead ? "mt-2.5" : undefined,
        )}
      >
        {reply.rows.map((row) => (
          <div
            key={row.label}
            className={cn(
              "flex items-baseline justify-between gap-3 text-sm",
              row.emphasis
                ? "border-t border-landing-flux-bubble-border/35 pt-1.5 font-medium text-landing-fg"
                : macOS
                  ? "text-landing-fg/80"
                  : "text-landing-muted",
            )}
          >
            <dt>{row.label}</dt>
            <dd
              className={cn(
                "shrink-0 font-mono tabular-nums",
                !row.emphasis && macOS && "text-landing-fg",
              )}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
      {reply.footer ? (
        <p
          className={cn(
            "mt-2.5 text-sm leading-snug",
            macOS ? "text-landing-fg/75" : "text-landing-muted",
          )}
        >
          {reply.footer}
        </p>
      ) : null}
    </FluxBubble>
  );
}

function ConversationMessageView({
  message,
  macOS,
}: {
  message: ConversationMessage;
  macOS?: boolean;
}) {
  switch (message.type) {
    case "user":
      return <UserMessage macOS={macOS}>{message.text}</UserMessage>;
    case "flux-structured":
      return <FluxStructuredMessage reply={message.reply} macOS={macOS} />;
    case "flux-text":
      return <FluxTextMessage parts={message.parts} macOS={macOS} />;
    case "flux-breakdown":
      return <FluxBreakdownMessage reply={message.reply} macOS={macOS} />;
  }
}

function ThreadHeader({
  threadLabel,
  participants,
}: {
  threadLabel: string;
  participants?: string[];
}) {
  return (
    <div className="border-b border-black/[0.06] px-4 py-2.5">
      <p className="truncate text-center text-[12px] font-medium text-[#1c1c1e]">
        {threadLabel}
      </p>
      {participants && participants.length > 1 ? (
        <p className="mt-0.5 truncate text-center text-[10px] text-[#8e8e93]">
          {participants.join(" · ")}
        </p>
      ) : null}
    </div>
  );
}

export function ConversationDemo({
  scenario,
  className,
  embedded = false,
  macOS = false,
  active = true,
  onComplete,
}: ConversationDemoProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [stage, setStage] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMac = embedded && macOS;

  const events = useMemo(
    () => buildAnimEvents(scenario.messages),
    [scenario.messages],
  );
  const timeline = useMemo(
    () => buildAnimTimeline(events, scenario.messages),
    [events, scenario.messages],
  );
  const stageDone = events.length;

  useEffect(() => {
    if (!active) {
      return;
    }

    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) {
        return;
      }

      if (reducedMotion) {
        setStage(stageDone);
        return;
      }

      setStage(0);
    });

    return () => {
      cancelled = true;
    };
  }, [active, reducedMotion, scenario.id, stageDone]);

  useEffect(() => {
    if (!active || reducedMotion || stage >= stageDone) {
      return;
    }

    const wait =
      stage === 0 ? timeline[0] : timeline[stage] - timeline[stage - 1];

    const timer = window.setTimeout(() => {
      setStage((current) => current + 1);
    }, wait);

    return () => window.clearTimeout(timer);
  }, [active, reducedMotion, stage, stageDone, timeline]);

  useEffect(() => {
    if (!active || stage !== stageDone || !onComplete) {
      return;
    }

    const holdMs = reducedMotion ? REDUCED_MOTION_HOLD_MS : HOLD_BEFORE_ADVANCE_MS;
    const timer = window.setTimeout(onComplete, holdMs);
    return () => window.clearTimeout(timer);
  }, [active, stage, stageDone, onComplete, reducedMotion]);

  const { visibleMessageIndices, typing } = getDisplayState(stage, events);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [visibleMessageIndices.length, typing, stage, reducedMotion]);

  const shellClass = isMac
    ? "flex h-full w-full flex-col overflow-hidden bg-[#f5f5f7]"
    : embedded
      ? "flex h-full flex-col overflow-hidden bg-landing-bg"
      : "flex min-h-[24rem] flex-col rounded-[var(--radius-lg)] border border-landing-border bg-landing-surface shadow-[var(--shadow-sm)] sm:min-h-[26rem]";

  return (
    <div
      className={cn(shellClass, className)}
      aria-label="FLUX conversation"
      role="region"
    >
      {!embedded ? (
        <div className="flex items-center justify-between border-b border-landing-border px-4 py-3 sm:px-5">
          <span className="text-xs font-semibold tracking-wide text-landing-fg">
            {scenario.threadLabel ?? "FLUX"}
          </span>
          <span className="text-[11px] font-medium tracking-wide text-landing-muted uppercase">
            {scenario.dateLabel}
          </span>
        </div>
      ) : isMac ? (
        <div className="shrink-0">
          {scenario.threadLabel ? (
            <ThreadHeader
              threadLabel={scenario.threadLabel}
              participants={scenario.participants}
            />
          ) : null}
          <div className="flex justify-center px-4 py-1.5">
            <span className="rounded-full bg-black/[0.06] px-2.5 py-0.5 text-[11px] font-medium text-[#8e8e93]">
              {scenario.dateLabel}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between border-b border-landing-border/80 px-4 py-2.5 sm:px-5">
          <span className="text-[11px] font-semibold tracking-wide text-landing-fg">
            {scenario.threadLabel ?? "FLUX"}
          </span>
          <span className="text-[10px] font-medium tracking-wide text-landing-muted uppercase">
            {scenario.dateLabel}
          </span>
        </div>
      )}

      <div
        ref={scrollRef}
        data-lenis-prevent
        className={cn(
          "hero-chat-messages min-h-0 flex-1 overflow-y-auto overscroll-contain",
          isMac && "hero-chat-messages--mac",
        )}
        aria-live="polite"
        aria-relevant="additions"
      >
        <div className="flex min-h-full flex-col justify-end gap-2 px-3.5 pb-3.5 pt-0.5 sm:gap-2.5 sm:px-4 sm:pb-4">
          {visibleMessageIndices.map((messageIndex) => (
            <ConversationMessageView
              key={`${scenario.id}-${messageIndex}`}
              message={scenario.messages[messageIndex]}
              macOS={isMac}
            />
          ))}

          {typing ? <TypingIndicator side={typing} macOS={isMac} /> : null}
        </div>
      </div>
    </div>
  );
}
