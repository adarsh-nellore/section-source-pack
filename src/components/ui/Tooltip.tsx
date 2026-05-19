"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { KeyChip } from "@/components/ui/KeyChip";

/**
 * Hover-reveal popover. Source: Paper sheet · Tooltip (node 68T-0).
 * Two variants: dark (ink surface, short hints) and glass (.glass-card, richer content).
 * Pure CSS open/close based on hover/focus state of the trigger.
 */

export type TooltipVariant = "dark" | "glass";
export type TooltipPlacement = "top" | "bottom" | "right" | "left";

export interface TooltipProps {
  children: ReactNode; // trigger
  content: ReactNode;
  shortcut?: ReactNode[];
  variant?: TooltipVariant;
  placement?: TooltipPlacement;
  className?: string;
}

const PLACEMENT: Record<TooltipPlacement, string> = {
  top:    "bottom-full left-1/2 -translate-x-1/2 mb-1.5",
  bottom: "top-full    left-1/2 -translate-x-1/2 mt-1.5",
  right:  "left-full   top-1/2 -translate-y-1/2 ml-1.5",
  left:   "right-full  top-1/2 -translate-y-1/2 mr-1.5",
};

export function Tooltip({
  children,
  content,
  shortcut,
  variant = "dark",
  placement = "top",
  className,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  return (
    <span
      className="relative inline-flex"
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          className={cn(
            "absolute z-40 whitespace-nowrap inline-flex items-center gap-2 pointer-events-none",
            variant === "dark"
              ? "bg-ink text-white py-1.5 px-2.5 rounded-md text-[12.5px] leading-4"
              : "glass-card py-2.5 px-3 rounded-lg text-[13px] leading-[19px] text-ink max-w-[340px] whitespace-normal",
            PLACEMENT[placement],
            className
          )}
        >
          <span>{content}</span>
          {shortcut && variant === "dark" && (
            <KeyChip keys={shortcut} size="sm" className="[&>span]:!border-muted [&_span]:!bg-muted [&_span]:!text-white" />
          )}
        </span>
      )}
    </span>
  );
}
