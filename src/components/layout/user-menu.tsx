"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "@/components/shared/toast";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
  ChevronRightIcon,
  HandshakeIcon,
  LayoutGridIcon,
  LogOutIcon,
  PaletteIcon,
  RotateCcwIcon,
  SettingsIcon,
  TrashIcon,
  UserIcon,
} from "@/components/ui/icons";
import {
  Popover,
  PopoverDivider,
  PopoverHeader,
  PopoverItem,
  PopoverOption,
  PopoverSubmenu,
} from "@/components/ui/popover";
import { ApiError } from "@/lib/api/client";
import { threadsApi } from "@/lib/api/threads";
import {
  notifyThreadsChanged,
  THREADS_CHANGED_EVENT,
} from "@/lib/chat/thread-events";
import { usePreferenceActions } from "@/lib/preferences/use-preference-actions";
import { useAuth } from "@/lib/auth/auth-provider";
import { useTheme, type ThemePreference } from "@/lib/theme/theme-provider";
import type { Thread } from "@/types/api";
import { cn } from "@/utils/cn";

type UserMenuProps = {
  onNavigate?: () => void;
  className?: string;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }

  return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
}

const themeOptions: Array<{ value: ThemePreference; label: string }> = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export function UserMenu({ onNavigate, className }: UserMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { updateTheme } = usePreferenceActions();
  const { theme } = useTheme();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const [recycleOpen, setRecycleOpen] = useState(false);
  const [recycleBin, setRecycleBin] = useState<Thread[]>([]);
  const [restoreTarget, setRestoreTarget] = useState<Thread | null>(null);
  const [restoring, setRestoring] = useState(false);
  const [purgeTarget, setPurgeTarget] = useState<Thread | null>(null);
  const [purging, setPurging] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const loadRecycleBin = useCallback(async () => {
    try {
      const deleted = await threadsApi.listRecycleBin();
      setRecycleBin(deleted);
    } catch {
      setRecycleBin([]);
    }
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      void loadRecycleBin();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [loadRecycleBin, open]);

  useEffect(() => {
    const refresh = () => {
      if (open) {
        void loadRecycleBin();
      }
    };

    window.addEventListener(THREADS_CHANGED_EVENT, refresh);

    return () => {
      window.removeEventListener(THREADS_CHANGED_EVENT, refresh);
    };
  }, [loadRecycleBin, open]);

  function closeMenu() {
    setOpen(false);
    setAppearanceOpen(false);
    setRecycleOpen(false);
  }

  function closeAndNavigate(action: () => void) {
    closeMenu();
    action();
    onNavigate?.();
  }

  async function onRestoreConfirm() {
    if (!restoreTarget) return;

    setRestoring(true);

    try {
      const restored = await threadsApi.restore(restoreTarget.id);
      toast({ title: "Conversation restored", variant: "success" });
      setRestoreTarget(null);
      await loadRecycleBin();
      notifyThreadsChanged();
      closeMenu();

      if (restored.type === "group" && restored.groupId) {
        router.push(
          `/app/chat?threadId=${restored.id}&groupId=${restored.groupId}`,
        );
      } else {
        router.push(`/app/chat?threadId=${restored.id}`);
      }
      onNavigate?.();
    } catch (err) {
      toast({
        title: "Could not restore conversation",
        description:
          err instanceof ApiError ? err.message : "Please try again.",
        variant: "error",
      });
    } finally {
      setRestoring(false);
    }
  }

  async function onPurgeConfirm() {
    if (!purgeTarget) return;

    setPurging(true);

    try {
      await threadsApi.permanentlyDelete(purgeTarget.id);
      toast({ title: "Permanently deleted", variant: "success" });
      setPurgeTarget(null);
      await loadRecycleBin();
      notifyThreadsChanged();
    } catch (err) {
      toast({
        title: "Could not delete permanently",
        description:
          err instanceof ApiError ? err.message : "Please try again.",
        variant: "error",
      });
    } finally {
      setPurging(false);
    }
  }

  if (!user) {
    return null;
  }

  return (
    <div className={cn("shrink-0 p-2 pt-1", className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-sidebar-hover"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-xs font-medium text-foreground/80">
          {getInitials(user.name)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">{user.name}</span>
          <span className="block truncate text-xs text-muted-foreground">
            {user.email}
          </span>
        </span>
      </button>

      <Popover
        open={open}
        onClose={closeMenu}
        anchorRef={triggerRef}
        side="top"
        align="start"
        className="w-[min(100vw-1.5rem,17rem)]"
      >
        <PopoverHeader
          name={user.name}
          subtitle={user.email}
          onClick={() =>
            closeAndNavigate(() => router.push("/app/profile"))
          }
        />

        <PopoverDivider />

        <PopoverItem
          icon={<LayoutGridIcon className="h-4 w-4" />}
          label="Overview"
          onClick={() => closeAndNavigate(() => router.push("/app"))}
          trailing={
            pathname === "/app" ? (
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            ) : null
          }
        />
        <PopoverItem
          icon={<HandshakeIcon className="h-4 w-4" />}
          label="Settlements"
          onClick={() =>
            closeAndNavigate(() => router.push("/app/settlements"))
          }
          trailing={
            pathname.startsWith("/app/settlements") ? (
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            ) : null
          }
        />

        <PopoverDivider />

        <PopoverItem
          icon={<UserIcon className="h-4 w-4" />}
          label="Profile"
          onClick={() =>
            closeAndNavigate(() => router.push("/app/profile"))
          }
          trailing={<ChevronRightIcon className="h-3.5 w-3.5" />}
        />
        <PopoverItem
          icon={<SettingsIcon className="h-4 w-4" />}
          label="Settings"
          onClick={() =>
            closeAndNavigate(() => router.push("/app/settings"))
          }
          trailing={<ChevronRightIcon className="h-3.5 w-3.5" />}
        />
        <PopoverSubmenu
          icon={<PaletteIcon className="h-4 w-4" />}
          label="Appearance"
          open={appearanceOpen}
          onOpenChange={setAppearanceOpen}
        >
          {themeOptions.map((option) => (
            <PopoverOption
              key={option.value}
              label={option.label}
              selected={theme === option.value}
              onClick={() => updateTheme(option.value)}
            />
          ))}
        </PopoverSubmenu>
        <PopoverSubmenu
          icon={<TrashIcon className="h-4 w-4" />}
          label="Recycle bin"
          hint="Deleted chats · 7 days"
          open={recycleOpen}
          onOpenChange={setRecycleOpen}
          trailing={
            <span className="flex items-center gap-1.5">
              {recycleBin.length > 0 ? (
                <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {recycleBin.length}
                </span>
              ) : null}
              <ChevronRightIcon className="h-3.5 w-3.5" />
            </span>
          }
          submenuClassName="min-w-[15rem]"
        >
          {recycleBin.length === 0 ? (
            <p className="px-3 py-2.5 text-xs text-muted-foreground">
              No deleted conversations.
            </p>
          ) : (
            recycleBin.map((thread) => (
              <div
                key={thread.id}
                className="group flex items-center gap-1 rounded-[var(--radius-md)] px-1 py-0.5 hover:bg-muted"
              >
                <span className="min-w-0 flex-1 truncate px-2 py-2 text-sm">
                  {thread.title}
                  {thread.type === "group" ? (
                    <span className="ml-1 text-[10px] text-muted-foreground">
                      Group
                    </span>
                  ) : null}
                </span>
                {thread.canManageRecycle !== false ? (
                  <>
                    <button
                      type="button"
                      aria-label="Restore"
                      title="Restore"
                      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-all hover:bg-background hover:text-foreground group-hover:opacity-100"
                      onClick={() => setRestoreTarget(thread)}
                    >
                      <RotateCcwIcon className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Delete permanently"
                      title="Delete permanently"
                      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-all hover:bg-background hover:text-destructive group-hover:opacity-100"
                      onClick={() => setPurgeTarget(thread)}
                    >
                      <TrashIcon className="h-3.5 w-3.5" />
                    </button>
                  </>
                ) : (
                  <span className="px-2 text-[10px] text-muted-foreground">
                    View only
                  </span>
                )}
              </div>
            ))
          )}
        </PopoverSubmenu>

        <PopoverDivider />

        <PopoverItem
          icon={<LogOutIcon className="h-4 w-4" />}
          label="Log out"
          destructive
          onClick={() => closeAndNavigate(() => void logout())}
        />
      </Popover>

      <Dialog
        open={Boolean(restoreTarget)}
        onClose={() => setRestoreTarget(null)}
        title="Restore conversation?"
        description={
          restoreTarget
            ? `"${restoreTarget.title}" will return to your active chats.`
            : undefined
        }
      >
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setRestoreTarget(null)}
            disabled={restoring}
          >
            Cancel
          </Button>
          <Button loading={restoring} onClick={() => void onRestoreConfirm()}>
            Restore
          </Button>
        </div>
      </Dialog>

      <Dialog
        open={Boolean(purgeTarget)}
        onClose={() => setPurgeTarget(null)}
        title="Delete permanently?"
        description={
          purgeTarget
            ? `"${purgeTarget.title}" will be removed forever.`
            : undefined
        }
      >
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setPurgeTarget(null)}
            disabled={purging}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            loading={purging}
            onClick={() => void onPurgeConfirm()}
          >
            Delete forever
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

export function SidebarAction({
  icon,
  label,
  onClick,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
}) {
  const className = cn(
    "flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground/80 transition-colors",
    "hover:bg-sidebar-hover hover:text-foreground",
  );

  const content = (
    <>
      <span className="flex h-4 w-4 shrink-0 items-center justify-center">
        {icon}
      </span>
      <span>{label}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={className} onClick={onClick}>
      {content}
    </button>
  );
}
