import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Multi-line text input. Source: Paper sheet · Textarea (node 68N-0).
 * Same border/radii as Input. Floor 3 rows, ceiling 12 rows before scroll.
 * Pure CSS resize-y; consumers wanting JS-autosize can wire a controlled handler.
 */

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ invalid, rows = 3, className, disabled, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        rows={rows}
        disabled={disabled}
        className={cn(
          "block w-full px-3 py-2.5 bg-paper border rounded-input transition-colors resize-y outline-none",
          "text-[13.5px] leading-[20px] placeholder:text-faint",
          invalid
            ? "border-coral text-ink"
            : "border-hairline-strong text-ink focus:border-coral focus:border-[1.5px]",
          disabled && "bg-soft border-hairline text-faintest",
          className
        )}
        {...props}
      />
    );
  }
);
