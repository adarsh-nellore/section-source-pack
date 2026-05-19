import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Display-serif label. Fraunces italic.
 * Source: Paper sheet · Caption (node 5KA-0). Net-new — formalizes Fraunces
 * usage which appeared sparingly in Peer walkthroughs.
 * Three sizes: lg=18/26 (figure caption), md=15/22 (default), sm=13/18 (table cell).
 */

export type CaptionSize = "sm" | "md" | "lg";
export type CaptionTone = "default" | "muted" | "faint";

export interface CaptionProps {
  children: ReactNode;
  size?: CaptionSize;
  tone?: CaptionTone;
  className?: string;
}

const SIZE: Record<CaptionSize, string> = {
  sm: "text-[13px] leading-[18px]",
  md: "text-[15px] leading-[22px]",
  lg: "text-[18px] leading-[26px]",
};

const TONE: Record<CaptionTone, string> = {
  default: "text-ink",
  muted:   "text-muted",
  faint:   "text-faint",
};

export function Caption({
  children,
  size = "md",
  tone = "default",
  className,
}: CaptionProps) {
  return (
    <span
      className={cn(
        "font-display italic font-normal",
        SIZE[size],
        TONE[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
