import { cn } from "@/lib/cn";
import { monotoneCubicPath, type Point } from "@/lib/chart-utils";

/**
 * Inline trend chart. Source: Paper sheet · Sparkline (node 6KQ-0).
 * Monotone cubic curve. Optional gradient area fill underneath.
 * Color tokens accepted via the `tone` prop.
 */

export type SparklineTone = "success" | "danger" | "info" | "neutral";

export interface SparklineProps {
  values: number[];
  width?: number;
  height?: number;
  tone?: SparklineTone;
  area?: boolean;
  dashed?: boolean;
  className?: string;
}

const STROKE: Record<SparklineTone, string> = {
  success: "var(--color-green)",
  danger:  "var(--color-coral)",
  info:    "var(--color-info)",
  neutral: "var(--color-faint)",
};

export function Sparkline({
  values,
  width = 120,
  height = 36,
  tone = "success",
  area = false,
  dashed = false,
  className,
}: SparklineProps) {
  if (values.length < 2) {
    return (
      <svg width={width} height={height} className={className}>
        <line
          x1={4}
          x2={width - 4}
          y1={height / 2}
          y2={height / 2}
          stroke={STROKE[tone]}
          strokeWidth={1.5}
          strokeDasharray="3 3"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pad = 4;
  const innerW = width;
  const innerH = height - pad * 2;
  const points: Point[] = values.map((v, i) => ({
    x: (i / (values.length - 1)) * innerW,
    y: pad + innerH - ((v - min) / range) * innerH,
  }));

  const d = monotoneCubicPath(points);
  const areaPath =
    `${d} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;
  const gradId = `spark-${tone}-${values.length}-${width}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={cn("block", className)}
    >
      {area && (
        <>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={STROKE[tone]} stopOpacity="0.35" />
              <stop offset="100%" stopColor={STROKE[tone]} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill={`url(#${gradId})`} stroke="none" />
        </>
      )}
      <path
        d={d}
        fill="none"
        stroke={STROKE[tone]}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dashed ? "3 3" : undefined}
      />
    </svg>
  );
}
