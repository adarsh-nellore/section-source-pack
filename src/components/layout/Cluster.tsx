import type { ReactNode, ElementType } from "react";
import { cn } from "@/lib/cn";

/**
 * Horizontal rhythm primitive.
 * Source: composition contract (docs/COMPOSITION.md rule 2) — the only way to
 * express horizontal row-groups in templates. Same gap vocabulary as Stack.
 * Wraps by default (so chip rows, breadcrumbs, button groups handle overflow
 * gracefully). Set `wrap={false}` for fixed-line clusters.
 */

export type ClusterGap = "tight" | "cozy" | "comfortable" | "block" | "section" | "page" | "hero";
export type ClusterAlign = "start" | "center" | "end" | "baseline" | "stretch";
export type ClusterJustify = "start" | "center" | "between" | "end";

export interface ClusterProps {
  children: ReactNode;
  gap?: ClusterGap;
  align?: ClusterAlign;
  justify?: ClusterJustify;
  wrap?: boolean;
  as?: ElementType;
  className?: string;
}

const GAP: Record<ClusterGap, string> = {
  tight:       "gap-1",
  cozy:        "gap-2",
  comfortable: "gap-3",
  block:       "gap-4",
  section:     "gap-6",
  page:        "gap-10",
  hero:        "gap-14",
};

const ALIGN: Record<ClusterAlign, string> = {
  start:    "items-start",
  center:   "items-center",
  end:      "items-end",
  baseline: "items-baseline",
  stretch:  "items-stretch",
};

const JUSTIFY: Record<ClusterJustify, string> = {
  start:   "justify-start",
  center:  "justify-center",
  between: "justify-between",
  end:     "justify-end",
};

export function Cluster({
  children,
  gap = "cozy",
  align = "center",
  justify,
  wrap = true,
  as: Tag = "div",
  className,
}: ClusterProps) {
  return (
    <Tag
      className={cn(
        "flex",
        wrap && "flex-wrap",
        GAP[gap],
        ALIGN[align],
        justify && JUSTIFY[justify],
        className
      )}
    >
      {children}
    </Tag>
  );
}
