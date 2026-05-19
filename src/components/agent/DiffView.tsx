import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Before/after AI edit. Source: Paper sheet · DiffView (node 75T-0).
 * Two layouts: inline (token-level highlights) and side-by-side (block-level columns).
 */

export interface DiffViewSideBySideProps {
  before: ReactNode;
  after: ReactNode;
  label?: ReactNode;
  className?: string;
}

/** Block-level before/after columns. */
export function DiffViewSideBySide({
  before,
  after,
  label,
  className,
}: DiffViewSideBySideProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <div className="font-mono font-bold uppercase tracking-label text-[11px] leading-[14px] text-faint">
          {label}
        </div>
      )}
      <div className="flex gap-3">
        <div className="flex-1 flex flex-col gap-2 py-3 px-4 bg-coral-soft border border-coral rounded-input">
          <div className="inline-flex items-center gap-1.5 self-start">
            <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-xs bg-coral font-mono font-bold text-[10px] text-white">−</span>
            <span className="font-mono font-bold uppercase tracking-label text-[10px] text-coral">before</span>
          </div>
          <div className="font-sans text-[13.5px] leading-[20px] text-ink line-through decoration-coral/50">
            {before}
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2 py-3 px-4 bg-green-soft border border-green rounded-input">
          <div className="inline-flex items-center gap-1.5 self-start">
            <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-xs bg-green font-mono font-bold text-[10px] text-white">+</span>
            <span className="font-mono font-bold uppercase tracking-label text-[10px] text-green">after</span>
          </div>
          <div className="font-sans text-[13.5px] leading-[20px] text-ink">{after}</div>
        </div>
      </div>
    </div>
  );
}

/** Token-level inline diff helpers. */
export function DiffRemoved({ children }: { children: ReactNode }) {
  return (
    <span className="bg-coral-soft text-coral px-1 rounded-xs line-through decoration-coral">
      {children}
    </span>
  );
}

export function DiffAdded({ children }: { children: ReactNode }) {
  return (
    <span className="bg-green-soft text-green px-1 rounded-xs underline decoration-green">
      {children}
    </span>
  );
}
