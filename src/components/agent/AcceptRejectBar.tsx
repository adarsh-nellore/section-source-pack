"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Glyph } from "@/components/ui/Glyph";

/**
 * Sticky bottom bar for AI-output actions. Source: Paper sheet · AcceptRejectBar (node 75W-0).
 * Variants: default (floating glass-card surface) · inverted (dark, compact selection toolbar).
 */

export type AcceptRejectBarVariant = "default" | "inverted";

export interface AcceptRejectBarProps {
  variant?: AcceptRejectBarVariant;
  iteration?: { current: number; total: number };
  label?: ReactNode;
  onAccept?: () => void;
  onReject?: () => void;
  onRegenerate?: () => void;
  acceptLabel?: ReactNode;
  className?: string;
}

export function AcceptRejectBar({
  variant = "default",
  iteration,
  label,
  onAccept,
  onReject,
  onRegenerate,
  acceptLabel = "Accept",
  className,
}: AcceptRejectBarProps) {
  if (variant === "inverted") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 py-2 px-2.5 bg-ink rounded-input shadow-modal",
          className
        )}
      >
        {label && <span className="font-mono text-[11px] text-faint">{label}</span>}
        {onRegenerate && (
          <button
            type="button"
            onClick={onRegenerate}
            aria-label="Regenerate"
            className="inline-flex items-center justify-center size-6 rounded-sm text-white hover:bg-white/10"
          >
            <Glyph name="more" size={13} strokeWidth={2} className="rotate-180" />
          </button>
        )}
        {onReject && (
          <button
            type="button"
            onClick={onReject}
            aria-label="Reject"
            className="inline-flex items-center justify-center size-6 rounded-sm text-white hover:bg-white/10"
          >
            <Glyph name="x" size={12} strokeWidth={2.5} />
          </button>
        )}
        {onAccept && (
          <button
            type="button"
            onClick={onAccept}
            className="inline-flex items-center gap-1 py-1 px-2.5 bg-coral rounded-sm font-sans font-medium text-[12px] text-white"
          >
            <Glyph name="check" size={11} strokeWidth={3} />
            {acceptLabel}
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 py-2.5 px-3.5 glass-card rounded-card",
        className
      )}
    >
      {iteration && (
        <span className="font-mono text-[11px] text-muted">
          iteration {iteration.current} of {iteration.total}
        </span>
      )}
      <span className="flex-1" />
      {onRegenerate && (
        <button
          type="button"
          onClick={onRegenerate}
          className="inline-flex items-center gap-1.5 py-1.5 px-2.5 bg-transparent border border-hairline-strong rounded-sm font-sans font-medium text-[12.5px] text-muted hover:bg-stripe"
        >
          <Glyph name="more" size={13} strokeWidth={2} className="rotate-180" />
          Regenerate
        </button>
      )}
      {onReject && (
        <button
          type="button"
          onClick={onReject}
          aria-label="Reject"
          className="inline-flex items-center justify-center size-8 bg-paper border border-hairline-strong rounded-sm text-muted hover:bg-stripe"
        >
          <Glyph name="x" size={14} strokeWidth={2.5} />
        </button>
      )}
      {onAccept && (
        <button
          type="button"
          onClick={onAccept}
          className="inline-flex items-center gap-1.5 py-2 px-3.5 bg-coral rounded-sm font-sans font-medium text-[13px] text-white hover:bg-coral/90"
        >
          <Glyph name="check" size={14} strokeWidth={2.5} />
          {acceptLabel}
        </button>
      )}
    </div>
  );
}
