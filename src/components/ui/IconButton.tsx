import type { ReactNode, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Square icon-only button. Source: Paper sheet · IconButton (node 5UY-0).
 * Walkthrough origin: NarrativeCard accept/cancel pair (2HH-0 sub).
 *   primary action (accept): size-6 rounded-sm bg-coral with white check
 *   secondary action (cancel): size-6 rounded-sm bg-paper border-hairline-strong
 * Requires aria-label.
 *
 * Speculative: hover states are net-new. Paper provides no hover spec.
 */

export type IconButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export type IconButtonSize = "sm" | "md" | "lg";

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "children"> {
  children: ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  type?: "button" | "submit" | "reset";
  /** Accessible label is required for icon-only buttons. */
  "aria-label": string;
}

const VARIANT: Record<IconButtonVariant, string> = {
  primary:     "bg-coral text-white hover:bg-coral/90",
  secondary:   "bg-paper text-ink border border-hairline-strong hover:bg-soft",
  ghost:       "bg-transparent text-muted hover:bg-soft hover:text-ink",
  destructive: "bg-coral-soft text-coral border border-coral hover:bg-coral hover:text-white",
};

const SIZE: Record<IconButtonSize, string> = {
  sm: "size-6 rounded-sm",
  md: "size-7 rounded-md",
  lg: "size-8 rounded-md",
};

export function IconButton({
  children,
  variant = "secondary",
  size = "md",
  type = "button",
  className,
  disabled,
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center transition-colors",
        VARIANT[variant],
        SIZE[size],
        disabled && "opacity-50 pointer-events-none",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
