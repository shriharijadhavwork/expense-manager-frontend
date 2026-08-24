"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth/auth-provider";
import { applyServerPreferences } from "@/lib/preferences/user-preferences";
import { useCurrency } from "@/lib/currency/currency-provider";
import { useTheme } from "@/lib/theme/theme-provider";
import { useTimezone } from "@/lib/timezone/timezone-provider";

/** Applies server-stored preferences after login/bootstrap. */
export function PreferencesSync() {
  const { user } = useAuth();
  const { setTheme } = useTheme();
  const { setTimezone } = useTimezone();
  const { setCurrency } = useCurrency();

  useEffect(() => {
    if (!user?.preferences) {
      return;
    }

    applyServerPreferences(user.preferences, {
      setTheme,
      setTimezone,
      setCurrency,
    });
  }, [user?.preferences, setTheme, setTimezone, setCurrency]);

  return null;
}
