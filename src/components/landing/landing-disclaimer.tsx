import { cn } from "@/utils/cn";

type LandingDisclaimerProps = {
  children: React.ReactNode;
  className?: string;
};

export function LandingDisclaimer({
  children,
  className,
}: LandingDisclaimerProps) {
  return (
    <p
      className={cn(
        "text-xs leading-relaxed text-landing-muted",
        className,
      )}
    >
      {children}
    </p>
  );
}
