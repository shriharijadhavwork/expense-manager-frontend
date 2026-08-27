export type DisplayInitialsSource = {
  name?: string | null;
  email?: string | null;
};

function resolveName(source: string | DisplayInitialsSource): string {
  if (typeof source === "string") {
    return source.trim();
  }

  const name = source.name?.trim();
  if (name) {
    return name;
  }

  const email = source.email?.trim();
  if (!email) {
    return "";
  }

  const localPart = email.split("@")[0]?.trim();
  return localPart ?? "";
}

/**
 * Two-character initials when a last name is present:
 * first letter of the first name + last letter of the last name.
 * Single-token names use the first letter only.
 */
export function getDisplayInitials(
  source: string | DisplayInitialsSource,
): string {
  const normalized = resolveName(source);
  const parts = normalized.split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  const firstName = parts[0]!;
  const firstInitial = firstName.charAt(0).toUpperCase();

  if (parts.length === 1) {
    return firstInitial;
  }

  const lastName = parts[parts.length - 1]!;
  const lastInitial = lastName.charAt(lastName.length - 1).toUpperCase();

  return `${firstInitial}${lastInitial}`;
}
