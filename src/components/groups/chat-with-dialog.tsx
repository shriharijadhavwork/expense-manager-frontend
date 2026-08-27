"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/shared/toast";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RelationSelect } from "@/components/ui/relation-select";
import type { UserRelation } from "@/constants/relation";
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

function isNoAccountError(message: string): boolean {
  return message.startsWith("No account found");
}

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
  const [inviteMode, setInviteMode] = useState(false);
  const [relation, setRelation] = useState<UserRelation>("friend");

  function resetForm() {
    setEmailsInput("");
    setError(null);
    setInviteMode(false);
    setRelation("friend");
  }

  function handleClose() {
    if (submitting) return;
    resetForm();
    onClose();
  }

  async function startChat(emails: string[]) {
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
    resetForm();
    onClose();
    onStarted?.();
  }

  async function sendInvite(email: string) {
    await groupsApi.createDirectInvite(email, relation);
    notifyGroupsChanged();
    toast({
      title: "Invite sent",
      description: `We emailed ${email}. They’ll join after signing up.`,
      variant: "success",
    });
    resetForm();
    onClose();
    onStarted?.();
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

    if (inviteMode) {
      if (emails.length !== 1) {
        setError("Invite one person at a time when they don’t have an account yet.");
        return;
      }
      setSubmitting(true);
      try {
        await sendInvite(emails[0]!);
      } catch (err) {
        setError(
          err instanceof ApiError
            ? err.message
            : "Could not send invite. Please try again.",
        );
      } finally {
        setSubmitting(false);
      }
      return;
    }

    setSubmitting(true);

    try {
      await startChat(emails);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Could not start group chat. Check the emails and try again.";

      if (err instanceof ApiError && isNoAccountError(message)) {
        setInviteMode(true);
        setError(
          emails.length === 1
            ? message
            : "One or more emails don’t have accounts. Invite one person at a time, or ask them to sign up first.",
        );
      } else {
        setError(message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Chat with…"
      description="Enter another person’s email. If they haven’t signed up yet, you can invite them from here."
    >
      <form className="space-y-4" onSubmit={(event) => void onSubmit(event)}>
        <Input
          label="Email"
          type="text"
          placeholder="e.g. friend@example.com"
          value={emailsInput}
          onChange={(event) => {
            setEmailsInput(event.target.value);
            if (inviteMode) {
              setInviteMode(false);
              setError(null);
            }
          }}
          autoFocus
        />
        <p className="text-xs text-muted-foreground">
          Separate multiple emails with commas or spaces when everyone already
          has an account. You are included automatically.
        </p>
        {inviteMode ? (
          <RelationSelect
            value={relation}
            onChange={setRelation}
            label="Their relation to you"
            disabled={submitting}
          />
        ) : null}
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
            {inviteMode ? "Invite" : "Start chat"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
