"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { Glyph } from "@/components/ui/Glyph";

/**
 * Boolean toggle. Source: Paper sheet · Checkbox (node 68R-0).
 * 16px square. States: unchecked / checked / indeterminate / disabled. Coral fill on checked.
 * Uses a hidden native input for keyboard + screen-reader support.
 */

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    { indeterminate, checked, disabled, className, ...props },
    ref
  ) {
    const filled = Boolean(checked) || Boolean(indeterminate);
    return (
      <span
        className={cn(
          "relative inline-flex items-center justify-center size-4 rounded-xs border-[1.5px] cursor-pointer transition-colors",
          filled
            ? disabled
              ? "bg-coral-soft border-coral opacity-50"
              : "bg-coral border-coral"
            : disabled
            ? "bg-soft border-hairline"
            : "bg-paper border-hairline-strong",
          className
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
          {...props}
        />
        {indeterminate ? (
          <span className="w-2 h-0.5 bg-white rounded-full" />
        ) : checked ? (
          <Glyph
            name="check"
            size={10}
            strokeWidth={3}
            className={cn(disabled ? "text-coral" : "text-white")}
          />
        ) : null}
      </span>
    );
  }
);
