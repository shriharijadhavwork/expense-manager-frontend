"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/components/landing/use-prefers-reduced-motion";
import { cn } from "@/utils/cn";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Extra delay before this element animates in, in ms — for staggering a group. */
  delay?: number;
};

/**
 * Scroll-triggered fade-up reveal via IntersectionObserver.
 *
 * Deliberately not CSS `animation-timeline: view()` — Firefox doesn't
 * support scroll-driven animations at all, and Safari only shipped it in
 * 2025, so that approach silently does nothing for a meaningful slice of
 * visitors. IntersectionObserver works everywhere.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const noObserverSupport =
    typeof window !== "undefined" && typeof IntersectionObserver === "undefined";
  const visible = inView || reducedMotion || noObserverSupport;

  useEffect(() => {
    if (reducedMotion || noObserverSupport) {
      return;
    }

    const node = ref.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion, noObserverSupport]);

  return (
    <div
      ref={ref}
      className={cn("landing-reveal", visible && "is-in-view", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
