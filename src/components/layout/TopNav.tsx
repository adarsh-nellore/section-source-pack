import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Top chrome bar. Source: Paper sheet · TopNav (node 6OU-0). 56px tall.
 * Slot-based: brand · breadcrumb · trailing (search/actions/status/avatar).
 * Brand defaults render Peer-ish mark; pass custom children to replace.
 */

export interface TopNavProps {
  brand?: ReactNode;
  breadcrumb?: ReactNode;
  trailing?: ReactNode;
  className?: string;
}

export function TopNav({ brand, breadcrumb, trailing, className }: TopNavProps) {
  return (
    <header
      className={cn(
        "flex items-center h-14 w-full shrink-0 px-6 gap-4 bg-paper border-b border-hairline-strong",
        className
      )}
    >
      {brand && <div className="flex items-center gap-2">{brand}</div>}
      {breadcrumb && <div className="flex items-center ml-6 gap-2 min-w-0">{breadcrumb}</div>}
      <div className="flex-1" />
      {trailing && <div className="flex items-center gap-3">{trailing}</div>}
    </header>
  );
}

/** Breadcrumb helper. Renders mono items with / separators. */
export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
  current?: boolean;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 min-w-0">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2 min-w-0">
          {i > 0 && (
            <span className="font-mono text-[13px] leading-4 text-faint shrink-0">/</span>
          )}
          <span
            className={cn(
              "font-mono text-[13px] leading-4 truncate",
              item.current ? "text-ink font-medium" : "text-ink"
            )}
          >
            {item.label}
          </span>
        </span>
      ))}
    </nav>
  );
}
