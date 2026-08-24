const LOCAL_THREAD_PREFIX = "local-";

export function createLocalThreadId(): string {
  return `${LOCAL_THREAD_PREFIX}${crypto.randomUUID()}`;
}

export function isLocalThreadId(threadId: string): boolean {
  return threadId.startsWith(LOCAL_THREAD_PREFIX);
}

export function isPersistedThreadId(threadId: string): boolean {
  return /^[a-f\d]{24}$/i.test(threadId);
}

export function isValidChatThreadId(threadId: string): boolean {
  return isPersistedThreadId(threadId) || isLocalThreadId(threadId);
}
