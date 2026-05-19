import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Stack, type StackGap } from "@/components/layout/Stack";

/**
 * Bounded reading column.
 * Source: composition contract (docs/COMPOSITION.md rule 4) — the canonical
 * wrapper for any reading-style page body (doc-editor content, longform
 * article column, settings forms, etc.).
 *
 * Locks: centered (mx-auto), max-w 720 by default, Stack vertical rhythm.
 * Variants:
 *   - reader  (default): max-w 720 · gap section
 *   - article (longer):  max-w 760 · gap section
 *   - narrow  (forms):   max-w 640 · gap block
 *
 * This is what fixes the "void to the right" in doc-editor — content centers
 * in the available width instead of hugging left at an arbitrary max-w.
 */

export type ProseVariant = "reader" | "article" | "narrow";

export interface ProseProps {
  children: ReactNode;
  variant?: ProseVariant;
  /** Override the default gap for this variant. */
  gap?: StackGap;
  className?: string;
}

const VARIANT: Record<ProseVariant, { max: string; gap: StackGap }> = {
  reader:  { max: "max-w-[720px]", gap: "section" },
  article: { max: "max-w-[760px]", gap: "section" },
  narrow:  { max: "max-w-[640px]", gap: "block" },
};

export function Prose({ children, variant = "reader", gap, className }: ProseProps) {
  const v = VARIANT[variant];
  return (
    <Stack
      as="article"
      gap={gap ?? v.gap}
      className={cn("w-full mx-auto", v.max, className)}
    >
      {children}
    </Stack>
  );
}
