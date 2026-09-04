import { LandingSection } from "@/components/landing/landing-section";
import { cn } from "@/utils/cn";

const TRADITIONAL_PAIN = [
  "You reconstruct the moment in a form — after the fact.",
  "Splits, people, and context get flattened into categories.",
  "The habit breaks the first busy week.",
] as const;

const FLUX_STEPS = [
  {
    step: "01",
    title: "Say what happened",
    detail: "“Dinner with Rahul, ₹1,240 — split three ways.”",
  },
  {
    step: "02",
    title: "FLUX structures it",
    detail: "Amount, category, people, and timing — kept together.",
  },
  {
    step: "03",
    title: "Ask when it matters",
    detail: "Who owes you, household spend, quarterly totals — in plain language.",
  },
] as const;

function FormFieldMock({
  label,
  wide,
  stale,
}: {
  label: string;
  wide?: boolean;
  stale?: boolean;
}) {
  return (
    <div>
      <span className="text-[11px] font-medium uppercase tracking-wide text-landing-muted/90">
        {label}
      </span>
      <div
        className={cn(
          "mt-1.5 h-9 rounded-[var(--radius-md)] border bg-landing-elevated",
          stale
            ? "border-landing-friction/25"
            : "border-landing-border",
          wide ? "w-full" : "w-3/5",
        )}
      />
    </div>
  );
}

function TraditionalPanel() {
  return (
    <article className="landing-problem-traditional relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-landing-border/80 p-6 sm:p-7">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-landing-muted">
        Traditional tracking
      </p>
      <p className="mt-2 text-sm leading-relaxed text-landing-muted">
        Stop what you&apos;re doing. Open the app. Rebuild the story in a
        form.
      </p>

      <div
        className="mt-6 rounded-[var(--radius-md)] border border-dashed border-landing-friction/20 bg-landing-elevated p-4 sm:p-5"
        aria-hidden
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <FormFieldMock label="Amount" />
          <FormFieldMock label="Category" stale />
          <FormFieldMock label="Date" wide />
          <FormFieldMock label="Notes" wide stale />
        </div>
        <div className="mt-4 flex h-9 w-32 items-center justify-center rounded-[var(--radius-md)] border border-landing-border bg-landing-muted/10 text-[11px] font-medium uppercase tracking-wide text-landing-muted/80">
          Save
        </div>
      </div>

      <ul className="mt-6 flex-1 space-y-3.5 border-t border-landing-border/80 pt-6">
        {TRADITIONAL_PAIN.map((point) => (
          <li
            key={point}
            className="flex gap-3 text-sm leading-relaxed text-landing-muted"
          >
            <span
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-landing-friction/55"
              aria-hidden
            />
            {point}
          </li>
        ))}
      </ul>
    </article>
  );
}

function FluxChatMock() {
  return (
    <div
      className="relative mt-6 overflow-hidden rounded-[var(--radius-md)] border border-landing-border bg-landing-elevated p-4 shadow-[0_8px_24px_-12px_color-mix(in_oklab,var(--landing-accent)_35%,transparent)]"
      aria-hidden
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-landing-accent/25 to-transparent"
        aria-hidden
      />
      <div className="space-y-2.5">
        <div className="flex justify-end">
          <div className="max-w-[88%] rounded-[1rem] rounded-br-[0.25rem] bg-landing-chat-user px-3 py-2 text-[13px] leading-snug text-white shadow-[0_2px_8px_color-mix(in_oklab,var(--landing-chat-user)_45%,transparent)]">
            Split dinner with Rahul — my share was ₹620.
          </div>
        </div>
        <div className="flex justify-start">
          <div className="max-w-[88%] rounded-[1rem] rounded-bl-[0.25rem] border border-landing-flux-bubble-border/45 bg-landing-flux-bubble px-3 py-2.5 text-[13px] text-landing-fg shadow-[0_2px_6px_rgb(0_0_0/0.06)]">
            <span className="font-medium text-landing-accent">Got it.</span>
            <div className="mt-2 rounded-md border border-landing-accent/20 bg-landing-elevated px-2.5 py-1.5 font-mono text-[12px] font-semibold tabular-nums text-landing-accent">
              ₹620
              <span className="mx-1 font-sans font-normal text-landing-muted">
                ·
              </span>
              <span className="font-sans font-medium text-landing-fg">
                Dining
              </span>
            </div>
            <p className="mt-1.5 text-[11px] font-medium text-landing-fg/65">
              Split with Rahul · Yesterday
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FluxTimeline() {
  return (
    <ol className="mt-6 space-y-0">
      {FLUX_STEPS.map((item, index) => {
        const isLast = index === FLUX_STEPS.length - 1;

        return (
          <li key={item.step} className="relative flex gap-4 pb-6 last:pb-0">
            {!isLast ? (
              <span
                className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-gradient-to-b from-landing-accent/55 to-landing-accent/15"
                aria-hidden
              />
            ) : null}
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-landing-accent font-mono text-[10px] font-semibold text-white shadow-[0_2px_8px_color-mix(in_oklab,var(--landing-accent)_40%,transparent)]">
              {item.step}
            </span>
            <div className="min-w-0 pt-1">
              <p className="text-sm font-semibold text-landing-fg">
                {item.title}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-landing-muted">
                {item.detail}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function FluxPanel() {
  return (
    <article className="landing-problem-flux relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-landing-accent/30 p-6 sm:p-7">
      <div className="relative">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-landing-accent">
          <span
            className="h-1.5 w-1.5 rounded-full bg-landing-accent shadow-[0_0_0_3px_color-mix(in_oklab,var(--landing-accent)_22%,transparent)]"
            aria-hidden
          />
          With FLUX
        </p>
        <p className="mt-2 text-sm font-medium leading-relaxed text-landing-fg">
          Talk naturally. FLUX keeps the context and keeps score.
        </p>

        <FluxChatMock />
        <FluxTimeline />
      </div>
    </article>
  );
}

export function SectionProblem() {
  return (
    <LandingSection
      id="the-problem"
      tone="surface"
      eyebrow="Why FLUX"
      contentClassName="pt-10 pb-16 sm:pt-12 sm:pb-20 lg:pt-14 lg:pb-24"
      title="Your life doesn't come with a spreadsheet."
      description="Most expense apps expect you to stop what you're doing, open a form, and reconstruct what already happened. That's homework — and it doesn't scale to real life."
    >
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <TraditionalPanel />
        <FluxPanel />
      </div>

      <p className="mt-10 max-w-2xl text-base leading-relaxed text-landing-muted sm:text-lg">
        You shouldn&apos;t have to manually record every coffee, split bill, or
        bank notification.{" "}
        <span className="font-medium text-landing-accent">
          FLUX meets you in conversation — not in a data entry screen.
        </span>
      </p>
    </LandingSection>
  );
}
