import { groupsApi } from "@/lib/api/groups";
import type { Thread } from "@/types/api";

/** Open latest active group thread, or create one if the group has none. */
export async function resolveGroupThread(groupId: string): Promise<Thread> {
  const threads = await groupsApi.listThreads(groupId);
  const latest = threads[0];
  if (latest) {
    return latest;
  }

  return groupsApi.createThread(groupId);
}
