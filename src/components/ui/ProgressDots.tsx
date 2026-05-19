import { cn } from "@/lib/cn";

/**
 * Step-progress indicator. Done = coral fill, current = coral with halo,
 * upcoming = hairline-strong outline.
 * Source: Paper sheet · ProgressDots (node 5K6-0). Walkthrough origin:
 * ClarifyCard Q1/Q2/Q3 dots (multiple Clarify Q3/3 frames).
 */

export interface ProgressDotsProps {
  total: number;
  current: number; // 1-indexed
  connector?: boolean;
  className?: string;
}

export function ProgressDots({
  total,
  current,
  connector = true,
  className,
}: ProgressDotsProps) {
  const items: React.ReactNode[] = [];

  for (let i = 1; i <= total; i++) {
    const state =
      i < current ? "done" : i === current ? "current" : "upcoming";

    items.push(
      <span
        key={`dot-${i}`}
        aria-current={state === "current" ? "step" : undefined}
        className={cn(
          state === "current" && "size-2 rounded-full bg-coral ring-[3px] ring-coral-soft",
          state === "done" && "size-1.5 rounded-full bg-coral",
          state === "upcoming" && "size-1.5 rounded-full border border-hairline-strong"
        )}
      />
    );

    if (connector && i < total) {
      items.push(
        <span
          key={`con-${i}`}
          className="w-6 h-px bg-hairline-strong"
        />
      );
    }
  }

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      {items}
    </div>
  );
}
