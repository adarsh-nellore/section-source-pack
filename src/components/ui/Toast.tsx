"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Glyph } from "@/components/ui/Glyph";

/**
 * Transient notification.
 * Source: Paper sheet · Toast (node 60N-0). Slides in from corner, auto-dismisses.
 * Glyph icon + title + optional body + optional close + optional action.
 */

export type ToastTone = "success" | "warning" | "danger" | "info";

export interface ToastProps {
  tone?: ToastTone;
  title: ReactNode;
  body?: ReactNode;
  action?: ReactNode;
  onClose?: () => void;
  className?: string;
}

const ICON_BG: Record<ToastTone, string> = {
  success: "bg-green-soft text-green",
  warning: "bg-gold-soft text-gold",
  danger:  "bg-coral-soft text-coral",
  info:    "bg-soft text-info",
};

const ICON_NAME: Record<ToastTone, Parameters<typeof Glyph>[0]["name"]> = {
  success: "check",
  warning: "more", // placeholder for warning glyph; uses more dots horizontally
  danger:  "x",
  info:    "more",
};

export function Toast({
  tone = "info",
  title,
  body,
  action,
  onClose,
  className,
}: ToastProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex items-start gap-3 w-[420px] py-3.5 px-4 bg-paper border border-hairline-strong rounded-card shadow-modal",
        className
      )}
    >
      <span
        className={cn(
          "inline-flex items-center justify-center shrink-0 size-6 rounded-full",
          ICON_BG[tone]
        )}
      >
        <Glyph name={ICON_NAME[tone]} size={14} strokeWidth={tone === "success" ? 3 : 2.5} />
      </span>
      <div className="flex-1 flex flex-col gap-0.5">
        <div className="font-sans font-semibold text-[13.5px] leading-[18px] text-ink">
          {title}
        </div>
        {body && (
          <div className="text-[13px] leading-[18px] text-muted">{body}</div>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className="shrink-0 inline-flex items-center justify-center size-5 rounded-sm text-faint hover:text-ink hover:bg-soft"
        >
          <Glyph name="x" size={12} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}
