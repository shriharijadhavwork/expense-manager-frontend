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
  readStoredCurrency,
  setDisplayCurrency,
  writeStoredCurrency,
  type CurrencyCode,
} from "@/lib/currency/currency";

type CurrencyContextValue = {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(readStoredCurrency);

  useEffect(() => {
    setDisplayCurrency(currency);
  }, [currency]);

  const setCurrency = useCallback((next: CurrencyCode) => {
    setCurrencyState(next);
    writeStoredCurrency(next);
  }, []);

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
    }),
    [currency, setCurrency],
  );

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return context;
}
