import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "@/lib/utils";

function InputField({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-[var(--radius-md)] border border-input bg-card px-3 py-1 text-sm text-foreground transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground hover:border-foreground/20 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/30 dark:bg-input/30",
        className,
      )}
      {...props}
    />
  );
}

type InputProps = React.ComponentProps<"input"> & {
  label?: string;
  error?: string;
  hint?: string;
};

function Input({
  className,
  label,
  error,
  hint,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;

  return (
    <div className="space-y-1.5">
      {label ? (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-foreground"
        >
          {label}
        </label>
      ) : null}
      <InputField
        id={inputId}
        className={cn(error && "border-destructive focus-visible:ring-destructive/30", className)}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
        }
        {...props}
      />
      {error ? (
        <p id={`${inputId}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export { Input, InputField };
