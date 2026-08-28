"use client";

import Link from "next/link";
import { BrandLockup } from "@/components/brand/brand-lockup";
import { LandingPrimaryCta } from "@/components/landing/landing-cta";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-provider";
import { cn } from "@/utils/cn";

export function LandingNav() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-landing-border bg-landing-bg">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-landing-accent focus-visible:ring-offset-2 focus-visible:ring-offset-landing-bg"
          aria-label="FLUX home"
        >
          <BrandLockup
            size="sm"
            className={cn("[&_p]:text-landing-fg")}
          />
        </Link>

        <nav
          className="flex items-center gap-2 sm:gap-3"
          aria-label="Primary"
        >
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href="#conversation-demo" />}
            className="text-landing-muted hover:bg-landing-surface hover:text-landing-fg max-sm:px-2 max-sm:text-xs"
          >
            <span className="sm:hidden">How it works</span>
            <span className="hidden sm:inline">See how it works</span>
          </Button>

          {!isLoading && !isAuthenticated ? (
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<Link href="/login" />}
              className="text-landing-muted hover:bg-landing-surface hover:text-landing-fg"
            >
              Sign in
            </Button>
          ) : null}

          <LandingPrimaryCta size="sm" />
        </nav>
      </div>
    </header>
  );
}
