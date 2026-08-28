"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { LandingDisclaimer } from "@/components/landing/landing-disclaimer";
import { usePrefersReducedMotion } from "@/components/landing/use-prefers-reduced-motion";
import { cn } from "@/utils/cn";

type AskCategory = "all" | "personal" | "shared" | "planning";

type AskExample = {
  id: string;
  category: Exclude<AskCategory, "all">;
  question: string;
  answer: ReactNode;
  source?: string;
};

const CATEGORY_LABELS: Record<AskCategory, string> = {
  all: "All",
  personal: "Your money",
  shared: "Shared",
  planning: "Planning",
};

const ASK_EXAMPLES: AskExample[] = [
  {
    id: "month-total",
    category: "personal",
    question: "How much did I spend this month?",
    source: "47 transactions · March",
    answer: (
      <>
        <span className="font-mono text-2xl font-semibold tabular-nums text-landing-accent">
          ₹28,500
        </span>
        <span className="mt-2 block text-sm text-landing-muted">
          Essentials and discretionary combined — no manual category filters.
        </span>
      </>
    ),
  },
  {
    id: "biggest",
    category: "personal",
    question: "What's my biggest expense this quarter?",
    source: "Q1 category rank",
    answer: (
      <>
        EMI / loans —{" "}
        <span className="font-mono font-semibold tabular-nums text-landing-fg">
          ₹28,000
        </span>
        <span className="mt-2 block text-sm text-landing-muted">
          Rent is next at ₹15,500. FLUX ranks what actually dominates your spend.
        </span>
      </>
    ),
  },
  {
    id: "trip-owed",
    category: "shared",
    question: "Who still owes me for the weekend trip?",
    source: "Weekend trip thread",
    answer: (
      <>
        <span className="font-mono text-2xl font-semibold tabular-nums text-landing-accent">
          ₹2,800
        </span>
        <span className="mt-1 block text-sm text-landing-muted">
          outstanding to you
        </span>
        <ul className="mt-4 space-y-2 border-t border-landing-border/70 pt-4 text-sm">
          <li className="flex justify-between gap-3">
            <span className="text-landing-fg">Meera</span>
            <span className="font-mono tabular-nums text-landing-fg">₹1,400</span>
          </li>
          <li className="flex justify-between gap-3">
            <span className="text-landing-fg">Rohan</span>
            <span className="font-mono tabular-nums text-landing-fg">₹1,400</span>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "household",
    category: "shared",
    question: "How's our household spend with Arjun this month?",
    source: "Home · with Arjun",
    answer: (
      <>
        <span className="font-mono text-2xl font-semibold tabular-nums text-landing-accent">
          ₹8,000
        </span>
        <span className="mt-1 block text-sm text-landing-muted">
          shared in March
        </span>
        <p className="mt-4 text-sm leading-relaxed text-landing-fg">
          Groceries ₹3,200 (50–50) · Electricity ₹2,000 (60–40 you). Arjun owes
          you ₹400 to even out.
        </p>
      </>
    ),
  },
  {
    id: "quarter-in-out",
    category: "planning",
    question: "How much came in vs how much went out this quarter?",
    source: "Q1 money flow",
    answer: (
      <dl className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-[var(--radius-md)] border border-landing-border bg-white/75 px-3 py-2.5">
          <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-landing-muted">
            Money in
          </dt>
          <dd className="mt-1 font-mono text-lg font-semibold tabular-nums text-income">
            ₹2,25,000
          </dd>
        </div>
        <div className="rounded-[var(--radius-md)] border border-landing-border bg-white/75 px-3 py-2.5">
          <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-landing-muted">
            Money out
          </dt>
          <dd className="mt-1 font-mono text-lg font-semibold tabular-nums text-expense">
            ₹85,500
          </dd>
        </div>
        <div className="rounded-[var(--radius-md)] border border-landing-accent/20 bg-landing-accent-soft/40 px-3 py-2.5">
          <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-landing-accent">
            Net
          </dt>
          <dd className="mt-1 font-mono text-lg font-semibold tabular-nums text-landing-fg">
            +₹1,39,500
          </dd>
        </div>
      </dl>
    ),
  },
  {
    id: "afford-trip",
    category: "planning",
    question: "Can I afford ₹20,000 for this trip?",
    source: "March essentials check",
    answer: (
      <>
        After EMI, rent, and bills, you have about{" "}
        <span className="font-mono font-semibold tabular-nums text-landing-fg">
          ₹24,200
        </span>{" "}
        free this month. A{" "}
        <span className="font-mono font-semibold tabular-nums text-landing-fg">
          ₹20,000
        </span>{" "}
        trip is tight but workable — FLUX shows the trade-off in plain language.
      </>
    ),
  },
];

function CategoryFilter({
  active,
  onChange,
}: {
  active: AskCategory;
  onChange: (category: AskCategory) => void;
}) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="tablist"
      aria-label="Question categories"
    >
      {(Object.keys(CATEGORY_LABELS) as AskCategory[]).map((category) => {
        const isActive = active === category;

        return (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(category)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-accent focus-visible:ring-offset-2 focus-visible:ring-offset-landing-bg",
              isActive
                ? "border-landing-accent/35 bg-landing-accent text-white"
                : "border-landing-border bg-landing-bg text-landing-muted hover:border-landing-accent/25 hover:text-landing-fg",
            )}
          >
            {CATEGORY_LABELS[category]}
          </button>
        );
      })}
    </div>
  );
}

export function AskFluxInteractive() {
  const reducedMotion = usePrefersReducedMotion();
  const [category, setCategory] = useState<AskCategory>("all");
  const [selectedId, setSelectedId] = useState(ASK_EXAMPLES[0]?.id ?? "");

  const filteredExamples = useMemo(
    () =>
      category === "all"
        ? ASK_EXAMPLES
        : ASK_EXAMPLES.filter((example) => example.category === category),
    [category],
  );

  const selected =
    filteredExamples.find((example) => example.id === selectedId) ??
    filteredExamples[0] ??
    ASK_EXAMPLES[0];

  const handleCategoryChange = (next: AskCategory) => {
    setCategory(next);
    const nextExamples =
      next === "all"
        ? ASK_EXAMPLES
        : ASK_EXAMPLES.filter((example) => example.category === next);
    setSelectedId(nextExamples[0]?.id ?? "");
  };

  if (!selected) {
    return null;
  }

  return (
    <>
      <CategoryFilter active={category} onChange={handleCategoryChange} />

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8">
        <div
          role="tablist"
          aria-label="Example questions"
          className="flex flex-col gap-2"
        >
          {filteredExamples.map((example) => {
            const isSelected = example.id === selected.id;

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
                  "rounded-[var(--radius-md)] border px-4 py-3.5 text-left transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-accent focus-visible:ring-offset-2 focus-visible:ring-offset-landing-bg",
                  isSelected
                    ? "border-landing-accent/35 bg-white shadow-[0_2px_10px_-4px_color-mix(in_oklab,var(--landing-accent)_28%,transparent)]"
                    : "border-landing-border bg-landing-bg/80 text-landing-muted hover:border-landing-accent/20 hover:text-landing-fg",
                )}
              >
                <span
                  className={cn(
                    "text-[10px] font-semibold uppercase tracking-[0.12em]",
                    isSelected ? "text-landing-accent" : "text-landing-muted",
                  )}
                >
                  {CATEGORY_LABELS[example.category]}
                </span>
                <span
                  className={cn(
                    "mt-1 block text-sm leading-snug",
                    isSelected ? "text-landing-fg" : undefined,
                  )}
                >
                  {example.question}
                </span>
              </button>
            );
          })}
        </div>

        <div
          id="ask-answer-panel"
          role="tabpanel"
          aria-labelledby={`ask-tab-${selected.id}`}
          className="landing-ask-answer rounded-[var(--radius-lg)] border border-landing-border p-5 sm:p-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-landing-muted">
              You asked
            </p>
            {selected.source ? (
              <span className="rounded-full bg-landing-accent/10 px-2.5 py-0.5 text-[10px] font-semibold text-landing-accent">
                {selected.source}
              </span>
            ) : null}
          </div>

          <p className="mt-2 text-base leading-relaxed text-landing-fg sm:text-[17px]">
            &ldquo;{selected.question}&rdquo;
          </p>

          <div className="mt-6 border-t border-landing-border/80 pt-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-landing-accent">
              FLUX answers
            </p>
            <div
              key={selected.id}
              className={cn(
                "mt-3 text-[15px] leading-relaxed text-landing-fg",
                !reducedMotion && "landing-enter",
              )}
            >
              {selected.answer}
            </div>
          </div>
        </div>
      </div>

      <LandingDisclaimer className="mt-8" badge="Coming soon">
        Ask in plain language — totals, splits, trends, and whether a plan fits.
        No filters to wire up first.
      </LandingDisclaimer>
    </>
  );
}
