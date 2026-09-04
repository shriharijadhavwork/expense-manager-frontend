import { HeroProductPreview } from "@/components/landing/hero-product-preview";
import { LandingPrimaryCta } from "@/components/landing/landing-cta";
import { LandingSecondaryCta } from "@/components/landing/landing-secondary-cta";
import { LandingTagline } from "@/components/landing/landing-tagline";
import { cn } from "@/utils/cn";

const HERO_PREVIEW_BLOCK_CLASS =
  "min-h-[22rem] sm:min-h-[24rem] lg:min-h-[34rem] xl:min-h-[36rem]";

export function LandingHero() {
  return (
    <section
      className="landing-hero relative overflow-hidden border-b border-landing-border/80"
      aria-labelledby="hero-heading"
    >
      <div className="relative z-[1] mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-16 md:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-12 lg:py-[5.5rem] lg:min-h-[calc(100svh-4rem)] xl:grid-cols-[minmax(0,1.05fr)_minmax(0,28rem)] xl:gap-16 xl:py-24">
        <div
          className={cn("flex flex-col justify-center", HERO_PREVIEW_BLOCK_CLASS)}
        >
          <h1
            id="hero-heading"
            className="landing-enter font-display text-[1.75rem] leading-[1.14] tracking-tight text-landing-fg sm:text-4xl sm:leading-[1.1] lg:text-[2.5rem] xl:text-[2.75rem]"
            style={{ animationDelay: "0.08s" }}
          >
            Your money shouldn&apos;t take{" "}
            <span className="text-landing-accent">more work</span> than earning
            it.
          </h1>

          <div
            className="landing-enter mt-4 flex items-center gap-2 sm:mt-5"
            style={{ animationDelay: "0.16s" }}
          >
            <span
              className="landing-typing-dot h-1.5 w-1.5 shrink-0 rounded-full bg-landing-accent"
              aria-hidden
            />
            <LandingTagline className="max-w-lg text-[15px] sm:text-base" />
          </div>

          <p
            className="landing-enter mt-5 max-w-lg text-base leading-relaxed text-landing-muted sm:mt-6 sm:text-lg"
            style={{ animationDelay: "0.24s" }}
          >
            Tell FLUX what happened — what you spent, what you earned, or who
            owes you. FLUX handles the details while you get on with your life.
          </p>

          <div
            className="landing-enter mt-8 flex flex-col gap-3 sm:flex-row sm:items-center lg:mt-10"
            style={{ animationDelay: "0.32s" }}
          >
            <LandingPrimaryCta
              size="lg"
              trailingArrow
              guestLabel="Talk to FLUX"
              authenticatedLabel="Talk to FLUX"
              className="w-full sm:w-auto"
            />
            <LandingSecondaryCta
              href="#the-problem"
              size="lg"
              className="w-full sm:w-auto"
            >
              See how it works
            </LandingSecondaryCta>
          </div>
        </div>

        <div
          className={cn(
            "landing-enter relative flex w-full flex-col justify-center",
            HERO_PREVIEW_BLOCK_CLASS,
            "lg:justify-self-end",
          )}
          style={{ animationDelay: "0.28s" }}
        >
          <HeroProductPreview className="mx-auto w-full max-w-[22rem] sm:max-w-[24rem] lg:mx-0 lg:max-w-none" />
        </div>
      </div>
    </section>
  );
}
