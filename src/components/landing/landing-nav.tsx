"use client";

import Link from "next/link";
import { BrandLockup } from "@/components/brand/brand-lockup";
import { LandingPrimaryCta } from "@/components/landing/landing-cta";
import {
  landingNavLinkClassName,
  landingNavPrimaryLinkClassName,
} from "@/components/landing/landing-styles";
import { useAuth } from "@/lib/auth/auth-provider";
import { cn } from "@/utils/cn";

export function LandingNav() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <header className="landing-nav sticky top-0 z-50 border-b border-landing-border/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="min-w-0 shrink-0 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-landing-accent focus-visible:ring-offset-2 focus-visible:ring-offset-landing-bg"
          aria-label="FLUX home"
        >
          <BrandLockup
            size="md"
            className={cn(
              "[&_p]:text-[1.375rem] [&_p]:leading-none [&_p]:text-landing-fg sm:[&_p]:text-[1.75rem]",
            )}
          />
        </Link>

        <nav
          className="flex min-w-0 items-center justify-end gap-1 sm:gap-3"
          aria-label="Primary"
        >
          <Link href="#the-problem" className={landingNavLinkClassName}>
            <span className="sm:hidden">How it works</span>
            <span className="hidden sm:inline">See how it works</span>
          </Link>

          {!isLoading && !isAuthenticated ? (
            <Link href="/login" className={landingNavLinkClassName}>
              Sign in
            </Link>
          ) : null}

          {!isLoading && isAuthenticated ? (
            <Link href="/app" className={cn(landingNavPrimaryLinkClassName, "md:hidden")}>
              Open app
            </Link>
          ) : null}

          {!isLoading && !isAuthenticated ? (
            <Link
              href="/register"
              className={cn(landingNavPrimaryLinkClassName, "md:hidden")}
            >
              Talk to FLUX
            </Link>
          ) : null}

          <LandingPrimaryCta size="sm" className="hidden md:inline-flex" />
        </nav>
      </div>
    </header>
  );
}
