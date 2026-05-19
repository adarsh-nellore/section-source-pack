import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Glyph } from "@/components/ui/Glyph";

/**
 * User-applied label / filter chip.
 * Source: Paper sheet · Tag (node 8EZ-0). Three variants (outlined, filled,
 * accent) and two sizes (sm, md). Optional trailing × close button removes the
 * tag; use Tag for user-driven facets and editable metadata, Badge for
 * system-set status.
 */

export type TagVariant = "outlined" | "filled" | "accent";
export type TagSize = "sm" | "md";

export interface TagProps {
  children: ReactNode;
  variant?: TagVariant;
  size?: TagSize;
  /** If provided, renders an × close button. */
  onClose?: () => void;
  /** Optional click handler for the whole tag. */
  onClick?: () => void;
  className?: string;
}

const VARIANT: Record<TagVariant, string> = {
  outlined: "bg-paper      border border-hairline-strong text-ink",
  filled:   "bg-soft       text-ink",
  accent:   "bg-coral-soft border border-coral text-coral",
};

const SIZE: Record<TagSize, string> = {
  sm: "h-5 pl-2   pr-1.5 gap-1   text-[12px] leading-[14px]",
  md: "h-6 pl-2.5 pr-1.5 gap-1.5 text-[13px] leading-[16px]",
};

const CLOSE_COLOR: Record<TagVariant, string> = {
  outlined: "text-faint hover:text-ink",
  filled:   "text-faint hover:text-ink",
  accent:   "text-coral hover:text-coral",
};

export function Tag({
  children,
  variant = "outlined",
  size = "md",
  onClose,
  onClick,
  className,
}: TagProps) {
  const interactive = Boolean(onClick);
  const base = cn(
    "inline-flex items-center rounded-lg font-sans font-medium",
    VARIANT[variant],
    SIZE[size],
    interactive && "cursor-pointer",
    className
  );

  return (
    <span className={base} onClick={onClick}>
      <span>{children}</span>
      {onClose && (
        <button
          type="button"
          aria-label="Remove"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className={cn(
            "shrink-0 inline-flex items-center justify-center rounded-sm transition-colors",
            CLOSE_COLOR[variant]
          )}
        >
          <Glyph name="x" size={12} strokeWidth={2.5} />
        </button>
      )}
    </span>
  );
}
