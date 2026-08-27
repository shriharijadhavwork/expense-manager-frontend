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
      <select
        id={id}
        value={value}
        disabled={disabled}
        required
        onChange={(event) => onChange(event.target.value as UserRelation)}
        className={cn(
          "h-10 w-full rounded-[var(--radius-md)] border border-input bg-card px-3 text-sm text-foreground",
          "transition-colors hover:border-foreground/20",
          "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        {USER_RELATION_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
