"use client";

import { useCallback, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { ConversationDemo } from "@/components/landing/conversation-demo";
import { HERO_CONVERSATION_SCENARIOS } from "@/components/landing/conversation-scenarios";
import { usePrefersReducedMotion } from "@/components/landing/use-prefers-reduced-motion";
import { cn } from "@/utils/cn";

import "swiper/css";

type HeroConversationCarouselProps = {
  className?: string;
  /** When on: loop the active conversation. When off: auto-advance to the next slide. */
  pauseAutoAdvance?: boolean;
  onActiveIndexChange?: (index: number) => void;
  onSwiperReady?: (swiper: SwiperType) => void;
};

export function HeroConversationCarousel({
  className,
  pauseAutoAdvance = false,
  onActiveIndexChange,
  onSwiperReady,
}: HeroConversationCarouselProps) {
  const reducedMotion = usePrefersReducedMotion();
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [replayEpochs, setReplayEpochs] = useState(() =>
    HERO_CONVERSATION_SCENARIOS.map(() => 0),
  );

  const handleComplete = useCallback(() => {
    if (pauseAutoAdvance) {
      setReplayEpochs((epochs) => {
        const next = [...epochs];
        next[activeIndex] += 1;
        return next;
      });
      return;
    }

    swiperRef.current?.slideNext();
  }, [pauseAutoAdvance, activeIndex]);

  const updateIndex = useCallback(
    (index: number) => {
      setActiveIndex(index);
      onActiveIndexChange?.(index);
    },
    [onActiveIndexChange],
  );

  return (
    <div className={cn("hero-conversation-carousel h-full w-full overflow-hidden", className)}>
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
          updateIndex(swiper.realIndex);
        }}
        onSlideChange={(swiper) => {
          updateIndex(swiper.realIndex);
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
