"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ExpenseDirection } from "@/types/api";
import { expenseDirectionLabel } from "@/utils/format";
import { cn } from "@/utils/cn";

type ExpenseDirectionSelectProps = {
  value: ExpenseDirection;
  onChange: (value: ExpenseDirection) => void;
  id?: string;
  className?: string;
};

const DIRECTION_OPTIONS: ExpenseDirection[] = ["debit", "credit"];

export function ExpenseDirectionSelect({
  value,
  onChange,
  id = "expense-direction",
  className,
}: ExpenseDirectionSelectProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        Type
      </label>
      <Select
        value={value}
        onValueChange={(nextValue) => onChange(nextValue as ExpenseDirection)}
      >
        <SelectTrigger
          id={id}
          className="h-10 w-full rounded-[var(--radius-md)] bg-card px-3"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger>
          {DIRECTION_OPTIONS.map((direction) => (
            <SelectItem key={direction} value={direction}>
              {expenseDirectionLabel(direction)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
