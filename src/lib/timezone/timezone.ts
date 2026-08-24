export const DEFAULT_TIMEZONE = "Asia/Kolkata";

const STORAGE_KEY = "expense-manager.timezone";

export type TimezonePreference = "auto" | string;

let displayTimezone = DEFAULT_TIMEZONE;

export function getDisplayTimezone(): string {
  return displayTimezone;
}

export function setDisplayTimezone(timezone: string): void {
  displayTimezone = isValidTimezone(timezone) ? timezone : DEFAULT_TIMEZONE;
}

export function isValidTimezone(timezone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}

export function detectTimezone(): string {
  try {
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (detected && isValidTimezone(detected)) {
      return detected;
    }
  } catch {
    // fall through
  }

  return DEFAULT_TIMEZONE;
}

export function readStoredTimezonePreference(): TimezonePreference {
  if (typeof window === "undefined") {
    return "auto";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return "auto";
  }

  if (stored === "auto") {
    return "auto";
  }

  return isValidTimezone(stored) ? stored : "auto";
}

export function writeStoredTimezonePreference(preference: TimezonePreference): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, preference);
}

export function resolveTimezone(preference: TimezonePreference): string {
  if (preference === "auto") {
    return detectTimezone();
  }

  return isValidTimezone(preference) ? preference : DEFAULT_TIMEZONE;
}

export const TIMEZONE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "Asia/Kolkata", label: "Asia/Kolkata (IST)" },
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "America/New York (ET)" },
  { value: "America/Los_Angeles", label: "America/Los Angeles (PT)" },
  { value: "Europe/London", label: "Europe/London (GMT/BST)" },
  { value: "Europe/Berlin", label: "Europe/Berlin (CET)" },
  { value: "Asia/Dubai", label: "Asia/Dubai (GST)" },
  { value: "Asia/Singapore", label: "Asia/Singapore (SGT)" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo (JST)" },
  { value: "Australia/Sydney", label: "Australia/Sydney (AEST)" },
];
