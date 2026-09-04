import type { ReactNode } from "react";
import { LandingSection } from "@/components/landing/landing-section";
import { cn } from "@/utils/cn";

function ComposerVisual() {
  return (
    <div
      className="landing-how-step-visual rounded-[var(--radius-md)] border border-landing-border p-4"
      aria-hidden
    >
      <div className="flex items-center justify-between gap-2 border-b border-landing-border/80 pb-3">
        <span className="text-[11px] font-medium uppercase tracking-wide text-landing-muted">
          Message FLUX
        </span>
        <span className="rounded-full bg-landing-accent/10 px-2 py-0.5 text-[10px] font-semibold text-landing-accent">
          Live
        </span>
      </div>
      <div className="mt-3 rounded-[var(--radius-md)] border border-landing-border bg-landing-bg px-3 py-2.5">
        <p className="text-[13px] leading-snug text-landing-fg">
          Split dinner with Rahul & Priya — my share was ₹620.
        </p>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <div className="h-9 min-w-0 flex-1 rounded-[var(--radius-md)] border border-dashed border-landing-border bg-landing-elevated px-3 text-[12px] leading-9 text-landing-muted/70">
          Say what happened…
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-landing-accent text-[10px] font-bold uppercase tracking-wide text-white">
          Go
        </div>
      </div>
    </div>
  );
}

const PARSE_TAGS = [
  { label: "₹620", tone: "amount" },
  { label: "Dining", tone: "category" },
  { label: "Rahul & Priya", tone: "people" },
  { label: "Your share", tone: "split" },
] as const;

function StructureVisual() {
  return (
    <div
      className="landing-how-step-visual rounded-[var(--radius-md)] border border-landing-border p-4"
      aria-hidden
    >
      <p className="text-[12px] leading-relaxed text-landing-muted">
        <span className="rounded bg-landing-accent/12 px-1 py-0.5 text-landing-fg">
          Split dinner
        </span>{" "}
        with{" "}
        <span className="rounded bg-landing-warm/25 px-1 py-0.5 text-landing-fg">
          Rahul & Priya
        </span>{" "}
        — my share was{" "}
        <span className="rounded bg-landing-accent/18 px-1 py-0.5 font-mono font-semibold tabular-nums text-landing-accent">
          ₹620
        </span>
        .
      </p>

      <div className="my-3 flex items-center gap-2">
        <span className="h-px flex-1 bg-landing-border" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-landing-accent">
          FLUX reads
        </span>
        <span className="h-px flex-1 bg-landing-border" />
      </div>

      <div className="flex flex-wrap gap-2">
        {PARSE_TAGS.map((tag) => (
          <span
            key={tag.label}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] font-medium",
              tag.tone === "amount" &&
                "border-landing-accent/25 bg-landing-accent/10 font-mono tabular-nums text-landing-accent",
              tag.tone === "category" &&
                "border-landing-border bg-landing-elevated text-landing-fg",
              tag.tone === "people" &&
                "border-landing-warm/30 bg-landing-warm/15 text-landing-fg",
              tag.tone === "split" &&
                "border-landing-accent/20 bg-landing-elevated text-landing-muted",
            )}
          >
            {tag.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function MoveOnVisual() {
  return (
    <div
      className="landing-how-step-visual rounded-[var(--radius-md)] border border-landing-border p-4"
      aria-hidden
    >
      <div className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-landing-accent/20 bg-landing-accent-soft/45 px-3 py-2.5">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-landing-muted">
            Expense inbox
          </p>
          <p className="mt-0.5 font-mono text-2xl font-semibold tabular-nums text-landing-accent">
            0
          </p>
        </div>
        <span className="rounded-full bg-landing-accent px-2.5 py-1 text-[11px] font-semibold text-white">
          All clear
        </span>
      </div>

      <p className="mt-4 text-[12px] leading-relaxed text-landing-muted">
        No follow-up tasks. No categories to fix. The record is already there
        when you need it.
      </p>

      <div className="mt-4 rounded-[var(--radius-md)] border border-dashed border-landing-border bg-landing-elevated px-3 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-landing-muted">
          Later, if you want
        </p>
        <p className="mt-1 text-[13px] text-landing-fg">
          &ldquo;Who still owes me for dinner?&rdquo;
        </p>
      </div>
    </div>
  );
}

const STEPS = [
  {
    id: "mention",
    step: "01",
    title: "Mention it once",
    detail:
      "Salary, a split dinner, shared groceries, a work lunch — say it the way you'd tell a friend. No form fields, no category picker.",
    Visual: ComposerVisual,
  },
  {
    id: "structure",
    step: "02",
    title: "FLUX structures it",
    detail:
      "Amount, category, people, and splits are pulled out behind the scenes. You never rebuild the story in a spreadsheet.",
    Visual: StructureVisual,
  },
  {
    id: "move-on",
    step: "03",
    title: "Move on",
    detail:
      "Nothing waits in an inbox for you to finish later. Come back when you have a question — not to clear a backlog.",
    Visual: MoveOnVisual,
  },
] as const;

function FlowStep({
  step,
  title,
  detail,
  Visual,
}: {
  step: string;
  title: string;
  detail: string;
  Visual: () => ReactNode;
}) {
  return (
    <article className="min-w-0">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-landing-accent bg-landing-bg font-mono text-[11px] font-bold text-landing-accent">
          {step}
        </span>
        <div className="min-w-0 pt-0.5">
          <h3 className="font-display text-xl text-landing-fg sm:text-[1.35rem]">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-landing-muted">
            {detail}
          </p>
        </div>
      </div>

      <div className="mt-5 pl-12 sm:mt-6">
        <Visual />
      </div>
    </article>
  );
}

function FlowConnector() {
  return (
    <div
      className="landing-how-connector mt-[4.75rem] hidden h-px w-full lg:block"
      aria-hidden
    />
  );
}

export function SectionConversation() {
  return (
    <LandingSection
      id="conversational-tracking"
      eyebrow="How it works"
      title="Not another thing on your list."
      description="Most trackers turn spending into homework — another app to open, another form to finish, another backlog to clear. FLUX is built for how you actually talk about money."
    >
      <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)_2.5rem_minmax(0,1fr)] lg:items-start lg:gap-x-2 lg:gap-y-0">
        <FlowStep
          step={STEPS[0].step}
          title={STEPS[0].title}
          detail={STEPS[0].detail}
          Visual={STEPS[0].Visual}
        />
        <FlowConnector />
        <FlowStep
          step={STEPS[1].step}
          title={STEPS[1].title}
          detail={STEPS[1].detail}
          Visual={STEPS[1].Visual}
        />
        <FlowConnector />
        <FlowStep
          step={STEPS[2].step}
          title={STEPS[2].title}
          detail={STEPS[2].detail}
          Visual={STEPS[2].Visual}
        />
      </div>

      <p className="mt-12 max-w-2xl border-t border-landing-border pt-8 text-base leading-relaxed text-landing-muted sm:text-lg">
        You mention it like a conversation. FLUX keeps the books.{" "}
        <span className="font-medium text-landing-fg">
          You don&apos;t maintain a todo list of expenses.
        </span>
      </p>
    </LandingSection>
  );
}
