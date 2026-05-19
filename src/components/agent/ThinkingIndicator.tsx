import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Three pulsing dots. Source: Paper sheet · ThinkingIndicator (node 6WT-0).
 * Renders while the agent is in the "thinking" state before tokens stream.
 * Animation: 0.6s cycle with staggered delays.
 */

export type ThinkingIndicatorTone = "muted" | "accent";
export type ThinkingIndicatorSize = "sm" | "md";

export interface ThinkingIndicatorProps {
  tone?: ThinkingIndicatorTone;
  size?: ThinkingIndicatorSize;
  label?: ReactNode;
  className?: string;
}

const DOT_COLOR: Record<ThinkingIndicatorTone, string> = {
  muted:  "bg-muted",
  accent: "bg-coral",
};

const DOT_SIZE: Record<ThinkingIndicatorSize, string> = {
  sm: "w-1 h-1",
  md: "w-1.5 h-1.5",
};

export function ThinkingIndicator({
  tone = "muted",
  size = "md",
  label,
  className,
}: ThinkingIndicatorProps) {
  const dot = cn("rounded-full", DOT_SIZE[size], DOT_COLOR[tone]);
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      {label && (
        <span className="font-sans italic text-[13px] text-muted">{label}</span>
      )}
      <span className="inline-flex items-center gap-1">
        <span className={cn(dot, "animate-pulse")} style={{ animationDelay: "0ms" }} />
        <span className={cn(dot, "animate-pulse")} style={{ animationDelay: "150ms" }} />
        <span className={cn(dot, "animate-pulse")} style={{ animationDelay: "300ms" }} />
      </span>
    </span>
  );
}
