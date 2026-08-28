import Link from "next/link";
import { HeroProductPreview } from "@/components/landing/hero-product-preview";
import { LandingPrimaryCta } from "@/components/landing/landing-cta";
import { LandingTagline } from "@/components/landing/landing-tagline";
import { cn } from "@/utils/cn";

/** Matches preview: title bar + chat viewport + controls — keeps columns vertically aligned */
const HERO_PREVIEW_BLOCK_CLASS = "lg:min-h-[33rem]";

export function LandingHero() {
  return (
    <section
      id="how-it-works"
      className="relative scroll-mt-16 overflow-hidden border-b border-landing-border"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_70%_40%,var(--landing-accent-soft)_0%,transparent_55%)] opacity-60"
        aria-hidden
      />

      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-12 lg:py-10 lg:max-h-[calc(100svh-8.5rem)] xl:grid-cols-[minmax(0,1.05fr)_minmax(0,28rem)] xl:gap-16">
        {/* Copy column */}
        <div
          className={cn(
            "flex flex-col justify-center",
            HERO_PREVIEW_BLOCK_CLASS,
          )}
        >
          <h1
            id="hero-heading"
            className="font-display text-[1.75rem] leading-[1.14] tracking-tight text-landing-fg sm:text-4xl sm:leading-[1.1] lg:text-[2.5rem] xl:text-[2.75rem]"
          >
            Your money shouldn&apos;t take more work than earning it.
          </h1>

          <LandingTagline className="mt-3 max-w-lg text-[15px] sm:mt-4 sm:text-base" />

          <p className="mt-4 max-w-lg text-base leading-relaxed text-landing-muted sm:mt-5 sm:text-lg">
            Tell FLUX what happened — what you spent, what you earned, or who
            owes you. FLUX keeps the context and keeps score while you get on
            with your life.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center lg:mt-8">
            <LandingPrimaryCta
              size="lg"
              trailingArrow
              guestLabel="Talk to FLUX"
              authenticatedLabel="Talk to FLUX"
              className="w-full sm:w-auto"
            />
            <Link
              href="#the-problem"
              className={cn(
                "inline-flex h-11 w-full items-center justify-center rounded-[var(--radius-md)] border border-landing-border bg-landing-bg/60 px-5 text-sm font-medium text-landing-fg backdrop-blur-[2px] transition-colors",
                "hover:border-landing-accent/30 hover:bg-landing-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-accent focus-visible:ring-offset-2 focus-visible:ring-offset-landing-bg",
                "sm:w-auto",
              )}
            >
              See how it works
            </Link>
          </div>
        </div>

        {/* Product preview */}
        <div
          className={cn(
            "relative flex w-full flex-col justify-center",
            HERO_PREVIEW_BLOCK_CLASS,
            "lg:justify-self-end",
          )}
        >
          <HeroProductPreview className="mx-auto w-full max-w-[22rem] sm:max-w-[24rem] lg:mx-0 lg:max-w-none" />
        </div>
      </div>
    </section>
  );
}
