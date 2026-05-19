import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Mono caption.
 * Source: Paper sheet · MetaText (node 5K9-0). Walkthrough origin:
 * "auto-saved · 14:02" (K-0) and "peer-csr-v3" (2GX-0).
 *   font-mono · md=13/16 · sm=11/14 · tones ink / muted / faint / faintest
 */

export type MetaTextTone = "default" | "faint" | "faintest" | "ink";
export type MetaTextSize = "sm" | "md";

export interface MetaTextProps {
  children: ReactNode;
  tone?: MetaTextTone;
  size?: MetaTextSize;
  className?: string;
}

const TONE: Record<MetaTextTone, string> = {
  default:  "text-muted",
  faint:    "text-faint",
  faintest: "text-faintest",
  ink:      "text-ink",
};

const SIZE: Record<MetaTextSize, string> = {
  sm: "text-[11px] leading-[14px]",
  md: "text-[13px] leading-[16px]",
};

export function MetaText({
  children,
  tone = "default",
  size = "md",
  className,
}: MetaTextProps) {
  return (
    <span className={cn("font-mono", TONE[tone], SIZE[size], className)}>
      {children}
    </span>
  );
}
