"use client";

import * as React from "react";
import { useRef } from "react";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";

import { cn } from "@/lib/utils";

function PopoverRoot({ ...props }: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverContent({
  className,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  anchor,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<
    PopoverPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "anchor"
  >) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        anchor={anchor}
        className="isolate z-50"
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={cn(
            "z-50 flex w-72 origin-(--transform-origin) flex-col gap-2.5 rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className,
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

type LegacyPopoverProps = {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
  className?: string;
  side?: "top" | "bottom";
  align?: "start" | "center" | "end";
};

function Popover({
  open,
  onClose,
  anchorRef,
  children,
  className,
  side = "top",
  align = "start",
}: LegacyPopoverProps) {
  return (
    <PopoverRoot
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <PopoverContent
        anchor={anchorRef}
        side={side}
        align={align}
        sideOffset={8}
        className={cn(
          "min-w-[15rem] overflow-visible rounded-[var(--radius-lg)] border border-border bg-card p-1.5 shadow-[var(--shadow-md)] ring-0",
          className,
        )}
        role="menu"
      >
        {children}
      </PopoverContent>
    </PopoverRoot>
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

function PopoverItem({
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

function PopoverDivider() {
  return <div className="my-1.5 border-t border-border" />;
}

function PopoverHeader({
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

function PopoverSubmenu({
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

function PopoverOption({
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

export {
  Popover,
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverItem,
  PopoverDivider,
  PopoverHeader,
  PopoverSubmenu,
  PopoverOption,
};
