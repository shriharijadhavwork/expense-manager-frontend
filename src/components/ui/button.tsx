import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        primary: "bg-primary text-primary-foreground hover:opacity-90",
        outline:
          "border-border bg-card text-foreground hover:bg-muted dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:opacity-90",
        ghost:
          "text-foreground hover:bg-muted dark:hover:bg-muted/50",
        destructive:
          "bg-destructive text-destructive-foreground hover:opacity-90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 gap-2 px-4",
        sm: "h-9 gap-1.5 px-3 text-sm",
        md: "h-10 gap-2 px-4 text-sm",
        lg: "h-11 gap-2 px-5 text-base",
        icon: "size-8",
        "icon-sm": "size-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
  };

function Button({
  className,
  variant = "default",
  size = "default",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const resolvedVariant = variant === "primary" ? "primary" : variant;
  const resolvedSize = size === "md" ? "md" : size;

  return (
    <ButtonPrimitive
      data-slot="button"
      disabled={disabled || loading}
      className={cn(
        buttonVariants({ variant: resolvedVariant, size: resolvedSize, className }),
      )}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-pulse rounded-full bg-current/40" />
      ) : null}
      {children}
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants };
