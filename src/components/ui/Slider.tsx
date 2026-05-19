"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Single-thumb range control. Source: Paper sheet · Slider (node 8DV-0).
 * 320px rail in soft, coral fill from left to thumb; thumb is paper + coral border.
 */

export interface SliderProps {
  value: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  label?: ReactNode;
  className?: string;
  disabled?: boolean;
  /** Accessible label; required if no visible label. */
  "aria-label"?: string;
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  showValue = false,
  label,
  className,
  disabled = false,
  ...rest
}: SliderProps) {
  const ariaLabel = rest["aria-label"];
  const pct = max === min ? 0 : Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  return (
    <div className={cn("inline-flex flex-col gap-2", className)}>
      {label && (
        <span className="text-[13px] leading-[16px] text-ink">{label}</span>
      )}
      <div className="inline-flex items-center gap-4">
        <div className="relative h-4 flex items-center shrink-0" style={{ width: 320 }}>
          <div className="absolute left-0 top-1.5 h-1 rounded-full bg-soft" style={{ width: 320 }} />
          <div className="absolute left-0 top-1.5 h-1 rounded-full bg-coral" style={{ width: `${pct}%` }} />
          <div
            className="absolute top-0 size-4 rounded-full bg-paper border-2 border-coral shadow-sm"
            style={{ left: `calc(${pct}% - 8px)` }}
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            disabled={disabled}
            aria-label={ariaLabel}
            onChange={(e) => onChange?.(Number(e.target.value))}
            className="absolute inset-0 w-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
        </div>
        {showValue && (
          <span className="text-[13px] leading-[16px] text-ink">{Math.round(pct)}%</span>
        )}
      </div>
    </div>
  );
}
