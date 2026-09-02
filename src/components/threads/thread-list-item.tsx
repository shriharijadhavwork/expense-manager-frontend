"use client";

import { useRef, useState } from "react";
import {
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
} from "@/components/ui/icons";
import { Popover, PopoverItem } from "@/components/ui/popover";
import { isThreadUnread } from "@/lib/chat/thread-read-state";
import type { Thread } from "@/types/api";
import { cn } from "@/utils/cn";

type ThreadListItemProps = {
  thread: Thread;
  active?: boolean;
  variant?: "compact" | "detailed";
  onSelect: () => void;
  onRename: (thread: Thread) => void;
  onDelete: (thread: Thread) => void;
};

function ThreadItemMenu({
  thread,
  onRename,
  onDelete,
}: {
  thread: Thread;
  onRename: (thread: Thread) => void;
  onDelete: (thread: Thread) => void;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Conversation options"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(event) => {
          event.stopPropagation();
          setOpen((value) => !value);
        }}
        className={cn(
          "inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-opacity",
          "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100",
          open && "opacity-100",
          "hover:bg-sidebar-hover hover:text-foreground",
        )}
      >
        <MoreHorizontalIcon className="h-4 w-4" />
      </button>

      <Popover
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={triggerRef}
        side="bottom"
        align="end"
        className="min-w-[10.5rem] p-1"
      >
        <PopoverItem
          icon={<PencilIcon className="h-4 w-4" />}
          label="Rename"
          onClick={() => {
            setOpen(false);
            onRename(thread);
          }}
        />
        <PopoverItem
          icon={<TrashIcon className="h-4 w-4" />}
          label="Delete"
          destructive
          onClick={() => {
            setOpen(false);
            onDelete(thread);
          }}
        />
      </Popover>
    </>
  );
}

export function ThreadListItem({
  thread,
  active = false,
  variant = "compact",
  onSelect,
  onRename,
  onDelete,
}: ThreadListItemProps) {
  const unread = isThreadUnread(thread);

  return (
    <li>
      <div
        className={cn(
          "group relative flex items-center gap-0.5 rounded-lg transition-colors",
          active ? "bg-sidebar-accent" : "hover:bg-sidebar-hover",
        )}
      >
        {unread ? (
          <span
            aria-label="Unread"
            className="pointer-events-none absolute left-2 top-2 h-1.5 w-1.5 rounded-full bg-flux-accent"
          />
        ) : null}

        <button
          type="button"
          onClick={onSelect}
          className={cn(
            "min-w-0 flex-1 truncate rounded-lg px-3 py-2 text-left text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring",
            variant === "detailed" && "font-medium",
          )}
        >
          <span
            className={cn(
              "block truncate",
              active ? "text-foreground" : "text-foreground/75",
            )}
          >
            {thread.title}
          </span>
        </button>

        <div className="shrink-0 pr-1">
          <ThreadItemMenu
            thread={thread}
            onRename={onRename}
            onDelete={onDelete}
          />
        </div>
      </div>
    </li>
  );
}
