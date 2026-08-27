"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/shared/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api/client";
import { groupsApi } from "@/lib/api/groups";
import {
  GROUPS_CHANGED_EVENT,
  notifyGroupsChanged,
} from "@/lib/groups/group-events";
import { resolveGroupThread } from "@/lib/groups/resolve-group-thread";
import { useAppDispatch } from "@/lib/store/hooks";
import { upsertThread } from "@/lib/store/thread-slice";
import type { Group } from "@/types/api";
import { cn } from "@/utils/cn";

type GroupsSidebarProps = {
  className?: string;
  onNavigate?: () => void;
};

export function GroupsSidebar({ className, onNavigate }: GroupsSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeGroupId = searchParams.get("groupId");
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [openingId, setOpeningId] = useState<string | null>(null);

  const loadGroups = useCallback(async () => {
    setStatus((current) => (current === "success" ? current : "loading"));

    try {
      const next = await groupsApi.list();
      setGroups(next);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      void loadGroups();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [loadGroups]);

  useEffect(() => {
    const refresh = () => {
      void loadGroups();
    };

    window.addEventListener(GROUPS_CHANGED_EVENT, refresh);
    window.addEventListener("focus", refresh);

    return () => {
      window.removeEventListener(GROUPS_CHANGED_EVENT, refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [loadGroups]);

  async function openGroup(group: Group) {
    setOpeningId(group.id);

    try {
      const thread = await resolveGroupThread(group.id);
      dispatch(upsertThread(thread));
      notifyGroupsChanged();
      router.push(`/app/chat?threadId=${thread.id}&groupId=${group.id}`);
      onNavigate?.();
    } catch (err) {
      toast({
        title: "Could not open group",
        description:
          err instanceof ApiError ? err.message : "Please try again.",
        variant: "error",
      });
    } finally {
      setOpeningId(null);
    }
  }

  if (status === "loading" && groups.length === 0) {
    return (
      <div className={cn("space-y-2 px-3 py-1", className)}>
        <Skeleton className="h-7 w-full rounded-lg" />
        <Skeleton className="h-7 w-full rounded-lg" />
      </div>
    );
  }

  if (status === "success" && groups.length === 0) {
    return null;
  }

  if (status === "error" && groups.length === 0) {
    return (
      <p className="px-3 py-1 text-xs text-muted-foreground">
        Couldn’t load groups.
      </p>
    );
  }

  return (
    <section className={cn(className)}>
      <h3 className="px-3 pb-1.5 pt-2 text-xs font-medium text-muted-foreground/80">
        Groups
      </h3>
      <ul>
        {groups.map((group) => {
          const active = group.id === activeGroupId;
          const busy = openingId === group.id;

          return (
            <li key={group.id}>
              <button
                type="button"
                disabled={busy}
                onClick={() => void openGroup(group)}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  active
                    ? "bg-sidebar-hover text-foreground"
                    : "text-foreground/80 hover:bg-sidebar-hover hover:text-foreground",
                  busy && "opacity-70",
                )}
              >
                <span className="min-w-0 flex-1 truncate font-medium">
                  {group.name}
                </span>
                <span className="shrink-0 text-[11px] text-muted-foreground">
                  {group.members.length}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
