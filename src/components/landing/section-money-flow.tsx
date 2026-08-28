import { LandingDisclaimer } from "@/components/landing/landing-disclaimer";
import { LandingSection } from "@/components/landing/landing-section";
import { cn } from "@/utils/cn";

type FlowItemProps = {
  label: string;
  amount: string;
  direction: "in" | "out" | "neutral";
  isLast?: boolean;
};

function FlowItem({ label, amount, direction, isLast = false }: FlowItemProps) {
  return (
    <li className="relative flex w-full flex-col items-center">
      <div
        className={cn(
          "flex w-full max-w-sm items-baseline justify-between gap-6 pb-4",
          isLast
            ? "border-t border-landing-border pt-4"
            : "border-b border-landing-border",
        )}
      >
        <span
          className={cn(
            "text-sm font-medium",
            isLast ? "text-landing-fg" : "text-landing-muted",
          )}
        >
          {label}
        </span>
        <span
          className={cn(
            "font-mono font-medium tabular-nums tracking-tight",
            isLast ? "text-xl sm:text-2xl" : "text-lg sm:text-xl",
            direction === "in" && "text-income",
            direction === "out" && "text-expense",
            direction === "neutral" && "text-landing-fg",
          )}
        >
          {amount}
        </span>
      </div>

      {!isLast ? (
        <span
          className="my-3 text-landing-muted select-none"
          aria-hidden
        >
          ↓
        </span>
      ) : null}
    </li>
  );
}

const FLOW_ITEMS: Array<{
  label: string;
  amount: string;
  direction: "in" | "out" | "neutral";
}> = [
  { label: "Income", amount: "+₹75,000", direction: "in" },
  { label: "Spending", amount: "−₹32,480", direction: "out" },
  { label: "Transfers", amount: "−₹2,000", direction: "out" },
  { label: "Balance", amount: "₹40,520", direction: "neutral" },
];

export function SectionMoneyFlow() {
  return (
    <LandingSection
      id="money-flow"
      tone="surface"
      title="See where your money went."
      description="Income, spending, transfers, and what's left — organized in one clear view. No ledger jargon, no chart overload."
    >
      <div className="mx-auto max-w-md">
        <ol className="flex flex-col items-center" aria-label="Money flow example">
          {FLOW_ITEMS.map((item, index) => (
            <FlowItem
              key={item.label}
              label={item.label}
              amount={item.amount}
              direction={item.direction}
              isLast={index === FLOW_ITEMS.length - 1}
            />
          ))}
        </ol>

        <LandingDisclaimer className="mt-8 text-center sm:text-left">
          Illustrative monthly summary — full money-flow tracking is part of the
          FLUX product direction.
        </LandingDisclaimer>
      </div>
    </LandingSection>
  );
}
