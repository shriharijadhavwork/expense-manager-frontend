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
import { useAuth } from "@/lib/auth/auth-provider";
import { useAppDispatch } from "@/lib/store/hooks";
import { upsertThread } from "@/lib/store/thread-slice";
import type { Group } from "@/types/api";
import { cn } from "@/utils/cn";

type AddMemberDialogProps = {
  open: boolean;
  group: Group;
  onClose: () => void;
  onGroupUpdated: (group: Group) => void;
};

type AddMode = "same_group" | "new_group";

export function AddMemberDialog({
  open,
  group,
  onClose,
  onGroupUpdated,
}: AddMemberDialogProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { toast } = useToast();
  const [emailsInput, setEmailsInput] = useState("");
  const [mode, setMode] = useState<AddMode>("same_group");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isOwner = Boolean(
    user &&
      group.members.some(
        (member) =>
          member.userId === user.id && member.role === "owner",
      ),
  );

  function handleClose() {
    if (submitting) return;
    setEmailsInput("");
    setError(null);
    setMode("same_group");
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

    const existingEmails = new Set(
      group.members.map((member) => member.email.toLowerCase()),
    );
    const alreadyIn = emails.filter((email) => existingEmails.has(email));
    if (alreadyIn.length > 0) {
      setError("One or more people are already in this group.");
      return;
    }

    if (mode === "same_group" && !isOwner) {
      setError("Only the group owner can add people to this group.");
      return;
    }

    setSubmitting(true);

    try {
      if (mode === "same_group") {
        let updated = group;
        for (const email of emails) {
          updated = await groupsApi.addMember(group.id, email);
        }
        onGroupUpdated(updated);
        notifyGroupsChanged();
        toast({
          title: emails.length === 1 ? "Member added" : "Members added",
          variant: "success",
        });
        setEmailsInput("");
        onClose();
        return;
      }

      const peerIds = group.members
        .map((member) => member.userId)
        .filter((id) => id.toLowerCase() !== user.id.toLowerCase());

      const result = await groupsApi.resolve({
        emails,
        memberIds: peerIds,
      });
      dispatch(upsertThread(result.thread));
      notifyGroupsChanged();
      router.push(
        `/app/chat?threadId=${result.thread.id}&groupId=${result.group.id}`,
      );
      toast({
        title: result.created ? "New group started" : "Opened shared group",
        variant: "success",
      });
      setEmailsInput("");
      onClose();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not add people. Check the emails and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Add people"
      description={`Choose how to include someone with “${group.name}”.`}
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

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-foreground">
            How should they join?
          </legend>

          <label
            className={cn(
              "flex cursor-pointer gap-3 rounded-[var(--radius-md)] border border-border p-3",
              mode === "same_group" && "border-primary/50 bg-muted/40",
              !isOwner && "opacity-60",
            )}
          >
            <input
              type="radio"
              name="add-mode"
              className="mt-1"
              checked={mode === "same_group"}
              disabled={!isOwner}
              onChange={() => setMode("same_group")}
            />
            <span className="min-w-0">
              <span className="block text-sm font-medium">
                Add to this group
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                They will see prior group chat history. Owner only.
              </span>
            </span>
          </label>

          <label
            className={cn(
              "flex cursor-pointer gap-3 rounded-[var(--radius-md)] border border-border p-3",
              mode === "new_group" && "border-primary/50 bg-muted/40",
            )}
          >
            <input
              type="radio"
              name="add-mode"
              className="mt-1"
              checked={mode === "new_group"}
              onChange={() => setMode("new_group")}
            />
            <span className="min-w-0">
              <span className="block text-sm font-medium">
                Start a new group
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                Keeps this group’s history private. Opens a fresh chat with
                everyone including the new people.
              </span>
            </span>
          </label>
        </fieldset>

        {mode === "same_group" ? (
          <p className="rounded-[var(--radius-md)] bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
            Warning: anyone added here can read earlier messages in this
            group’s threads.
          </p>
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
            Continue
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
