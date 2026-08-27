const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Parse pasted emails; skips self and duplicates. */
export function parseMemberEmails(raw: string, selfEmail: string): string[] {
  const parts = raw
    .split(/[\s,;]+/)
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);

  const emails: string[] = [];
  const self = selfEmail.toLowerCase().trim();

  for (const part of parts) {
    if (!EMAIL_RE.test(part)) {
      throw new Error(
        `"${part}" is not a valid email. Use the address from their Profile.`,
      );
    }

    if (part === self) {
      continue;
    }

    if (!emails.includes(part)) {
      emails.push(part);
    }
  }

  return emails;
}
