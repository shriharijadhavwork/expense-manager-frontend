"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { ChatWorkspace } from "@/components/chat/chat-workspace";
import { Button } from "@/components/ui/button";
import { createLocalThreadId } from "@/lib/chat/local-thread";
import { isValidThreadId } from "@/utils/message-preview";

export function ChatPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const threadId = searchParams.get("threadId");
  const skipNextNavigationLoadRef = useRef(false);

  useEffect(() => {
    if (!threadId) {
      router.replace(`/app/chat?threadId=${createLocalThreadId()}`);
    }
  }, [router, threadId]);

  const handleThreadIdChange = useCallback(
    (nextThreadId: string) => {
      skipNextNavigationLoadRef.current = true;
      router.replace(`/app/chat?threadId=${nextThreadId}`);
    },
    [router],
  );

  const handleNewChat = useCallback(() => {
    router.push(`/app/chat?threadId=${createLocalThreadId()}`);
  }, [router]);

  if (!threadId) {
    return null;
  }

  if (!isValidThreadId(threadId)) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center px-4">
        <div className="max-w-sm text-center">
          <h3 className="text-base font-medium tracking-tight">
            Invalid conversation link
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            This link does not point to a valid conversation.
          </p>
          <Button className="mt-5" onClick={handleNewChat}>
            Start a new chat
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <ChatWorkspace
        threadId={threadId}
        onThreadIdChange={handleThreadIdChange}
        skipInitialLoadRef={skipNextNavigationLoadRef}
      />
    </div>
  );
}
