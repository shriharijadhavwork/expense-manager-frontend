import { LandingDisclaimer } from "@/components/landing/landing-disclaimer";
import { LandingSection } from "@/components/landing/landing-section";

type TogetherExample = {
  id: string;
  label: string;
  thread: string;
  people: string;
  snippet: string[];
  highlight: string;
};

const EXAMPLES: TogetherExample[] = [
  {
    id: "trip",
    label: "Friends & trips",
    thread: "Weekend trip",
    people: "Meera · Rohan · You",
    snippet: [
      "Cab ₹2,400 — split three ways.",
      "Airbnb ₹1,800 — same split.",
      "Who owes me what for the trip?",
    ],
    highlight: "FLUX tracks who paid, who owes, and keeps the group tally.",
  },
  {
    id: "home",
    label: "Partner & home",
    thread: "Home · with Arjun",
    people: "Arjun · You",
    snippet: [
      "Groceries ₹3,200 — half each.",
      "Electricity ₹2,000 — split 60–40.",
      "How's our household spend this month?",
    ],
    highlight: "Uneven splits, shared bills, running balances — all in one thread.",
  },
  {
    id: "insights",
    label: "You & insights",
    thread: "Quarterly review",
    people: "Just you",
    snippet: [
      "What should I know about my money this quarter?",
      "Where did most of it go? Rank my spending areas.",
      "Send me my quarterly spending summary.",
    ],
    highlight: "Summaries, trends, and reports — ask questions, not just log expenses.",
  },
];

function TogetherCard({ example }: { example: TogetherExample }) {
  return (
    <article className="flex h-full flex-col rounded-[var(--radius-lg)] border border-landing-border bg-landing-bg p-5 sm:p-6">
      <p className="text-xs font-medium uppercase tracking-wide text-landing-accent">
        {example.label}
      </p>
      <h3 className="mt-2 font-display text-lg text-landing-fg">{example.thread}</h3>
      <p className="mt-1 text-sm text-landing-muted">{example.people}</p>

      <ul className="mt-5 flex-1 space-y-2.5">
        {example.snippet.map((line) => (
          <li
            key={line}
            className="rounded-[var(--radius-md)] border border-landing-border bg-landing-surface px-3 py-2 text-[13px] leading-snug text-landing-fg"
          >
            &ldquo;{line}&rdquo;
          </li>
        ))}
      </ul>

      <p className="mt-5 border-t border-landing-border pt-4 text-sm leading-relaxed text-landing-muted">
        {example.highlight}
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
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {EXAMPLES.map((example) => (
          <TogetherCard key={example.id} example={example} />
        ))}
      </div>

      <LandingDisclaimer className="mt-8">
        Illustrative examples — group threads, splits, and shared balances are
        part of the FLUX product direction.
      </LandingDisclaimer>
    </LandingSection>
  );
}
