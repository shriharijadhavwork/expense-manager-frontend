"use client";

import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { ThreadSidebar } from "@/components/layout/thread-sidebar";
import { SidebarAction, UserMenu } from "@/components/layout/user-menu";
import { SquarePenIcon } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { createLocalThreadId } from "@/lib/chat/local-thread";
import { cn } from "@/utils/cn";

type AppSidebarProps = {
  className?: string;
  onNavigate?: () => void;
};

function ThreadSidebarFallback() {
  return (
    <div className="space-y-2 px-3 py-2">
      <Skeleton className="h-8 w-full rounded-lg" />
      <Skeleton className="h-8 w-full rounded-lg" />
      <Skeleton className="h-8 w-full rounded-lg" />
    </div>
  );
}

export function AppSidebar({ className, onNavigate }: AppSidebarProps) {
  const router = useRouter();

  function startNewChat() {
    router.push(`/app/chat?threadId=${createLocalThreadId()}`);
    onNavigate?.();
  }

  return (
    <aside
      className={cn(
        "flex h-full w-[17.5rem] shrink-0 flex-col border-r border-sidebar-border bg-sidebar xl:w-[18.5rem]",
        className,
      )}
    >
      <div className="flex shrink-0 items-center px-3 py-3.5">
        <p className="px-2 text-[15px] font-semibold tracking-tight text-foreground/90">
          Expense Manager
        </p>
      </div>

      <div className="shrink-0 px-2 pb-2">
        <SidebarAction
          icon={<SquarePenIcon className="h-4 w-4" />}
          label="New chat"
          onClick={startNewChat}
        />
      </div>

      <Suspense fallback={<ThreadSidebarFallback />}>
        <ThreadSidebar onNavigate={onNavigate} />
      </Suspense>

      <UserMenu onNavigate={onNavigate} />
    </aside>
  );
}
