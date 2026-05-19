import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Cluster } from "@/components/layout/Cluster";

/**
 * Canonical action-row pattern.
 * Formalizes the floating-action-bar from list-detail (Pill + IconButton X +
 * primary Button) and the form footer pattern from settings (Cancel + Save).
 * Use this anywhere a page presents a row of primary+secondary actions —
 * sticky bottom, sticky top, inline below a form, or floating with a glass
 * card.
 */

export type ActionBarVariant = "inline" | "sticky-bottom" | "sticky-top" | "floating";

export interface ActionBarProps {
  /** Primary action (usually a Button variant="primary"). */
  primary?: ReactNode;
  /** Secondary action(s) — Button variant="secondary" or "ghost". */
  secondary?: ReactNode;
  /** Left-side content (e.g. metadata, status text). */
  leading?: ReactNode;
  /** Layout context — controls position + chrome. */
  variant?: ActionBarVariant;
  className?: string;
}

const VARIANT: Record<ActionBarVariant, string> = {
  "inline":         "py-4",
  "sticky-bottom":  "sticky bottom-0 z-10 bg-paper border-t border-hairline-strong px-6 py-3",
  "sticky-top":     "sticky top-0 z-10 bg-paper border-b border-hairline-strong px-6 py-3",
  "floating":       "glass-card shadow-pop rounded-card px-3 py-2",
};

export function ActionBar({
  primary,
  secondary,
  leading,
  variant = "inline",
  className,
}: ActionBarProps) {
  return (
    <Cluster
      gap="cozy"
      justify={leading ? "between" : "end"}
      align="center"
      wrap={false}
      className={cn(VARIANT[variant], className)}
    >
      {leading && (
        <div className="min-w-0 flex-1 truncate">{leading}</div>
      )}
      <Cluster gap="cozy" align="center" wrap={false} className="shrink-0">
        {secondary}
        {primary}
      </Cluster>
    </Cluster>
  );
}
