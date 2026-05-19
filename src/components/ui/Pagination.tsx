"use client";

import { cn } from "@/lib/cn";
import { Glyph } from "@/components/ui/Glyph";

/**
 * Page navigation for paged tables and lists.
 * Source: Paper sheet · Pagination (node 8F0-0). Numbered variant for >3
 * pages with prev/next chev buttons and ellipsis when total > 7. Active page
 * uses coral background; compact mode hides numbers and shows prev/next only.
 */

export interface PaginationProps {
  current: number;       // 1-indexed
  total: number;         // total pages
  onPageChange?: (page: number) => void;
  /** Hide page numbers, show only prev/next buttons. */
  compact?: boolean;
  className?: string;
}

function buildPages(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | "ellipsis")[] = [1];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);
  if (left > 2) pages.push("ellipsis");
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push("ellipsis");
  pages.push(total);
  return pages;
}

export function Pagination({
  current,
  total,
  onPageChange,
  compact = false,
  className,
}: PaginationProps) {
  const prevDisabled = current <= 1;
  const nextDisabled = current >= total;

  const goto = (page: number) => {
    if (page < 1 || page > total || page === current) return;
    onPageChange?.(page);
  };

  if (compact) {
    return (
      <div className={cn("inline-flex items-center gap-3", className)}>
        <button
          type="button"
          disabled={prevDisabled}
          onClick={() => goto(current - 1)}
          className={cn(
            "inline-flex items-center h-8 px-3 gap-1.5 rounded-md font-sans font-medium text-[13px] text-ink hover:bg-soft transition-colors",
            prevDisabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <Glyph name="arrow-left" size={14} strokeWidth={2.5} />
          <span>Previous</span>
        </button>
        <button
          type="button"
          disabled={nextDisabled}
          onClick={() => goto(current + 1)}
          className={cn(
            "inline-flex items-center h-8 px-3 gap-1.5 rounded-md font-sans font-medium text-[13px] text-ink hover:bg-soft transition-colors",
            nextDisabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <span>Next</span>
          <Glyph name="arrow-right" size={14} strokeWidth={2.5} />
        </button>
      </div>
    );
  }

  const pages = buildPages(current, total);

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <button
        type="button"
        aria-label="Previous page"
        disabled={prevDisabled}
        onClick={() => goto(current - 1)}
        className={cn(
          "inline-flex items-center justify-center size-8 rounded-md bg-paper border border-hairline-strong text-ink hover:bg-soft transition-colors",
          prevDisabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <Glyph name="chev-left" size={14} strokeWidth={2.5} />
      </button>
      {pages.map((page, idx) =>
        page === "ellipsis" ? (
          <span
            key={`ell-${idx}`}
            className="inline-flex items-center justify-center size-8 font-mono text-[13px] tracking-widest text-faint"
          >
            ···
          </span>
        ) : (
          <button
            key={page}
            type="button"
            aria-current={page === current ? "page" : undefined}
            onClick={() => goto(page)}
            className={cn(
              "inline-flex items-center justify-center size-8 rounded-md font-mono text-[13px] transition-colors",
              page === current
                ? "bg-coral text-white font-bold"
                : "bg-paper border border-hairline-strong text-ink hover:bg-soft"
            )}
          >
            {page}
          </button>
        )
      )}
      <button
        type="button"
        aria-label="Next page"
        disabled={nextDisabled}
        onClick={() => goto(current + 1)}
        className={cn(
          "inline-flex items-center justify-center size-8 rounded-md bg-paper border border-hairline-strong text-ink hover:bg-soft transition-colors",
          nextDisabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <Glyph name="chev-right" size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
}
