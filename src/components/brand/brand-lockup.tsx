import { appConfig } from "@/config/env";
import { cn } from "@/utils/cn";

type BrandLockupProps = {
  showTagline?: boolean;
  size?: "sm" | "md";
  className?: string;
};

export function BrandLockup({
  showTagline = false,
  size = "md",
  className,
}: BrandLockupProps) {
  return (
    <div className={cn(className)}>
      <p
        className={cn(
          "font-display tracking-tight text-foreground",
          size === "sm" ? "text-[15px] leading-none" : "text-xl leading-tight",
        )}
      >
        {appConfig.appName}
      </p>
      {showTagline ? (
        <p className="mt-1 text-xs leading-snug text-muted-foreground">
          {appConfig.tagline}
        </p>
      ) : null}
    </div>
  );
}
