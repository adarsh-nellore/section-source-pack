import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Right-anchored panel rail. Source: Paper sheet · RightRail (node 6OW-0).
 * Header slot · scrollable body (scroll-tame) · sticky footer slot.
 * Width is consumer-controlled (typically via AppShell's `rightRailWidth`
 * prop, default 340px).
 */

export interface RightRailProps {
  header?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function RightRail({
  header,
  footer,
  children,
  className,
}: RightRailProps) {
  return (
    <div
      className={cn(
        "flex flex-col h-full w-full bg-paper",
        className
      )}
    >
      {header && (
        <div className="shrink-0 px-4 pt-4">
          {header}
          <div className="hairline-fade mt-3" />
        </div>
      )}
      <div className="flex-1 min-h-0 overflow-y-auto scroll-tame px-4 py-4">{children}</div>
      {footer && (
        <div className="shrink-0">
          <div className="hairline-fade" />
          <div className="px-4 py-3">{footer}</div>
        </div>
      )}
    </div>
  );
}
