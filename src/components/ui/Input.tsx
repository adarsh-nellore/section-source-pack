import { forwardRef, type ReactNode, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Single-line text input. Source: Paper sheet · Input (node 68L-0).
 * Inter body, hairline-strong border, rounded-input (10px). Sizes md / lg.
 * Optional leading glyph and trailing slot (KeyChip or IconButton).
 */

export type InputSize = "md" | "lg";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  inputSize?: InputSize;
  invalid?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
  containerClassName?: string;
}

const SIZE: Record<InputSize, string> = {
  md: "h-9  text-[13.5px]",
  lg: "h-11 text-[14.5px]",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    inputSize = "md",
    invalid,
    leading,
    trailing,
    containerClassName,
    className,
    disabled,
    ...props
  },
  ref
) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 bg-paper border rounded-input transition-colors",
        invalid ? "border-coral" : "border-hairline-strong focus-within:border-coral focus-within:border-[1.5px]",
        disabled && "bg-soft border-hairline",
        SIZE[inputSize],
        containerClassName
      )}
    >
      {leading && <span className="shrink-0 inline-flex text-faint">{leading}</span>}
      <input
        ref={ref}
        disabled={disabled}
        className={cn(
          "flex-1 min-w-0 bg-transparent outline-none placeholder:text-faint",
          disabled ? "text-faintest" : "text-ink",
          className
        )}
        {...props}
      />
      {trailing && <span className="shrink-0 inline-flex">{trailing}</span>}
    </div>
  );
});
