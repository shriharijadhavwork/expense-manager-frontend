"use client";

import { useCallback } from "react";
import { useToast } from "@/components/shared/toast";
import { ApiError } from "@/lib/api/client";
import { useCurrency } from "@/lib/currency/currency-provider";
import type { CurrencyCode } from "@/lib/currency/currency";
import { persistPreferences } from "@/lib/preferences/persist-preferences";
import { useAuth } from "@/lib/auth/auth-provider";
import { useTheme, type ThemePreference } from "@/lib/theme/theme-provider";
import { useTimezone } from "@/lib/timezone/timezone-provider";
import type { TimezonePreference } from "@/lib/timezone/timezone";

export function usePreferenceActions() {
  const { refreshUser } = useAuth();
  const { setTheme } = useTheme();
  const { setTimezone } = useTimezone();
  const { setCurrency } = useCurrency();
  const { toast } = useToast();

  const savePreferences = useCallback(
    async (
      preferences: Parameters<typeof persistPreferences>[0],
      options?: { silent?: boolean },
    ) => {
      try {
        await persistPreferences(preferences);
        await refreshUser();
      } catch (error) {
        if (!options?.silent) {
          toast({
            title: "Could not save preference",
            description:
              error instanceof ApiError ? error.message : "Please try again.",
            variant: "error",
          });
        }
      }
    },
    [refreshUser, toast],
  );

  const updateTheme = useCallback(
    (theme: ThemePreference) => {
      setTheme(theme);
      void savePreferences({ theme });
    },
    [savePreferences, setTheme],
  );

  const updateTimezone = useCallback(
    (timezone: TimezonePreference) => {
      setTimezone(timezone);
      void savePreferences({ timezone });
    },
    [savePreferences, setTimezone],
  );

  const updateCurrency = useCallback(
    (defaultCurrency: CurrencyCode) => {
      setCurrency(defaultCurrency);
      void savePreferences({ defaultCurrency });
    },
    [savePreferences, setCurrency],
  );

  return {
    updateTheme,
    updateTimezone,
    updateCurrency,
  };
}
