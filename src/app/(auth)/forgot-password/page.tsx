"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/shared/toast";
import { ApiError } from "@/lib/api/client";
import { BrandLockup } from "@/components/brand/brand-lockup";
import { authApi } from "@/lib/api/auth";

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await authApi.forgotPassword(email.trim());
      setSent(true);
      toast({ title: "Check your email", variant: "success" });
      // Message is intentionally generic even when the account does not exist.
      void result;
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Unable to start a password reset. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full" padding="lg">
      <div className="mb-6">
        <BrandLockup showTagline />
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">
          Forgot password
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your account email and we’ll send a reset link if it exists.
        </p>
      </div>

      {sent ? (
        <div className="space-y-4">
          <p className="rounded-[var(--radius-md)] bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
            If an account exists for that email, a reset link has been sent.
            Check your inbox and spam folder.
          </p>
          <Link
            href="/login"
            className="inline-flex h-10 w-full items-center justify-center rounded-[var(--radius-md)] border border-border bg-card text-sm font-medium text-foreground hover:bg-muted"
          >
            Back to sign in
          </Link>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={(event) => void onSubmit(event)}>
          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoFocus
          />

          {error ? (
            <p className="rounded-[var(--radius-md)] bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <Button type="submit" className="w-full" loading={loading}>
            Send reset link
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </Card>
  );
}
