import { getDisplayCurrency, normalizeCurrency } from "@/lib/currency/currency";
import { getDisplayTimezone } from "@/lib/timezone/timezone";

const CURRENCY_LOCALE: Record<string, string> = {
  INR: "en-IN",
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
  AED: "en-AE",
  SGD: "en-SG",
  JPY: "ja-JP",
  AUD: "en-AU",
  CAD: "en-CA",
  CHF: "de-CH",
};

function getLocaleForCurrency(currency: string): string {
  const normalized = normalizeCurrency(currency);
  return CURRENCY_LOCALE[normalized] ?? "en-US";
}

function fractionDigitsForAmount(amount: number): {
  maximumFractionDigits: number;
  minimumFractionDigits: number;
} {
  const hasFraction = Math.abs(amount % 1) > Number.EPSILON;
  return {
    maximumFractionDigits: hasFraction ? 2 : 0,
    minimumFractionDigits: hasFraction ? 2 : 0,
  };
}

/** Locale-grouped amount without currency symbol, e.g. "50,000". */
export function formatGroupedAmount(amount: number, currency: string): string {
  const locale = getLocaleForCurrency(currency);
  const { maximumFractionDigits, minimumFractionDigits } =
    fractionDigitsForAmount(amount);

  return new Intl.NumberFormat(locale, {
    style: "decimal",
    maximumFractionDigits,
    minimumFractionDigits,
  }).format(amount);
}

function getCurrencySymbolParts(currency: string): {
  symbol: string;
  symbolFirst: boolean;
} {
  const locale = getLocaleForCurrency(currency);
  const parts = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
  }).formatToParts(1);

  const symbol = parts.find((part) => part.type === "currency")?.value ?? currency;
  const symbolIndex = parts.findIndex((part) => part.type === "currency");
  const numberIndex = parts.findIndex((part) =>
    ["integer", "decimal", "fraction"].includes(part.type),
  );

  return {
    symbol,
    symbolFirst: symbolIndex >= 0 && numberIndex >= 0 && symbolIndex < numberIndex,
  };
}

/** Prefixes/suffixes grouped amount with symbol for the given currency. */
export function withCurrencySymbol(
  groupedAmount: string,
  currency: string,
): string {
  const { symbol, symbolFirst } = getCurrencySymbolParts(currency);

  if (symbolFirst) {
    return `${symbol}${groupedAmount}`;
  }

  return `${groupedAmount}\u00a0${symbol}`;
}

export function formatMoney(amount: number, currency?: string): string {
  const resolvedCurrency = currency ?? getDisplayCurrency();
  const grouped = formatGroupedAmount(amount, resolvedCurrency);
  return withCurrencySymbol(grouped, resolvedCurrency);
}

export function sumByCurrency<T extends { amount: number; currency: string }>(
  items: T[],
): Map<string, number> {
  const totals = new Map<string, number>();

  for (const item of items) {
    totals.set(item.currency, (totals.get(item.currency) ?? 0) + item.amount);
  }

  return totals;
}

export function formatCurrencyTotals(
  totals: Map<string, number>,
  preferredCurrency?: string,
): string[] {
  const currency = preferredCurrency ?? getDisplayCurrency();
  const entries = [...totals.entries()].sort((a, b) => {
    if (a[0] === currency) return -1;
    if (b[0] === currency) return 1;
    return a[0].localeCompare(b[0]);
  });

  return entries.map(([code, amount]) => formatMoney(amount, code));
}

/**
 * Display amount with symbol. Expense record currency takes precedence over user default.
 * Server `formattedAmount` is grouped digits only (no symbol).
 */
export function displayExpenseAmount(expense: {
  amount: number;
  currency: string;
  formattedAmount?: string;
}): string {
  const currency = expense.currency;
  const grouped =
    expense.formattedAmount ?? formatGroupedAmount(expense.amount, currency);

  return withCurrencySymbol(grouped, currency);
}

function getTimeZone(timeZone?: string): string {
  return timeZone ?? getDisplayTimezone();
}

export function formatDateLabel(
  dateOnly: string,
  timeZone?: string,
): string {
  const date = new Date(`${dateOnly}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    return dateOnly;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: getTimeZone(timeZone),
  }).format(date);
}

export function formatShortDate(dateOnly: string, timeZone?: string): string {
  const date = new Date(`${dateOnly}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    return dateOnly;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    timeZone: getTimeZone(timeZone),
  }).format(date);
}

export function formatDateTime(
  isoTimestamp: string,
  timeZone?: string,
): string {
  const date = new Date(isoTimestamp);
  if (Number.isNaN(date.getTime())) {
    return isoTimestamp;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: getTimeZone(timeZone),
  }).format(date);
}

export function formatTime(isoTimestamp: string, timeZone?: string): string {
  const date = new Date(isoTimestamp);
  if (Number.isNaN(date.getTime())) {
    return isoTimestamp;
  }

  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: getTimeZone(timeZone),
  }).format(date);
}

export function todayDateOnly(timeZone?: string): string {
  return formatDateOnlyInTimezone(new Date(), getTimeZone(timeZone));
}

export function startOfMonthDateOnly(timeZone?: string): string {
  const tz = getTimeZone(timeZone);
  const parts = getZonedDateParts(new Date(), tz);

  return `${parts.year}-${String(parts.month).padStart(2, "0")}-01`;
}

function formatDateOnlyInTimezone(date: Date, timeZone: string): string {
  const parts = getZonedDateParts(date, timeZone);
  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
}

function getZonedDateParts(
  date: Date,
  timeZone: string,
): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(date);

  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);

  return { year, month, day };
}

export function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}
