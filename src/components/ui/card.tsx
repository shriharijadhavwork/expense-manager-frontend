import * as React from "react";

import { cn } from "@/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  padding?: "none" | "sm" | "md" | "lg";
};

function Card({
  className,
  padding = "md",
  children,
  ...props
}: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(
        "rounded-[var(--radius-lg)] border border-border bg-card text-card-foreground shadow-[var(--shadow-sm)]",
        padding === "sm" && "p-4",
        padding === "md" && "p-5",
        padding === "lg" && "p-6",
        padding === "none" && "p-0",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Card };
