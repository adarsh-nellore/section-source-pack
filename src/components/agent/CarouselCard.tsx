"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Glyph } from "@/components/ui/Glyph";
import { IconButton } from "@/components/ui/IconButton";
import { ThinkingIndicator } from "@/components/agent/ThinkingIndicator";

/**
 * "AI drafted N variants, pick one" pattern.
 * Source: Paper sheet · CarouselCard (node 75U-0). Walkthrough origin:
 * NarrativeDraftPreviewCard (2HH-0).
 * States: preparing · ready (cycle + accept/cancel) · accepted (green pill).
 */

export interface CarouselVariant {
  label: string;
  body: ReactNode;
  footer?: ReactNode;
}

export interface CarouselCardProps {
  variants: CarouselVariant[];
  state?: "preparing" | "ready" | "accepted";
  acceptedIndex?: number;
  preparingLabel?: ReactNode;
  onAccept?: (index: number) => void;
  onReject?: () => void;
  onEdit?: () => void;
  className?: string;
}

export function CarouselCard({
  variants,
  state = "ready",
  acceptedIndex,
  preparingLabel,
  onAccept,
  onReject,
  onEdit,
  className,
}: CarouselCardProps) {
  const [index, setIndex] = useState(0);
  const total = variants.length;
  const current = state === "accepted" ? acceptedIndex ?? 0 : index;
  const variant = variants[current];

  if (state === "preparing") {
    return (
      <div className={cn("flex flex-col w-[360px] bg-paper border border-hairline-strong rounded-card overflow-hidden", className)}>
        <div className="flex items-center gap-2 py-2.5 px-3 border-b border-hairline">
          <ThinkingIndicator size="sm" />
          <span className="font-mono text-[11px] text-muted">
            {preparingLabel ?? `preparing ${total} framings…`}
          </span>
        </div>
        <div className="py-3 px-3 font-sans italic text-[12.5px] leading-[19px] text-faint">
          Peer is drafting…
        </div>
      </div>
    );
  }

  if (state === "accepted") {
    return (
      <div className={cn("flex flex-col w-[360px] bg-paper border border-green rounded-card overflow-hidden", className)}>
        <div className="flex items-center gap-2 py-2.5 px-3 bg-green-soft">
          <Glyph name="check" size={12} strokeWidth={2.5} className="text-green" />
          <span className="flex-1 font-mono font-bold text-[11px] text-green">
            accepted · {variant.label}
          </span>
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="px-2 py-0.5 font-mono text-[11px] text-green hover:underline"
            >
              edit
            </button>
          )}
        </div>
        <div className="py-2.5 px-3 font-sans text-[13px] leading-[19px] text-ink">
          {variant.body}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col w-[360px] bg-paper border border-hairline-strong rounded-card overflow-hidden", className)}>
      <div className="flex items-center justify-between py-2.5 px-3 border-b border-hairline">
        <div className="flex items-center gap-2.5">
          <div className="flex items-stretch bg-paper border border-hairline-strong rounded-md overflow-hidden">
            <button
              type="button"
              disabled={current === 0}
              onClick={() => setIndex(Math.max(0, current - 1))}
              className={cn(
                "py-1 px-2 font-mono text-[13px] leading-4",
                current === 0 ? "text-faintest" : "text-ink hover:bg-stripe"
              )}
            >
              ‹
            </button>
            <span className="w-px self-center h-3 bg-hairline-strong" />
            <button
              type="button"
              disabled={current === total - 1}
              onClick={() => setIndex(Math.min(total - 1, current + 1))}
              className={cn(
                "py-1 px-2 font-mono text-[13px] leading-4",
                current === total - 1 ? "text-faintest" : "text-coral hover:bg-stripe"
              )}
            >
              ›
            </button>
          </div>
          <span className="font-mono text-[11px] text-ink">
            v{current + 1} of {total} · {variant.label}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <IconButton variant="primary" size="sm" aria-label="Accept" onClick={() => onAccept?.(current)}>
            <Glyph name="check" size={10} strokeWidth={3} />
          </IconButton>
          <IconButton variant="secondary" size="sm" aria-label="Reject" onClick={onReject}>
            <Glyph name="x" size={10} strokeWidth={2.5} />
          </IconButton>
        </div>
      </div>
      <div className="py-2.5 px-3 font-sans italic text-[12px] leading-[19px] text-muted">
        {variant.body}
      </div>
      {variant.footer && (
        <div className="py-2.5 px-3 border-t border-hairline font-mono text-[11px] text-faintest">
          {variant.footer}
        </div>
      )}
    </div>
  );
}
