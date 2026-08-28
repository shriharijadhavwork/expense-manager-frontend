import Link from "next/link";
import { appConfig } from "@/config/env";
import { BrandLockup } from "@/components/brand/brand-lockup";
import { landingLinkClassName } from "@/components/landing/landing-styles";
import { Separator } from "@/components/ui/separator";

export function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-landing-border bg-landing-bg">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <BrandLockup
              showTagline
              className="[&_p:first-child]:text-landing-fg [&_p:last-child]:text-landing-muted"
            />
          </div>

          <nav
            className="flex flex-col gap-3 text-sm sm:items-end"
            aria-label="Footer"
          >
            <Link href="/register" className={landingLinkClassName}>
              Create account
            </Link>
            <Link href="/login" className={landingLinkClassName}>
              Sign in
            </Link>
            <Link href="/app" className={landingLinkClassName}>
              Open app
            </Link>
            <Link href="#trust" className={landingLinkClassName}>
              Privacy &amp; security
            </Link>
          </nav>
        </div>

        <Separator className="my-8 bg-landing-border" />

        <p className="text-xs text-landing-muted">
          © {year} {appConfig.appName}. Your money is yours.
        </p>
      </div>
    </footer>
  );
}
