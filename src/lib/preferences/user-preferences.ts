import type { UserPreferences as ApiUserPreferences } from "@/types/api";
import type { CurrencyCode } from "@/lib/currency/currency";
import { normalizeCurrency } from "@/lib/currency/currency";
import {
  readStoredCurrency,
  writeStoredCurrency,
} from "@/lib/currency/currency";
import {
  readStoredTimezonePreference,
  writeStoredTimezonePreference,
  type TimezonePreference,
} from "@/lib/timezone/timezone";

export type ThemePreference = "light" | "dark" | "system";

export type UserPreferences = {
  theme: ThemePreference;
  timezone: TimezonePreference;
  defaultCurrency: CurrencyCode;
};

const THEME_STORAGE_KEY = "expense-manager.theme";

function writeStoredTheme(theme: ThemePreference): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function applyServerPreferences(
  preferences: ApiUserPreferences,
  handlers: {
    setTheme: (theme: ThemePreference) => void;
    setTimezone: (timezone: TimezonePreference) => void;
    setCurrency: (currency: CurrencyCode) => void;
  },
): void {
  handlers.setTheme(preferences.theme);
  handlers.setTimezone(preferences.timezone);
  handlers.setCurrency(normalizeCurrency(preferences.defaultCurrency));

  writeStoredTheme(preferences.theme);
  writeStoredTimezonePreference(preferences.timezone);
  writeStoredCurrency(normalizeCurrency(preferences.defaultCurrency));
}

export function readLocalPreferences(): UserPreferences {
  const storedTheme = typeof window === "undefined"
    ? "system"
    : window.localStorage.getItem(THEME_STORAGE_KEY);

  const theme =
    storedTheme === "light" || storedTheme === "dark" || storedTheme === "system"
      ? storedTheme
      : "system";

  return {
    theme,
    timezone: readStoredTimezonePreference(),
    defaultCurrency: readStoredCurrency(),
  };
}
