import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

type ErrorStateProps = {
  title?: string;
  description: string;
  onRetry?: () => void;
  className?: string;
};

export function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-destructive/20 bg-card px-6 py-10 text-center",
        className,
      )}
    >
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      {onRetry ? (
        <Button className="mt-5" variant="outline" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}
