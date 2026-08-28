import type { ReactNode } from "react";
import { LandingDisclaimer } from "@/components/landing/landing-disclaimer";
import { LandingSection } from "@/components/landing/landing-section";
import { cn } from "@/utils/cn";

const AVATAR_TONES = [
  "bg-landing-accent/15 text-landing-accent",
  "bg-landing-warm/25 text-landing-fg",
  "bg-landing-chat-user text-white",
] as const;

function PersonAvatar({
  name,
  toneIndex = 0,
  className,
}: {
  name: string;
  toneIndex?: number;
  className?: string;
}) {
  const initials =
    name === "You"
      ? "Y"
      : name
          .trim()
          .split(/\s+/)
          .map((part) => part[0])
          .join("")
          .slice(0, 2);

  return (
    <span
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold ring-2 ring-white",
        AVATAR_TONES[toneIndex % AVATAR_TONES.length],
        className,
      )}
      aria-hidden
    >
      {initials}
    </span>
  );
}

function CompareBars({
  previousLabel,
  previousAmount,
  currentLabel,
  currentAmount,
  previousWidth,
  currentWidth,
}: {
  previousLabel: string;
  previousAmount: string;
  currentLabel: string;
  currentAmount: string;
  previousWidth: string;
  currentWidth: string;
}) {
  return (
    <div className="space-y-3" aria-hidden>
      <div>
        <div className="mb-1 flex items-center justify-between text-[11px] text-landing-muted">
          <span>{previousLabel}</span>
          <span className="font-mono tabular-nums">{previousAmount}</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-landing-border/70">
          <div
            className={cn("h-full rounded-full bg-landing-muted/35", previousWidth)}
          />
        </div>
      </div>
      <div>
        <div className="mb-1 flex items-center justify-between text-[11px]">
          <span className="font-medium text-landing-fg">{currentLabel}</span>
          <span className="font-mono font-semibold tabular-nums text-landing-accent">
            {currentAmount}
          </span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-landing-border/70">
          <div
            className={cn("h-full rounded-full bg-landing-accent", currentWidth)}
          />
        </div>
      </div>
    </div>
  );
}

function SharedSpendVisual({ compact }: { compact?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-md)] border border-landing-border/70 bg-landing-bg/50 p-4",
        compact ? "mt-0" : "mt-5",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <PersonAvatar name="Meera" toneIndex={0} />
          <PersonAvatar name="Rohan" toneIndex={1} className="-ml-2" />
          <PersonAvatar name="You" toneIndex={2} className="-ml-2" />
        </div>
        <span className="rounded-full bg-landing-accent/12 px-2 py-0.5 text-[10px] font-bold text-landing-accent">
          +133%
        </span>
      </div>

      <CompareBars
        previousLabel="Last month"
        previousAmount="₹1,800"
        currentLabel="This month · Weekend trip"
        currentAmount="₹4,200"
        previousWidth="w-[22%]"
        currentWidth="w-[88%]"
      />

      <ul className="mt-4 grid gap-2 border-t border-landing-border/60 pt-3 sm:grid-cols-3">
        {[
          { label: "Cab", amount: "₹2,400" },
          { label: "Airbnb", amount: "₹1,800" },
          { label: "Split", amount: "3 ways" },
        ].map((item) => (
          <li
            key={item.label}
            className="rounded-[var(--radius-md)] border border-landing-border/60 bg-white/70 px-2.5 py-2 text-center text-[11px]"
          >
            <span className="text-landing-muted">{item.label}</span>
            <span className="mt-0.5 block font-mono font-semibold tabular-nums text-landing-fg">
              {item.amount}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DiningTrendVisual() {
  const weeks = [
    { label: "W1", height: "h-[38%]" },
    { label: "W2", height: "h-[52%]" },
    { label: "W3", height: "h-[48%]" },
    { label: "W4", height: "h-[72%]" },
  ] as const;

  return (
    <div className="mt-5 rounded-[var(--radius-md)] border border-landing-border/70 bg-landing-bg/50 p-4">
      <div className="flex items-end justify-between gap-3">
        <div className="flex h-20 flex-1 items-end justify-between gap-2">
          {weeks.map((week, index) => (
            <div key={week.label} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex h-16 w-full items-end rounded-sm bg-landing-border/40 px-0.5 pb-0.5">
                <div
                  className={cn(
                    "w-full rounded-sm",
                    index === weeks.length - 1
                      ? "bg-landing-accent"
                      : "bg-landing-accent/45",
                    week.height,
                  )}
                />
              </div>
              <span className="text-[9px] font-medium text-landing-muted">
                {week.label}
              </span>
            </div>
          ))}
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-landing-muted">
            vs last month
          </p>
          <p className="mt-1 font-mono text-xl font-bold tabular-nums text-landing-accent">
            +24%
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-landing-border/60 pt-3 text-[12px]">
        <span className="text-landing-muted">₹6,790 last</span>
        <span className="font-mono font-semibold tabular-nums text-landing-fg">
          ₹8,420 now
        </span>
      </div>
    </div>
  );
}

function WeekendRhythmVisual() {
  const days = [
    { label: "Su", weekend: true },
    { label: "Mo", weekend: false },
    { label: "Tu", weekend: false },
    { label: "We", weekend: false },
    { label: "Th", weekend: false },
    { label: "Fr", weekend: false },
    { label: "Sa", weekend: true },
  ] as const;

  return (
    <div className="mt-5 rounded-[var(--radius-md)] border border-landing-border/70 bg-landing-bg/50 p-3.5 sm:p-4">
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => (
          <div key={day.label} className="flex min-w-0 flex-col items-center">
            <span
              className={cn(
                "flex aspect-square w-full max-w-9 items-center justify-center rounded-full text-[9px] font-semibold sm:text-[10px]",
                day.weekend
                  ? "bg-landing-accent text-white shadow-[0_2px_6px_color-mix(in_oklab,var(--landing-accent)_30%,transparent)]"
                  : "border border-landing-border bg-white/80 text-landing-muted",
              )}
            >
              {day.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-landing-border/60 pt-3">
        <p className="text-[11px] leading-snug text-landing-muted sm:text-[12px]">
          Discretionary spend
        </p>
        <p className="shrink-0 text-right font-mono text-base font-bold tabular-nums text-landing-accent sm:text-lg">
          62%
          <span className="ml-1 text-[10px] font-medium text-landing-muted sm:text-[11px]">
            Sat–Sun
          </span>
        </p>
      </div>
    </div>
  );
}

function InsightCard({
  badge,
  title,
  detail,
  visual,
  className,
  featured,
}: {
  badge: string;
  title: string;
  detail: string;
  visual: ReactNode;
  className?: string;
  featured?: boolean;
}) {
  return (
    <article
      className={cn(
        "landing-insight-card landing-reveal landing-reveal-item relative rounded-[var(--radius-lg)] border border-white/70 p-5 sm:p-6",
        featured && "lg:p-6",
        className,
      )}
    >
      <div
        className={cn(
          featured &&
            "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-center lg:gap-6",
        )}
      >
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="rounded-full border border-landing-accent/20 bg-landing-accent-soft/50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-landing-accent">
              {badge}
            </span>
            {featured ? (
              <span className="text-[10px] font-medium text-landing-muted">
                Highest signal this month
              </span>
            ) : null}
          </div>

          <h3
            className={cn(
              "mt-4 font-display leading-snug text-landing-fg",
              featured ? "text-xl sm:text-2xl" : "text-lg sm:text-xl",
            )}
          >
            {title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-landing-muted">
            {detail}
          </p>
        </div>

        <div className={cn(featured ? "mt-5 lg:mt-0" : "mt-5")}>{visual}</div>
      </div>
    </article>
  );
}

function InsightsPatternBoard() {
  return (
    <div className="landing-insights-board landing-reveal landing-reveal-body relative rounded-[var(--radius-lg)] border border-landing-accent/15 p-4 sm:p-5 lg:p-6">
      <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-landing-accent/10 pb-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-landing-muted">
            Pattern layer
          </p>
          <p className="mt-1 text-sm font-medium text-landing-fg">
            March · FLUX is watching
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-landing-accent/20 bg-white/80 px-3 py-1.5">
          <span
            className="landing-insight-live h-2 w-2 rounded-full bg-landing-accent"
            aria-hidden
          />
          <span className="text-[11px] font-semibold text-landing-accent">
            3 patterns surfaced
          </span>
        </div>
      </div>

      <div className="relative mt-5 grid gap-4 sm:grid-cols-2 lg:gap-5">
        <InsightCard
          featured
          badge="Shared spend"
          title="Shared spending is up — mostly the weekend trip."
          detail="₹4,200 across Meera & Rohan this month vs ₹1,800 last month."
          visual={<SharedSpendVisual compact />}
          className="sm:col-span-2"
        />
        <InsightCard
          badge="Dining trend"
          title="Dining is up 24% compared with last month."
          detail="₹8,420 this month vs ₹6,790 last month."
          visual={<DiningTrendVisual />}
        />
        <InsightCard
          badge="Weekend rhythm"
          title="You spent more on weekends this month."
          detail="62% of discretionary spend landed on Sat–Sun."
          visual={<WeekendRhythmVisual />}
        />
      </div>
    </div>
  );
}

export function SectionInsights() {
  return (
    <LandingSection
      id="insights"
      contentClassName="pb-16 sm:pb-20 lg:pb-24"
      title="FLUX notices things you don't."
      description="As your spending history grows, FLUX surfaces patterns you'd otherwise miss — without another dashboard to babysit."
    >
      <InsightsPatternBoard />

      <p className="mt-10 max-w-2xl text-base leading-relaxed text-landing-muted sm:text-lg">
        Not more charts to maintain —{" "}
        <span className="font-medium text-landing-fg">
          signals that find you when your spending story shifts.
        </span>
      </p>

      <LandingDisclaimer className="mt-8 max-w-2xl" badge="Coming soon">
        Pattern alerts like these — surfaced for you, not another dashboard to
        babysit.
      </LandingDisclaimer>
    </LandingSection>
  );
}
