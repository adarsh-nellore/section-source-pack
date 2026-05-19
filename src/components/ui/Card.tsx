import type { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Card. Source: Paper sheet · Card (node 5A4-0). Walkthrough origin:
 * NarrativeDraftPreviewCard (2HH-0).
 *   rounded-card overflow-clip border-hairline-strong
 *   header:  py-2.5 px-3 border-b border-hairline
 *   body:    padding per padding prop (none / sm / md / lg)
 *   footer:  py-2.5 px-3 border-t border-hairline
 *
 * Speculative: the `elevated` variant's shadow is net-new. Paper cards are flat
 * (border-only). Use `elevated` deliberately for off-Paper surfaces.
 */

export type CardVariant = "paper" | "soft" | "outline" | "elevated";
export type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  header?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
}

const VARIANT: Record<CardVariant, string> = {
  paper:    "bg-paper        border border-hairline-strong",
  soft:     "bg-soft         border border-hairline-strong",
  outline:  "bg-transparent  border border-hairline-strong",
  elevated: "bg-paper        border border-hairline-strong shadow-pop",
};

const PADDING: Record<CardPadding, string> = {
  none: "",
  sm:   "py-2   px-2.5",
  md:   "py-2.5 px-3",
  lg:   "py-3   px-4",
};

export function Card({
  variant = "paper",
  padding = "md",
  header,
  footer,
  children,
  className,
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-card overflow-clip",
        VARIANT[variant],
        className
      )}
      {...rest}
    >
      {header !== undefined && (
        <div className="flex items-center justify-between py-2.5 px-3 border-b border-hairline">
          {header}
        </div>
      )}
      <div className={PADDING[padding]}>{children}</div>
      {footer !== undefined && (
        <div className="py-2.5 px-3 border-t border-hairline">{footer}</div>
      )}
    </div>
  );
}
