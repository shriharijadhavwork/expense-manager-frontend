/**
 * @deprecated Prefer parse-member-emails. Kept so hot reload / stale Turbopack
 * chunks that still import this path do not crash.
 */
const OBJECT_ID_RE = /^[a-f\d]{24}$/i;

/** @deprecated Use parseMemberEmails instead. */
export function parseMemberIds(raw: string, selfId: string): string[] {
  const parts = raw
    .split(/[\s,;]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  const ids: string[] = [];

  for (const part of parts) {
    if (!OBJECT_ID_RE.test(part)) {
      throw new Error(
        `"${part}" is not a valid user ID. Use email from Profile instead.`,
      );
    }

    if (part.toLowerCase() === selfId.toLowerCase()) {
      continue;
    }

    if (!ids.some((id) => id.toLowerCase() === part.toLowerCase())) {
      ids.push(part);
    }
  }

  return ids;
}

/** @deprecated Prefer member.name / member.email from the API. */
export function shortUserId(userId: string): string {
  if (userId.length <= 10) {
    return userId;
  }

  return `${userId.slice(0, 6)}…${userId.slice(-4)}`;
}
