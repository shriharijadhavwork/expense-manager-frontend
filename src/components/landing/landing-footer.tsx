"use client";

import Link from "next/link";
import { appConfig } from "@/config/env";
import { BrandLockup } from "@/components/brand/brand-lockup";
import { landingLinkClassName } from "@/components/landing/landing-styles";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth/auth-provider";

export function LandingFooter() {
  const year = new Date().getFullYear();
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <footer className="border-t border-landing-border bg-landing-bg">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <BrandLockup
              showTagline
              className="[&_p:first-child]:text-landing-fg [&_p:last-child]:text-landing-muted"
            />
          </div>

          {!isLoading ? (
            <Link
              href={isAuthenticated ? "/app" : "/register"}
              className={landingLinkClassName}
            >
              {isAuthenticated ? "Open app" : "Sign up"}
            </Link>
          ) : null}
        </div>

        <Separator className="my-8 bg-landing-border" />

        <p className="text-xs text-landing-muted">
          © {year} {appConfig.appName}.
        </p>
      </div>
    </footer>
  );
}
