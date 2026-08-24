import type { Thread } from "@/types/api";

export type ThreadGroupKey = "today" | "yesterday" | "earlier";

export type ThreadGroup = {
  key: ThreadGroupKey;
  label: string;
  threads: Thread[];
};

const GROUP_LABELS: Record<ThreadGroupKey, string> = {
  today: "Today",
  yesterday: "Yesterday",
  earlier: "Earlier",
};

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function groupThreadsByRecency(threads: Thread[]): ThreadGroup[] {
  const now = new Date();
  const todayStart = startOfLocalDay(now);
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  const buckets: Record<ThreadGroupKey, Thread[]> = {
    today: [],
    yesterday: [],
    earlier: [],
  };

  for (const thread of threads) {
    const activity = new Date(thread.lastActivityAt);

    if (activity >= todayStart) {
      buckets.today.push(thread);
      continue;
    }

    if (activity >= yesterdayStart) {
      buckets.yesterday.push(thread);
      continue;
    }

    buckets.earlier.push(thread);
  }

  return (Object.keys(buckets) as ThreadGroupKey[])
    .map((key) => ({
      key,
      label: GROUP_LABELS[key],
      threads: buckets[key],
    }))
    .filter((group) => group.threads.length > 0);
}

export function formatThreadActivity(isoDate: string, now = new Date()): string {
  const activity = new Date(isoDate);
  if (Number.isNaN(activity.getTime())) {
    return "";
  }

  const todayStart = startOfLocalDay(now);
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  if (activity >= todayStart) {
    return activity.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  if (activity >= yesterdayStart) {
    return "Yesterday";
  }

  return activity.toLocaleDateString([], {
    day: "numeric",
    month: "short",
  });
}
