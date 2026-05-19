import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Closed-enum display headline.
 * Source: composition contract (docs/COMPOSITION.md rule 1) — the only way to
 * render a display-style title in this codebase. Locks font, size, weight,
 * tracking, and HTML tag per size. Consumers cannot override font-size via
 * className; only structural classes (margin, alignment) are accepted.
 *
 * Use this instead of `<h1 className="text-[Npx] …">`. The audit script will
 * flag raw heading tags inside src/app/.
 */

export type HeadingSize = "display" | "h1" | "h2" | "h3" | "h4";
export type HeadingTone = "ink" | "muted";

export interface HeadingProps {
  children: ReactNode;
  size?: HeadingSize;
  tone?: HeadingTone;
  /** Structural classes only — no font-size overrides. */
  className?: string;
  /** Optional id for in-page anchors. */
  id?: string;
}

const SIZE: Record<HeadingSize, { cls: string; tag: "h1" | "h2" | "h3" | "h4" }> = {
  display: { cls: "text-[56px] leading-[64px] font-medium   tracking-[-0.025em]", tag: "h1" },
  h1:      { cls: "text-[44px] leading-[52px] font-medium   tracking-[-0.02em]",  tag: "h1" },
  h2:      { cls: "text-[32px] leading-[38px] font-medium   tracking-[-0.015em]", tag: "h2" },
  h3:      { cls: "text-[22px] leading-[28px] font-medium   tracking-[-0.01em]",  tag: "h3" },
  h4:      { cls: "text-[17px] leading-[24px] font-semibold tracking-normal",     tag: "h4" },
};

const TONE: Record<HeadingTone, string> = {
  ink:   "text-ink",
  muted: "text-muted",
};

export function Heading({
  children,
  size = "h1",
  tone = "ink",
  className,
  id,
}: HeadingProps) {
  const { cls, tag: Tag } = SIZE[size];
  return (
    <Tag id={id} className={cn("font-sans", cls, TONE[tone], className)}>
      {children}
    </Tag>
  );
}
