"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-provider";
import { sanitizeNextPath, withNextQuery } from "@/lib/auth/next-path";

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const nextParam = sanitizeNextPath(searchParams.get("next"));
  const needsVerification =
    isAuthenticated && user !== null && user.emailVerified === false;
  const onVerifyPage = pathname === "/verify-email";

  useEffect(() => {
    if (isLoading) return;

    if (needsVerification) {
      if (!onVerifyPage) {
        router.replace(withNextQuery("/verify-email", nextParam));
      }
      return;
    }

    if (isAuthenticated) {
      if (onVerifyPage) {
        router.replace(nextParam ?? "/app");
        return;
      }
      router.replace(nextParam ?? "/app");
    }
  }, [
    isAuthenticated,
    isLoading,
    needsVerification,
    nextParam,
    onVerifyPage,
    router,
  ]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
      </div>
    );
  }

  if (needsVerification && onVerifyPage) {
    return children;
  }

  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
      </div>
    );
  }

  return children;
}
