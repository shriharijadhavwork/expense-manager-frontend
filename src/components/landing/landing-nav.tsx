"use client";

import Link from "next/link";
import { BrandLockup } from "@/components/brand/brand-lockup";
import { LandingPrimaryCta } from "@/components/landing/landing-cta";
import { LandingSecondaryCta } from "@/components/landing/landing-secondary-cta";
import { landingNavLinkClassName } from "@/components/landing/landing-styles";
import { useAuth } from "@/lib/auth/auth-provider";
import { cn } from "@/utils/cn";

export function LandingNav() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <header className="landing-nav sticky top-0 z-50 border-b border-landing-border/70">
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
          <LandingSecondaryCta href="#the-problem" size="sm">
            <span className="sm:hidden">How it works</span>
            <span className="hidden sm:inline">See how it works</span>
          </LandingSecondaryCta>

          {!isLoading && !isAuthenticated ? (
            <Link href="/login" className={landingNavLinkClassName}>
              Sign in
            </Link>
          ) : null}

          <LandingPrimaryCta size="sm" />
        </nav>
      </div>
    </header>
  );
}
