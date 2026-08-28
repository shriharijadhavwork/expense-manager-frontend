import { AskFluxInteractive } from "@/components/landing/ask-flux-interactive";
import { LandingSection } from "@/components/landing/landing-section";

export function SectionAskFlux() {
  return (
    <LandingSection
      id="ask-flux"
      eyebrow="Questions"
      title="Your finances, finally conversational."
      description="No filters to configure. No spreadsheet formulas. Ask what you actually want to know."
    >
      <AskFluxInteractive />
    </LandingSection>
  );
}
