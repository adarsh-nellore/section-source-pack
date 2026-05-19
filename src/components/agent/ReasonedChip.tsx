"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Glyph } from "@/components/ui/Glyph";
import { Hairline } from "@/components/ui/Hairline";

/**
 * Accepted-with-reason badge. Source: Paper sheet · ReasonedChip (node 6WY-0).
 * Walkthrough origin: node 2HB-0. Click to reveal numbered reasoning steps +
 * source list (typically rendered with SourceChip components).
 */

export interface ReasonedChipProps {
  label: ReactNode;
  steps?: ReactNode[];
  sources?: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function ReasonedChip({
  label,
  steps,
  sources,
  defaultOpen = false,
  className,
}: ReasonedChipProps) {
  const [open, setOpen] = useState(defaultOpen);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => steps || sources ? setOpen(true) : undefined}
        className={cn(
          "inline-flex self-start items-center gap-2 py-1.5 px-2.5 bg-paper border border-hairline-strong rounded-lg transition-colors hover:bg-stripe",
          className
        )}
      >
        <Glyph name="check" size={11} strokeWidth={2.5} className="text-green" />
        <span className="font-mono text-[11px] leading-[14px] text-muted">{label}</span>
        {(steps || sources) && (
          <Glyph name="chev" size={11} strokeWidth={2} className="text-faint" />
        )}
      </button>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex self-start flex-col gap-2.5 max-w-[420px] p-3 bg-paper border border-hairline-strong rounded-lg",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="inline-flex items-center gap-2 text-left"
      >
        <Glyph name="check" size={11} strokeWidth={2.5} className="text-green" />
        <span className="flex-1 font-mono text-[11px] leading-[14px] text-muted">{label}</span>
        <Glyph name="chev-up" size={11} strokeWidth={2} className="text-faint" />
      </button>
      {steps && steps.length > 0 && (
        <>
          <Hairline />
          <ol className="flex flex-col gap-1.5">
            {steps.map((step, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-0.5 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-coral-soft font-mono font-bold text-[9px] text-coral shrink-0">
                  {i + 1}
                </span>
                <span className="text-[12.5px] leading-[18px] text-ink">{step}</span>
              </li>
            ))}
          </ol>
        </>
      )}
      {sources && (
        <>
          <Hairline />
          <div className="flex flex-col gap-1">
            <div className="font-mono font-bold uppercase tracking-label text-[10px] leading-[14px] text-faint">
              sources
            </div>
            {sources}
          </div>
        </>
      )}
    </div>
  );
}
