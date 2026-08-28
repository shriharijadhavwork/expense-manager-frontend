import { cn } from "@/utils/cn";

type LandingShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function LandingShell({ children, className }: LandingShellProps) {
  return (
    <div className={cn("landing flex min-h-dvh flex-col", className)}>
      {children}
    </div>
  );
}
