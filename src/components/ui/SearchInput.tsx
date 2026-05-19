import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Glyph } from "@/components/ui/Glyph";
import { KeyChip } from "@/components/ui/KeyChip";

/**
 * Specialized search Input. Source: Paper sheet · SearchInput (node 68M-0).
 * Leading search glyph, optional ⌘K KeyChip hint, optional clear button.
 */

export interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  shortcut?: ReactNode[];
  onClear?: () => void;
  containerClassName?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    { shortcut, onClear, containerClassName, className, value, ...props },
    ref
  ) {
    const hasValue =
      typeof value === "string" ? value.length > 0 : value != null;

    return (
      <div
        className={cn(
          "flex items-center gap-2 px-3 h-9 bg-paper border border-hairline-strong rounded-input transition-colors focus-within:border-coral focus-within:border-[1.5px]",
          containerClassName
        )}
      >
        <Glyph name="search" size={14} className="shrink-0 text-faint" />
        <input
          ref={ref}
          value={value}
          className={cn(
            "flex-1 min-w-0 bg-transparent outline-none text-[13.5px] text-ink placeholder:text-faint",
            className
          )}
          {...props}
        />
        {hasValue && onClear ? (
          <button
            type="button"
            aria-label="Clear"
            onClick={onClear}
            className="shrink-0 inline-flex items-center justify-center size-5 rounded-sm text-faint hover:text-ink"
          >
            <Glyph name="x" size={12} strokeWidth={2.5} />
          </button>
        ) : shortcut ? (
          <KeyChip keys={shortcut} size="sm" />
        ) : null}
      </div>
    );
  }
);
