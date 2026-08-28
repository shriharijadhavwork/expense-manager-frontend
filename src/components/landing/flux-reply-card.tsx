import { cn } from "@/utils/cn";

export type FluxReplyData = {
  preamble?: string;
  amount: string;
  category: string;
  detail: string;
};

type FluxReplyCardProps = {
  data: FluxReplyData;
  /** 0 = hidden, 1 = preamble, 2 = amount line, 3 = detail line */
  stage: number;
  className?: string;
  /** Staggered entrance — only for animated demos */
  animate?: boolean;
};

export function FluxReplyCard({
  data,
  stage,
  className,
  animate = false,
}: FluxReplyCardProps) {
  if (stage < 1) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      {data.preamble && stage >= 1 ? (
        <p
          className={cn(
            "text-[15px] leading-relaxed text-landing-fg",
            animate && "landing-enter",
          )}
        >
          {data.preamble}
        </p>
      ) : null}

      {stage >= 2 ? (
        <div
          className={cn(
            "rounded-[var(--radius-md)] border border-landing-border bg-landing-bg px-3.5 py-2.5",
            animate && "landing-enter",
          )}
          style={animate ? { animationDelay: "80ms" } : undefined}
        >
          <p className="font-mono text-[15px] font-medium tabular-nums tracking-tight text-landing-fg">
            {data.amount}
            <span className="mx-1.5 text-landing-muted" aria-hidden>
              ·
            </span>
            <span className="font-sans font-normal text-landing-fg">
              {data.category}
            </span>
          </p>
        </div>
      ) : null}

      {stage >= 3 ? (
        <p
          className={cn(
            "px-0.5 text-sm text-landing-muted",
            animate && "landing-enter",
          )}
          style={animate ? { animationDelay: "160ms" } : undefined}
        >
          {data.detail}
        </p>
      ) : null}
    </div>
  );
}
