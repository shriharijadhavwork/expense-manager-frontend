import { LandingPrimaryCta } from "@/components/landing/landing-cta";
import { Reveal } from "@/components/landing/reveal";
import { cn } from "@/utils/cn";

export function SectionFinalCta() {
  return (
    <section
      id="get-started"
      className="landing-final-cta scroll-mt-16 border-b border-landing-border/80 bg-landing-elevated"
      aria-labelledby="final-cta-heading"
    >
      <Reveal className="relative z-[1] mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8 lg:py-28">
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
      </Reveal>
    </section>
  );
}
