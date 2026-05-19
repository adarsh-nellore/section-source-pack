import { cn } from "@/lib/cn";

/**
 * Blinking caret rendered at the end of streaming text.
 * Source: Paper sheet · StreamingCursor (node 6WU-0).
 * Variants: inline (2px coral bar, default) or block (8×12 ink, terminal feel).
 */

export type StreamingCursorVariant = "inline" | "block";

export interface StreamingCursorProps {
  variant?: StreamingCursorVariant;
  className?: string;
}

export function StreamingCursor({
  variant = "inline",
  className,
}: StreamingCursorProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block align-text-bottom animate-pulse",
        variant === "inline"
          ? "w-0.5 h-[1em] bg-coral ml-0.5"
          : "w-2 h-[0.85em] bg-ink ml-0.5",
        className
      )}
    />
  );
}
