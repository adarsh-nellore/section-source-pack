import type { ReactNode, ElementType } from "react";
import { cn } from "@/lib/cn";

/**
 * Vertical rhythm primitive.
 * Source: composition contract (docs/COMPOSITION.md rule 2) — the only way to
 * express vertical rhythm in templates. Maps directly to the named spacing
 * buckets in docs/SPACING.md (Tight 4 / Cozy 8 / Comfortable 12 / Block 16
 * / Section 24 / Page 40 / Hero 56-64). Raw `flex flex-col gap-N` is
 * forbidden in src/app/.
 */

export type StackGap = "tight" | "cozy" | "comfortable" | "block" | "section" | "page" | "hero";
export type StackAlign = "start" | "center" | "end" | "stretch";
export type StackJustify = "start" | "center" | "between" | "end";

export interface StackProps {
  children: ReactNode;
  gap?: StackGap;
  align?: StackAlign;
  justify?: StackJustify;
  /** Render as a different element (default `div`). */
  as?: ElementType;
  className?: string;
}

const GAP: Record<StackGap, string> = {
  tight:       "gap-1",      // 4
  cozy:        "gap-2",      // 8
  comfortable: "gap-3",      // 12
  block:       "gap-4",      // 16
  section:     "gap-6",      // 24
  page:        "gap-10",     // 40
  hero:        "gap-14",     // 56
};

const ALIGN: Record<StackAlign, string> = {
  start:   "items-start",
  center:  "items-center",
  end:     "items-end",
  stretch: "items-stretch",
};

const JUSTIFY: Record<StackJustify, string> = {
  start:   "justify-start",
  center:  "justify-center",
  between: "justify-between",
  end:     "justify-end",
};

export function Stack({
  children,
  gap = "block",
  align,
  justify,
  as: Tag = "div",
  className,
}: StackProps) {
  return (
    <Tag
      className={cn(
        "flex flex-col",
        GAP[gap],
        align && ALIGN[align],
        justify && JUSTIFY[justify],
        className
      )}
    >
      {children}
    </Tag>
  );
}
