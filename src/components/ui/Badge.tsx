import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Small uppercase mono label.
 * Source: Paper sheet · Badge (node 5K4-0). Walkthrough origin: KindBadge "md" (R-0).
 *   rounded-[3px] py-0.5 px-1 bg-soft font-mono font-bold text-muted text-[9px]/12
 *
 * Speculative: tone="info" is net-new (no Paper precedent).
 */

export type BadgeTone =
  | "neutral"   // bg-soft   text-muted   — default (matches Paper KindBadge)
  | "muted"     // bg-stripe text-faint
  | "accent"    // bg-coral-soft text-coral
  | "success"   // bg-green-soft text-green
  | "warning"   // bg-gold-soft text-gold
  | "danger"    // bg-coral-soft text-coral
  | "info";

export type BadgeSize = "sm" | "md";

export interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  size?: BadgeSize;
  uppercase?: boolean;
  className?: string;
}

const TONE: Record<BadgeTone, string> = {
  neutral: "bg-soft text-muted",
  muted:   "bg-stripe text-faint",
  accent:  "bg-coral-soft text-coral",
  success: "bg-green-soft text-green",
  warning: "bg-gold-soft text-gold",
  danger:  "bg-coral-soft text-coral",
  info:    "bg-soft text-info",
};

const SIZE: Record<BadgeSize, string> = {
  // Paper values: py-0.5 (2px) px-1 (4px) text-[9px]/3 (lh 12px)
  sm: "py-0.5 px-1 text-[9px] leading-[12px]",
  md: "py-0.75 px-1.5 text-[10px] leading-[13px]",
};

export function Badge({
  children,
  tone = "neutral",
  size = "sm",
  uppercase = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-xs font-mono font-bold",
        TONE[tone],
        SIZE[size],
        uppercase && "uppercase tracking-caps",
        className
      )}
    >
      {children}
    </span>
  );
}
