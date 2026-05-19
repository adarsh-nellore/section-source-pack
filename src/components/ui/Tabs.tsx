"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Inline segmented control. Source: Paper sheet · Tabs (node 68P-0).
 * Paper inset background with white active segment. Use for view switchers
 * and list filters; not for document tabs (use TabBar instead).
 */

export type TabsSize = "sm" | "md";

export interface TabsOption {
  value: string;
  label: ReactNode;
  count?: number;
}

export interface TabsProps {
  options: TabsOption[];
  value: string;
  onChange: (value: string) => void;
  size?: TabsSize;
  className?: string;
}

const SIZE: Record<TabsSize, { tray: string; item: string; text: string }> = {
  sm: { tray: "p-0.5 rounded-md", item: "h-6 px-2.5 rounded-sm", text: "text-[12px]" },
  md: { tray: "p-1   rounded-md", item: "h-7 px-3   rounded-md", text: "text-[13px]" },
};

export function Tabs({ options, value, onChange, size = "md", className }: TabsProps) {
  const s = SIZE[size];
  return (
    <div
      role="tablist"
      className={cn("inline-flex items-center bg-soft gap-0.5", s.tray, className)}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "inline-flex items-center gap-1.5 font-medium transition-colors",
              s.item,
              s.text,
              active
                ? "bg-paper text-ink shadow-card"
                : "text-muted hover:text-ink"
            )}
          >
            <span>{opt.label}</span>
            {typeof opt.count === "number" && (
              <span
                className={cn(
                  "font-mono text-[11px]",
                  active ? "text-coral" : "text-faintest"
                )}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
