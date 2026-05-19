"use client";

import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { IconButton } from "@/components/ui/IconButton";
import { Glyph } from "@/components/ui/Glyph";

/**
 * Edge-anchored overlay panel. Source: Paper sheet · Drawer (node 8FI-0).
 * Slide-in from right (or left). Backdrop scrim (bg-ink/20 backdrop-blur-sm)
 * dismisses on click; Esc key also closes. Header slot · scrollable body
 * (scroll-tame) · sticky footer slot. Three sizes (sm 320, md 400, lg 480).
 * Note: consumer manages `open` state; this component renders only when open.
 */

export type DrawerSide = "right" | "left";
export type DrawerSize = "sm" | "md" | "lg";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: DrawerSide;
  size?: DrawerSize;
  /** Header content (typically a title + close button). */
  header?: ReactNode;
  /** Footer content (typically primary + secondary actions). */
  footer?: ReactNode;
  /** Drawer body. */
  children?: ReactNode;
  /** Optional accessible label (defaults to "Drawer"). */
  "aria-label"?: string;
  className?: string;
}

const SIZE: Record<DrawerSize, string> = {
  sm: "w-[320px]",
  md: "w-[400px]",
  lg: "w-[480px]",
};

const SIDE: Record<DrawerSide, string> = {
  right: "right-0 border-l border-hairline-strong",
  left:  "left-0  border-r border-hairline-strong",
};

export function Drawer({
  open,
  onClose,
  side = "right",
  size = "md",
  header,
  footer,
  children,
  "aria-label": ariaLabel = "Drawer",
  className,
}: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-ink/20 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={cn(
          "absolute top-0 h-full flex flex-col bg-paper shadow-pop",
          SIDE[side],
          SIZE[size],
          className
        )}
      >
        <div className="shrink-0 px-6 py-4 border-b border-hairline">
          {header ?? (
            <div className="flex items-center justify-end">
              <IconButton variant="ghost" size="md" onClick={onClose} aria-label="Close">
                <Glyph name="x" size={14} strokeWidth={2.5} />
              </IconButton>
            </div>
          )}
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto scroll-tame px-6 py-4">
          {children}
        </div>
        {footer && (
          <div className="shrink-0 px-6 py-3 border-t border-hairline">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
