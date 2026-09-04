"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/shared/toast";
import { ExpenseCategoryFields } from "@/components/expenses/expense-category-fields";
import { ExpenseDirectionSelect } from "@/components/expenses/expense-direction-select";
import { PencilIcon, TrashIcon } from "@/components/ui/icons";
import { expensesApi } from "@/lib/api/expenses";
import { ApiError } from "@/lib/api/client";
import { SUPPORTED_CURRENCIES } from "@/lib/currency/currency";
import { useCurrency } from "@/lib/currency/currency-provider";
import type { Expense, ExpenseCategoryOption, ExpenseDirection } from "@/types/api";
import type { CurrencyCode } from "@/lib/currency/currency";
import {
  displayExpenseAmount,
  expenseDirectionAmountClass,
  expenseDirectionLabel,
  formatExpenseCategoryLine,
  formatShortDate,
  todayDateOnly,
} from "@/utils/format";
import { cn } from "@/utils/cn";

const ALL_CATEGORIES_VALUE = "__all_categories__";
const ALL_TYPES_VALUE = "__all_types__";

type ExpenseFormState = {
  amount: string;
  currency: CurrencyCode;
  direction: ExpenseDirection;
  category: string;
  subCategory: string;
  note: string;
  date: string;
};

const createEmptyForm = (currency: CurrencyCode): ExpenseFormState => ({
  amount: "",
  currency,
  direction: "debit",
  category: "",
  subCategory: "",
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
  const [categories, setCategories] = useState<ExpenseCategoryOption[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDirection, setFilterDirection] = useState<"" | ExpenseDirection>("");
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
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);

  useEffect(() => {
    void expensesApi.listCategories().then(setCategories).catch(() => {
      setCategories([]);
    });
  }, []);

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);

    try {
      const hasFilters = Boolean(filterCategory || filterDirection || from || to);
      const data = hasFilters
        ? await expensesApi.search({
            ...(filterCategory ? { category: filterCategory } : {}),
            ...(filterDirection ? { direction: filterDirection } : {}),
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
  }, [filterCategory, filterDirection, from, to, onLoaded]);

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
      direction: expense.direction,
      category: expense.category,
      subCategory: expense.subCategory,
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
      const payload = {
        amount,
        currency: form.currency,
        direction: form.direction,
        category: form.category,
        subCategory: form.subCategory.trim(),
        note: form.note.trim(),
        date: form.date,
      };

      if (editing) {
        await expensesApi.update(editing.id, payload);
        toast({ title: "Expense updated", variant: "success" });
      } else {
        await expensesApi.create(payload);
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

  async function onDeleteConfirm() {
    if (!deleteTarget) return;
    const expense = deleteTarget;

    setDeletingId(expense.id);
    try {
      await expensesApi.remove(expense.id);
      toast({ title: "Expense deleted", variant: "success" });
      setDeleteTarget(null);
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
          <Button className="rounded-full" onClick={openCreate}>
            Add expense
          </Button>
        </div>
      ) : null}

      {showFilters && mode === "full" ? (
        <Card className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-1.5">
            <label
              htmlFor="filter-category"
              className="block text-sm font-medium text-foreground"
            >
              Category
            </label>
            <Select
              value={filterCategory || ALL_CATEGORIES_VALUE}
              onValueChange={(value) =>
                setFilterCategory(value === ALL_CATEGORIES_VALUE ? "" : (value ?? ""))
              }
            >
              <SelectTrigger
                id="filter-category"
                className="h-10 w-full rounded-[var(--radius-md)] bg-card px-3"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger>
                <SelectItem value={ALL_CATEGORIES_VALUE}>All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.slug} value={category.slug}>
                    {category.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="filter-direction"
              className="block text-sm font-medium text-foreground"
            >
              Type
            </label>
            <Select
              value={filterDirection || ALL_TYPES_VALUE}
              onValueChange={(value) =>
                setFilterDirection(
                  value === ALL_TYPES_VALUE || !value
                    ? ""
                    : (value as ExpenseDirection),
                )
              }
            >
              <SelectTrigger
                id="filter-direction"
                className="h-10 w-full rounded-[var(--radius-md)] bg-card px-3"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger>
                <SelectItem value={ALL_TYPES_VALUE}>All types</SelectItem>
                <SelectItem value="debit">Expense</SelectItem>
                <SelectItem value="credit">Income</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
            <Button
              className="w-full rounded-full"
              variant="secondary"
              onClick={() => void load()}
            >
              Search
            </Button>
            <Button
              variant="ghost"
              className="rounded-full"
              onClick={() => {
                setFilterCategory("");
                setFilterDirection("");
                setFrom("");
                setTo("");
              }}
            >
              Clear
            </Button>
          </div>
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
        <Card padding="none" className="overflow-hidden">
          <ul className="divide-y divide-border">
            {visibleExpenses.map((expense) => (
              <li
                key={expense.id}
                className="flex items-center gap-3 p-4 transition-colors hover:bg-muted/40 sm:gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="truncate text-sm font-medium text-foreground">
                      {expense.note || formatExpenseCategoryLine(expense)}
                    </p>
                    {expense.groupId ? (
                      <Badge tone="success" className="shrink-0">
                        Group
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {formatShortDate(expense.date)} ·{" "}
                    {formatExpenseCategoryLine(expense)}
                    {expense.currency !== defaultCurrency
                      ? ` · ${expense.currency}`
                      : null}
                  </p>
                </div>

                <p
                  className={cn(
                    "shrink-0 font-mono text-base font-semibold tracking-tight",
                    expenseDirectionAmountClass(expense.direction),
                  )}
                  title={expenseDirectionLabel(expense.direction)}
                >
                  {expense.direction === "credit" ? "+" : "−"}
                  {displayExpenseAmount(expense)}
                </p>

                {mode === "full" ? (
                  <div className="flex shrink-0 items-center gap-0.5">
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label="Edit expense"
                      onClick={() => openEdit(expense)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label="Delete expense"
                      className="text-muted-foreground hover:text-destructive"
                      loading={deletingId === expense.id}
                      onClick={() => setDeleteTarget(expense)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </Card>
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
              <Select
                value={form.currency}
                onValueChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    currency: (value ?? current.currency) as CurrencyCode,
                  }))
                }
              >
                <SelectTrigger
                  id="expense-currency"
                  className="h-10 w-full rounded-[var(--radius-md)] bg-card px-3"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger>
                  {SUPPORTED_CURRENCIES.map((option) => (
                    <SelectItem key={option.code} value={option.code}>
                      {option.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <ExpenseDirectionSelect
            value={form.direction}
            onChange={(direction) =>
              setForm((current) => ({ ...current, direction }))
            }
          />

          <ExpenseCategoryFields
            categories={categories}
            categorySlug={form.category}
            subCategory={form.subCategory}
            onCategoryChange={(category) =>
              setForm((current) => ({ ...current, category }))
            }
            onSubCategoryChange={(subCategory) =>
              setForm((current) => ({ ...current, subCategory }))
            }
          />

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
              className="rounded-full"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="rounded-full" loading={saving}>
              {editing ? "Save changes" : "Create expense"}
            </Button>
          </div>
        </form>
      </Dialog>

      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete expense?"
        description={
          deleteTarget
            ? `This ${displayExpenseAmount(deleteTarget)} ${expenseDirectionLabel(deleteTarget.direction).toLowerCase()} will be removed permanently.`
            : undefined
        }
      >
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={() => setDeleteTarget(null)}
            disabled={deletingId === deleteTarget?.id}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="rounded-full"
            loading={deletingId === deleteTarget?.id}
            onClick={() => void onDeleteConfirm()}
          >
            Delete
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
