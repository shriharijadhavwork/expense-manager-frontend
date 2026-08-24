"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ThreadListItem } from "@/components/threads/thread-list-item";
import { useToast } from "@/components/shared/toast";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api/client";
import { createLocalThreadId } from "@/lib/chat/local-thread";
import { notifyThreadsChanged } from "@/lib/chat/thread-events";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  deleteThread,
  renameThread,
  selectThreadList,
  selectThreadsListStatus,
} from "@/lib/store/thread-slice";
import type { Thread } from "@/types/api";
import { cn } from "@/utils/cn";

type ThreadSidebarProps = {
  className?: string;
  onNavigate?: () => void;
};

export function ThreadSidebar({ className, onNavigate }: ThreadSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentThreadId = searchParams.get("threadId");
  const dispatch = useAppDispatch();
  const threads = useAppSelector(selectThreadList);
  const status = useAppSelector(selectThreadsListStatus);
  const { toast } = useToast();

  const [renameTarget, setRenameTarget] = useState<Thread | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [renameError, setRenameError] = useState<string | null>(null);
  const [renaming, setRenaming] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Thread | null>(null);
  const [deleting, setDeleting] = useState(false);

  function handleSelect(threadId: string) {
    router.push(`/app/chat?threadId=${threadId}`);
    onNavigate?.();
  }

  function openRename(thread: Thread) {
    setRenameTarget(thread);
    setRenameValue(thread.title);
    setRenameError(null);
  }

  function closeRename() {
    setRenameTarget(null);
    setRenameValue("");
    setRenameError(null);
  }

  async function onRenameSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!renameTarget) return;

    const nextTitle = renameValue.trim();
    if (!nextTitle) {
      setRenameError("Title cannot be empty.");
      return;
    }

    setRenaming(true);
    setRenameError(null);

    try {
      await dispatch(
        renameThread({ threadId: renameTarget.id, title: nextTitle }),
      ).unwrap();
      toast({ title: "Conversation renamed", variant: "success" });
      closeRename();
    } catch (err) {
      setRenameError(
        err instanceof ApiError ? err.message : "Failed to rename conversation.",
      );
    } finally {
      setRenaming(false);
    }
  }

  async function onDeleteConfirm() {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      await dispatch(deleteThread(deleteTarget.id)).unwrap();
      toast({ title: "Moved to recycle bin", variant: "success" });

      if (deleteTarget.id === currentThreadId) {
        router.replace(`/app/chat?threadId=${createLocalThreadId()}`);
      }

      setDeleteTarget(null);
      notifyThreadsChanged();
      onNavigate?.();
    } catch (err) {
      toast({
        title: "Could not delete conversation",
        description:
          err instanceof ApiError ? err.message : "Please try again.",
        variant: "error",
      });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
          {status === "loading" && threads.length === 0 ? (
            <div className="space-y-2 px-1 py-1">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : null}

          {status === "success" && threads.length > 0 ? (
            <section>
              <h3 className="px-3 pb-1.5 pt-2 text-xs font-medium text-muted-foreground/80">
                Recents
              </h3>
              <ul>
                {threads.map((thread) => (
                  <ThreadListItem
                    key={thread.id}
                    thread={thread}
                    variant="compact"
                    active={thread.id === currentThreadId}
                    onSelect={() => handleSelect(thread.id)}
                    onRename={openRename}
                    onDelete={setDeleteTarget}
                  />
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>

      <Dialog
        open={Boolean(renameTarget)}
        onClose={closeRename}
        title="Rename conversation"
        description="Give this chat a clearer title."
      >
        <form
          className="space-y-4"
          onSubmit={(event) => void onRenameSubmit(event)}
        >
          <Input
            label="Title"
            value={renameValue}
            onChange={(event) => setRenameValue(event.target.value)}
            autoFocus
          />
          {renameError ? (
            <p className="text-sm text-destructive">{renameError}</p>
          ) : null}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={closeRename}>
              Cancel
            </Button>
            <Button type="submit" loading={renaming}>
              Save
            </Button>
          </div>
        </form>
      </Dialog>

      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete conversation?"
        description={
          deleteTarget
            ? `"${deleteTarget.title}" will move to the recycle bin for 7 days.`
            : undefined
        }
      >
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setDeleteTarget(null)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            loading={deleting}
            onClick={() => void onDeleteConfirm()}
          >
            Delete
          </Button>
        </div>
      </Dialog>
    </>
  );
}
