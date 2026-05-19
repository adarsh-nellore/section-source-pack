import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { MetaLabel } from "@/components/ui/MetaLabel";
import { Hairline } from "@/components/ui/Hairline";

/**
 * Canonical label/value pair patterns.
 * Lifted from doc-editor / claim-detail / list-detail metadata strips where
 * the same "SOURCE / CONFIDENCE / CITED TABLES" three-cell strip was authored
 * by hand each time. Two exports:
 *   - <KeyValue label value /> — single cell
 *   - <DefinitionList items orientation /> — grid of KeyValue pairs
 */

export interface KeyValueProps {
  label: ReactNode;
  value: ReactNode;
  /** Optional secondary line under the value. */
  caption?: ReactNode;
  /** Inline (label left, value right) vs stacked (label above value). */
  orientation?: "inline" | "stacked";
  className?: string;
}

export function KeyValue({
  label,
  value,
  caption,
  orientation = "stacked",
  className,
}: KeyValueProps) {
  if (orientation === "inline") {
    return (
      <div className={cn("flex items-baseline justify-between gap-3", className)}>
        <MetaLabel tone="muted">{label}</MetaLabel>
        <div className="text-right min-w-0">
          <div className="font-sans text-[14px] leading-[20px] text-ink truncate">
            {value}
          </div>
          {caption && (
            <div className="font-mono text-[11px] leading-[14px] text-faint mt-0.5">
              {caption}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-1 min-w-0", className)}>
      <MetaLabel tone="muted">{label}</MetaLabel>
      <div className="font-sans text-[14px] leading-[20px] text-ink">{value}</div>
      {caption && (
        <div className="font-mono text-[11px] leading-[14px] text-faint">{caption}</div>
      )}
    </div>
  );
}

export interface DefinitionListItem {
  id: string;
  label: ReactNode;
  value: ReactNode;
  caption?: ReactNode;
}

export interface DefinitionListProps {
  items: DefinitionListItem[];
  /** "horizontal" = cells in a row separated by vertical hairlines; "grid" = 2-column grid; "stacked" = vertical stack. */
  layout?: "horizontal" | "grid" | "stacked";
  className?: string;
}

export function DefinitionList({
  items,
  layout = "horizontal",
  className,
}: DefinitionListProps) {
  if (layout === "horizontal") {
    return (
      <div className={cn("flex items-stretch gap-6", className)}>
        {items.map((item, i) => (
          <div key={item.id} className="flex items-stretch gap-6">
            {i > 0 && <Hairline orientation="vertical" />}
            <KeyValue label={item.label} value={item.value} caption={item.caption} />
          </div>
        ))}
      </div>
    );
  }

  if (layout === "grid") {
    return (
      <div className={cn("grid grid-cols-2 gap-x-6 gap-y-4", className)}>
        {items.map((item) => (
          <KeyValue
            key={item.id}
            label={item.label}
            value={item.value}
            caption={item.caption}
            orientation="stacked"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {items.map((item) => (
        <KeyValue
          key={item.id}
          label={item.label}
          value={item.value}
          caption={item.caption}
          orientation="inline"
        />
      ))}
    </div>
  );
}
