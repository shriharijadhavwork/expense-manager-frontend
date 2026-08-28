import Link from "next/link";
import {
  landingSecondaryButtonClassName,
  landingSecondaryButtonLgClassName,
  landingSecondaryButtonSmClassName,
} from "@/components/landing/landing-styles";
import { cn } from "@/utils/cn";

type LandingSecondaryCtaProps = {
  href: string;
  children: React.ReactNode;
  size?: "sm" | "lg";
  className?: string;
};

export function LandingSecondaryCta({
  href,
  children,
  size = "sm",
  className,
}: LandingSecondaryCtaProps) {
  return (
    <Link
      href={href}
      className={cn(
        landingSecondaryButtonClassName,
        size === "lg" ? landingSecondaryButtonLgClassName : landingSecondaryButtonSmClassName,
        className,
      )}
    >
      {children}
    </Link>
  );
}
