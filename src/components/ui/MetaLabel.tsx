import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Uppercase mono label.
 * Source: Paper sheet · MetaLabel (node 5K8-0). Walkthrough origin: "SECTION 12.4"
 * (13-0) and "GRADE" table header (1J-0).
 *   tracking-label font-mono font-bold text-[11px]/14 · default text-ink · muted text-faint
 */

export type MetaLabelTone = "default" | "muted";

export interface MetaLabelProps {
  children: ReactNode;
  tone?: MetaLabelTone;
  className?: string;
}

const TONE: Record<MetaLabelTone, string> = {
  default: "text-ink",
  muted:   "text-faint",
};

export function MetaLabel({ children, tone = "default", className }: MetaLabelProps) {
  return (
    <span
      className={cn(
        "font-mono font-bold uppercase tracking-label text-[11px] leading-[14px]",
        TONE[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
