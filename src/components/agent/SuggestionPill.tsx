"use client";

import type { ReactNode, MouseEventHandler } from "react";
import { cn } from "@/lib/cn";
import { Glyph } from "@/components/ui/Glyph";

/**
 * Sparkle-prefixed pill for "apply this AI suggestion" actions.
 * Source: Paper sheet · SuggestionPill (node 6WX-0). Three tones:
 * subtle (paper bg, coral sparkle), primary (coral fill, white), inverted
 * (used in dark toolbars).
 */

export type SuggestionPillTone = "subtle" | "primary" | "inverted";
export type SuggestionPillSize = "sm" | "md";

export interface SuggestionPillProps {
  children: ReactNode;
  tone?: SuggestionPillTone;
  size?: SuggestionPillSize;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

const TONE: Record<SuggestionPillTone, { wrap: string; sparkle: string }> = {
  subtle:   { wrap: "bg-paper border border-hairline-strong text-ink hover:bg-coral-soft hover:border-coral hover:text-coral", sparkle: "text-coral" },
  primary:  { wrap: "bg-coral text-white border border-transparent hover:bg-coral/90", sparkle: "text-white" },
  inverted: { wrap: "bg-coral text-white border border-transparent", sparkle: "text-white" },
};

const SIZE: Record<SuggestionPillSize, { box: string; text: string; icon: number }> = {
  sm: { box: "h-7 px-2.5 gap-1.5", text: "text-[12px] leading-[14px]",   icon: 11 },
  md: { box: "h-8 px-3.5 gap-2",   text: "text-[13px] leading-[16px]",   icon: 13 },
};

export function SuggestionPill({
  children,
  tone = "subtle",
  size = "sm",
  onClick,
  className,
}: SuggestionPillProps) {
  const t = TONE[tone];
  const s = SIZE[size];
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center font-mono transition-colors rounded-lg",
        s.box,
        s.text,
        t.wrap,
        className
      )}
    >
      <Glyph name="sparkle" size={s.icon} className={cn("shrink-0", t.sparkle)} />
      <span>{children}</span>
    </button>
  );
}
