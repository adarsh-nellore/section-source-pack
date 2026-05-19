import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Glyph } from "@/components/ui/Glyph";

/**
 * Tool invocation card. Source: Paper sheet · ToolCallCard (node 75R-0).
 * States: running (dots + elapsed) · completed (check + result count) · failed (x + reason).
 */

export type ToolCallState = "running" | "completed" | "failed";

export interface ToolCallCardProps {
  name: string;
  args?: ReactNode;
  state?: ToolCallState;
  elapsed?: string;
  resultSummary?: ReactNode;
  results?: ReactNode[];
  reason?: ReactNode;
  className?: string;
}

export function ToolCallCard({
  name,
  args,
  state = "running",
  elapsed,
  resultSummary,
  results,
  reason,
  className,
}: ToolCallCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 py-2.5 px-3 rounded-lg max-w-[420px]",
        state === "running"   && "bg-stripe border border-hairline-strong",
        state === "completed" && "bg-paper  border border-hairline-strong",
        state === "failed"    && "bg-coral-soft border border-coral",
        className
      )}
    >
      <div className="flex items-center gap-2">
        {state === "running" && (
          <span className="inline-flex gap-0.5">
            <span className="w-1 h-1 rounded-full bg-muted animate-pulse" style={{ animationDelay: "0ms" }} />
            <span className="w-1 h-1 rounded-full bg-muted animate-pulse" style={{ animationDelay: "150ms" }} />
            <span className="w-1 h-1 rounded-full bg-muted animate-pulse" style={{ animationDelay: "300ms" }} />
          </span>
        )}
        {state === "completed" && (
          <Glyph name="check" size={11} strokeWidth={2.5} className="text-green" />
        )}
        {state === "failed" && (
          <Glyph name="x" size={11} strokeWidth={2.5} className="text-coral" />
        )}
        <span className="flex-1 font-mono font-bold text-[11px] tracking-[0.04em] text-ink">
          {name}
        </span>
        {(elapsed || resultSummary) && (
          <span
            className={cn(
              "font-mono text-[11px]",
              state === "completed" ? "text-green" :
              state === "failed"    ? "text-coral" : "text-faint"
            )}
          >
            {resultSummary ?? elapsed}
          </span>
        )}
      </div>
      {args && (
        <div className="font-sans text-[12.5px] leading-[18px] text-muted">{args}</div>
      )}
      {state === "failed" && reason && (
        <div className="font-sans text-[12.5px] leading-[18px] text-coral">{reason}</div>
      )}
      {state === "completed" && results && results.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {results.map((r, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-2 py-1 bg-stripe border border-hairline rounded-xs font-mono text-[10px] text-muted"
            >
              {r}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
