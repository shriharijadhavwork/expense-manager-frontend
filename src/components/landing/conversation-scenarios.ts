export type FluxStructuredReply = {
  lead: string;
  amount: string;
  category: string;
  context: string;
};

export type FluxTextPart = {
  text: string;
  variant?: "default" | "amount" | "muted";
};

export type FluxBreakdownRow = {
  label: string;
  value: string;
  emphasis?: boolean;
};

export type FluxBreakdownReply = {
  lead?: string;
  rows: FluxBreakdownRow[];
  footer?: string;
};

export type ConversationMessage =
  | { type: "user"; text: string }
  | { type: "flux-structured"; reply: FluxStructuredReply }
  | { type: "flux-text"; parts: FluxTextPart[] }
  | { type: "flux-breakdown"; reply: FluxBreakdownReply };

export type ConversationScenario = {
  id: string;
  dateLabel: string;
  threadLabel?: string;
  /** Short label for carousel dots */
  carouselLabel?: string;
  participants?: string[];
  messages: ConversationMessage[];
};

export const HERO_CONVERSATION_SCENARIOS: ConversationScenario[] = [
  {
    id: "weekend-trip",
    dateLabel: "Saturday",
    threadLabel: "Weekend trip",
    carouselLabel: "Group trip",
    participants: ["Meera", "Rohan", "You"],
    messages: [
      {
        type: "user",
        text: "Cab to the hill station was ₹2,400 — split three ways.",
      },
      {
        type: "flux-structured",
        reply: {
          lead: "Got it.",
          amount: "₹800 each",
          category: "Transport",
          context: "Split with Meera & Rohan · Today",
        },
      },
      {
        type: "user",
        text: "I also paid ₹1,800 for the Airbnb. Same split.",
      },
      {
        type: "flux-structured",
        reply: {
          lead: "Noted.",
          amount: "₹600 each",
          category: "Stay",
          context: "Weekend trip · Split 3 ways",
        },
      },
      {
        type: "user",
        text: "Who owes me what for the trip so far?",
      },
      {
        type: "flux-breakdown",
        reply: {
          lead: "Trip tally — you've fronted everything:",
          rows: [
            { label: "Transport", value: "₹2,400" },
            { label: "Stay", value: "₹1,800" },
            { label: "Your share", value: "₹1,400", emphasis: true },
            { label: "Meera owes you", value: "₹1,400", emphasis: true },
            { label: "Rohan owes you", value: "₹1,400", emphasis: true },
          ],
          footer: "I'll keep this updated as more expenses land.",
        },
      },
    ],
  },
  {
    id: "household-arjun",
    dateLabel: "This month",
    threadLabel: "Home · with Arjun",
    carouselLabel: "Household",
    participants: ["Arjun", "You"],
    messages: [
      {
        type: "user",
        text: "Groceries were ₹3,200 — half mine, half Arjun's.",
      },
      {
        type: "flux-structured",
        reply: {
          lead: "Logged.",
          amount: "₹1,600 each",
          category: "Groceries",
          context: "Split with Arjun · Today",
        },
      },
      {
        type: "user",
        text: "Electricity bill ₹2,000. We split 60–40 — he works from home more.",
      },
      {
        type: "flux-structured",
        reply: {
          lead: "Done.",
          amount: "₹800 · ₹1,200",
          category: "Bills",
          context: "You 40% · Arjun 60% · Electricity",
        },
      },
      {
        type: "user",
        text: "How's our household spend looking this month?",
      },
      {
        type: "flux-breakdown",
        reply: {
          lead: "Household so far in March:",
          rows: [
            { label: "Groceries", value: "₹6,400" },
            { label: "Bills & utilities", value: "₹4,200" },
            { label: "Total shared", value: "₹10,600", emphasis: true },
            { label: "You paid", value: "₹5,800" },
            { label: "Arjun paid", value: "₹4,800" },
          ],
          footer: "Arjun owes you ₹400 to even things out.",
        },
      },
    ],
  },
  {
    id: "quarterly-insights",
    dateLabel: "This quarter",
    threadLabel: "Insights",
    carouselLabel: "Quarterly review",
    messages: [
      {
        type: "user",
        text: "What should I know about my money this quarter?",
      },
      {
        type: "flux-breakdown",
        reply: {
          lead: "Q1 at a glance:",
          rows: [
            { label: "Money in", value: "₹2,25,000" },
            { label: "Money out", value: "₹1,89,400" },
            { label: "Net", value: "+₹35,600", emphasis: true },
            { label: "Biggest expense", value: "Rent · ₹54,000" },
          ],
          footer: "You're ahead this quarter — spending is tracking below income.",
        },
      },
      {
        type: "user",
        text: "Where did most of it go? Rank my spending areas.",
      },
      {
        type: "flux-breakdown",
        reply: {
          lead: "Top categories — highest to lowest:",
          rows: [
            { label: "1. Rent", value: "₹54,000", emphasis: true },
            { label: "2. Dining", value: "₹14,200" },
            { label: "3. Groceries", value: "₹11,800" },
            { label: "4. Transport", value: "₹9,400" },
            { label: "5. Bills", value: "₹8,200" },
          ],
          footer: "Dining is up 20% vs last quarter — mostly weekends and team meals.",
        },
      },
      {
        type: "user",
        text: "Send me my quarterly spending summary.",
      },
      {
        type: "flux-text",
        parts: [
          { text: "Done — sent to your email.", variant: "default" },
          {
            text: " Includes in vs out, category breakdown, biggest expenses, and what changed since last quarter.",
            variant: "muted",
          },
        ],
      },
    ],
  },
];
