import { cn } from "@/utils/cn";

type LandingDisclaimerProps = {
  children: React.ReactNode;
  className?: string;
  /** Optional pill — e.g. "Coming soon", "Preview" */
  badge?: string;
};

export function LandingDisclaimer({
  children,
  className,
  badge,
}: LandingDisclaimerProps) {
  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs leading-relaxed text-landing-muted",
        className,
      )}
    >
      {badge ? (
        <span className="shrink-0 rounded-full border border-landing-accent/20 bg-landing-accent-soft/40 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-landing-accent">
          {badge}
        </span>
      ) : null}
      <span>{children}</span>
    </p>
  );
}
