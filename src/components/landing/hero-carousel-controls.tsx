"use client";

import { Pause, Play } from "lucide-react";
import { HERO_CONVERSATION_SCENARIOS } from "@/components/landing/conversation-scenarios";
import { cn } from "@/utils/cn";

type HeroCarouselControlsProps = {
  activeIndex: number;
  paused: boolean;
  onSelect: (index: number) => void;
  onPauseToggle: () => void;
  className?: string;
};

export function HeroCarouselControls({
  activeIndex,
  paused,
  onSelect,
  onPauseToggle,
  className,
}: HeroCarouselControlsProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center gap-3 sm:gap-4",
        className,
      )}
      data-lenis-prevent
      aria-label="Demo playback controls"
    >
      <div
        role="tablist"
        aria-label="Conversation examples"
        className="flex items-center gap-1.5 rounded-full border border-landing-border bg-landing-bg/80 px-2 py-1.5 backdrop-blur-sm"
      >
        {HERO_CONVERSATION_SCENARIOS.map((scenario, index) => {
          const isActive = index === activeIndex;
          const label = scenario.carouselLabel ?? scenario.threadLabel ?? "Demo";

          return (
            <button
              key={scenario.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`${label} example`}
              title={label}
              onClick={() => onSelect(index)}
              className={cn(
                "touch-manipulation rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-accent focus-visible:ring-offset-2 focus-visible:ring-offset-landing-bg",
                isActive
                  ? "h-2.5 w-8 bg-landing-accent sm:h-2 sm:w-7"
                  : "h-3 w-3 bg-landing-border hover:bg-landing-muted sm:h-2 sm:w-2",
              )}
            />
          );
        })}
      </div>

      <button
        type="button"
        onClick={onPauseToggle}
        aria-label={paused ? "Resume auto-advance" : "Pause auto-advance"}
        aria-pressed={paused}
        title={paused ? "Resume auto-advance" : "Pause auto-advance"}
        className={cn(
          "flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border border-landing-border bg-landing-bg/80 text-landing-muted backdrop-blur-sm transition-colors sm:h-8 sm:w-8",
          "hover:border-landing-accent/30 hover:text-landing-fg",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-accent focus-visible:ring-offset-2 focus-visible:ring-offset-landing-bg",
          paused && "border-landing-accent/30 text-landing-accent",
        )}
      >
        {paused ? (
          <Play className="h-3.5 w-3.5 fill-current" aria-hidden />
        ) : (
          <Pause className="h-3.5 w-3.5 fill-current" aria-hidden />
        )}
      </button>
    </div>
  );
}
