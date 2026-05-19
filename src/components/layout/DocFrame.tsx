import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Document canvas. Source: Paper sheet · DocFrame (node 6OX-0).
 * Slots for TabBar (rendered above) + scrollable content area.
 * Renders inside AppShell main slot or anywhere a paneled doc is needed.
 */

export interface DocFrameProps {
  tabBar?: ReactNode;
  children?: ReactNode;
  bordered?: boolean;
  /** Inner padding for the scroll area. */
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
}

const PADDING: Record<NonNullable<DocFrameProps["padding"]>, string> = {
  none: "",
  sm: "px-6 py-6",
  md: "px-10 py-8",
  lg: "px-12 py-10",
};

export function DocFrame({
  tabBar,
  children,
  bordered = false,
  padding = "md",
  className,
}: DocFrameProps) {
  return (
    <div
      className={cn(
        "flex flex-col flex-1 min-w-0 min-h-0 bg-paper overflow-hidden",
        bordered && "border border-hairline-strong rounded-card",
        className
      )}
    >
      {tabBar}
      <div className={cn("flex-1 min-h-0 overflow-y-auto scroll-tame", PADDING[padding])}>
        {children}
      </div>
    </div>
  );
}
