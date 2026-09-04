"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { expensesApi } from "@/lib/api/expenses";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/auth-provider";
import { useCurrency } from "@/lib/currency/currency-provider";
import type { Expense } from "@/types/api";
import { cn } from "@/utils/cn";
import {
  displayExpenseAmount,
  expenseDirectionAmountClass,
  formatCurrencyTotals,
  formatExpenseCategoryLine,
  formatMoney,
  formatShortDate,
  startOfMonthDateOnly,
  sumByCurrency,
  todayDateOnly,
} from "@/utils/format";

export default function DashboardPage() {
  const { user } = useAuth();
  const { currency: preferredCurrency } = useCurrency();
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const data = await expensesApi.list();
      setExpenses(data);
      setStatus("success");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to load dashboard.",
      );
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      void load();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [load]);

  const monthStart = startOfMonthDateOnly();
  const today = todayDateOnly();

  const metrics = useMemo(() => {
    const monthExpenses = expenses.filter(
      (expense) => expense.date >= monthStart && expense.date <= today,
    );

    // `amount` is always a positive magnitude — `direction` is what makes it
    // spend vs income. Summing without splitting on direction conflates the
    // two (e.g. a ₹300 credit + ₹150 debit would show as "₹450 · 2 expenses").
    const monthSpend = monthExpenses.filter(
      (expense) => expense.direction !== "credit",
    );
    const monthIncome = monthExpenses.filter(
      (expense) => expense.direction === "credit",
    );
    const allSpend = expenses.filter((expense) => expense.direction !== "credit");
    const allIncome = expenses.filter((expense) => expense.direction === "credit");

    const totalAllByCurrency = sumByCurrency(allSpend);
    const totalMonthByCurrency = sumByCurrency(monthSpend);
    const incomeAllByCurrency = sumByCurrency(allIncome);
    const incomeMonthByCurrency = sumByCurrency(monthIncome);

    const monthPreferredSpend = monthSpend.filter(
      (expense) => expense.currency === preferredCurrency,
    );

    const byCategory = new Map<string, { label: string; amount: number }>();
    for (const expense of monthPreferredSpend) {
      const existing = byCategory.get(expense.category);
      byCategory.set(expense.category, {
        label: expense.categoryLabel,
        amount: (existing?.amount ?? 0) + expense.amount,
      });
    }

    const topCategories = [...byCategory.entries()]
      .sort((a, b) => b[1].amount - a[1].amount)
      .slice(0, 4);

    const recent = [...expenses]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5);

    return {
      totalAllByCurrency,
      totalMonthByCurrency,
      incomeAllByCurrency,
      incomeMonthByCurrency,
      countMonth: monthSpend.length,
      countAll: allSpend.length,
      topCategories,
      recent,
    };
  }, [expenses, monthStart, today, preferredCurrency]);

  const monthlyIncome = user?.preferences.monthlyIncome ?? null;
  const spentThisMonth = metrics.totalMonthByCurrency.get(preferredCurrency) ?? 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Hello, ${user?.name?.split(" ")[0] ?? "there"}`}
        description="A clear view of your spending. Values come from your live expense data."
        actions={
          <Link
            href="/app/expenses"
            className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Manage expenses
          </Link>
        }
      />

      {status === "loading" ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-28" />
          ))}
        </div>
      ) : null}

      {status === "error" && error ? (
        <ErrorState description={error} onRetry={() => void load()} />
      ) : null}

      {status === "success" ? (
        <>
          {monthlyIncome !== null ? (
            <Card className="border-primary/15">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Remaining this month
                  </p>
                  <p
                    className={cn(
                      "mt-2 font-mono text-3xl font-semibold tracking-tight tabular-nums",
                      monthlyIncome - spentThisMonth >= 0
                        ? "text-income"
                        : "text-expense",
                    )}
                  >
                    {formatMoney(monthlyIncome - spentThisMonth, preferredCurrency)}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Based on your configured monthly income — not your actual
                    bank balance.
                  </p>
                </div>
                <div className="flex gap-6 sm:gap-10">
                  <div>
                    <p className="text-xs text-muted-foreground">Income</p>
                    <p className="mt-1 font-mono text-sm font-semibold tabular-nums">
                      {formatMoney(monthlyIncome, preferredCurrency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Spent</p>
                    <p className="mt-1 font-mono text-sm font-semibold tabular-nums text-expense">
                      {formatMoney(spentThisMonth, preferredCurrency)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium">
                  Set your monthly income to see your remaining balance.
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Track what&apos;s left to spend this month, calculated from
                  your income and expenses.
                </p>
              </div>
              <Link
                href="/app/settings"
                className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Set monthly income
              </Link>
            </Card>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <p className="text-sm text-muted-foreground">This month</p>
              <div className="mt-3 space-y-1">
                {metrics.totalMonthByCurrency.size > 0 ? (
                  formatCurrencyTotals(
                    metrics.totalMonthByCurrency,
                    preferredCurrency,
                  ).map((label) => (
                    <p
                      key={label}
                      className="font-mono text-2xl font-semibold tracking-tight text-expense"
                    >
                      {label}
                    </p>
                  ))
                ) : (
                  <p className="font-mono text-2xl font-semibold tracking-tight text-expense">
                    {formatMoney(0, preferredCurrency)}
                  </p>
                )}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {`${metrics.countMonth} expense${metrics.countMonth === 1 ? "" : "s"}`}
                {metrics.totalMonthByCurrency.size > 1
                  ? " · totals shown per currency"
                  : null}
              </p>
              {metrics.incomeMonthByCurrency.size > 0 ? (
                <p className="mt-1 text-xs font-medium text-income">
                  +
                  {formatCurrencyTotals(
                    metrics.incomeMonthByCurrency,
                    preferredCurrency,
                  ).join(", +")}{" "}
                  received
                </p>
              ) : null}
            </Card>
            <Card>
              <p className="text-sm text-muted-foreground">All time</p>
              <div className="mt-3 space-y-1">
                {metrics.totalAllByCurrency.size > 0 ? (
                  formatCurrencyTotals(
                    metrics.totalAllByCurrency,
                    preferredCurrency,
                  ).map((label) => (
                    <p
                      key={label}
                      className="font-mono text-2xl font-semibold tracking-tight"
                    >
                      {label}
                    </p>
                  ))
                ) : (
                  <p className="font-mono text-2xl font-semibold tracking-tight">
                    {formatMoney(0, preferredCurrency)}
                  </p>
                )}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {`${metrics.countAll} expense${metrics.countAll === 1 ? "" : "s"}`}
                {metrics.totalAllByCurrency.size > 1
                  ? " · totals shown per currency"
                  : null}
              </p>
              {metrics.incomeAllByCurrency.size > 0 ? (
                <p className="mt-1 text-xs font-medium text-income">
                  +
                  {formatCurrencyTotals(
                    metrics.incomeAllByCurrency,
                    preferredCurrency,
                  ).join(", +")}{" "}
                  received
                </p>
              ) : null}
            </Card>
            <Card>
              <p className="text-sm text-muted-foreground">Top category</p>
              <p className="mt-3 text-2xl font-semibold tracking-tight">
                {metrics.topCategories[0]
                  ? metrics.topCategories[0][1].label
                  : "—"}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {metrics.topCategories[0]
                  ? formatMoney(
                      metrics.topCategories[0][1].amount,
                      preferredCurrency,
                    )
                  : `No ${preferredCurrency} spend this month`}
              </p>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <Card padding="none">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div>
                  <h2 className="text-base font-semibold">Recent activity</h2>
                  <p className="text-sm text-muted-foreground">
                    Latest expenses from your account
                  </p>
                </div>
                <Link
                  href="/app/expenses"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View all
                </Link>
              </div>
              {metrics.recent.length === 0 ? (
                <div className="p-5">
                  <EmptyState
                    title="No expenses yet"
                    description="Add an expense to see activity here."
                    actionLabel="Go to expenses"
                    onAction={() => router.push("/app/expenses")}
                  />
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {metrics.recent.map((expense) => (
                    <li
                      key={expense.id}
                      className="flex items-center justify-between gap-4 px-5 py-4"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {expense.note || formatExpenseCategoryLine(expense)}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatShortDate(expense.date)} ·{" "}
                          {formatExpenseCategoryLine(expense)}
                        </p>
                      </div>
                      <p
                        className={cn(
                          "shrink-0 font-mono text-sm font-semibold",
                          expenseDirectionAmountClass(expense.direction),
                        )}
                      >
                        {displayExpenseAmount(expense)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card>
              <h2 className="text-base font-semibold">Categories this month</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Display-only totals from your expense list
              </p>
              <div className="mt-5 space-y-3">
                {metrics.topCategories.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No categorized spend yet this month.
                  </p>
                ) : (
                  metrics.topCategories.map(([slug, row]) => (
                    <div
                      key={slug}
                      className="flex items-center justify-between gap-3"
                    >
                      <Badge tone="primary">{row.label}</Badge>
                      <p className="font-mono text-sm font-medium">
                        {formatMoney(row.amount, preferredCurrency)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
}
