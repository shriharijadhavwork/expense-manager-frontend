"use client";

import type { CSSProperties } from "react";
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

import { useTheme } from "@/lib/theme/theme-provider";

function Toaster({ ...props }: ToasterProps) {
  const { resolvedTheme } = useTheme();

  return (
    <Sonner
      theme={resolvedTheme}
      className="toaster group"
      duration={3200}
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--card)",
          "--normal-text": "var(--card-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius-md)",
        } as CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "rounded-[var(--radius-md)] border bg-card text-card-foreground shadow-[var(--shadow-md)]",
          title: "text-sm font-medium",
          description: "text-sm text-muted-foreground",
          success: "border-success/30",
          error: "border-destructive/30",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
