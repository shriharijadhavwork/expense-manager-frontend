import { cn } from "@/utils/cn";

type LandingSectionProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  /** Alternate surface for visual rhythm between sections */
  tone?: "default" | "surface";
};

export function LandingSection({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  contentClassName,
  tone = "default",
}: LandingSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "border-b border-landing-border",
        id && "scroll-mt-16",
        tone === "surface" &&
          "bg-[linear-gradient(180deg,color-mix(in_oklab,var(--landing-accent-soft)_18%,var(--landing-surface))_0%,var(--landing-surface)_100%)]",
        className,
      )}
      aria-labelledby={id ? `${id}-heading` : undefined}
    >
      <div className={cn("mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24", contentClassName)}>
        <div className="landing-reveal landing-reveal-header max-w-2xl">
          {eyebrow ? (
            <p className="text-sm font-medium tracking-wide text-landing-muted">
              {eyebrow}
            </p>
          ) : null}
          <h2
            id={id ? `${id}-heading` : undefined}
            className={cn(
              "font-display text-3xl leading-tight tracking-tight text-landing-fg sm:text-4xl",
              eyebrow ? "mt-3" : undefined,
            )}
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-4 text-base leading-relaxed text-landing-muted sm:text-lg">
              {description}
            </p>
          ) : null}
        </div>

        <div className="landing-reveal landing-reveal-body mt-12 lg:mt-14">{children}</div>
      </div>
    </section>
  );
}
