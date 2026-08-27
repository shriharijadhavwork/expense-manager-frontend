"use client";

import { toast as sonnerToast } from "sonner";

type ToastVariant = "default" | "success" | "error";

type ToastInput = {
  title: string;
  description?: string;
  variant?: ToastVariant;
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return children;
}

export function useToast() {
  return {
    toast: ({ title, description, variant = "default" }: ToastInput) => {
      const options = description ? { description } : undefined;

      if (variant === "success") {
        sonnerToast.success(title, options);
        return;
      }

      if (variant === "error") {
        sonnerToast.error(title, options);
        return;
      }

      sonnerToast(title, options);
    },
  };
}
