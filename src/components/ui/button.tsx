import { cn } from "@/utils/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "destructive" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-medium transition-colors",
        "disabled:pointer-events-none disabled:opacity-50",
        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "h-10 px-4 text-sm",
        size === "lg" && "h-11 px-5 text-base",
        variant === "primary" &&
          "bg-primary text-primary-foreground hover:opacity-90",
        variant === "secondary" &&
          "bg-secondary text-secondary-foreground hover:opacity-90",
        variant === "outline" &&
          "border border-border bg-card text-foreground hover:bg-muted",
        variant === "ghost" && "text-foreground hover:bg-muted",
        variant === "destructive" &&
          "bg-destructive text-destructive-foreground hover:opacity-90",
        className,
      )}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-pulse rounded-full bg-current/40" />
      ) : null}
      {children}
    </button>
  );
}
