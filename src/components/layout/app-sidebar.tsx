"use client";

import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { BrandLockup } from "@/components/brand/brand-lockup";
import { ChatWithDialog } from "@/components/groups/chat-with-dialog";
import { GroupsSidebar } from "@/components/groups/groups-sidebar";
import { ThreadSidebar } from "@/components/layout/thread-sidebar";
import { SidebarAction, UserMenu } from "@/components/layout/user-menu";
import { SquarePenIcon, UsersIcon } from "@/components/ui/icons";
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
  const [chatWithOpen, setChatWithOpen] = useState(false);

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
        <BrandLockup size="sm" className="px-2" />
      </div>

      <div className="shrink-0 space-y-0.5 px-2 pb-2">
        <SidebarAction
          icon={<SquarePenIcon className="h-4 w-4" />}
          label="New chat"
          onClick={startNewChat}
        />
        <SidebarAction
          icon={<UsersIcon className="h-4 w-4" />}
          label="Chat with…"
          onClick={() => setChatWithOpen(true)}
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <Suspense fallback={<ThreadSidebarFallback />}>
          <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
            <GroupsSidebar onNavigate={onNavigate} />
            <ThreadSidebar onNavigate={onNavigate} embedded />
          </div>
        </Suspense>
      </div>

      <UserMenu onNavigate={onNavigate} />

      <ChatWithDialog
        open={chatWithOpen}
        onClose={() => setChatWithOpen(false)}
        onStarted={onNavigate}
      />
    </aside>
  );
}
