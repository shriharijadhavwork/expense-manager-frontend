import type { Thread } from "@/types/api";
import { isLocalThreadId } from "@/lib/chat/local-thread";

export function isThreadUnread(thread: Pick<Thread, "lastActivityAt" | "readAt" | "unread">): boolean {
  if (thread.unread !== undefined) {
    return thread.unread;
  }

  if (!thread.readAt) {
    return true;
  }

  return (
    new Date(thread.lastActivityAt).getTime() >
    new Date(thread.readAt).getTime()
  );
}

export function countUnreadThreads(threads: Thread[]): number {
  return threads.filter((thread) => isThreadUnread(thread)).length;
}

export function shouldPersistReadState(threadId: string): boolean {
  return !isLocalThreadId(threadId);
}
