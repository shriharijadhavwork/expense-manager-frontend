export const DEFAULT_CURRENCY = "INR";

const STORAGE_KEY = "expense-manager.currency";

export type CurrencyCode =
  | "INR"
  | "USD"
  | "EUR"
  | "GBP"
  | "AED"
  | "SGD"
  | "JPY"
  | "AUD"
  | "CAD"
  | "CHF";

export const SUPPORTED_CURRENCIES: Array<{ code: CurrencyCode; label: string }> = [
  { code: "INR", label: "Indian Rupee (INR)" },
  { code: "USD", label: "US Dollar (USD)" },
  { code: "EUR", label: "Euro (EUR)" },
  { code: "GBP", label: "British Pound (GBP)" },
  { code: "AED", label: "UAE Dirham (AED)" },
  { code: "SGD", label: "Singapore Dollar (SGD)" },
  { code: "JPY", label: "Japanese Yen (JPY)" },
  { code: "AUD", label: "Australian Dollar (AUD)" },
  { code: "CAD", label: "Canadian Dollar (CAD)" },
  { code: "CHF", label: "Swiss Franc (CHF)" },
];

const supportedSet = new Set<string>(SUPPORTED_CURRENCIES.map((item) => item.code));

let displayCurrency: CurrencyCode = DEFAULT_CURRENCY;

export function getDisplayCurrency(): CurrencyCode {
  return displayCurrency;
}

export function setDisplayCurrency(currency: string): void {
  displayCurrency = isSupportedCurrency(currency) ? currency : DEFAULT_CURRENCY;
}

export function isSupportedCurrency(currency: string): currency is CurrencyCode {
  return supportedSet.has(currency.toUpperCase());
}

export function normalizeCurrency(currency: string | undefined): CurrencyCode {
  if (!currency) {
    return DEFAULT_CURRENCY;
  }

  const upper = currency.toUpperCase();
  return isSupportedCurrency(upper) ? upper : DEFAULT_CURRENCY;
}

export function readStoredCurrency(): CurrencyCode {
  if (typeof window === "undefined") {
    return DEFAULT_CURRENCY;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored ? normalizeCurrency(stored) : DEFAULT_CURRENCY;
}

export function writeStoredCurrency(currency: CurrencyCode): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, currency);
}
