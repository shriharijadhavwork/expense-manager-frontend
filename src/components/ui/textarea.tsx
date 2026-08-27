import * as React from "react";

import { cn } from "@/lib/utils";

function TextareaField({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-24 w-full rounded-[var(--radius-md)] border border-input bg-card px-3 py-2 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground hover:border-foreground/20 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/30 dark:bg-input/30",
        className,
      )}
      {...props}
    />
  );
}

type TextareaProps = React.ComponentProps<"textarea"> & {
  label?: string;
  error?: string;
  hint?: string;
};

function Textarea({
  className,
  label,
  error,
  hint,
  id,
  ...props
}: TextareaProps) {
  const textareaId = id ?? props.name;

  return (
    <div className="space-y-1.5">
      {label ? (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-foreground"
        >
          {label}
        </label>
      ) : null}
      <TextareaField
        id={textareaId}
        className={cn(error && "border-destructive focus-visible:ring-destructive/30", className)}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-sm text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export { Textarea, TextareaField };
