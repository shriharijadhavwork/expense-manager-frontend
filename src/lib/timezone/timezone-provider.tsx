"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  detectTimezone,
  readStoredTimezonePreference,
  resolveTimezone,
  setDisplayTimezone,
  writeStoredTimezonePreference,
  type TimezonePreference,
} from "@/lib/timezone/timezone";

type TimezoneContextValue = {
  preference: TimezonePreference;
  resolvedTimezone: string;
  detectedTimezone: string;
  setTimezone: (preference: TimezonePreference) => void;
};

const TimezoneContext = createContext<TimezoneContextValue | null>(null);

export function TimezoneProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<TimezonePreference>(
    readStoredTimezonePreference,
  );
  const [detectedTimezone] = useState(detectTimezone);

  const resolvedTimezone = useMemo(
    () => resolveTimezone(preference),
    [preference],
  );

  useEffect(() => {
    setDisplayTimezone(resolvedTimezone);
  }, [resolvedTimezone]);

  const setTimezone = useCallback((next: TimezonePreference) => {
    setPreferenceState(next);
    writeStoredTimezonePreference(next);
  }, []);

  const value = useMemo(
    () => ({
      preference,
      resolvedTimezone,
      detectedTimezone,
      setTimezone,
    }),
    [preference, resolvedTimezone, detectedTimezone, setTimezone],
  );

  return (
    <TimezoneContext.Provider value={value}>{children}</TimezoneContext.Provider>
  );
}

export function useTimezone(): TimezoneContextValue {
  const context = useContext(TimezoneContext);
  if (!context) {
    throw new Error("useTimezone must be used within TimezoneProvider");
  }
  return context;
}
