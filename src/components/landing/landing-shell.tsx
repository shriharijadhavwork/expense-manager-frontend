import { cn } from "@/utils/cn";
import { LandingSmoothScroll } from "@/components/landing/landing-smooth-scroll";

type LandingShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function LandingShell({ children, className }: LandingShellProps) {
  return (
    <LandingSmoothScroll>
      <div className={cn("landing flex min-h-dvh flex-col", className)}>
        {children}
      </div>
    </LandingSmoothScroll>
  );
}
