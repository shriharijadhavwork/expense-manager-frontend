import type { ReactNode } from "react";
import { LandingDisclaimer } from "@/components/landing/landing-disclaimer";
import { LandingSection } from "@/components/landing/landing-section";
import { SpendingRadarChart } from "@/components/landing/spending-radar-chart";
import { cn } from "@/utils/cn";

const THREADS = [
  {
    id: "trip",
    name: "Weekend trip",
    people: ["Meera", "Rohan", "You"],
    meta: "₹4,200 shared",
    active: true,
  },
  {
    id: "home",
    name: "Home · with Arjun",
    people: ["Arjun", "You"],
    meta: "Household",
    active: false,
  },
  {
    id: "insights",
    name: "Quarterly review",
    people: ["You"],
    meta: "Just you",
    active: false,
  },
] as const;

const TRIP_EXPENSES = [
  { item: "Cab", amount: "₹2,400", paidBy: "You", each: "₹800" },
  { item: "Airbnb", amount: "₹1,800", paidBy: "You", each: "₹600" },
] as const;

const TRIP_BALANCES = [
  { name: "Meera", owes: "₹1,400" },
  { name: "Rohan", owes: "₹1,400" },
] as const;

const HOME_SPLITS = [
  { label: "Groceries", amount: "₹3,200", split: "50–50" },
  { label: "Electricity", amount: "₹2,000", split: "60–40 you" },
] as const;

function InsightsRadarPanel() {
  return (
    <div
      className="landing-together-panel mt-5 rounded-[var(--radius-md)] border border-landing-border p-4 sm:p-5"
      aria-hidden
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-landing-border/70 pb-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-landing-muted">
            Q1 spending profile
          </p>
          <p className="mt-1 text-sm text-landing-fg">
            Rent and EMI usually dominate — then see what else fills the rest.
          </p>
        </div>
        <span className="rounded-full bg-landing-accent/10 px-2.5 py-1 text-[11px] font-semibold text-landing-accent">
          8 categories tracked
        </span>
      </div>

      <div className="mt-5">
        <SpendingRadarChart />
      </div>
    </div>
  );
}

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
    name === "You" ? "Y" : name.trim().split(/\s+/).map((part) => part[0]).join("").slice(0, 2);

  return (
    <span
      className={cn(
        "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ring-2 ring-white",
        AVATAR_TONES[toneIndex % AVATAR_TONES.length],
        className,
      )}
      aria-hidden
    >
      {initials}
    </span>
  );
}

function AvatarStack({ people }: { people: readonly string[] }) {
  return (
    <span className="flex items-center">
      {people.map((person, index) => (
        <PersonAvatar
          key={person}
          name={person}
          toneIndex={index}
          className={cn(index > 0 && "-ml-2")}
        />
      ))}
    </span>
  );
}

function ThreadRail() {
  return (
    <div
      className="landing-together-rail rounded-[var(--radius-lg)] border border-landing-border p-3 sm:p-4"
      aria-label="Example FLUX threads"
    >
      <div className="flex items-center justify-between gap-3 border-b border-landing-border/70 pb-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-landing-muted">
          Your threads
        </p>
        <span className="rounded-full bg-landing-accent/10 px-2 py-0.5 text-[10px] font-semibold text-landing-accent">
          3 contexts
        </span>
      </div>

      <ul
        className="mt-3 flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-3 sm:overflow-visible"
        data-lenis-prevent
      >
        {THREADS.map((thread) => (
          <li key={thread.id} className="min-w-[11.5rem] shrink-0 sm:min-w-0">
            <div
              className={cn(
                "rounded-[var(--radius-md)] border px-3 py-2.5 transition-colors",
                thread.active
                  ? "border-landing-accent/30 bg-landing-elevated shadow-[0_2px_8px_-4px_color-mix(in_oklab,var(--landing-accent)_30%,transparent)]"
                  : "border-landing-border/80 bg-landing-surface",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <AvatarStack people={thread.people} />
                <span className="text-[10px] font-medium text-landing-muted">
                  {thread.meta}
                </span>
              </div>
              <p
                className={cn(
                  "mt-2 truncate text-[13px] font-medium",
                  thread.active ? "text-landing-fg" : "text-landing-muted",
                )}
              >
                {thread.name}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TripSettlementBoard() {
  return (
    <div
      className="landing-together-panel mt-5 rounded-[var(--radius-md)] border border-landing-border p-4"
      aria-hidden
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-landing-muted">
          Trip tally
        </p>
        <span className="font-mono text-xs font-semibold tabular-nums text-landing-accent">
          ₹4,200 total
        </span>
      </div>

      <div className="mt-3 overflow-hidden rounded-[var(--radius-md)] border border-landing-border/80 bg-landing-elevated">
        <div className="grid grid-cols-[1.1fr_0.8fr_0.7fr] gap-2 border-b border-landing-border/70 bg-landing-bg/60 px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-landing-muted">
          <span>Expense</span>
          <span>Paid by</span>
          <span className="text-right">Each</span>
        </div>
        {TRIP_EXPENSES.map((row) => (
          <div
            key={row.item}
            className="grid grid-cols-[1.1fr_0.8fr_0.7fr] gap-2 border-b border-landing-border/50 px-3 py-2.5 text-[12px] last:border-b-0"
          >
            <span className="text-landing-fg">
              {row.item}{" "}
              <span className="font-mono tabular-nums text-landing-muted">
                {row.amount}
              </span>
            </span>
            <span className="text-landing-muted">{row.paidBy}</span>
            <span className="text-right font-mono tabular-nums text-landing-accent">
              {row.each}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-[var(--radius-md)] border border-landing-accent/20 bg-landing-accent-soft/40 px-3 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-landing-accent">
          Outstanding to you
        </p>
        <ul className="mt-2 space-y-2">
          {TRIP_BALANCES.map((balance) => (
            <li
              key={balance.name}
              className="flex items-center justify-between gap-3 text-[13px]"
            >
              <span className="flex items-center gap-2 text-landing-fg">
                <PersonAvatar name={balance.name} toneIndex={0} />
                {balance.name}
              </span>
              <span className="font-mono font-semibold tabular-nums text-landing-accent">
                {balance.owes}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function HouseholdMeter() {
  return (
    <div
      className="landing-together-panel mt-5 rounded-[var(--radius-md)] border border-landing-border p-4"
      aria-hidden
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-landing-muted">
          March household
        </p>
        <span className="font-mono text-xs font-semibold tabular-nums text-landing-fg">
          ₹8,000
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <div className="mb-1 flex justify-between text-[11px] text-landing-muted">
            <span>You · 52%</span>
            <span className="font-mono tabular-nums">₹4,200</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-landing-border/70">
            <div className="h-full w-[52%] rounded-full bg-landing-accent" />
          </div>
        </div>
        <div>
          <div className="mb-1 flex justify-between text-[11px] text-landing-muted">
            <span>Arjun · 48%</span>
            <span className="font-mono tabular-nums">₹3,800</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-landing-border/70">
            <div className="h-full w-[48%] rounded-full bg-landing-warm/80" />
          </div>
        </div>
      </div>

      <ul className="mt-4 space-y-2 border-t border-landing-border/70 pt-4">
        {HOME_SPLITS.map((split) => (
          <li
            key={split.label}
            className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-landing-border/70 bg-landing-elevated px-3 py-2 text-[12px]"
          >
            <span className="text-landing-fg">{split.label}</span>
            <span className="font-mono tabular-nums text-landing-muted">
              {split.amount}
            </span>
            <span className="rounded-full bg-landing-accent/10 px-2 py-0.5 text-[10px] font-semibold text-landing-accent">
              {split.split}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}


function ScenarioPanel({
  label,
  title,
  people,
  highlight,
  children,
  className,
}: {
  label: string;
  title: string;
  people: readonly string[];
  highlight: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-[var(--radius-lg)] border border-landing-border bg-landing-bg p-5 sm:p-6",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-landing-accent">
            {label}
          </p>
          <h3 className="mt-2 font-display text-xl text-landing-fg">{title}</h3>
        </div>
        <AvatarStack people={people} />
      </div>

      {children}

      <p className="mt-5 border-t border-landing-border pt-4 text-sm leading-relaxed text-landing-muted">
        {highlight}
      </p>
    </article>
  );
}

export function SectionTogether() {
  return (
    <LandingSection
      id="track-together"
      tone="surface"
      eyebrow="Together"
      title="Track money with the people in your life."
      description="Partners, roommates, family, friends, colleagues — FLUX keeps shared context in group threads so nobody has to be the spreadsheet person."
    >
      <ThreadRail />

      <div className="mt-8 grid gap-5 lg:grid-cols-12 lg:gap-6">
        <ScenarioPanel
          label="Friends & trips"
          title="Weekend trip"
          people={THREADS[0].people}
          highlight="FLUX tracks who paid, who owes, and keeps the group tally — so you're not chasing people in a group chat."
          className="lg:col-span-7"
        >
          <TripSettlementBoard />
        </ScenarioPanel>

        <ScenarioPanel
          label="Partner & home"
          title="Home · with Arjun"
          people={THREADS[1].people}
          highlight="Uneven splits, shared bills, running balances — all in one household thread."
          className="lg:col-span-5"
        >
          <HouseholdMeter />
        </ScenarioPanel>
      </div>

      <ScenarioPanel
        label="You & insights"
        title="Quarterly review"
        people={THREADS[2].people}
        highlight="Rent, EMI, groceries, dining — see the full picture and ask FLUX where your quarter actually went."
        className="mt-5"
      >
        <InsightsRadarPanel />
      </ScenarioPanel>

      <LandingDisclaimer className="mt-8" badge="Coming soon">
        Shared threads, splits, and running balances — built for the people in
        your life, not a shared spreadsheet.
      </LandingDisclaimer>
    </LandingSection>
  );
}
