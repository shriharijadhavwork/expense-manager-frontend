"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/shared/toast";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/client";
import { groupsApi } from "@/lib/api/groups";
import { notifyGroupsChanged } from "@/lib/groups/group-events";
import { parseMemberEmails } from "@/lib/groups/parse-member-emails";
import { useAppDispatch } from "@/lib/store/hooks";
import { upsertThread } from "@/lib/store/thread-slice";
import { useAuth } from "@/lib/auth/auth-provider";

type ChatWithDialogProps = {
  open: boolean;
  onClose: () => void;
  onStarted?: () => void;
};

export function ChatWithDialog({
  open,
  onClose,
  onStarted,
}: ChatWithDialogProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { toast } = useToast();
  const [emailsInput, setEmailsInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleClose() {
    if (submitting) return;
    setEmailsInput("");
    setError(null);
    onClose();
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!user) return;

    setError(null);

    let emails: string[];
    try {
      emails = parseMemberEmails(emailsInput, user.email);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid email addresses.");
      return;
    }

    if (emails.length === 0) {
      setError("Add at least one other person’s email.");
      return;
    }

    setSubmitting(true);

    try {
      const result = await groupsApi.resolve({ emails });
      dispatch(upsertThread(result.thread));
      notifyGroupsChanged();
      router.push(
        `/app/chat?threadId=${result.thread.id}&groupId=${result.group.id}`,
      );
      toast({
        title: result.created ? "Group chat started" : "Opened group chat",
        variant: "success",
      });
      setEmailsInput("");
      onClose();
      onStarted?.();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not start group chat. Check the emails and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Chat with…"
      description="Enter another person’s email from their Profile. If they haven’t signed up yet, invite them from a group’s Members panel."
    >
      <form className="space-y-4" onSubmit={(event) => void onSubmit(event)}>
        <Input
          label="Email"
          type="email"
          placeholder="e.g. friend@example.com"
          value={emailsInput}
          onChange={(event) => setEmailsInput(event.target.value)}
          autoFocus
        />
        <p className="text-xs text-muted-foreground">
          Separate multiple emails with commas or spaces. You are included
          automatically.
        </p>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            Start chat
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
