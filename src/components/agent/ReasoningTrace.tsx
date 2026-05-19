"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Glyph } from "@/components/ui/Glyph";

/**
 * Collapsible step-by-step reasoning. Source: Paper sheet · ReasoningTrace (node 75S-0).
 * Each step: number badge + label + optional detail line. Final step rendered with a green
 * check instead of a number to mark completion.
 */

export interface ReasoningStep {
  label: ReactNode;
  detail?: ReactNode;
  done?: boolean;
}

export interface ReasoningTraceProps {
  steps: ReasoningStep[];
  defaultOpen?: boolean;
  summary?: ReactNode;
  className?: string;
}

export function ReasoningTrace({
  steps,
  defaultOpen = false,
  summary,
  className,
}: ReasoningTraceProps) {
  const [open, setOpen] = useState(defaultOpen);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex self-start items-center gap-2 py-1.5 px-2.5 bg-paper border border-hairline-strong rounded-lg font-mono text-[11px] text-muted hover:bg-stripe",
          className
        )}
      >
        <Glyph name="check" size={11} strokeWidth={2.5} className="text-green" />
        <span>{summary ?? `${steps.length} reasoning steps`}</span>
        <Glyph name="chev" size={11} strokeWidth={2} className="text-faint" />
      </button>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-2.5 py-3.5 px-4 bg-stripe border border-hairline rounded-input max-w-[480px]",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="font-mono font-bold uppercase tracking-label text-[10px] leading-[14px] text-faint">
          reasoning
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Collapse"
          className="inline-flex items-center justify-center size-5 rounded-sm text-faint hover:text-ink"
        >
          <Glyph name="chev-up" size={11} strokeWidth={2} />
        </button>
      </div>
      <ol className="flex flex-col">
        {steps.map((step, i) => (
          <li
            key={i}
            className={cn(
              "flex gap-2.5 py-2.5",
              i < steps.length - 1 && "border-b border-dashed border-hairline"
            )}
          >
            <span
              className={cn(
                "shrink-0 inline-flex items-center justify-center w-[18px] h-[18px] rounded-full font-mono font-bold text-[10px] text-white",
                step.done ? "bg-green" : "bg-coral"
              )}
            >
              {step.done ? "✓" : i + 1}
            </span>
            <div className="flex-1 flex flex-col gap-0.5">
              <div className="font-sans font-medium text-[13px] leading-[18px] text-ink">
                {step.label}
              </div>
              {step.detail && (
                <div className="font-sans text-[12px] leading-[16px] text-muted">
                  {step.detail}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
