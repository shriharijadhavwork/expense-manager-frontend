"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/shared/toast";
import { ApiError } from "@/lib/api/client";
import { authApi } from "@/lib/api/auth";
import { useAuth } from "@/lib/auth/auth-provider";
import { BrandLockup } from "@/components/brand/brand-lockup";
import { sanitizeNextPath } from "@/lib/auth/next-path";

export default function VerifyEmailPage() {
  const { user, setUser, logout, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = sanitizeNextPath(searchParams.get("next"));
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  async function onVerify(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setVerifying(true);

    try {
      const nextUser = await authApi.verifyEmail(code.trim());
      setUser(nextUser);
      toast({ title: "Email confirmed", variant: "success" });
      router.replace(nextPath ?? "/app");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not verify that code. Try again.",
      );
    } finally {
      setVerifying(false);
    }
  }

  async function onResend() {
    setError(null);
    setResending(true);
    try {
      await authApi.resendOtp();
      toast({ title: "Code sent", variant: "success" });
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not resend the code. Try again shortly.",
      );
    } finally {
      setResending(false);
    }
  }

  return (
    <Card className="w-full" padding="lg">
      <div className="mb-6">
        <BrandLockup showTagline />
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">
          Confirm your email
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-foreground">
            {user?.email ?? "your email"}
          </span>
          . Enter it below to finish setting up your account.
        </p>
      </div>

      <form className="space-y-4" onSubmit={(event) => void onVerify(event)}>
        <Input
          label="Verification code"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="123456"
          maxLength={6}
          required
          value={code}
          onChange={(event) =>
            setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
          }
          autoFocus
        />

        {error ? (
          <p className="rounded-[var(--radius-md)] bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <Button type="submit" className="w-full" loading={verifying}>
          Verify email
        </Button>
      </form>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="outline"
          loading={resending}
          onClick={() => void onResend()}
        >
          Resend code
        </Button>
        <Button type="button" variant="ghost" onClick={() => void logout()}>
          Sign out
        </Button>
      </div>
    </Card>
  );
}
