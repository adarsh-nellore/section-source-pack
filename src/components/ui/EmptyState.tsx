import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Centered empty-container guidance.
 * Source: Paper sheet · EmptyState (node 60P-0). Glyph + title + body +
 * optional CTA. Three surface variants: soft (dashed), paper (solid), bare.
 */

export type EmptyStateVariant = "soft" | "paper" | "bare";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: ReactNode;
  body?: ReactNode;
  action?: ReactNode;
  variant?: EmptyStateVariant;
  iconTint?: "neutral" | "coral";
  className?: string;
}

const VARIANT: Record<EmptyStateVariant, string> = {
  soft:  "bg-stripe border border-dashed border-hairline-strong",
  paper: "bg-paper  border border-hairline-strong",
  bare:  "",
};

export function EmptyState({
  icon,
  title,
  body,
  action,
  variant = "soft",
  iconTint = "neutral",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center text-center gap-3 py-12 px-8 rounded-card",
        VARIANT[variant],
        className
      )}
    >
      {icon && (
        <div
          className={cn(
            "inline-flex items-center justify-center size-12 rounded-card",
            iconTint === "coral"
              ? "bg-coral-soft text-coral"
              : variant === "paper"
              ? "bg-soft text-faint"
              : "bg-paper border border-hairline-strong text-faint"
          )}
        >
          {icon}
        </div>
      )}
      <div className="font-sans font-semibold text-[15px] leading-[22px] text-ink">
        {title}
      </div>
      {body && (
        <div className="text-[13px] leading-[19px] text-muted max-w-[260px]">
          {body}
        </div>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
