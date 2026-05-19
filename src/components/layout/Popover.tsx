"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Anchored floating panel. Source: Paper sheet · Popover (node 8UI-0).
 * Richer than Tooltip, smaller than Modal. Four cardinal placements with a
 * directional arrow. Click trigger closes on outside click or Esc; hover
 * trigger opens on pointerenter/focus and closes on pointerleave/blur.
 */

export type PopoverPlacement = "top" | "right" | "bottom" | "left";
export type PopoverTrigger = "hover" | "click";

export interface PopoverProps {
  /** The element that triggers the popover. */
  trigger: ReactNode;
  /** The popover content. */
  children: ReactNode;
  placement?: PopoverPlacement;
  triggerType?: PopoverTrigger;
  /** Show an arrow pointing at the trigger. */
  showArrow?: boolean;
  /** Optional accessible label. */
  "aria-label"?: string;
  className?: string;
}

const PLACEMENT: Record<PopoverPlacement, string> = {
  top:    "absolute bottom-full left-1/2 -translate-x-1/2 mb-2",
  right:  "absolute left-full   top-1/2  -translate-y-1/2 ml-2",
  bottom: "absolute top-full    left-1/2 -translate-x-1/2 mt-2",
  left:   "absolute right-full  top-1/2  -translate-y-1/2 mr-2",
};

// Arrow is a rotated square; we position it so the unbordered corner points
// at the trigger. Each placement reveals two adjacent borders.
const ARROW: Record<PopoverPlacement, string> = {
  // popover above trigger -> arrow sits at bottom edge of card, points down
  top:    "absolute top-full   left-1/2 -translate-x-1/2 -translate-y-1/2 size-2 rotate-45 bg-paper border-r border-b border-hairline-strong",
  // popover right of trigger -> arrow sits on left edge of card, points left
  right:  "absolute right-full top-1/2  -translate-y-1/2  translate-x-1/2 size-2 rotate-45 bg-paper border-l border-b border-hairline-strong",
  // popover below trigger -> arrow sits at top edge of card, points up
  bottom: "absolute bottom-full left-1/2 -translate-x-1/2 translate-y-1/2 size-2 rotate-45 bg-paper border-l border-t border-hairline-strong",
  // popover left of trigger -> arrow sits on right edge of card, points right
  left:   "absolute left-full  top-1/2  -translate-y-1/2 -translate-x-1/2 size-2 rotate-45 bg-paper border-r border-t border-hairline-strong",
};

export function Popover({
  trigger,
  children,
  placement = "bottom",
  triggerType = "click",
  showArrow = true,
  "aria-label": ariaLabel,
  className,
}: PopoverProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!open || triggerType !== "click") return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, triggerType]);

  const hoverHandlers =
    triggerType === "hover"
      ? {
          onPointerEnter: () => setOpen(true),
          onPointerLeave: () => setOpen(false),
          onFocus: () => setOpen(true),
          onBlur: () => setOpen(false),
        }
      : {};

  const clickHandlers =
    triggerType === "click"
      ? { onClick: () => setOpen((v) => !v) }
      : {};

  return (
    <span ref={wrapRef} className="relative inline-flex" {...hoverHandlers}>
      <span className="inline-flex" {...clickHandlers}>
        {trigger}
      </span>
      {open && (
        <span
          role="dialog"
          aria-label={ariaLabel}
          className={cn(
            "z-40 w-72 bg-paper rounded-lg border border-hairline-strong shadow-pop p-4",
            PLACEMENT[placement],
            className
          )}
        >
          {showArrow && <span className={ARROW[placement]} aria-hidden="true" />}
          {children}
        </span>
      )}
    </span>
  );
}
