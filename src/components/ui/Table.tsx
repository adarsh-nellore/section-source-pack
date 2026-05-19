import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Tabular data display. Source: Paper sheet · Table (node 6KP-0).
 * Header row + body rows + optional total. Numeric columns right-aligned.
 * Columns are configured by the consumer; this component lays out the chrome.
 */

export interface TableColumn<T> {
  key: keyof T | string;
  header: ReactNode;
  align?: "left" | "right" | "center";
  /** flex grow weight; default 1 */
  weight?: number;
  render?: (row: T, index: number) => ReactNode;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  total?: { label: ReactNode; values: ReactNode[] };
  caption?: ReactNode;
  zebra?: boolean;
  className?: string;
  rowKey?: (row: T, index: number) => string;
}

function align(a?: "left" | "right" | "center") {
  if (a === "right") return "text-right";
  if (a === "center") return "text-center";
  return "text-left";
}

export function Table<T extends Record<string, unknown>>({
  columns,
  rows,
  total,
  caption,
  zebra = true,
  className,
  rowKey,
}: TableProps<T>) {
  return (
    <div className={cn("flex flex-col w-full", className)}>
      {caption && <div className="mb-3">{caption}</div>}
      <div className="flex items-center py-2.5 px-4 gap-4 bg-stripe border-b border-hairline">
        {columns.map((col, i) => (
          <div
            key={String(col.key) + i}
            className={cn(
              "font-mono font-bold uppercase tracking-label text-[11px] leading-[14px] text-faint",
              align(col.align)
            )}
            style={{ flex: col.weight ?? 1 }}
          >
            {col.header}
          </div>
        ))}
      </div>
      {rows.map((row, i) => (
        <div
          key={rowKey ? rowKey(row, i) : i}
          className={cn(
            "flex items-center py-3 px-4 gap-4 border-b border-hairline text-[14px] leading-[20px] text-ink",
            zebra && i % 2 === 1 && "bg-stripe"
          )}
        >
          {columns.map((col, ci) => (
            <div
              key={String(col.key) + ci}
              className={align(col.align)}
              style={{ flex: col.weight ?? 1 }}
            >
              {col.render
                ? col.render(row, i)
                : ((row as Record<string, unknown>)[String(col.key)] as ReactNode)}
            </div>
          ))}
        </div>
      ))}
      {total && (
        <div className="flex items-center py-3 px-4 gap-4 border-t-[1.5px] border-ink text-[14px] leading-[20px] text-ink font-semibold">
          <div className={cn(align(columns[0]?.align))} style={{ flex: columns[0]?.weight ?? 1 }}>
            {total.label}
          </div>
          {total.values.map((v, vi) => {
            const c = columns[vi + 1];
            return (
              <div
                key={vi}
                className={cn(align(c?.align))}
                style={{ flex: c?.weight ?? 1 }}
              >
                {v}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
