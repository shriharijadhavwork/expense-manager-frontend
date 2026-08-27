"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/shared/toast";
import { ApiError } from "@/lib/api/client";
import { BrandLockup } from "@/components/brand/brand-lockup";
import { authApi } from "@/lib/api/auth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const token = useMemo(
    () => searchParams.get("token")?.trim() ?? "",
    [searchParams],
  );

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!token) {
      setError("This reset link is missing a token. Request a new one.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await authApi.resetPassword({ token, newPassword: password });
      toast({ title: "Password updated", variant: "success" });
      router.replace("/login");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Unable to reset your password. Request a new link.",
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
          Choose a new password
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter a new password for your account. This link works once and
          expires after an hour.
        </p>
      </div>

      {!token ? (
        <div className="space-y-4">
          <p className="rounded-[var(--radius-md)] bg-destructive/10 px-3 py-2 text-sm text-destructive">
            This reset link is invalid. Request a new one from the forgot
            password page.
          </p>
          <Link
            href="/forgot-password"
            className="inline-flex h-10 w-full items-center justify-center rounded-[var(--radius-md)] border border-border bg-card text-sm font-medium text-foreground hover:bg-muted"
          >
            Request a new link
          </Link>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={(event) => void onSubmit(event)}>
          <Input
            label="New password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            hint="At least 8 characters"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoFocus
          />
          <Input
            label="Confirm password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
          />

          {error ? (
            <p className="rounded-[var(--radius-md)] bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <Button type="submit" className="w-full" loading={loading}>
            Update password
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link
          href="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </Card>
  );
}
