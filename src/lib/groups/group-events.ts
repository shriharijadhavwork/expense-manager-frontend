export const GROUPS_CHANGED_EVENT = "expense-manager:groups-changed";

export function notifyGroupsChanged(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(GROUPS_CHANGED_EVENT));
}
