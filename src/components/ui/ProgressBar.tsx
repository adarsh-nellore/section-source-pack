import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { MetaLabel } from "@/components/ui/MetaLabel";

/**
 * Determinate progress bar. Source: Paper sheet · ProgressBar (node 8DY-0).
 * Soft rail + tonal fill (coral / green / gold / info). Optional title above,
 * optional percent right.
 */

export type ProgressBarTone = "coral" | "green" | "gold" | "info";

export interface ProgressBarProps {
  value: number;
  tone?: ProgressBarTone;
  /** Show percentage label to the right. */
  showValue?: boolean;
  /** Optional title above the bar. */
  label?: ReactNode;
  /** Bar height: thin (1.5px) or normal (4px). */
  size?: "thin" | "default";
  className?: string;
}

const TONE: Record<ProgressBarTone, string> = {
  coral: "bg-coral",
  green: "bg-green",
  gold:  "bg-gold",
  info:  "bg-info",
};

export function ProgressBar({
  value,
  tone = "coral",
  showValue = false,
  label,
  size = "default",
  className,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value));
  const heightClass = size === "thin" ? "h-[1.5px]" : "h-1";

  const rail = (
    <div className={cn("relative rounded-full bg-soft w-full", heightClass)}>
      <div
        className={cn("absolute top-0 left-0 rounded-full", heightClass, TONE[tone])}
        style={{ width: `${pct}%` }}
      />
    </div>
  );

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-baseline">
          {label ? <MetaLabel tone="muted">{label}</MetaLabel> : <span />}
          {showValue && (
            <span className="font-medium text-[13px] leading-[16px] text-ink">
              {Math.round(pct)}%
            </span>
          )}
        </div>
      )}
      {showValue && !label ? (
        <div className="flex items-center gap-4">
          {rail}
        </div>
      ) : (
        rail
      )}
    </div>
  );
}
