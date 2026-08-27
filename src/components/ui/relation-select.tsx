"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { USER_RELATION_OPTIONS, type UserRelation } from "@/constants/relation";
import { cn } from "@/utils/cn";

type RelationSelectProps = {
  value: UserRelation;
  onChange: (value: UserRelation) => void;
  label?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
};

export function RelationSelect({
  value,
  onChange,
  label = "Relation",
  disabled = false,
  id = "relation",
  className,
}: RelationSelectProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <Select
        value={value}
        onValueChange={(nextValue) => onChange(nextValue as UserRelation)}
        disabled={disabled}
      >
        <SelectTrigger
          id={id}
          className="h-10 w-full rounded-[var(--radius-md)] bg-card px-3"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger>
          {USER_RELATION_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
