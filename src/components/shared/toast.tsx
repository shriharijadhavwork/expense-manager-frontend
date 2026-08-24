"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { cn } from "@/utils/cn";

type ToastVariant = "default" | "success" | "error";

type ToastItem = {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  toast: (input: {
    title: string;
    description?: string;
    variant?: ToastVariant;
  }) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback(
    (input: {
      title: string;
      description?: string;
      variant?: ToastVariant;
    }) => {
      const id = crypto.randomUUID();
      const item: ToastItem = {
        id,
        title: input.title,
        variant: input.variant ?? "default",
        ...(input.description !== undefined
          ? { description: input.description }
          : {}),
      };

      setItems((current) => [...current, item]);
      window.setTimeout(() => {
        setItems((current) => current.filter((toastItem) => toastItem.id !== id));
      }, 3200);
    },
    [],
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:items-end sm:px-6"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "pointer-events-auto w-full max-w-sm rounded-[var(--radius-md)] border px-4 py-3 shadow-[var(--shadow-md)]",
              "bg-card text-card-foreground",
              item.variant === "success" && "border-success/30",
              item.variant === "error" && "border-destructive/30",
            )}
          >
            <p className="text-sm font-medium">{item.title}</p>
            {item.description ? (
              <p className="mt-1 text-sm text-muted-foreground">
                {item.description}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
