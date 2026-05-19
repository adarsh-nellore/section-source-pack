import type { ReactNode, MouseEventHandler } from "react";
import { cn } from "@/lib/cn";

/**
 * Pill chip. Source: Paper sheet · Pill (node 5UW-0).
 * Walkthrough origin: Reasoned chip (2HB-0), Magnitude chip (2H7-0).
 *   outlined: rounded-lg py-1.5 px-2.5 gap-2 bg-paper border border-hairline-strong
 *   filled:   rounded-lg py-1.5 px-2.5 gap-2 bg-stripe border border-hairline-strong
 *   accent:   rounded-lg py-1.5 px-2.5 gap-2 bg-coral text-white
 *   ghost:    transparent (speculative — net-new)
 * Use Pill for chip-shaped items in chat/copilot rails; use Button for action buttons.
 */

export type PillVariant =
  | "outlined"    // bg-paper border-hairline-strong — default
  | "filled"      // bg-stripe border-hairline-strong
  | "accent"      // bg-coral text-white
  | "ghost";      // transparent, hover bg-soft

export type PillSize = "sm" | "md";

export interface PillProps {
  children?: ReactNode;
  variant?: PillVariant;
  size?: PillSize;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onAuxClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
  /** Render as a non-interactive span instead of a button. */
  asStatic?: boolean;
}

const VARIANT: Record<PillVariant, string> = {
  outlined: "bg-paper  border border-hairline-strong text-muted",
  filled:   "bg-stripe border border-hairline-strong text-muted",
  accent:   "bg-coral  text-white",
  ghost:    "bg-transparent text-muted hover:bg-soft",
};

const SIZE: Record<PillSize, string> = {
  // Paper values: py-1.5 (6px) px-2.5 (10px) gap-2 (8px) text-[11px]/3.5 (lh 14px)
  sm: "py-1.5 px-2.5 gap-2 text-[11px] leading-[14px]",
  md: "py-2 px-3 gap-2 text-[12px] leading-[15px]",
};

export function Pill({
  children,
  variant = "outlined",
  size = "sm",
  leadingIcon,
  trailingIcon,
  onClick,
  onAuxClick,
  disabled,
  asStatic = false,
  className,
}: PillProps) {
  const base = cn(
    "inline-flex items-center self-start rounded-lg font-mono transition-colors",
    VARIANT[variant],
    SIZE[size],
    !asStatic && !disabled && "cursor-pointer",
    disabled && "opacity-50 pointer-events-none",
    className
  );

  const content = (
    <>
      {leadingIcon && <span className="shrink-0 inline-flex">{leadingIcon}</span>}
      {children && <span>{children}</span>}
      {trailingIcon && <span className="shrink-0 inline-flex">{trailingIcon}</span>}
    </>
  );

  if (asStatic) return <span className={base}>{content}</span>;

  return (
    <button
      type="button"
      onClick={onClick}
      onAuxClick={onAuxClick}
      disabled={disabled}
      className={base}
    >
      {content}
    </button>
  );
}
