"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ExpenseCategoryOption } from "@/types/api";
import { cn } from "@/utils/cn";

type ExpenseCategoryFieldsProps = {
  categories: ExpenseCategoryOption[];
  categorySlug: string;
  subCategory: string;
  onCategoryChange: (slug: string) => void;
  onSubCategoryChange: (value: string) => void;
  categoryId?: string;
  subCategoryId?: string;
  className?: string;
};

export function ExpenseCategoryFields({
  categories,
  categorySlug,
  subCategory,
  onCategoryChange,
  onSubCategoryChange,
  categoryId = "expense-category",
  subCategoryId = "expense-subcategory",
  className,
}: ExpenseCategoryFieldsProps) {
  const selected = categories.find((item) => item.slug === categorySlug);
  const suggestions = selected?.subCategorySuggestions ?? [];

  return (
    <div className={cn("grid gap-4 sm:grid-cols-2", className)}>
      <div className="space-y-1.5">
        <label htmlFor={categoryId} className="block text-sm font-medium text-foreground">
          Category
        </label>
        <Select
          value={categorySlug || null}
          onValueChange={(value) => onCategoryChange(value ?? "")}
        >
          <SelectTrigger
            id={categoryId}
            className="h-10 w-full rounded-[var(--radius-md)] bg-card px-3"
          >
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger>
            {categories.map((category) => (
              <SelectItem key={category.slug} value={category.slug}>
                {category.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Input
        id={subCategoryId}
        label="Sub-category"
        name="subCategory"
        list={suggestions.length > 0 ? `${subCategoryId}-suggestions` : undefined}
        placeholder="e.g. Snacks, WiFi Recharge"
        value={subCategory}
        onChange={(event) => onSubCategoryChange(event.target.value)}
      />
      {suggestions.length > 0 ? (
        <datalist id={`${subCategoryId}-suggestions`}>
          {suggestions.map((item) => (
            <option key={item} value={item} />
          ))}
        </datalist>
      ) : null}
    </div>
  );
}
