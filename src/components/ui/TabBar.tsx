import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Container for Tab elements. Source: Paper sheet · Tab + TabBar (node 68O-0).
 * 48px tall tray with bottom hairline. Trailing slot for actions (open / map / split).
 */

export interface TabBarProps {
  children: ReactNode;
  trailing?: ReactNode;
  className?: string;
}

export function TabBar({ children, trailing, className }: TabBarProps) {
  return (
    <div
      className={cn(
        "flex items-end h-12 w-full px-4 gap-1 bg-paper border-b border-hairline",
        className
      )}
    >
      {children}
      {trailing && <div className="ml-auto self-center flex items-center gap-1">{trailing}</div>}
    </div>
  );
}
