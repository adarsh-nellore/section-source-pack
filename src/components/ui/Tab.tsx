import type { ReactNode, MouseEventHandler } from "react";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/Badge";
import { Glyph } from "@/components/ui/Glyph";

/**
 * Document tab. Source: Paper sheet · Tab + TabBar (node 68O-0).
 * Active tab: white fill, indigo top edge, side hairline borders.
 * Inactive: stripe fill, no chrome until hover.
 */

export type TabKind = "md" | "csv" | "pdf" | "generic";

export interface TabProps {
  label: string;
  kind?: TabKind;
  active?: boolean;
  dirty?: boolean;
  onClose?: MouseEventHandler<HTMLButtonElement>;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  children?: ReactNode;
}

const KIND_TONE = {
  md:      "neutral",
  csv:     "success",
  pdf:     "danger",
  generic: "neutral",
} as const;

export function Tab({
  label,
  kind = "md",
  active = false,
  dirty = false,
  onClose,
  onClick,
  className,
}: TabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center h-9 px-3 gap-2 rounded-t-lg font-mono text-[13px] leading-4 transition-colors relative",
        active
          ? "bg-paper text-ink border-l border-r border-hairline-strong"
          : "bg-stripe text-muted hover:text-ink",
        className
      )}
    >
      {active && (
        <span className="absolute top-0 left-0 right-0 h-0.5 bg-accent-indigo rounded-t-lg" />
      )}
      <Badge tone={KIND_TONE[kind]} size="sm">{kind}</Badge>
      <span className="font-medium">{label}</span>
      {dirty && !onClose && <span className="size-1.5 rounded-full bg-coral ml-0.5" />}
      {onClose && (
        <span
          role="button"
          tabIndex={0}
          aria-label="Close tab"
          onClick={(e) => {
            e.stopPropagation();
            onClose(e as never);
          }}
          className="ml-1 inline-flex items-center justify-center text-faint hover:text-ink cursor-pointer"
        >
          <Glyph name="x" size={12} strokeWidth={2.5} />
        </span>
      )}
    </button>
  );
}
