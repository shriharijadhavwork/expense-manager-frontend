"use client";

import {
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";

import { cn } from "@/lib/utils";

function TooltipProvider({
  delay = 120,
  ...props
}: TooltipPrimitive.Provider.Props) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delay}
      {...props}
    />
  );
}

function TooltipRoot({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  side = "top",
  sideOffset = 6,
  align = "center",
  alignOffset = 0,
  children,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<
    TooltipPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-[110]"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            "pointer-events-none max-w-[14rem] rounded-md bg-foreground px-2 py-1 text-[11px] font-medium leading-snug text-background shadow-md",
            "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
            "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className,
          )}
          {...props}
        >
          {children}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

type LegacyTooltipProps = {
  content: string;
  children: ReactElement;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  disabled?: boolean;
  className?: string;
};

function Tooltip({
  content,
  children,
  side = "top",
  align = "center",
  disabled = false,
  className,
}: LegacyTooltipProps) {
  if (!isValidElement(children)) {
    return children as ReactNode;
  }

  if (disabled || !content.trim()) {
    return children;
  }

  return (
    <TooltipRoot>
      <TooltipTrigger render={children} className="cursor-default" />
      <TooltipContent side={side} align={align} className={className}>
        {content}
      </TooltipContent>
    </TooltipRoot>
  );
}

export {
  Tooltip,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
};
