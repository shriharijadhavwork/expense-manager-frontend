"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/cn";

type PopoverProps = {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
  className?: string;
  side?: "top" | "bottom";
  align?: "start" | "center" | "end";
};

export function Popover({
  open,
  onClose,
  anchorRef,
  children,
  className,
  side = "top",
  align = "start",
}: PopoverProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({
    visibility: "hidden",
  });

  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    const anchor = anchorRef.current;
    const panel = panelRef.current;
    if (!anchor || !panel) {
      return;
    }

    const anchorRect = anchor.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const gap = 8;

    let top =
      side === "top"
        ? anchorRect.top - panelRect.height - gap
        : anchorRect.bottom + gap;

    let left = anchorRect.left;
    if (align === "center") {
      left = anchorRect.left + anchorRect.width / 2 - panelRect.width / 2;
    } else if (align === "end") {
      left = anchorRect.right - panelRect.width;
    }

    const padding = 12;
    const maxLeft = window.innerWidth - panelRect.width - padding;
    left = Math.max(padding, Math.min(left, maxLeft));
    top = Math.max(padding, top);

    setStyle({
      top,
      left,
      visibility: "visible",
    });
  }, [align, anchorRef, open, side]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        panelRef.current?.contains(target) ||
        anchorRef.current?.contains(target)
      ) {
        return;
      }

      onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [anchorRef, onClose, open]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      ref={panelRef}
      role="menu"
      style={style}
      className={cn(
        "fixed z-[100] min-w-[15rem] overflow-visible rounded-[var(--radius-lg)] border border-border bg-card p-1.5 shadow-[var(--shadow-md)]",
        className,
      )}
    >
      {children}
    </div>,
    document.body,
  );
}

type PopoverItemProps = {
  icon?: React.ReactNode;
  label: string;
  hint?: string;
  destructive?: boolean;
  active?: boolean;
  onClick?: () => void;
  href?: string;
  trailing?: React.ReactNode;
};

export function PopoverItem({
  icon,
  label,
  hint,
  destructive = false,
  active = false,
  onClick,
  href,
  trailing,
}: PopoverItemProps) {
  const className = cn(
    "flex w-full cursor-pointer items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-left text-sm transition-colors",
    destructive
      ? "text-destructive hover:bg-destructive/10"
      : active
        ? "bg-muted text-foreground"
        : "text-foreground hover:bg-muted",
  );

  const content = (
    <>
      {icon ? (
        <span className="flex h-4 w-4 shrink-0 items-center justify-center text-muted-foreground">
          {icon}
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block font-medium">{label}</span>
        {hint ? (
          <span className="block text-xs text-muted-foreground">{hint}</span>
        ) : null}
      </span>
      {trailing ? (
        <span className="shrink-0 text-muted-foreground">{trailing}</span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={className} onClick={onClick}>
      {content}
    </button>
  );
}

export function PopoverDivider() {
  return <div className="my-1.5 border-t border-border" />;
}

export function PopoverHeader({
  name,
  subtitle,
  onClick,
}: {
  name: string;
  subtitle: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full cursor-pointer items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-left transition-colors hover:bg-muted"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{name}</p>
        <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <ChevronRightSmall />
    </button>
  );
}

function ChevronRightSmall() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0 text-muted-foreground"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

type PopoverSubmenuProps = {
  icon?: React.ReactNode;
  label: string;
  hint?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trailing?: React.ReactNode;
  submenuClassName?: string;
  children: React.ReactNode;
};

export function PopoverSubmenu({
  icon,
  label,
  hint,
  open,
  onOpenChange,
  trailing,
  submenuClassName,
  children,
}: PopoverSubmenuProps) {
  const closeTimerRef = useRef<number | null>(null);

  function clearCloseTimer() {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

  function scheduleClose() {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      onOpenChange(false);
    }, 120);
  }

  function handleEnter() {
    clearCloseTimer();
    onOpenChange(true);
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={scheduleClose}
    >
      <PopoverItem
        icon={icon}
        label={label}
        hint={hint}
        active={open}
        trailing={trailing ?? <ChevronRightSmall />}
        onClick={() => onOpenChange(!open)}
      />

      {open ? (
        <div
          role="menu"
          className={cn(
            "absolute left-[calc(100%+0.35rem)] top-0 z-[110] min-w-[10.5rem] overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card p-1.5 shadow-[var(--shadow-md)]",
            submenuClassName,
          )}
          onMouseEnter={handleEnter}
          onMouseLeave={scheduleClose}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

type PopoverOptionProps = {
  label: string;
  selected?: boolean;
  onClick?: () => void;
};

export function PopoverOption({
  label,
  selected = false,
  onClick,
}: PopoverOptionProps) {
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={selected}
      onClick={onClick}
      className={cn(
        "flex w-full cursor-pointer items-center justify-between gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-left text-sm transition-colors",
        selected ? "bg-muted font-medium text-foreground" : "hover:bg-muted",
      )}
    >
      <span>{label}</span>
      {selected ? (
        <CheckIconSmall />
      ) : (
        <span className="h-4 w-4 shrink-0" aria-hidden />
      )}
    </button>
  );
}

function CheckIconSmall() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0 text-foreground"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
