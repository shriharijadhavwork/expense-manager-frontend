"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AddMemberDialog } from "@/components/groups/add-member-dialog";
import { useToast } from "@/components/shared/toast";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/client";
import { groupsApi } from "@/lib/api/groups";
import { notifyGroupsChanged } from "@/lib/groups/group-events";
import { useAuth } from "@/lib/auth/auth-provider";
import { createLocalThreadId } from "@/lib/chat/local-thread";
import type { Group, GroupInvite } from "@/types/api";
import { cn } from "@/utils/cn";

type GroupMembersDialogProps = {
  open: boolean;
  groupId: string;
  onClose: () => void;
};

export function GroupMembersDialog({
  open,
  groupId,
  onClose,
}: GroupMembersDialogProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [group, setGroup] = useState<Group | null>(null);
  const [invites, setInvites] = useState<GroupInvite[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviting, setInviting] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [transferTarget, setTransferTarget] = useState<string | null>(null);
  const [transferring, setTransferring] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);
  const [removing, setRemoving] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<GroupInvite | null>(null);
  const [revoking, setRevoking] = useState(false);

  const membership = group?.members.find(
    (member) => member.userId === user?.id,
  );
  const isOwner = membership?.role === "owner";
  const otherMembers =
    group?.members.filter((member) => member.userId !== user?.id) ?? [];

  const refresh = useCallback(async () => {
    setLoading(true);
    setLoadError(null);

    try {
      const nextGroup = await groupsApi.getById(groupId);
      setGroup(nextGroup);

      const self = nextGroup.members.find(
        (member) => member.userId === user?.id,
      );
      if (self?.role === "owner") {
        const nextInvites = await groupsApi.listInvites(groupId);
        setInvites(nextInvites.filter((invite) => invite.status === "pending"));
      } else {
        setInvites([]);
      }
    } catch (err) {
      setLoadError(
        err instanceof ApiError ? err.message : "Failed to load group.",
      );
    } finally {
      setLoading(false);
    }
  }, [groupId, user?.id]);

  useEffect(() => {
    if (!open) return;

    const frame = window.requestAnimationFrame(() => {
      void refresh();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [open, refresh]);

  function handleClose() {
    if (leaving || transferring || removing || inviting || revoking) {
      return;
    }
    setAddOpen(false);
    setInviteEmail("");
    setInviteError(null);
    onClose();
  }

  async function onInviteSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!group) return;

    const email = inviteEmail.trim().toLowerCase();
    if (!email || !email.includes("@")) {
      setInviteError("Enter a valid email address.");
      return;
    }

    setInviting(true);
    setInviteError(null);

    try {
      const invite = await groupsApi.createInvite(group.id, email);
      setInvites((current) => {
        const without = current.filter((item) => item.id !== invite.id);
        return [invite, ...without];
      });
      setInviteEmail("");
      toast({
        title: "Invite created",
        description: invite.inviteUrl
          ? "Share the invite link from the list below."
          : undefined,
        variant: "success",
      });
    } catch (err) {
      setInviteError(
        err instanceof ApiError ? err.message : "Could not create invite.",
      );
    } finally {
      setInviting(false);
    }
  }

  async function onLeave() {
    if (!group) return;
    setLeaving(true);

    try {
      const result = await groupsApi.leave(group.id);
      notifyGroupsChanged();
      toast({
        title: result.dissolved ? "Group dissolved" : "Left group",
        description: result.message,
        variant: "success",
      });
      onClose();
      router.push(`/app/chat?threadId=${createLocalThreadId()}`);
    } catch (err) {
      toast({
        title: "Could not leave group",
        description:
          err instanceof ApiError
            ? err.message
            : "Transfer ownership first if you are the only owner with other members.",
        variant: "error",
      });
    } finally {
      setLeaving(false);
    }
  }

  async function onTransferConfirm() {
    if (!group || !transferTarget) return;
    setTransferring(true);

    try {
      const updated = await groupsApi.transferOwnership(
        group.id,
        transferTarget,
      );
      setGroup(updated);
      setTransferTarget(null);
      notifyGroupsChanged();
      toast({ title: "Ownership transferred", variant: "success" });
      void refresh();
    } catch (err) {
      toast({
        title: "Could not transfer ownership",
        description:
          err instanceof ApiError ? err.message : "Please try again.",
        variant: "error",
      });
    } finally {
      setTransferring(false);
    }
  }

  async function onRemoveConfirm() {
    if (!group || !removeTarget) return;
    setRemoving(true);

    try {
      const updated = await groupsApi.removeMember(group.id, removeTarget);
      setGroup(updated);
      setRemoveTarget(null);
      notifyGroupsChanged();
      toast({ title: "Member removed", variant: "success" });
    } catch (err) {
      toast({
        title: "Could not remove member",
        description:
          err instanceof ApiError ? err.message : "Please try again.",
        variant: "error",
      });
    } finally {
      setRemoving(false);
    }
  }

  async function onRevokeConfirm() {
    if (!group || !revokeTarget) return;
    setRevoking(true);

    try {
      await groupsApi.revokeInvite(group.id, revokeTarget.id);
      setInvites((current) =>
        current.filter((invite) => invite.id !== revokeTarget.id),
      );
      setRevokeTarget(null);
      toast({ title: "Invite revoked", variant: "success" });
    } catch (err) {
      toast({
        title: "Could not revoke invite",
        description:
          err instanceof ApiError ? err.message : "Please try again.",
        variant: "error",
      });
    } finally {
      setRevoking(false);
    }
  }

  async function copyInviteLink(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Invite link copied", variant: "success" });
    } catch {
      toast({
        title: "Could not copy link",
        description: url,
        variant: "error",
      });
    }
  }

  return (
    <>
      <Dialog
        open={open && !addOpen}
        onClose={handleClose}
        title={group?.name ?? "Group"}
        description="Members, invites, and ownership."
        className="max-w-lg"
      >
        {loading && !group ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : null}

        {loadError ? (
          <div className="space-y-3">
            <p className="text-sm text-destructive">{loadError}</p>
            <Button type="button" variant="outline" onClick={() => void refresh()}>
              Retry
            </Button>
          </div>
        ) : null}

        {group ? (
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {isOwner ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setAddOpen(true)}
                >
                  Add people
                </Button>
              ) : null}
              <Button
                type="button"
                size="sm"
                variant="outline"
                loading={leaving}
                onClick={() => void onLeave()}
              >
                Leave group
              </Button>
            </div>

            <section className="space-y-2">
              <h3 className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Members ({group.members.length})
              </h3>
              <ul className="divide-y divide-border rounded-[var(--radius-md)] border border-border">
                {group.members.map((member) => {
                  const isSelf = member.userId === user?.id;
                  const label = isSelf ? "You" : member.name || member.email;

                  return (
                    <li
                      key={member.id}
                      className="flex items-center gap-3 px-3 py-2.5"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{label}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {member.role === "owner" ? "Owner" : "Member"}
                          {!isSelf ? (
                            <span className="ml-1 opacity-70">{member.email}</span>
                          ) : null}
                        </p>
                      </div>
                      {isOwner && !isSelf ? (
                        <div className="flex shrink-0 gap-1">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            disabled={transferring || removing}
                            onClick={() => setTransferTarget(member.userId)}
                          >
                            Make owner
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                            disabled={transferring || removing}
                            onClick={() => setRemoveTarget(member.userId)}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
              {isOwner && otherMembers.length > 0 ? (
                <p className="text-xs text-muted-foreground">
                  Transfer ownership before leaving if others remain in the
                  group.
                </p>
              ) : null}
            </section>

            {isOwner ? (
              <section className="space-y-3">
                <h3 className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  Invite by email
                </h3>
                <form
                  className="space-y-2"
                  onSubmit={(event) => void onInviteSubmit(event)}
                >
                  <Input
                    label="Email"
                    type="email"
                    placeholder="friend@example.com"
                    value={inviteEmail}
                    onChange={(event) => setInviteEmail(event.target.value)}
                  />
                  <Button type="submit" size="sm" loading={inviting}>
                    Send invite
                  </Button>
                </form>
                {inviteError ? (
                  <p className="text-sm text-destructive">{inviteError}</p>
                ) : null}

                {invites.length > 0 ? (
                  <ul className="space-y-2">
                    {invites.map((invite) => (
                      <li
                        key={invite.id}
                        className="rounded-[var(--radius-md)] border border-border px-3 py-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {invite.email}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Pending · expires{" "}
                              {new Date(invite.expiresAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex shrink-0 gap-1">
                            {invite.inviteUrl ? (
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  void copyInviteLink(invite.inviteUrl!)
                                }
                              >
                                Copy link
                              </Button>
                            ) : null}
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="text-destructive"
                              onClick={() => setRevokeTarget(invite)}
                            >
                              Revoke
                            </Button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No pending email invites.
                  </p>
                )}
              </section>
            ) : null}

            <div className="flex justify-end">
              <Button type="button" variant="outline" onClick={handleClose}>
                Done
              </Button>
            </div>
          </div>
        ) : null}
      </Dialog>

      {group ? (
        <AddMemberDialog
          open={addOpen}
          group={group}
          onClose={() => setAddOpen(false)}
          onGroupUpdated={(updated) => {
            setGroup(updated);
            notifyGroupsChanged();
          }}
        />
      ) : null}

      <Dialog
        open={Boolean(transferTarget)}
        onClose={() => setTransferTarget(null)}
        title="Transfer ownership?"
        description="You will become a regular member. The selected person becomes the owner."
      >
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setTransferTarget(null)}
            disabled={transferring}
          >
            Cancel
          </Button>
          <Button
            type="button"
            loading={transferring}
            onClick={() => void onTransferConfirm()}
          >
            Transfer
          </Button>
        </div>
      </Dialog>

      <Dialog
        open={Boolean(removeTarget)}
        onClose={() => setRemoveTarget(null)}
        title="Remove member?"
        description="They will lose access to this group’s chats. History stays for remaining members."
      >
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setRemoveTarget(null)}
            disabled={removing}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            loading={removing}
            onClick={() => void onRemoveConfirm()}
          >
            Remove
          </Button>
        </div>
      </Dialog>

      <Dialog
        open={Boolean(revokeTarget)}
        onClose={() => setRevokeTarget(null)}
        title="Revoke invite?"
        description={
          revokeTarget
            ? `The invite for ${revokeTarget.email} will stop working.`
            : undefined
        }
      >
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setRevokeTarget(null)}
            disabled={revoking}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            loading={revoking}
            onClick={() => void onRevokeConfirm()}
          >
            Revoke
          </Button>
        </div>
      </Dialog>
    </>
  );
}

/** Compact trigger used in the chat header. */
export function GroupHeaderActions({
  groupId,
  groupName,
}: {
  groupId: string;
  groupName?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "cursor-pointer text-[11px] text-muted-foreground/80 underline-offset-2",
          "hover:text-foreground hover:underline",
        )}
      >
        {groupName ? `${groupName} · Members` : "Group · Members"}
      </button>
      <GroupMembersDialog
        open={open}
        groupId={groupId}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
