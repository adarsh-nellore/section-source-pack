"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Glyph } from "@/components/ui/Glyph";

/**
 * Native select wrapper for visual consistency. Source: Paper sheet · Select (node 68Q-0).
 * For composed menus with custom items (sections, shortcuts), use DropdownMenu instead.
 */

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  leading?: ReactNode;
  name?: string;
  id?: string;
  className?: string;
  containerClassName?: string;
}

export function Select({
  options,
  value,
  onChange,
  placeholder,
  disabled,
  invalid,
  leading,
  name,
  id,
  className,
  containerClassName,
}: SelectProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 h-9 bg-paper border rounded-input transition-colors relative",
        invalid ? "border-coral" : "border-hairline-strong",
        disabled && "bg-soft border-hairline",
        containerClassName
      )}
    >
      {leading && <span className="shrink-0 inline-flex text-faint">{leading}</span>}
      <select
        id={id}
        name={name}
        value={value ?? ""}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          "flex-1 min-w-0 bg-transparent outline-none appearance-none text-[13.5px] pr-5",
          disabled
            ? "text-faintest"
            : value === undefined || value === ""
            ? "text-faint"
            : "text-ink",
          className
        )}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
      <Glyph
        name="chev"
        size={14}
        className={cn(
          "pointer-events-none absolute right-3",
          disabled ? "text-faintest" : "text-muted"
        )}
      />
    </div>
  );
}
