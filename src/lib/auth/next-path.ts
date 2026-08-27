const SAFE_NEXT_RE = /^\/[A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=%]*$/;

/** Only allow same-origin relative paths for post-auth redirects. */
export function sanitizeNextPath(
  value: string | null | undefined,
): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return null;
  }

  if (!SAFE_NEXT_RE.test(trimmed)) {
    return null;
  }

  return trimmed;
}

export function withNextQuery(
  href: string,
  next: string | null | undefined,
): string {
  const safe = sanitizeNextPath(next);
  if (!safe) {
    return href;
  }

  const separator = href.includes("?") ? "&" : "?";
  return `${href}${separator}next=${encodeURIComponent(safe)}`;
}
