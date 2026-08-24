export const THREADS_CHANGED_EVENT = "expense-manager:threads-changed";

export function notifyThreadsChanged(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(THREADS_CHANGED_EVENT));
}
