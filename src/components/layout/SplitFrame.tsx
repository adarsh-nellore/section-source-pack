import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Two-column split. Source: Paper sheet · SplitFrame (node 6OY-0).
 * Each side hosts a DocFrame or arbitrary panel. Vertical hairline divider.
 * Optional `ratio` skews the split (default 50/50).
 */

export interface SplitFrameProps {
  left: ReactNode;
  right: ReactNode;
  /** Left flex weight; right is always 1. e.g. 1 = 50/50, 1.5 = 60/40. */
  ratio?: number;
  bordered?: boolean;
  className?: string;
}

export function SplitFrame({
  left,
  right,
  ratio = 1,
  bordered = false,
  className,
}: SplitFrameProps) {
  return (
    <div
      className={cn(
        "flex flex-1 min-w-0 min-h-0 bg-paper",
        bordered && "border border-hairline-strong rounded-card overflow-hidden",
        className
      )}
    >
      <div className="flex flex-col min-w-0" style={{ flex: ratio }}>
        {left}
      </div>
      <div className="w-px self-stretch bg-hairline-strong" />
      <div className="flex flex-col min-w-0" style={{ flex: 1 }}>
        {right}
      </div>
    </div>
  );
}
