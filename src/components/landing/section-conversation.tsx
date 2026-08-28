import {
  ConversationExchange,
} from "@/components/landing/conversation-exchange";
import type { FluxReplyData } from "@/components/landing/flux-reply-card";
import { LandingDisclaimer } from "@/components/landing/landing-disclaimer";
import { LandingSection } from "@/components/landing/landing-section";

const EXAMPLES: Array<{
  userMessage: string;
  fluxReply: FluxReplyData;
}> = [
  {
    userMessage: "I got my ₹75,000 salary today.",
    fluxReply: {
      preamble: "Got it.",
      amount: "₹75,000",
      category: "Income",
      detail: "Salary · Today",
    },
  },
  {
    userMessage: "Split yesterday's dinner with Rahul and Priya — my share was ₹620.",
    fluxReply: {
      preamble: "Noted.",
      amount: "₹620",
      category: "Dining",
      detail: "Split with Rahul & Priya · Yesterday",
    },
  },
  {
    userMessage: "Paid ₹3,200 for groceries. Half mine, half Arjun's.",
    fluxReply: {
      preamble: "Logged.",
      amount: "₹1,600 each",
      category: "Groceries",
      detail: "Split with Arjun · Home thread",
    },
  },
  {
    userMessage: "Team lunch ₹4,500 — log my ₹900 share.",
    fluxReply: {
      preamble: "Recorded.",
      amount: "₹900",
      category: "Dining",
      detail: "Team lunch · Your share · Today",
    },
  },
];

export function SectionConversation() {
  return (
    <LandingSection
      id="conversational-tracking"
      eyebrow="How it works"
      title="Just tell us what happened."
      description="Salary, a split dinner, shared groceries, a work lunch — say it the way you'd tell a friend. FLUX turns natural language into structured records, with who was involved and how it splits."
    >
      <div className="landing-scroll-row -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 snap-x snap-mandatory sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 sm:snap-none lg:gap-5">
        {EXAMPLES.map((example) => (
          <ConversationExchange
            key={example.userMessage}
            userMessage={example.userMessage}
            fluxReply={example.fluxReply}
            className="w-[min(88vw,20rem)] shrink-0 snap-center sm:w-auto"
          />
        ))}
      </div>

      <LandingDisclaimer className="mt-8 text-center sm:text-left">
        Illustrative examples — natural language parsing is part of the FLUX
        product direction.
      </LandingDisclaimer>
    </LandingSection>
  );
}
