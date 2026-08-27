"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/shared/toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { ApiError } from "@/lib/api/client";
import { groupsApi } from "@/lib/api/groups";
import { notifyGroupsChanged } from "@/lib/groups/group-events";
import { resolveGroupThread } from "@/lib/groups/resolve-group-thread";
import { useAppDispatch } from "@/lib/store/hooks";
import { upsertThread } from "@/lib/store/thread-slice";

export default function AcceptInvitePage() {
  const params = useParams<{ token: string }>();
  const token = typeof params.token === "string" ? params.token : "";
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onAccept() {
    if (!token) {
      setError("Invalid invite link.");
      return;
    }

    setAccepting(true);
    setError(null);

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
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not accept this invite.",
      );
    } finally {
      setAccepting(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-6 px-4 py-8 sm:px-6">
      <PageHeader
        title="Group invite"
        description="Accept this invite to join the shared expense group."
      />

      <Card className="space-y-4">
        <p className="text-sm text-muted-foreground">
          You’ll join as a member and can open the group’s chats right away.
          Make sure you’re signed in with the email this invite was sent to.
        </p>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            loading={accepting}
            onClick={() => void onAccept()}
            disabled={!token}
          >
            Accept invite
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/app/chat")}
            disabled={accepting}
          >
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}
