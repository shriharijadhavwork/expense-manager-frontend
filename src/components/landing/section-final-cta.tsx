import { LandingPrimaryCta } from "@/components/landing/landing-cta";
import { cn } from "@/utils/cn";

export function SectionFinalCta() {
  return (
    <section
      id="get-started"
      className="landing-reveal landing-reveal-body scroll-mt-16 border-b border-landing-border/80 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--landing-accent-soft)_22%,var(--landing-surface))_0%,var(--landing-surface)_55%,color-mix(in_oklab,var(--landing-warm)_10%,var(--landing-surface))_100%)]"
      aria-labelledby="final-cta-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <h2
          id="final-cta-heading"
          className="font-display text-3xl leading-tight tracking-tight text-landing-fg sm:text-4xl lg:text-5xl"
        >
          Go live. We&apos;ll keep score.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-landing-muted sm:text-lg">
          Your money shouldn&apos;t take more work than earning it.
        </p>
        <div
          className={cn(
            "mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row",
          )}
        >
          <LandingPrimaryCta
            size="lg"
            trailingArrow
            className="w-full sm:w-auto"
          />
        </div>
      </div>
    </section>
  );
}
