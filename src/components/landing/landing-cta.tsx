"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-provider";
import { cn } from "@/utils/cn";

type LandingPrimaryCtaProps = {
  className?: string;
  size?: "default" | "sm" | "lg";
  trailingArrow?: boolean;
  guestLabel?: string;
  authenticatedLabel?: string;
};

export function LandingPrimaryCta({
  className,
  size = "default",
  trailingArrow = false,
  guestLabel = "Talk to FLUX",
  authenticatedLabel = "Open app",
}: LandingPrimaryCtaProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (!isLoading && isAuthenticated) {
    return (
      <Button
        size={size}
        nativeButton={false}
        render={<Link href="/app" />}
        className={cn(
          "bg-landing-accent text-landing-accent-fg hover:bg-landing-accent/90",
          "focus-visible:ring-landing-accent",
          className,
        )}
      >
        {authenticatedLabel}
      </Button>
    );
  }

  return (
    <Button
      size={size}
      nativeButton={false}
      render={<Link href="/register" />}
      className={cn(
        "bg-landing-accent text-landing-accent-fg hover:bg-landing-accent/90",
        "focus-visible:ring-landing-accent",
        className,
      )}
      aria-busy={isLoading || undefined}
    >
      {guestLabel}
      {trailingArrow ? " →" : ""}
    </Button>
  );
}
