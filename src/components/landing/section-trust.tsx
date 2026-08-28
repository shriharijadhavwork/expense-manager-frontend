import { LandingSection } from "@/components/landing/landing-section";

const TRUST_POINTS = [
  {
    id: "account",
    title: "Your account, your data",
    description:
      "Expenses, threads, and messages belong to your signed-in account. Other users cannot access your personal records.",
  },
  {
    id: "passwords",
    title: "Passwords stay hashed",
    description:
      "Passwords are hashed with bcrypt before storage. FLUX never keeps them in plain text.",
  },
  {
    id: "auth",
    title: "Sign-in required",
    description:
      "API access uses bearer tokens issued after login. Unauthenticated requests cannot read or change your data.",
  },
  {
    id: "email",
    title: "Verified email",
    description:
      "New accounts confirm their email address before accessing the app.",
  },
] as const;

export function SectionTrust() {
  return (
    <LandingSection
      id="trust"
      title="Your money is yours."
      description="FLUX is built to keep your financial life private to you — with straightforward security, not marketing jargon."
    >
      <ul className="grid list-none gap-8 p-0 sm:grid-cols-2">
        {TRUST_POINTS.map((point) => (
          <li key={point.id}>
            <h3 className="text-base font-medium text-landing-fg">
              {point.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-landing-muted">
              {point.description}
            </p>
          </li>
        ))}
      </ul>
    </LandingSection>
  );
}
