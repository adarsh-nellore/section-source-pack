import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Glyph } from "@/components/ui/Glyph";

/**
 * KPI tile. Source: Paper sheet · Stat (node 6KR-0).
 * Label (MetaLabel-style) + value (Inter semibold) + delta + optional Sparkline.
 */

export type StatTone = "neutral" | "success" | "danger";

export interface StatDelta {
  value: string;
  tone?: StatTone;
  direction?: "up" | "down";
}

export interface StatProps {
  label: ReactNode;
  value: ReactNode;
  unit?: ReactNode;
  delta?: StatDelta;
  sparkline?: ReactNode;
  variant?: "card" | "soft" | "bare";
  className?: string;
}

const VARIANT: Record<NonNullable<StatProps["variant"]>, string> = {
  card: "bg-paper border border-hairline-strong rounded-card p-4",
  soft: "bg-stripe rounded-input p-3.5",
  bare: "",
};

const DELTA_COLOR: Record<StatTone, string> = {
  success: "text-green",
  danger:  "text-coral",
  neutral: "text-faint",
};

export function Stat({
  label,
  value,
  unit,
  delta,
  sparkline,
  variant = "card",
  className,
}: StatProps) {
  const deltaTone = delta?.tone ?? "neutral";
  return (
    <div className={cn("flex flex-col gap-2.5", VARIANT[variant], className)}>
      <div className="font-mono font-bold uppercase tracking-label text-[11px] leading-[14px] text-faint">
        {label}
      </div>
      <div className="flex items-baseline gap-2">
        <div className="font-sans font-semibold text-[28px] leading-[32px] text-ink">
          {value}
          {unit && (
            <span className="font-medium text-[18px] text-muted ml-0.5">{unit}</span>
          )}
        </div>
        {delta && (
          <div
            className={cn(
              "inline-flex items-center gap-0.5 font-mono text-[11px] leading-[14px]",
              DELTA_COLOR[deltaTone]
            )}
          >
            <Glyph
              name={delta.direction === "down" ? "chev" : "chev-up"}
              size={10}
              strokeWidth={2.5}
            />
            {delta.value}
          </div>
        )}
      </div>
      {sparkline && <div className="-mx-1">{sparkline}</div>}
    </div>
  );
}
