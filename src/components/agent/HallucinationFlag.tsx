import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Glyph } from "@/components/ui/Glyph";

/**
 * Warning marker for AI-generated claims that need review.
 * Source: Paper sheet · HallucinationFlag (node 6X0-0). Covers low_confidence
 * + hallucination_flagged agent states. Three render modes:
 * - badge: inline mini-pill next to text
 * - underline: dashed underline + superscript marker over a phrase
 * - block: full callout banner with explanation + actions
 */

export type FlagTone = "danger" | "warning";
export type FlagVariant = "badge" | "block";

export interface HallucinationFlagProps {
  tone?: FlagTone;
  variant?: FlagVariant;
  label?: ReactNode;
  title?: ReactNode;
  body?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

const TONE: Record<FlagTone, { bg: string; border: string; ink: string }> = {
  danger:  { bg: "bg-coral-soft", border: "border-coral", ink: "text-coral" },
  warning: { bg: "bg-gold-soft",  border: "border-gold",  ink: "text-gold" },
};

export function HallucinationFlag({
  tone = "danger",
  variant = "badge",
  label,
  title,
  body,
  actions,
  className,
}: HallucinationFlagProps) {
  const t = TONE[tone];

  if (variant === "block") {
    return (
      <div
        role="alert"
        className={cn(
          "flex items-start gap-3 py-3 px-4 rounded-input border-l-[3px]",
          t.bg,
          t.border,
          className
        )}
      >
        <Glyph
          name="more"
          size={14}
          strokeWidth={2.5}
          className={cn("mt-0.5 shrink-0 rotate-90", t.ink)}
        />
        <div className="flex-1 flex flex-col gap-1">
          {title && (
            <div className="font-sans font-semibold text-[13px] leading-[18px] text-ink">
              {title}
            </div>
          )}
          {body && (
            <div className="font-sans text-[12.5px] leading-[18px] text-muted">
              {body}
            </div>
          )}
          {actions && <div className="flex gap-2 mt-1">{actions}</div>}
        </div>
      </div>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 py-0.5 px-1.5 rounded-xs border font-mono font-bold text-[10px] leading-[13px]",
        t.bg,
        t.border,
        t.ink,
        className
      )}
    >
      <Glyph name="more" size={9} strokeWidth={3} className="rotate-90" />
      <span>{label ?? (tone === "danger" ? "review" : "low confidence")}</span>
    </span>
  );
}
