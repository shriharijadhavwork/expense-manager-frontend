"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { useCoarsePointer } from "@/components/landing/use-coarse-pointer";
import { usePrefersReducedMotion } from "@/components/landing/use-prefers-reduced-motion";

const LENIS_LERP = 0.07;
const ANCHOR_SCROLL_DURATION = 1.35;

type LandingSmoothScrollProps = {
  children: React.ReactNode;
};

export function LandingSmoothScroll({ children }: LandingSmoothScrollProps) {
  const reducedMotion = usePrefersReducedMotion();
  const coarsePointer = useCoarsePointer();

  useEffect(() => {
    if (reducedMotion || coarsePointer) {
      return;
    }

    const lenis = new Lenis({
      lerp: LENIS_LERP,
      duration: ANCHOR_SCROLL_DURATION,
      smoothWheel: true,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.15,
      infinite: false,
    });

    let frameId = 0;

    function onFrame(time: number) {
      lenis.raf(time);
      frameId = requestAnimationFrame(onFrame);
    }

    frameId = requestAnimationFrame(onFrame);

    function onAnchorClick(event: MouseEvent) {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest<HTMLAnchorElement>('a[href^="#"]');

      if (!anchor || anchor.getAttribute("href") === "#") {
        return;
      }

      const hash = anchor.getAttribute("href");

      if (!hash) {
        return;
      }

      const element = document.querySelector(hash);

      if (!(element instanceof HTMLElement)) {
        return;
      }

      event.preventDefault();
      lenis.scrollTo(element, {
        offset: -72,
        duration: ANCHOR_SCROLL_DURATION,
      });
    }

    document.addEventListener("click", onAnchorClick);

    return () => {
      cancelAnimationFrame(frameId);
      document.removeEventListener("click", onAnchorClick);
      lenis.destroy();
    };
  }, [reducedMotion, coarsePointer]);

  return children;
}
