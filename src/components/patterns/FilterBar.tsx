"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Cluster } from "@/components/layout/Cluster";
import { SearchInput } from "@/components/ui/SearchInput";
import { Tabs } from "@/components/ui/Tabs";

/**
 * Canonical filter/toolbar pattern.
 * Lifted from dashboard / search-results / browse-library templates which all
 * authored the same "Search + segmented Tabs + sort + view-toggle" composition
 * by hand. After this pattern exists, those templates collapse to one call.
 */

export interface FilterTab {
  value: string;
  label: ReactNode;
  count?: number;
}

export interface FilterBarProps {
  /** Tabs on the left side (typically status / category filters). */
  tabs?: FilterTab[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
  /** Inline search input. */
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  /** Right-side trailing controls (sort dropdown, view toggle, etc.). */
  trailing?: ReactNode;
  className?: string;
}

export function FilterBar({
  tabs,
  activeTab,
  onTabChange,
  searchValue,
  searchPlaceholder = "Search…",
  onSearchChange,
  trailing,
  className,
}: FilterBarProps) {
  return (
    <Cluster
      gap="block"
      justify="between"
      align="center"
      wrap={false}
      className={cn("w-full", className)}
    >
      <Cluster gap="comfortable" align="center" wrap={false} className="min-w-0 flex-1">
        {tabs && tabs.length > 0 && (
          <Tabs
            size="md"
            value={activeTab ?? tabs[0]?.value ?? ""}
            options={tabs.map((t) => ({
              value: t.value,
              label: typeof t.count === "number" ? `${t.label} ${t.count}` : t.label,
            }))}
            onChange={(v) => onTabChange?.(v as string)}
          />
        )}
        {onSearchChange && (
          <div className="min-w-0 max-w-[320px] flex-1">
            <SearchInput
              value={searchValue ?? ""}
              placeholder={searchPlaceholder}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        )}
      </Cluster>
      {trailing && (
        <Cluster gap="cozy" align="center" wrap={false} className="shrink-0">
          {trailing}
        </Cluster>
      )}
    </Cluster>
  );
}
