"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Single-select from a group. Source: Paper sheet · Radio (node 68S-0).
 * 16px circle. States: unselected / selected / disabled. Coral fill on selected.
 */

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { checked, disabled, className, ...props },
  ref
) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center size-4 rounded-full border-[1.5px] cursor-pointer transition-colors bg-paper",
        checked
          ? "border-coral"
          : disabled
          ? "border-hairline bg-soft"
          : "border-hairline-strong",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <input
        ref={ref}
        type="radio"
        checked={checked}
        disabled={disabled}
        className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
        {...props}
      />
      {checked && <span className="size-2 rounded-full bg-coral" />}
    </span>
  );
});
