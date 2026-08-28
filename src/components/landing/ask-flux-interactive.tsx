"use client";

import { useState } from "react";
import { EntityAvatar } from "@/components/ui/entity-avatar";
import { LandingDisclaimer } from "@/components/landing/landing-disclaimer";
import { landingFluxAvatarClassName } from "@/components/landing/landing-styles";
import { usePrefersReducedMotion } from "@/components/landing/use-prefers-reduced-motion";
import { cn } from "@/utils/cn";

type AskExample = {
  id: string;
  question: string;
  answer: React.ReactNode;
};

const ASK_EXAMPLES: AskExample[] = [
  {
    id: "month-total",
    question: "How much did I spend this month?",
    answer: (
      <>
        <span className="font-mono font-medium tabular-nums">₹32,480</span>
        <span className="text-landing-muted">
          {" "}
          across 47 transactions this month.
        </span>
      </>
    ),
  },
  {
    id: "biggest",
    question: "What's my biggest expense?",
    answer: (
      <>
        Rent —{" "}
        <span className="font-mono font-medium tabular-nums">₹18,000</span>
        <span className="text-landing-muted"> on the 1st.</span>
      </>
    ),
  },
  {
    id: "why-more",
    question: "Why did I spend more this month?",
    answer: (
      <>
        Dining is up compared to last month, and you had three weekend trips.
        <span className="mt-2 block text-sm text-landing-muted">
          FLUX connects the patterns — you don&apos;t have to build the
          spreadsheet first.
        </span>
      </>
    ),
  },
  {
    id: "trip-owed",
    question: "Who still owes me for the weekend trip?",
    answer: (
      <>
        <span className="font-mono font-medium tabular-nums">₹2,800</span>
        <span className="text-landing-muted">
          {" "}
          outstanding — Meera owes ₹1,400, Rohan owes ₹1,400.
        </span>
      </>
    ),
  },
  {
    id: "household",
    question: "How's our household spend with Arjun this month?",
    answer: (
      <>
        <span className="font-mono font-medium tabular-nums">₹10,600</span>
        <span className="text-landing-muted">
          {" "}
          shared so far — groceries ₹6,400, bills ₹4,200. Arjun owes you ₹400
          to even out.
        </span>
      </>
    ),
  },
  {
    id: "with-rahul",
    question: "How much did I spend with Rahul?",
    answer: (
      <>
        <span className="font-mono font-medium tabular-nums">₹3,480</span>
        <span className="text-landing-muted">
          {" "}
          across 4 shared meals this month.
        </span>
      </>
    ),
  },
  {
    id: "quarter-in-out",
    question: "How much came in vs how much went out this quarter?",
    answer: (
      <>
        Money in{" "}
        <span className="font-mono font-medium tabular-nums">₹2,25,000</span>
        <span className="text-landing-muted"> · Money out </span>
        <span className="font-mono font-medium tabular-nums">₹1,89,400</span>
        <span className="text-landing-muted">
          {" "}
          — net{" "}
          <span className="font-mono font-medium tabular-nums">+₹35,600</span>.
        </span>
      </>
    ),
  },
  {
    id: "quarter-email",
    question: "Send me my quarterly spending summary.",
    answer: (
      <>
        Done — check your email.
        <span className="mt-2 block text-sm text-landing-muted">
          Full breakdown: in vs out, top categories, biggest expenses, and
          what changed vs last quarter.
        </span>
      </>
    ),
  },
  {
    id: "afford-trip",
    question: "Can I afford ₹20,000 for this trip?",
    answer: (
      <>
        After essentials, you have about{" "}
        <span className="font-mono font-medium tabular-nums">₹24,200</span>{" "}
        free this month. A{" "}
        <span className="font-mono font-medium tabular-nums">₹20,000</span>{" "}
        trip would be tight but workable.
      </>
    ),
  },
];

export function AskFluxInteractive() {
  const reducedMotion = usePrefersReducedMotion();
  const [selectedId, setSelectedId] = useState(ASK_EXAMPLES[0]?.id ?? "");
  const selected =
    ASK_EXAMPLES.find((example) => example.id === selectedId) ??
    ASK_EXAMPLES[0];

  if (!selected) {
    return null;
  }

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12">
        <div
          role="tablist"
          aria-label="Example questions"
          className="flex flex-col gap-2"
        >
          {ASK_EXAMPLES.map((example) => {
            const isSelected = example.id === selectedId;

            return (
              <button
                key={example.id}
                type="button"
                role="tab"
                id={`ask-tab-${example.id}`}
                aria-selected={isSelected}
                aria-controls="ask-answer-panel"
                onClick={() => setSelectedId(example.id)}
                className={cn(
                  "rounded-[var(--radius-md)] border px-4 py-3 text-left text-sm leading-snug transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-accent focus-visible:ring-offset-2 focus-visible:ring-offset-landing-bg",
                  isSelected
                    ? "border-landing-accent/40 bg-landing-accent-soft text-landing-fg"
                    : "border-landing-border bg-landing-bg text-landing-muted hover:border-landing-accent/25 hover:text-landing-fg",
                )}
              >
                {example.question}
              </button>
            );
          })}
        </div>

        <div
          id="ask-answer-panel"
          role="tabpanel"
          aria-labelledby={`ask-tab-${selected.id}`}
          className="rounded-[var(--radius-lg)] border border-landing-border bg-landing-surface p-5 sm:p-6"
        >
          <p className="text-sm font-medium text-landing-muted">You asked</p>
          <p className="mt-2 text-[15px] leading-relaxed text-landing-fg">
            {selected.question}
          </p>

          <div className="mt-6 border-t border-landing-border pt-6">
            <div className="flex items-start gap-2">
              <EntityAvatar
                name="Flux"
                variant="neutral"
                size="chat"
                initials="Fx"
                className={cn("mt-0.5", landingFluxAvatarClassName)}
                aria-hidden
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-landing-muted">FLUX</p>
                <p
                  key={selected.id}
                  className={cn(
                    "mt-2 text-[15px] leading-relaxed text-landing-fg",
                    !reducedMotion && "landing-enter",
                  )}
                >
                  {selected.answer}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LandingDisclaimer className="mt-8">
        Illustrative examples — conversational Q&amp;A is part of the FLUX
        product direction.
      </LandingDisclaimer>
    </>
  );
}
