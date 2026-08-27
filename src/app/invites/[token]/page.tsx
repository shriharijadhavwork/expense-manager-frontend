"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BrandLockup } from "@/components/brand/brand-lockup";
import { useToast } from "@/components/shared/toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ApiError } from "@/lib/api/client";
import { groupsApi } from "@/lib/api/groups";
import { useAuth } from "@/lib/auth/auth-provider";
import { withNextQuery } from "@/lib/auth/next-path";
import { notifyGroupsChanged } from "@/lib/groups/group-events";
import { resolveGroupThread } from "@/lib/groups/resolve-group-thread";
import { useAppDispatch } from "@/lib/store/hooks";
import { upsertThread } from "@/lib/store/thread-slice";
import type { InvitePreview } from "@/types/api";

export default function PublicInvitePage() {
  const params = useParams<{ token: string }>();
  const token = typeof params.token === "string" ? params.token : "";
  const invitePath = token ? `/invites/${token}` : "/invites";
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();

  const [preview, setPreview] = useState<InvitePreview | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [acceptError, setAcceptError] = useState<string | null>(null);

  const loadPreview = useCallback(async () => {
    if (!token) {
      setLoadError("Invalid invite link.");
      setLoadingPreview(false);
      return;
    }

    setLoadingPreview(true);
    setLoadError(null);

    try {
      const next = await groupsApi.previewInvite(token);
      setPreview(next);
    } catch (err) {
      setPreview(null);
      setLoadError(
        err instanceof ApiError
          ? err.message
          : "Could not load this invite.",
      );
    } finally {
      setLoadingPreview(false);
    }
  }, [token]);

  useEffect(() => {
    void loadPreview();
  }, [loadPreview]);

  const emailMatches = useMemo(() => {
    if (!user || !preview) return false;
    return user.email.toLowerCase() === preview.email.toLowerCase();
  }, [preview, user]);

  async function onAccept() {
    if (!token) return;

    setAccepting(true);
    setAcceptError(null);

    try {
      const group = await groupsApi.acceptInvite(token);
      const thread = await resolveGroupThread(group.id);
      dispatch(upsertThread(thread));
      notifyGroupsChanged();
      toast({
        title: `Joined ${group.name}`,
        variant: "success",
      });
      router.replace(`/app/chat?threadId=${thread.id}&groupId=${group.id}`);
    } catch (err) {
      setAcceptError(
        err instanceof ApiError
          ? err.message
          : "Could not accept this invite.",
      );
    } finally {
      setAccepting(false);
    }
  }

  const loginHref = withNextQuery("/login", invitePath);
  const registerWithEmail = (() => {
    const base = withNextQuery("/register", invitePath);
    if (!preview?.email) return base;
    const sep = base.includes("?") ? "&" : "?";
    return `${base}${sep}email=${encodeURIComponent(preview.email)}`;
  })();

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-accent/40 blur-3xl dark:bg-accent/20" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10">
        <Card className="w-full space-y-4" padding="lg">
          <div>
            <BrandLockup showTagline />
            <h1 className="mt-4 text-2xl font-semibold tracking-tight">
              Group invite
            </h1>
            {preview ? (
              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">
                    {preview.invitedByName}
                  </span>
                  {preview.invitedByEmail ? (
                    <>
                      {" "}
                      <span className="opacity-80">
                        ({preview.invitedByEmail})
                      </span>
                    </>
                  ) : null}{" "}
                  invited you as{" "}
                  <span className="font-medium text-foreground">
                    {preview.relationLabel}
                  </span>
                  .
                </p>
                <p>
                  Join “{preview.groupName}” to share expenses and chats.
                </p>
              </div>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">
                Accept an invite to join a shared expense group.
              </p>
            )}
          </div>

          {loadingPreview || authLoading ? (
            <div className="flex justify-center py-6">
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            </div>
          ) : loadError ? (
            <p className="text-sm text-destructive">{loadError}</p>
          ) : preview?.status !== "pending" ? (
            <p className="text-sm text-muted-foreground">
              This invite is {preview?.status ?? "unavailable"} and can no
              longer be accepted.
            </p>
          ) : !isAuthenticated ? (
            <div className="space-y-4">
              <p className="rounded-[var(--radius-md)] bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                Use the same email this invite was sent to:{" "}
                <span className="font-medium text-foreground">
                  {preview.email}
                </span>
                .
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  href={loginHref}
                  className="inline-flex h-10 items-center justify-center rounded-[var(--radius-md)] bg-primary text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  Sign in to accept
                </Link>
                <Link
                  href={registerWithEmail}
                  className="inline-flex h-10 items-center justify-center rounded-[var(--radius-md)] border border-border bg-card text-sm font-medium text-foreground hover:bg-muted"
                >
                  Create account
                </Link>
              </div>
            </div>
          ) : user?.emailVerified === false ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Confirm your email before accepting this invite.
              </p>
              <Link
                href={withNextQuery("/verify-email", invitePath)}
                className="inline-flex h-10 w-full items-center justify-center rounded-[var(--radius-md)] bg-primary text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Verify email
              </Link>
            </div>
          ) : !emailMatches ? (
            <div className="space-y-3">
              <p className="text-sm text-destructive">
                You’re signed in as {user?.email}, but this invite was sent to{" "}
                {preview.email}. Sign in with the invited email to continue.
              </p>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  void logout(loginHref);
                }}
              >
                Switch account
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Signed in as {user?.email}. Accept to join{" "}
                <span className="font-medium text-foreground">
                  {preview.groupName}
                </span>{" "}
                as{" "}
                <span className="font-medium text-foreground">
                  {preview.relationLabel}
                </span>
                .
              </p>
              {acceptError ? (
                <p className="text-sm text-destructive">{acceptError}</p>
              ) : null}
              <Button
                type="button"
                className="w-full"
                loading={accepting}
                onClick={() => void onAccept()}
              >
                Accept invite
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
