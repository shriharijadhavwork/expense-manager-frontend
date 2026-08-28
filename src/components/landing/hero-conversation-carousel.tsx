"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { ConversationDemo } from "@/components/landing/conversation-demo";
import { HERO_CONVERSATION_SCENARIOS } from "@/components/landing/conversation-scenarios";
import { useCoarsePointer } from "@/components/landing/use-coarse-pointer";
import { useMounted } from "@/components/landing/use-mounted";
import { usePrefersReducedMotion } from "@/components/landing/use-prefers-reduced-motion";
import { cn } from "@/utils/cn";

import "swiper/css";

type HeroConversationCarouselProps = {
  className?: string;
  activeIndex: number;
  /** When on: loop the active conversation. When off: auto-advance to the next slide. */
  pauseAutoAdvance?: boolean;
  onActiveIndexChange?: (index: number) => void;
  onSwiperReady?: (swiper: SwiperType | null) => void;
};

export function HeroConversationCarousel({
  className,
  activeIndex,
  pauseAutoAdvance = false,
  onActiveIndexChange,
  onSwiperReady,
}: HeroConversationCarouselProps) {
  const mounted = useMounted();
  const coarsePointer = useCoarsePointer();
  const reducedMotion = usePrefersReducedMotion();
  const swiperRef = useRef<SwiperType | null>(null);
  const [replayEpochs, setReplayEpochs] = useState(() =>
    HERO_CONVERSATION_SCENARIOS.map(() => 0),
  );

  const useSimpleCarousel = mounted && coarsePointer;
  const scenarioCount = HERO_CONVERSATION_SCENARIOS.length;

  const advanceToNext = useCallback(() => {
    const nextIndex = (activeIndex + 1) % scenarioCount;
    onActiveIndexChange?.(nextIndex);
  }, [activeIndex, onActiveIndexChange, scenarioCount]);

  const handleComplete = useCallback(() => {
    if (pauseAutoAdvance) {
      setReplayEpochs((epochs) => {
        const next = [...epochs];
        next[activeIndex] += 1;
        return next;
      });
      return;
    }

    if (useSimpleCarousel) {
      advanceToNext();
      return;
    }

    const swiper = swiperRef.current;
    if (!swiper) {
      return;
    }

    swiper.slideNext();
  }, [pauseAutoAdvance, activeIndex, useSimpleCarousel, advanceToNext]);

  useEffect(() => {
    if (useSimpleCarousel) {
      onSwiperReady?.(null);
      return;
    }

    const swiper = swiperRef.current;
    if (!swiper) {
      return;
    }

    if (swiper.realIndex !== activeIndex) {
      swiper.slideToLoop(activeIndex, 0);
    }
  }, [activeIndex, onSwiperReady, useSimpleCarousel]);

  if (!mounted) {
    return (
      <div
        className={cn(
          "hero-conversation-carousel h-full w-full overflow-hidden",
          className,
        )}
      >
        <ConversationDemo
          scenario={HERO_CONVERSATION_SCENARIOS[0]}
          embedded
          macOS
          active={false}
          className="h-full w-full"
        />
      </div>
    );
  }

  if (useSimpleCarousel) {
    const scenario = HERO_CONVERSATION_SCENARIOS[activeIndex];

    return (
      <div
        className={cn(
          "hero-conversation-carousel h-full w-full overflow-hidden",
          className,
        )}
      >
        <ConversationDemo
          key={`${scenario.id}-${replayEpochs[activeIndex]}`}
          scenario={scenario}
          embedded
          macOS
          active
          onComplete={handleComplete}
          className="h-full w-full"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "hero-conversation-carousel h-full w-full overflow-hidden",
        className,
      )}
    >
      <Swiper
        loop
        speed={reducedMotion ? 400 : 720}
        allowTouchMove={false}
        slidesPerView={1}
        spaceBetween={0}
        resistanceRatio={0}
        autoHeight={false}
        className="hero-conversation-swiper !h-full !w-full !overflow-hidden"
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          onSwiperReady?.(swiper);
          if (swiper.realIndex !== activeIndex) {
            swiper.slideToLoop(activeIndex, 0);
          }
        }}
        onSlideChange={(swiper) => {
          if (swiper.realIndex !== activeIndex) {
            onActiveIndexChange?.(swiper.realIndex);
          }
        }}
      >
        {HERO_CONVERSATION_SCENARIOS.map((scenario, index) => (
          <SwiperSlide key={scenario.id} className="!h-full !w-full">
            <ConversationDemo
              key={`${scenario.id}-${replayEpochs[index]}`}
              scenario={scenario}
              embedded
              macOS
              active={activeIndex === index}
              onComplete={handleComplete}
              className="h-full w-full"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
