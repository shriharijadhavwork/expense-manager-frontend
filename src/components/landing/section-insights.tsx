import { LandingDisclaimer } from "@/components/landing/landing-disclaimer";
import { LandingSection } from "@/components/landing/landing-section";

const INSIGHTS = [
  {
    id: "shared-up",
    text: "Shared spending is up — mostly the weekend trip.",
    detail: "₹4,200 across Meera & Rohan this month vs ₹1,800 last month.",
  },
  {
    id: "dining-up",
    text: "Dining is up 24% compared with last month.",
    detail: "₹8,420 this month vs ₹6,790 last month.",
  },
  {
    id: "weekends",
    text: "You spent more on weekends this month.",
    detail: "62% of discretionary spend landed on Sat–Sun.",
  },
] as const;

function InsightItem({
  text,
  detail,
}: {
  text: string;
  detail: string;
}) {
  return (
    <article className="border-l-2 border-landing-accent/50 py-1 pl-5">
      <p className="text-base leading-snug text-landing-fg sm:text-lg">
        {text}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-landing-muted">
        {detail}
      </p>
    </article>
  );
}

export function SectionInsights() {
  return (
    <LandingSection
      id="insights"
      tone="surface"
      title="FLUX notices things you don't."
      description="As your spending history grows, FLUX surfaces patterns you'd otherwise miss — without another dashboard to babysit."
    >
      <div className="max-w-2xl space-y-8">
        {INSIGHTS.map((insight) => (
          <InsightItem
            key={insight.id}
            text={insight.text}
            detail={insight.detail}
          />
        ))}
      </div>

      <LandingDisclaimer className="mt-10 max-w-2xl">
        Example insights shown above. Category totals and monthly summaries are
        available today; comparative and pattern-based insights are part of the
        FLUX product direction.
      </LandingDisclaimer>
    </LandingSection>
  );
}
