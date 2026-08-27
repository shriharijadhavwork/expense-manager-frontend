import * as React from "react";

import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "primary" | "success" | "warning" | "destructive";
};

function Badge({
  className,
  tone = "neutral",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tone === "neutral" && "bg-muted text-muted-foreground",
        tone === "primary" && "bg-accent text-accent-foreground",
        tone === "success" && "bg-success/15 text-success",
        tone === "warning" && "bg-warning/15 text-warning",
        tone === "destructive" && "bg-destructive/15 text-destructive",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge };
