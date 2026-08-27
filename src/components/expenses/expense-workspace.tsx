"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/shared/toast";
import { expensesApi } from "@/lib/api/expenses";
import { ApiError } from "@/lib/api/client";
import { SUPPORTED_CURRENCIES } from "@/lib/currency/currency";
import { useCurrency } from "@/lib/currency/currency-provider";
import type { Expense } from "@/types/api";
import type { CurrencyCode } from "@/lib/currency/currency";
import { capitalize, displayExpenseAmount, formatShortDate, todayDateOnly } from "@/utils/format";
import { cn } from "@/utils/cn";

const CATEGORY_SUGGESTIONS = [
  "food",
  "travel",
  "shopping",
  "transport",
  "bills",
  "health",
  "entertainment",
];

type ExpenseFormState = {
  amount: string;
  currency: CurrencyCode;
  category: string;
  note: string;
  date: string;
};

const createEmptyForm = (currency: CurrencyCode): ExpenseFormState => ({
  amount: "",
  currency,
  category: "",
  note: "",
  date: todayDateOnly(),
});

type ExpenseWorkspaceProps = {
  mode?: "full" | "recent";
  limit?: number;
  title?: string;
  description?: string;
  showFilters?: boolean;
  onLoaded?: (expenses: Expense[]) => void;
};

export function ExpenseWorkspace({
  mode = "full",
  limit,
  title = "Expenses",
  description = "Track spending with clear amounts, categories, and dates.",
  showFilters = true,
  onLoaded,
}: ExpenseWorkspaceProps) {
  const { toast } = useToast();
  const { currency: defaultCurrency } = useCurrency();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [form, setForm] = useState<ExpenseFormState>(() =>
    createEmptyForm(defaultCurrency),
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);

    try {
      const hasFilters = Boolean(category.trim() || from || to);
      const data = hasFilters
        ? await expensesApi.search({
            ...(category.trim() ? { category: category.trim() } : {}),
            ...(from ? { from } : {}),
            ...(to ? { to } : {}),
          })
        : await expensesApi.list();

      setExpenses(data);
      onLoaded?.(data);
      setStatus("success");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to load expenses.";
      setError(message);
      setStatus("error");
    }
  }, [category, from, to, onLoaded]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      void load();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [load]);

  const visibleExpenses = useMemo(() => {
    const sorted = [...expenses].sort((a, b) => b.date.localeCompare(a.date));
    return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
  }, [expenses, limit]);

  function openCreate() {
    setEditing(null);
    setForm(createEmptyForm(defaultCurrency));
    setFormError(null);
    setDialogOpen(true);
  }

  function openEdit(expense: Expense) {
    setEditing(expense);
    setForm({
      amount: String(expense.amount),
      currency: expense.currency as CurrencyCode,
      category: expense.category,
      note: expense.note,
      date: expense.date,
    });
    setFormError(null);
    setDialogOpen(true);
  }

  async function onSave(event: React.FormEvent) {
    event.preventDefault();
    setFormError(null);

    const amount = Number(form.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setFormError("Enter a valid amount greater than 0.");
      return;
    }
    if (!form.category.trim()) {
      setFormError("Category is required.");
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.date)) {
      setFormError("Date must be YYYY-MM-DD.");
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        await expensesApi.update(editing.id, {
          amount,
          currency: form.currency,
          category: form.category.trim(),
          note: form.note.trim(),
          date: form.date,
        });
        toast({ title: "Expense updated", variant: "success" });
      } else {
        await expensesApi.create({
          amount,
          currency: form.currency,
          category: form.category.trim(),
          note: form.note.trim(),
          date: form.date,
        });
        toast({ title: "Expense added", variant: "success" });
      }
      setDialogOpen(false);
      await load();
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : "Unable to save expense.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(expense: Expense) {
    const confirmed = window.confirm(
      `Delete this ${displayExpenseAmount(expense)} expense?`,
    );
    if (!confirmed) return;

    setDeletingId(expense.id);
    try {
      await expensesApi.remove(expense.id);
      toast({ title: "Expense deleted", variant: "success" });
      await load();
    } catch (err) {
      toast({
        title: "Delete failed",
        description:
          err instanceof ApiError ? err.message : "Please try again.",
        variant: "error",
      });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {mode === "full" ? (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          <Button onClick={openCreate}>Add expense</Button>
        </div>
      ) : null}

      {showFilters && mode === "full" ? (
        <Card className="grid gap-3 sm:grid-cols-4">
          <Input
            label="Category"
            list="expense-categories"
            placeholder="food"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          />
          <Input
            label="From"
            type="date"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
          />
          <Input
            label="To"
            type="date"
            value={to}
            onChange={(event) => setTo(event.target.value)}
          />
          <div className="flex items-end gap-2">
            <Button className="w-full" variant="secondary" onClick={() => void load()}>
              Search
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setCategory("");
                setFrom("");
                setTo("");
              }}
            >
              Clear
            </Button>
          </div>
          <datalist id="expense-categories">
            {CATEGORY_SUGGESTIONS.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        </Card>
      ) : null}

      {status === "loading" ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-20 w-full" />
          ))}
        </div>
      ) : null}

      {status === "error" && error ? (
        <ErrorState description={error} onRetry={() => void load()} />
      ) : null}

      {status === "success" && visibleExpenses.length === 0 ? (
        <EmptyState
          title="No expenses yet"
          description="Add your first expense to start building a clear spending picture."
          actionLabel="Add expense"
          onAction={openCreate}
        />
      ) : null}

      {status === "success" && visibleExpenses.length > 0 ? (
        <div className="space-y-2">
          {visibleExpenses.map((expense) => (
            <Card
              key={expense.id}
              padding="none"
              className="overflow-hidden transition-colors hover:bg-muted/30"
            >
              <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-mono text-lg font-semibold tracking-tight text-expense">
                      {displayExpenseAmount(expense)}
                    </p>
                    <Badge tone="primary">{capitalize(expense.category)}</Badge>
                    <Badge>{expense.currency}</Badge>
                    {expense.groupId ? (
                      <Badge tone="success">Group</Badge>
                    ) : null}
                  </div>
                  <p className="mt-1 truncate text-sm text-foreground">
                    {expense.note || "No note"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatShortDate(expense.date)}
                  </p>
                </div>
                {mode === "full" ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEdit(expense)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      loading={deletingId === expense.id}
                      onClick={() => void onDelete(expense)}
                    >
                      Delete
                    </Button>
                  </div>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      ) : null}

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editing ? "Edit expense" : "Add expense"}
        description="Amount and currency are stored separately on each expense."
      >
        <form className="space-y-4" onSubmit={onSave}>
          <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
            <Input
              label="Amount"
              name="amount"
              inputMode="decimal"
              required
              value={form.amount}
              onChange={(event) =>
                setForm((current) => ({ ...current, amount: event.target.value }))
              }
            />
            <div className="space-y-2">
              <label
                htmlFor="expense-currency"
                className="text-sm font-medium text-foreground"
              >
                Currency
              </label>
              <select
                id="expense-currency"
                name="currency"
                required
                value={form.currency}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    currency: event.target.value as CurrencyCode,
                  }))
                }
                className="h-10 w-full rounded-[var(--radius-md)] border border-border bg-card px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {SUPPORTED_CURRENCIES.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.code}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Input
            label="Category"
            name="category"
            list="expense-form-categories"
            required
            value={form.category}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                category: event.target.value,
              }))
            }
          />
          <datalist id="expense-form-categories">
            {CATEGORY_SUGGESTIONS.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
          <Input
            label="Date"
            name="date"
            type="date"
            required
            value={form.date}
            onChange={(event) =>
              setForm((current) => ({ ...current, date: event.target.value }))
            }
          />
          <Textarea
            label="Note"
            name="note"
            value={form.note}
            onChange={(event) =>
              setForm((current) => ({ ...current, note: event.target.value }))
            }
          />
          {formError ? (
            <p className={cn("text-sm text-destructive")}>{formError}</p>
          ) : null}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editing ? "Save changes" : "Create expense"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
