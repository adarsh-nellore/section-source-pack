import type { ReactNode, MouseEventHandler, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Button. Source: Paper sheet · Button (node 5UX-0).
 * Walkthrough origin: input send (2I4-0 sub), NarrativeCard accept/cancel (2HH-0 sub).
 *   primary:     bg-coral text-white · rounded-sm/md per size
 *   secondary:   bg-paper border-hairline-strong text-ink
 *   ghost:       transparent text-muted
 *   destructive: bg-coral-soft text-coral border-coral
 *
 * Speculative: hover states are net-new. Paper provides no hover spec.
 */

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const VARIANT: Record<ButtonVariant, string> = {
  primary:     "bg-coral text-white hover:bg-coral/90",
  secondary:   "bg-paper text-ink border border-hairline-strong hover:bg-soft",
  ghost:       "bg-transparent text-muted hover:bg-soft hover:text-ink",
  destructive: "bg-coral-soft text-coral border border-coral hover:bg-coral hover:text-white",
};

const SIZE: Record<ButtonSize, string> = {
  // Paper values for primary action button (~24px) and text buttons (~28-32px)
  sm: "h-6 px-2  gap-1   text-[12px]   rounded-sm",
  md: "h-8 px-3  gap-1.5 text-[13px]   rounded-md",
  lg: "h-9 px-4  gap-2   text-[13.5px] rounded-md",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  leadingIcon,
  trailingIcon,
  type = "button",
  className,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center font-medium transition-colors leading-none",
        VARIANT[variant],
        SIZE[size],
        disabled && "opacity-50 pointer-events-none",
        className
      )}
      {...rest}
    >
      {leadingIcon && <span className="shrink-0 inline-flex">{leadingIcon}</span>}
      {children && <span>{children}</span>}
      {trailingIcon && <span className="shrink-0 inline-flex">{trailingIcon}</span>}
    </button>
  );
}
