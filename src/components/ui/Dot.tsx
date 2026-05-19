import { cn } from "@/lib/cn";

/**
 * Status indicator dot.
 * Source: Paper sheet · Dot (node 5K5-0). Walkthrough origin: TopNav green
 * save dot (I-0), MessageBubble agent dot, ProgressDots step.
 */

export type DotColor = "coral" | "green" | "gold" | "info" | "muted";
export type DotSize = "sm" | "md" | "lg";

export interface DotProps {
  color?: DotColor;
  size?: DotSize;
  pulse?: boolean;
  className?: string;
}

const COLOR: Record<DotColor, string> = {
  coral:  "bg-coral",
  green:  "bg-green",
  gold:   "bg-gold",
  info:   "bg-info",
  muted:  "bg-faint",
};

const SIZE: Record<DotSize, string> = {
  // Paper: 1.5 / 2 / 2.5 in our scale = 6 / 8 / 10 px
  sm: "size-1.5",
  md: "size-2",
  lg: "size-2.5",
};

export function Dot({
  color = "green",
  size = "sm",
  pulse = false,
  className,
}: DotProps) {
  return (
    <span
      className={cn(
        "inline-block shrink-0 rounded-full",
        COLOR[color],
        SIZE[size],
        pulse && "animate-pulse",
        className
      )}
    />
  );
}
