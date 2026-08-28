import { EntityAvatar } from "@/components/ui/entity-avatar";
import { LandingDisclaimer } from "@/components/landing/landing-disclaimer";
import { LandingSection } from "@/components/landing/landing-section";
import { landingFluxAvatarClassName } from "@/components/landing/landing-styles";
import { cn } from "@/utils/cn";

function FlatRecordCard() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-landing-border bg-landing-bg p-5 sm:p-6">
      <p className="text-sm font-medium text-landing-muted">
        A typical tracker
      </p>
      <p className="mt-5 font-mono text-2xl font-medium tabular-nums tracking-tight text-landing-fg">
        ₹1,240
      </p>
      <p className="mt-1 text-base text-landing-muted">Food</p>
    </div>
  );
}

function ContextRecordCard() {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-landing-accent/25 bg-landing-accent-soft/40 p-5 sm:p-6",
      )}
    >
      <p className="text-sm font-medium text-landing-fg">FLUX</p>
      <p className="mt-5 font-mono text-2xl font-medium tabular-nums tracking-tight text-landing-fg">
        ₹1,240
      </p>
      <p className="mt-1 text-base text-landing-fg">Dining</p>
      <dl className="mt-4 space-y-1 border-t border-landing-accent/15 pt-4">
        <div>
          <dt className="sr-only">Context</dt>
          <dd className="text-sm text-landing-muted">Dinner with Rahul & Priya</dd>
        </div>
        <div>
          <dt className="sr-only">Split</dt>
          <dd className="text-sm text-landing-muted">Your share · ₹620</dd>
        </div>
        <div>
          <dt className="sr-only">When</dt>
          <dd className="text-sm text-landing-muted">Yesterday</dd>
        </div>
      </dl>
    </div>
  );
}

function FollowUpExchange() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-landing-border bg-landing-surface p-5 sm:p-6">
      <p className="text-sm font-medium text-landing-muted">
        Later, you can ask:
      </p>

      <div className="mt-5 space-y-4">
        <div className="flex justify-end">
          <p className="max-w-md rounded-[1rem] rounded-br-[0.375rem] border border-landing-border bg-landing-bg px-3.5 py-2.5 text-[15px] leading-relaxed text-landing-fg">
            Who still owes me for the weekend trip?
          </p>
        </div>

        <div className="flex items-start gap-2">
          <EntityAvatar
            name="Flux"
            variant="neutral"
            size="chat"
            initials="Fx"
            className={cn("mt-0.5", landingFluxAvatarClassName)}
            aria-hidden
          />
          <p className="pt-1 text-[15px] leading-relaxed text-landing-fg">
            <span className="font-mono font-medium tabular-nums">₹2,800</span>
            <span className="text-landing-muted">
              {" "}
              outstanding — Meera owes ₹1,400, Rohan owes ₹1,400 from the trip.
            </span>
          </p>
        </div>
      </div>

      <LandingDisclaimer className="mt-5">
        Illustrative example — context-aware answers are part of the FLUX
        product direction.
      </LandingDisclaimer>
    </div>
  );
}

export function SectionMemory() {
  return (
    <LandingSection
      id="memory"
      eyebrow="Context"
      title="It remembers. So you don't have to."
      description="Most apps store an amount and a category. FLUX keeps who was there, how it splits, which thread it belongs to, and when it happened — so your questions make sense later."
    >
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <FlatRecordCard />
        <ContextRecordCard />
      </div>

      <div className="mt-8 lg:mt-10">
        <FollowUpExchange />
      </div>
    </LandingSection>
  );
}
