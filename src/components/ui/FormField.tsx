import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { MetaLabel } from "@/components/ui/MetaLabel";
import { Glyph } from "@/components/ui/Glyph";

/**
 * Field wrapper.
 * Source: Paper sheet · FormField (node 8F1-0). Composes a MetaLabel,
 * control (Input / Select / Textarea / Checkbox), and either a helper hint
 * or an error message. When `error` is set, it replaces the hint and the
 * field is rendered in the danger tone (coral leading dot + coral text).
 */

export interface FormFieldProps {
  label?: ReactNode;
  /** The control element — typically <Input>, <Select>, <Textarea>, or <Checkbox>. */
  children: ReactNode;
  /** Optional helper text below the control. */
  hint?: ReactNode;
  /** Error message — replaces hint when present and sets the field's tone to danger. */
  error?: ReactNode;
  /** Show "required" indicator next to the label. */
  required?: boolean;
  /** htmlFor binding; passed to the inner label element. */
  htmlFor?: string;
  className?: string;
}

export function FormField({
  label,
  children,
  hint,
  error,
  required,
  htmlFor,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={htmlFor} className="inline-flex items-baseline gap-1.5">
          <MetaLabel>{label}</MetaLabel>
          {required && (
            <span className="font-mono font-bold text-[10px] leading-[12px] uppercase tracking-label text-coral">
              · required
            </span>
          )}
        </label>
      )}
      {children}
      {error ? (
        <div className="flex items-center gap-1.5">
          <Glyph
            name="more"
            size={12}
            strokeWidth={2.5}
            className="text-coral shrink-0"
          />
          <span className="font-sans text-[12px] leading-[16px] text-coral">
            {error}
          </span>
        </div>
      ) : hint ? (
        <span className="font-sans text-[12px] leading-[16px] text-faint">
          {hint}
        </span>
      ) : null}
    </div>
  );
}
