"use client";

import { useCallback, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import Tilt from "react-parallax-tilt";
import { HeroCarouselControls } from "@/components/landing/hero-carousel-controls";
import { HeroConversationCarousel } from "@/components/landing/hero-conversation-carousel";
import { HERO_CHAT_VIEWPORT_CLASS } from "@/components/landing/landing-styles";
import { useCoarsePointer } from "@/components/landing/use-coarse-pointer";
import { useMounted } from "@/components/landing/use-mounted";
import { usePrefersReducedMotion } from "@/components/landing/use-prefers-reduced-motion";
import { cn } from "@/utils/cn";

type HeroProductPreviewProps = {
  className?: string;
};

function MacTrafficLights() {
  return (
    <div className="flex items-center gap-2" aria-hidden>
      <span className="h-3 w-3 rounded-full bg-[#ff5f57] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)]" />
      <span className="h-3 w-3 rounded-full bg-[#febc2e] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]" />
      <span className="h-3 w-3 rounded-full bg-[#28c840] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

export function HeroProductPreview({ className }: HeroProductPreviewProps) {
  const mounted = useMounted();
  const reducedMotion = usePrefersReducedMotion();
  const coarsePointer = useCoarsePointer();
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const useTilt = mounted && !reducedMotion && !coarsePointer;

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index);

    const swiper = swiperRef.current;
    if (!swiper) {
      return;
    }

    swiper.slideToLoop(index);
  }, []);

  const frame = (
    <div
      className={cn(
        "overflow-hidden rounded-xl",
        "shadow-[0_25px_80px_-20px_rgba(0,0,0,0.45),0_0_0_1px_rgba(0,0,0,0.35)]",
      )}
    >
      <div className="relative flex h-10 items-center border-b border-black/40 bg-[#2d2d2d] px-3.5">
        <MacTrafficLights />
        <span className="pointer-events-none absolute inset-x-0 text-center text-[13px] font-medium tracking-tight text-white/50">
          FLUX
        </span>
      </div>

      <div className={cn("w-full overflow-hidden bg-[#f5f5f7]", HERO_CHAT_VIEWPORT_CLASS)}>
        <HeroConversationCarousel
          className="h-full"
          activeIndex={activeIndex}
          pauseAutoAdvance={paused}
          onActiveIndexChange={setActiveIndex}
          onSwiperReady={(swiper) => {
            swiperRef.current = swiper;
          }}
        />
      </div>
    </div>
  );

  return (
    <div
      id="conversation-demo"
      className={cn("relative w-full", className)}
      aria-label="FLUX app preview"
    >
      <div
        className="pointer-events-none absolute -inset-8 -z-10 rounded-[2rem] bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--landing-accent)_35%,#3a3a3c)_0%,transparent_70%)] opacity-30 blur-3xl sm:-inset-12"
        aria-hidden
      />

      {useTilt ? (
        <Tilt
          tiltEnable
          tiltMaxAngleX={7}
          tiltMaxAngleY={9}
          tiltAngleXInitial={5}
          tiltAngleYInitial={8}
          glareEnable
          glareMaxOpacity={0.14}
          glareColor="#ffffff"
          glarePosition="all"
          glareBorderRadius="0.75rem"
          scale={1.015}
          perspective={1400}
          transitionSpeed={1400}
          className="transform-gpu will-change-transform"
        >
          {frame}
        </Tilt>
      ) : (
        <div
          className={cn(
            !coarsePointer &&
              "[transform:perspective(1200px)_rotateX(4deg)_rotateY(8deg)]",
          )}
          style={coarsePointer ? undefined : { transformStyle: "preserve-3d" }}
        >
          {frame}
        </div>
      )}

      <HeroCarouselControls
        className="relative z-20 mt-3.5 sm:mt-4"
        activeIndex={activeIndex}
        paused={paused}
        onSelect={goToSlide}
        onPauseToggle={() => setPaused((current) => !current)}
      />
    </div>
  );
}
