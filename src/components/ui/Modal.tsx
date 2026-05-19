"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { IconButton } from "@/components/ui/IconButton";
import { Glyph } from "@/components/ui/Glyph";

/**
 * Overlay dialog. Source: Paper sheet · Modal (node 60Q-0).
 * Centered Card on a 50% black scrim. Composes title row, body, optional
 * footer with action buttons. Three sizes (sm 360, md 480, lg 640).
 * Note: consumer manages `open` state; this component renders only when open.
 */

export type ModalSize = "sm" | "md" | "lg";

export interface ModalProps {
  open: boolean;
  title?: ReactNode;
  description?: ReactNode;
  size?: ModalSize;
  onClose?: () => void;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
}

const SIZE: Record<ModalSize, string> = {
  sm: "w-[360px]",
  md: "w-[480px]",
  lg: "w-[640px]",
};

export function Modal({
  open,
  title,
  description,
  size = "md",
  onClose,
  footer,
  children,
  className,
}: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-ink/30">
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "flex flex-col bg-paper border border-hairline-strong rounded-card shadow-modal overflow-hidden",
          SIZE[size],
          className
        )}
      >
        {(title || onClose) && (
          <div className="flex items-start justify-between gap-4 py-3.5 px-5 border-b border-hairline">
            <div className="flex flex-col gap-0.5 min-w-0">
              {title && (
                <div className="font-sans font-semibold text-[15px] leading-[22px] text-ink">
                  {title}
                </div>
              )}
              {description && (
                <div className="text-[13px] leading-[18px] text-muted">
                  {description}
                </div>
              )}
            </div>
            {onClose && (
              <IconButton variant="ghost" size="md" onClick={onClose} aria-label="Close">
                <Glyph name="x" size={14} strokeWidth={2.5} />
              </IconButton>
            )}
          </div>
        )}
        <div className="py-4 px-5">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2 py-3 px-5 border-t border-hairline bg-stripe">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
