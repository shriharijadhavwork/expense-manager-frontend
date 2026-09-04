import { LandingDisclaimer } from "@/components/landing/landing-disclaimer";
import { LandingSection } from "@/components/landing/landing-section";
import { cn } from "@/utils/cn";

const MEMORY_LAYERS = [
  {
    id: "amount",
    step: "01",
    title: "Amount & category",
    typical: "₹1,240 · Food",
    flux: "₹1,240 · Dining",
    note: "Most trackers stop here — a number and a label.",
  },
  {
    id: "people",
    step: "02",
    title: "People & split",
    typical: "—",
    flux: "Rahul & Priya · Your share ₹620",
    note: "Who was involved and what you actually paid.",
  },
  {
    id: "thread",
    step: "03",
    title: "Thread & timing",
    typical: "—",
    flux: "Weekend trip · Yesterday",
    note: "Which conversation it belongs to, and when.",
  },
] as const;

const RECALL_SOURCES = [
  { label: "Cab", amount: "₹800 each" },
  { label: "Airbnb", amount: "₹600 each" },
] as const;

const RECALL_BALANCES = [
  { name: "Meera", amount: "₹1,400" },
  { name: "Rohan", amount: "₹1,400" },
] as const;

function FlatTrackerStrip() {
  return (
    <div
      className="rounded-[var(--radius-md)] border border-dashed border-landing-friction/25 bg-landing-friction-soft/25 px-4 py-3"
      aria-hidden
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-landing-friction">
        Typical tracker remembers
      </p>
      <p className="mt-2 font-mono text-xl font-semibold tabular-nums text-landing-fg">
        ₹1,240
      </p>
      <p className="mt-0.5 text-sm text-landing-muted">Food</p>
      <p className="mt-3 text-[12px] leading-relaxed text-landing-muted">
        No people. No split. No thread. Context is gone by tomorrow.
      </p>
    </div>
  );
}

function MemoryLayerRow({
  layer,
  isLast,
}: {
  layer: (typeof MEMORY_LAYERS)[number];
  isLast?: boolean;
}) {
  return (
    <li className="relative flex gap-4 pb-8 last:pb-0">
      {!isLast ? (
        <span
          className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-gradient-to-b from-landing-accent/45 to-landing-accent/10"
          aria-hidden
        />
      ) : null}

      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-landing-accent bg-landing-bg font-mono text-[10px] font-bold text-landing-accent">
        {layer.step}
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-landing-fg">{layer.title}</p>
        <p className="mt-1 text-[12px] leading-relaxed text-landing-muted">
          {layer.note}
        </p>

        <div className="landing-memory-layer mt-3 overflow-hidden rounded-[var(--radius-md)] border border-landing-border">
          <div className="grid sm:grid-cols-2">
            <div className="border-b border-landing-border/70 bg-landing-bg/50 px-3 py-2.5 sm:border-b-0 sm:border-r">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-landing-muted">
                Typical
              </p>
              <p
                className={cn(
                  "mt-1 font-mono text-[13px] tabular-nums",
                  layer.typical === "—"
                    ? "text-landing-muted/50"
                    : "text-landing-muted",
                )}
              >
                {layer.typical}
              </p>
            </div>
            <div className="px-3 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-landing-accent">
                FLUX keeps
              </p>
              <p className="mt-1 text-[13px] font-medium text-landing-fg">
                {layer.flux}
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

function MemoryLayersPanel() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-landing-border bg-landing-bg p-5 sm:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-landing-muted">
        What gets remembered
      </p>
      <p className="mt-2 text-sm leading-relaxed text-landing-muted">
        One dinner mention — three layers of context that stay linked.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
        <FlatTrackerStrip />

        <ol className="space-y-0">
          {MEMORY_LAYERS.map((layer, index) => (
            <MemoryLayerRow
              key={layer.id}
              layer={layer}
              isLast={index === MEMORY_LAYERS.length - 1}
            />
          ))}
        </ol>
      </div>
    </div>
  );
}

function RecallResultPanel() {
  return (
    <div className="landing-memory-recall rounded-[var(--radius-lg)] border border-landing-accent/20 p-5 sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-landing-muted">
            Later, you ask
          </p>
          <div className="mt-3 rounded-[var(--radius-md)] border border-landing-border bg-landing-elevated px-4 py-3">
            <p className="text-[13px] leading-relaxed text-landing-fg">
              &ldquo;Who still owes me for the weekend trip?&rdquo;
            </p>
          </div>

          <div className="mt-4 flex items-center gap-2 text-[11px] text-landing-muted">
            <span className="h-px flex-1 bg-landing-border" />
            <span className="font-semibold uppercase tracking-[0.1em] text-landing-accent">
              FLUX recalls
            </span>
            <span className="h-px flex-1 bg-landing-border" />
          </div>

          <p className="mt-3 text-[12px] leading-relaxed text-landing-muted">
            Pulled from the{" "}
            <span className="font-medium text-landing-fg">Weekend trip</span>{" "}
            thread — not a generic ledger search.
          </p>
        </div>

        <div
          className="rounded-[var(--radius-md)] border border-landing-border bg-landing-elevated p-4"
          aria-hidden
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-landing-muted">
              Trip balance
            </p>
            <span className="rounded-full bg-landing-accent/10 px-2.5 py-0.5 text-[10px] font-semibold text-landing-accent">
              Weekend trip
            </span>
          </div>

          <p className="mt-3 font-mono text-2xl font-semibold tabular-nums text-landing-accent">
            ₹2,800
            <span className="ml-2 text-sm font-normal text-landing-muted">
              outstanding to you
            </span>
          </p>

          <ul className="mt-4 space-y-2 border-t border-landing-border/70 pt-4">
            {RECALL_BALANCES.map((balance) => (
              <li
                key={balance.name}
                className="flex items-center justify-between gap-3 text-[13px]"
              >
                <span className="text-landing-fg">{balance.name} owes you</span>
                <span className="font-mono font-semibold tabular-nums text-landing-fg">
                  {balance.amount}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4 rounded-[var(--radius-md)] border border-landing-border/70 bg-landing-bg/60 px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-landing-muted">
              Built from
            </p>
            <ul className="mt-2 space-y-1.5">
              {RECALL_SOURCES.map((source) => (
                <li
                  key={source.label}
                  className="flex items-center justify-between gap-3 text-[12px] text-landing-muted"
                >
                  <span>{source.label}</span>
                  <span className="font-mono tabular-nums">{source.amount}</span>
                </li>
              ))}
              <li className="flex items-center justify-between gap-3 text-[12px] text-landing-muted">
                <span>Dinner · Rahul & Priya</span>
                <span className="font-mono tabular-nums">₹620 you</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <LandingDisclaimer className="mt-5 border-t border-landing-accent/10 pt-5">
        Here&apos;s what it feels like when context sticks — a question next
        week still has a real answer.
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
      <div className="space-y-6 lg:space-y-8">
        <MemoryLayersPanel />
        <RecallResultPanel />
      </div>
    </LandingSection>
  );
}
