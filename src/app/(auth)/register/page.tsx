"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/auth-provider";
import { ApiError } from "@/lib/api/client";
import { useToast } from "@/components/shared/toast";
import { BrandLockup } from "@/components/brand/brand-lockup";
import { sanitizeNextPath, withNextQuery } from "@/lib/auth/next-path";

export default function RegisterPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const nextPath = sanitizeNextPath(searchParams.get("next"));
  const invitedEmail = searchParams.get("email")?.trim() ?? "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState(invitedEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const account = await signup(name.trim(), email.trim(), password);
      toast({
        title: "Check your email",
        description: "Enter the verification code we sent you.",
        variant: "success",
      });
      if (account.emailVerified === false) {
        router.replace(withNextQuery("/verify-email", nextPath));
        return;
      }
      router.replace(nextPath ?? "/app");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Unable to create your account. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full" padding="lg">
      <div className="mb-6">
        <BrandLockup showTagline />
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">
          Create account
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {invitedEmail
            ? "Use the invited email address so you can accept the group invite after signup."
            : "Start tracking spending — go live, spend, we’ll keep score."}
        </p>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <Input
          label="Name"
          name="name"
          autoComplete="name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          hint={
            invitedEmail
              ? "Must match the email on the invite."
              : undefined
          }
        />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          hint="At least 8 characters"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        {error ? (
          <p className="rounded-[var(--radius-md)] bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <Button type="submit" className="w-full" loading={loading}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={withNextQuery("/login", nextPath)}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </Card>
  );
}
