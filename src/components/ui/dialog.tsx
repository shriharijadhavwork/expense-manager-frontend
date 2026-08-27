"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { XIcon } from "@/components/ui/icons";

function DialogRoot({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-[100] bg-[var(--overlay)] data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className,
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean;
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "fixed z-[101] grid w-full max-w-lg gap-4 rounded-t-[var(--radius-lg)] border border-border bg-card p-5 text-sm text-card-foreground shadow-[var(--shadow-md)] outline-none sm:rounded-[var(--radius-lg)] sm:p-6",
          "bottom-0 left-1/2 max-h-[min(92dvh,920px)] -translate-x-1/2 overflow-y-auto",
          "sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2",
          "data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-bottom-4 sm:data-open:slide-in-from-bottom-0 sm:data-open:zoom-in-95",
          "data-closed:animate-out data-closed:fade-out-0 data-closed:slide-out-to-bottom-4 sm:data-closed:slide-out-to-bottom-0 sm:data-closed:zoom-out-95",
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton ? (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 h-8 w-8 px-0"
              />
            }
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-1.5 pr-8", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

type LegacyDialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  className,
}: LegacyDialogProps) {
  return (
    <DialogRoot
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className={className} showCloseButton={false}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <DialogHeader className="pr-0">
            <DialogTitle>{title}</DialogTitle>
            {description ? (
              <DialogDescription>{description}</DialogDescription>
            ) : null}
          </DialogHeader>
          <DialogClose
            render={
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 shrink-0 px-0"
                aria-label="Close"
              />
            }
          >
            <XIcon />
          </DialogClose>
        </div>
        {children}
      </DialogContent>
    </DialogRoot>
  );
}

export {
  Dialog,
  DialogRoot,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
