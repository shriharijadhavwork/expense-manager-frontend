import { LandingSection } from "@/components/landing/landing-section";
import { cn } from "@/utils/cn";

const TRADITIONAL_STEPS = ["forms", "categories", "fields", "save"] as const;
const FLUX_STEPS = ["talk", "understood", "tracked"] as const;

function FlowSteps({
  label,
  steps,
  variant,
}: {
  label: string;
  steps: readonly string[];
  variant: "muted" | "accent";
}) {
  return (
    <div>
      <p
        className={cn(
          "text-sm font-medium",
          variant === "muted" ? "text-landing-muted" : "text-landing-fg",
        )}
      >
        {label}
      </p>
      <ol
        className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2"
        aria-label={label}
      >
        {steps.map((step, index) => (
          <li key={step} className="flex items-center gap-2">
            <span
              className={cn(
                "rounded-[var(--radius-md)] border px-3 py-1.5 text-sm capitalize",
                variant === "muted" &&
                  "border-landing-border bg-landing-bg text-landing-muted",
                variant === "accent" &&
                  "border-landing-accent/30 bg-landing-accent-soft text-landing-fg",
              )}
            >
              {step}
            </span>
            {index < steps.length - 1 ? (
              <span
                className="text-landing-muted select-none"
                aria-hidden
              >
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function SectionProblem() {
  return (
    <LandingSection
      id="the-problem"
      tone="surface"
      contentClassName="pt-10 pb-16 sm:pt-12 sm:pb-20 lg:pt-14 lg:pb-24"
      title="Your life doesn't come with a spreadsheet."
      description="Most expense apps expect you to stop what you're doing, open a form, and reconstruct what already happened. That's homework — and it doesn't scale to real life."
    >
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <FlowSteps
          label="Traditional tracking"
          steps={TRADITIONAL_STEPS}
          variant="muted"
        />
        <FlowSteps label="FLUX" steps={FLUX_STEPS} variant="accent" />
      </div>

      <p className="mt-10 max-w-xl text-sm leading-relaxed text-landing-muted">
        You shouldn&apos;t have to manually record every coffee, split bill, or
        bank notification. FLUX meets you in conversation — not in a data entry
        screen.
      </p>
    </LandingSection>
  );
}
