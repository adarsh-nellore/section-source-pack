"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Binary toggle. Source: Paper sheet · Switch (node 8DU-0).
 * Rounded-full track; thumb slides edge-to-edge. Off = soft + hairline-strong,
 * on = coral fill. Three sizes; optional inline label for settings rows.
 */

export type SwitchSize = "sm" | "md" | "lg";

export interface SwitchProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  size?: SwitchSize;
  disabled?: boolean;
  /** Optional inline label; if you need a fuller form layout, use <FormField>. */
  label?: ReactNode;
  /** Accessible label; required if no visible label. */
  "aria-label"?: string;
  className?: string;
}

const TRACK: Record<SwitchSize, string> = {
  sm: "w-7 h-4 p-px",
  md: "w-8 h-[18px] p-px",
  lg: "w-10 h-6 p-0.5",
};

const THUMB: Record<SwitchSize, string> = {
  sm: "size-3",
  md: "size-3.5",
  lg: "size-5",
};

export function Switch({
  checked,
  onChange,
  size = "md",
  disabled = false,
  label,
  className,
  ...rest
}: SwitchProps) {
  const ariaLabel = rest["aria-label"];
  const toggle = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cn(
        "inline-flex items-center rounded-full shrink-0 transition-colors",
        checked
          ? "bg-coral justify-end"
          : "bg-soft border border-hairline-strong",
        disabled && "opacity-50 pointer-events-none",
        TRACK[size]
      )}
    >
      <span
        className={cn(
          "rounded-full bg-paper shrink-0 transition-transform",
          !checked && "border border-hairline-strong",
          THUMB[size]
        )}
      />
    </button>
  );

  if (!label) return <span className={className}>{toggle}</span>;

  return (
    <label className={cn("inline-flex items-start gap-3 cursor-pointer", disabled && "cursor-not-allowed", className)}>
      <span className="mt-0.5">{toggle}</span>
      <span className="text-[13.5px] leading-[18px] text-ink">{label}</span>
    </label>
  );
}
