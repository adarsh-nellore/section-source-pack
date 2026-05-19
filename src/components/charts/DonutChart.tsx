import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Donut/ring chart. Source: Paper sheet · DonutChart (node 8H8-0).
 * Single-value progress or multi-segment composition. Center label carries
 * the headline number, optional caption below. Uses the pathLength=100 trick
 * so stroke-dasharray math is percentage-based.
 */

export type DonutTone = "coral" | "muted" | "green" | "info" | "gold";

export interface DonutSegment {
  id: string;
  label: string;
  value: number;
  tone?: DonutTone;
}

export interface DonutChartProps {
  segments: DonutSegment[];
  /** Center label (e.g. "73%" or "n=847"). */
  centerLabel?: ReactNode;
  /** Caption below the center label (e.g. "compliant"). */
  centerCaption?: ReactNode;
  /** Show a legend column to the right. Default true. */
  showLegend?: boolean;
  /** SVG width/height. Default 240. */
  size?: number;
  /** Stroke width of the ring. Default 24. */
  strokeWidth?: number;
  className?: string;
}

const TONE_STROKE: Record<DonutTone, string> = {
  coral: "var(--color-coral)",
  muted: "var(--color-faint)",
  green: "var(--color-green)",
  info:  "var(--color-info)",
  gold:  "var(--color-gold)",
};

const DEFAULT_TONE_ORDER: DonutTone[] = ["coral", "green", "gold", "info", "muted"];

export function DonutChart({
  segments,
  centerLabel,
  centerCaption,
  showLegend = true,
  size = 240,
  strokeWidth = 24,
  className,
}: DonutChartProps) {
  const total = segments.reduce((sum, s) => sum + Math.max(0, s.value), 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - strokeWidth) / 2;

  // Build cumulative offsets in percent terms (pathLength=100).
  let cumulative = 0;
  const arcs = segments.map((s, i) => {
    const pct = (Math.max(0, s.value) / total) * 100;
    const tone = s.tone ?? DEFAULT_TONE_ORDER[i % DEFAULT_TONE_ORDER.length];
    const arc = {
      id: s.id,
      label: s.label,
      pct,
      offset: -cumulative,
      stroke: TONE_STROKE[tone],
    };
    cumulative += pct;
    return arc;
  });

  return (
    <div
      className={cn(
        "inline-flex items-center gap-8",
        className,
      )}
    >
      <div
        className="relative shrink-0"
        style={{ width: size, height: size }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          xmlns="http://www.w3.org/2000/svg"
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
          }}
          className="block"
        >
          {/* Background ring */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="var(--color-hairline)"
            strokeWidth={strokeWidth}
          />
          {/* Segment arcs (pathLength=100 → dasharray/offset in percent) */}
          {arcs.map((a) => (
            <circle
              key={`arc-${a.id}`}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={a.stroke}
              strokeWidth={strokeWidth}
              pathLength={100}
              strokeDasharray={`${a.pct} ${100 - a.pct}`}
              strokeDashoffset={a.offset}
            />
          ))}
        </svg>
        {(centerLabel || centerCaption) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 pointer-events-none">
            {centerLabel && (
              <div className="font-sans font-semibold text-ink text-[32px] leading-9">
                {centerLabel}
              </div>
            )}
            {centerCaption && (
              <div className="font-mono font-bold uppercase text-faint text-[11px] leading-[14px] tracking-[0.06em]">
                {centerCaption}
              </div>
            )}
          </div>
        )}
      </div>

      {showLegend && segments.length > 0 && (
        <div className="flex flex-col gap-3.5">
          {segments.map((s, i) => {
            const tone = s.tone ?? DEFAULT_TONE_ORDER[i % DEFAULT_TONE_ORDER.length];
            const pct = Math.round((Math.max(0, s.value) / total) * 100);
            return (
              <div key={`leg-${s.id}`} className="flex items-center gap-2.5 min-w-[160px]">
                <span
                  className="rounded-full shrink-0 size-2"
                  style={{ background: TONE_STROKE[tone] }}
                />
                <span className="font-sans text-[13px] leading-4 text-ink">
                  {s.label}
                </span>
                <span className="ml-auto pl-5 font-mono text-[11px] leading-[14px] text-faint">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
