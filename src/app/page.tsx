import type { Metadata } from "next";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingNav } from "@/components/landing/landing-nav";
import { SectionAskFlux } from "@/components/landing/section-ask-flux";
import { SectionConversation } from "@/components/landing/section-conversation";
import { SectionFinalCta } from "@/components/landing/section-final-cta";
import { SectionInsights } from "@/components/landing/section-insights";
import { SectionMemory } from "@/components/landing/section-memory";
import { SectionMoneyFlow } from "@/components/landing/section-money-flow";
import { SectionProblem } from "@/components/landing/section-problem";
import { SectionTogether } from "@/components/landing/section-together";
import { SectionTrust } from "@/components/landing/section-trust";
import { LandingShell } from "@/components/landing/landing-shell";
import { appConfig } from "@/config/env";

const description =
  "Talk naturally about your money. FLUX understands, remembers context, and keeps score — so you don't have to maintain a spreadsheet.";

export const metadata: Metadata = {
  title: `${appConfig.appName} — Go live. Spend. We'll keep score.`,
  description,
  applicationName: appConfig.appName,
  openGraph: {
    title: `${appConfig.appName} — Go live. Spend. We'll keep score.`,
    description,
    type: "website",
    siteName: appConfig.appName,
  },
  twitter: {
    card: "summary_large_image",
    title: `${appConfig.appName} — Go live. Spend. We'll keep score.`,
    description,
  },
};

export default function HomePage() {
  return (
    <LandingShell>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-landing-surface focus:px-3 focus:py-2 focus:text-sm focus:text-landing-fg focus:shadow-sm"
      >
        Skip to content
      </a>

      <LandingNav />

      <main id="main-content" className="flex-1">
        <LandingHero />
        <SectionProblem />
        <SectionConversation />
        <SectionTogether />
        <SectionMemory />
        <SectionMoneyFlow />
        <SectionAskFlux />
        <SectionInsights />
        <SectionTrust />
        <SectionFinalCta />
      </main>

      <LandingFooter />
    </LandingShell>
  );
}
