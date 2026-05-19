import type { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Multi-column data row. Source: Paper sheet · Row (node 6KO-0).
 * Variants: default, zebra (stripe bg), muted (faintest text), total (top border + semibold).
 */

export type RowVariant = "default" | "zebra" | "muted" | "total";

export interface RowProps extends HTMLAttributes<HTMLDivElement> {
  variant?: RowVariant;
  align?: "center" | "baseline";
  gap?: "sm" | "md" | "lg";
}

const VARIANT: Record<RowVariant, string> = {
  default: "bg-paper  border-b border-hairline text-ink",
  zebra:   "bg-stripe border-b border-hairline text-ink",
  muted:   "bg-paper  border-b border-hairline text-faintest",
  total:   "bg-paper  border-t-[1.5px] border-ink text-ink font-semibold",
};

const GAP: Record<NonNullable<RowProps["gap"]>, string> = {
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
};

export function Row({
  variant = "default",
  align = "center",
  gap = "md",
  className,
  children,
  ...rest
}: RowProps) {
  return (
    <div
      className={cn(
        "flex py-3 px-4.5 text-[14px] leading-[20px]",
        align === "baseline" ? "items-baseline" : "items-center",
        GAP[gap],
        VARIANT[variant],
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
