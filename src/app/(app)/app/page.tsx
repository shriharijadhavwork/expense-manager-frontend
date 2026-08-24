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
import type { Expense } from "@/types/api";
import {
  capitalize,
  formatMoney,
  formatShortDate,
  startOfMonthDateOnly,
  todayDateOnly,
} from "@/utils/format";

export default function DashboardPage() {
  const { user } = useAuth();
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
    const totalAll = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalMonth = monthExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );

    const byCategory = new Map<string, number>();
    for (const expense of monthExpenses) {
      byCategory.set(
        expense.category,
        (byCategory.get(expense.category) ?? 0) + expense.amount,
      );
    }

    const topCategories = [...byCategory.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);

    const recent = [...expenses]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5);

    return {
      totalAll,
      totalMonth,
      countMonth: monthExpenses.length,
      countAll: expenses.length,
      topCategories,
      recent,
    };
  }, [expenses, monthStart, today]);

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Hello, ${user?.name?.split(" ")[0] ?? "there"}`}
        description="A clear view of your spending. Values come from your live expense data."
        actions={
          <Link
            href="/app/expenses"
            className="inline-flex h-10 items-center justify-center rounded-[var(--radius-md)] bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
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
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <p className="text-sm text-muted-foreground">This month</p>
              <p className="mt-3 font-mono text-2xl font-semibold tracking-tight text-expense">
                {formatMoney(metrics.totalMonth)}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {`${metrics.countMonth} expense${metrics.countMonth === 1 ? "" : "s"}`}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-muted-foreground">All time</p>
              <p className="mt-3 font-mono text-2xl font-semibold tracking-tight">
                {formatMoney(metrics.totalAll)}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {metrics.countAll} recorded
              </p>
            </Card>
            <Card>
              <p className="text-sm text-muted-foreground">Top category</p>
              <p className="mt-3 text-2xl font-semibold tracking-tight">
                {metrics.topCategories[0]
                  ? capitalize(metrics.topCategories[0][0])
                  : "—"}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {metrics.topCategories[0]
                  ? formatMoney(metrics.topCategories[0][1])
                  : "No spend this month"}
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
                          {expense.note || capitalize(expense.category)}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatShortDate(expense.date)} ·{" "}
                          {capitalize(expense.category)}
                        </p>
                      </div>
                      <p className="shrink-0 font-mono text-sm font-semibold text-expense">
                        {formatMoney(expense.amount)}
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
                  metrics.topCategories.map(([name, amount]) => (
                    <div
                      key={name}
                      className="flex items-center justify-between gap-3"
                    >
                      <Badge tone="primary">{capitalize(name)}</Badge>
                      <p className="font-mono text-sm font-medium">
                        {formatMoney(amount)}
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
