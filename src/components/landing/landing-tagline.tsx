import { appConfig } from "@/config/env";
import { cn } from "@/utils/cn";

type LandingTaglineProps = {
  className?: string;
};

export function LandingTagline({ className }: LandingTaglineProps) {
  const parts = appConfig.tagline.split("—");
  const lead = parts[0]?.trim() ?? appConfig.tagline;
  const tail = parts.slice(1).join("—").trim();

  return (
    <p className={cn("text-sm leading-relaxed text-landing-muted", className)}>
      <span className="text-landing-fg">{lead}</span>
      {tail ? (
        <>
          <span className="text-landing-warm"> — </span>
          <span>{tail}</span>
        </>
      ) : null}
    </p>
  );
}
