import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Glyph } from "@/components/ui/Glyph";

/**
 * Inline persistent banner.
 * Source: Paper sheet · Alert (node 60O-0). Same tonal palette as Toast but
 * full-width, tonal background fill, no shadow. Use for state that needs
 * sustained visibility (validation errors, compliance flags, system status).
 */

export type AlertTone = "success" | "warning" | "danger" | "info";

export interface AlertProps {
  tone?: AlertTone;
  title?: ReactNode;
  body?: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  onDismiss?: () => void;
  compact?: boolean;
  className?: string;
}

const BG: Record<AlertTone, string> = {
  success: "bg-green-soft border-l-green",
  warning: "bg-gold-soft  border-l-gold",
  danger:  "bg-coral-soft border-l-coral",
  info:    "bg-soft       border-l-info",
};

const ICON_COLOR: Record<AlertTone, string> = {
  success: "text-green",
  warning: "text-gold",
  danger:  "text-coral",
  info:    "text-info",
};

const ICON_NAME = {
  success: "check",
  warning: "more",
  danger:  "x",
  info:    "more",
} as const;

export function Alert({
  tone = "info",
  title,
  body,
  children,
  action,
  onDismiss,
  compact = false,
  className,
}: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 border-l-[3px] rounded-input",
        BG[tone],
        compact ? "py-2.5 px-3.5" : "py-3.5 px-4.5",
        className
      )}
    >
      <span className={cn("mt-0.5 shrink-0 inline-flex", ICON_COLOR[tone])}>
        <Glyph name={ICON_NAME[tone]} size={16} strokeWidth={tone === "success" ? 2.5 : 2.5} />
      </span>
      <div className="flex-1 flex flex-col gap-1">
        {title && (
          <div className="font-sans font-semibold text-[14px] leading-[20px] text-ink">
            {title}
          </div>
        )}
        {body && (
          <div className="text-[13px] leading-[19px] text-muted">{body}</div>
        )}
        {children}
      </div>
      {action && <div className="shrink-0">{action}</div>}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="shrink-0 inline-flex items-center justify-center size-5 rounded-sm text-faint hover:text-ink"
        >
          <Glyph name="x" size={12} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}
