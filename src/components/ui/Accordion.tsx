"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Glyph } from "@/components/ui/Glyph";

/**
 * Collapsible disclosure groups.
 * Source: Paper sheet · Accordion (node 8EY-0). Header row stays h-12
 * regardless of state; expanded items reveal a content panel beneath a
 * hairline divider. `single` mode behaves as a radio (one item open at a
 * time); `multi` mode allows independent toggles.
 */

export interface AccordionItem {
  id: string;
  title: ReactNode;
  children: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** "single" = only one open at a time (radio-style); "multi" = independent toggles. */
  mode?: "single" | "multi";
  /** IDs of items that start open. */
  defaultOpen?: string[];
  className?: string;
}

export function Accordion({
  items,
  mode = "multi",
  defaultOpen = [],
  className,
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(
    () => new Set(defaultOpen)
  );

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        return next;
      }
      if (mode === "single") return new Set([id]);
      next.add(id);
      return next;
    });
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        return (
          <div
            key={item.id}
            className="flex flex-col rounded-lg overflow-clip bg-paper border border-hairline-strong"
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => toggle(item.id)}
              className={cn(
                "flex items-center h-12 px-4 gap-3 text-left transition-colors hover:bg-soft",
              )}
            >
              <span
                className={cn(
                  "flex-1 min-w-0 font-sans text-[14px] leading-[20px]",
                  isOpen ? "font-medium text-ink" : "text-ink"
                )}
              >
                {item.title}
              </span>
              <Glyph
                name={isOpen ? "chev-up" : "chev"}
                size={14}
                strokeWidth={2.5}
                className="text-muted shrink-0"
              />
            </button>
            {isOpen && (
              <div className="border-t border-hairline px-4 pt-3 pb-4 text-[13.5px] leading-[18px] text-muted">
                {item.children}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
