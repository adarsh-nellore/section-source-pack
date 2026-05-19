import { cn } from "@/lib/cn";
import { monotoneCubicPath, type Point } from "@/lib/chart-utils";

/**
 * Multi-series line chart. Source: Paper sheet · LineChart (node 8H6-0).
 * Smooth monotone-cubic curves with axis labels, hairline grid, optional
 * point markers on the first series, and an optional below-chart legend.
 */

export type LineTone = "coral" | "muted" | "green" | "info" | "gold";

export interface LineSeries {
  id: string;
  label: string;
  values: number[];
  tone?: LineTone;
}

export interface LineChartProps {
  series: LineSeries[];
  /** X-axis labels. Length should match series[i].values.length. */
  xLabels?: string[];
  /** Y-axis min/max; if omitted, derived from data. */
  yMin?: number;
  yMax?: number;
  /** Number of horizontal grid lines (default 5). */
  gridLines?: number;
  /** Show legend below chart. Default true. */
  showLegend?: boolean;
  /** Show data point dots on series[0] only. Default true. */
  showDots?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

const TONE_STROKE: Record<LineTone, string> = {
  coral: "var(--color-coral)",
  muted: "var(--color-faint)",
  green: "var(--color-green)",
  info:  "var(--color-info)",
  gold:  "var(--color-gold)",
};

const MARGIN = { top: 16, right: 16, bottom: 32, left: 40 };

function niceTick(value: number): string {
  if (Math.abs(value) >= 1000) return value.toFixed(0);
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(1);
}

export function LineChart({
  series,
  xLabels,
  yMin,
  yMax,
  gridLines = 5,
  showLegend = true,
  showDots = true,
  width = 600,
  height = 320,
  className,
}: LineChartProps) {
  const innerW = Math.max(0, width - MARGIN.left - MARGIN.right);
  const innerH = Math.max(0, height - MARGIN.top - MARGIN.bottom);

  // Derive domain from all values if not provided.
  const allValues = series.flatMap((s) => s.values);
  const dataMin = allValues.length ? Math.min(...allValues) : 0;
  const dataMax = allValues.length ? Math.max(...allValues) : 1;
  const domainMin = yMin ?? dataMin;
  const domainMax = yMax ?? dataMax;
  const range = domainMax - domainMin || 1;

  const maxLen = series.reduce((m, s) => Math.max(m, s.values.length), 0);

  function xFor(i: number, n: number): number {
    if (n <= 1) return MARGIN.left + innerW / 2;
    return MARGIN.left + (i / (n - 1)) * innerW;
  }

  function yFor(v: number): number {
    return MARGIN.top + innerH - ((v - domainMin) / range) * innerH;
  }

  // Grid line y-positions + labels (top to bottom).
  const ticks = Array.from({ length: gridLines }, (_, i) => {
    const t = i / (gridLines - 1);
    const value = domainMax - t * range;
    const y = MARGIN.top + t * innerH;
    return { y, value };
  });

  // X-tick positions distributed along the longest series.
  const xTicks =
    xLabels && xLabels.length
      ? xLabels.map((label, i) => ({
          label,
          x: xFor(i, xLabels.length),
        }))
      : [];

  return (
    <div className={cn("inline-flex flex-col gap-3", className)}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        className="block"
      >
        {/* Grid lines + y-axis labels */}
        <g>
          {ticks.map((t, i) => (
            <line
              key={`grid-${i}`}
              x1={MARGIN.left}
              x2={width - MARGIN.right}
              y1={t.y}
              y2={t.y}
              stroke="var(--color-hairline)"
              strokeWidth={0.5}
            />
          ))}
        </g>
        <g
          fontFamily="var(--font-mono)"
          fontSize="11"
          fill="var(--color-muted)"
        >
          {ticks.map((t, i) => (
            <text
              key={`yl-${i}`}
              x={MARGIN.left - 8}
              y={t.y + 3}
              textAnchor="end"
            >
              {niceTick(t.value)}
            </text>
          ))}
        </g>

        {/* X-axis labels */}
        <g
          fontFamily="var(--font-mono)"
          fontSize="11"
          fill="var(--color-faint)"
        >
          {xTicks.map((t, i) => (
            <text
              key={`xl-${i}`}
              x={t.x}
              y={height - MARGIN.bottom + 18}
              textAnchor="middle"
            >
              {t.label}
            </text>
          ))}
        </g>

        {/* Series paths */}
        {series.map((s) => {
          if (s.values.length < 2) return null;
          const pts: Point[] = s.values.map((v, i) => ({
            x: xFor(i, s.values.length),
            y: yFor(v),
          }));
          const d = monotoneCubicPath(pts);
          const stroke = TONE_STROKE[s.tone ?? "coral"];
          return (
            <path
              key={`path-${s.id}`}
              d={d}
              fill="none"
              stroke={stroke}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        })}

        {/* Dots on first series only */}
        {showDots && series[0] && series[0].values.length >= 1 && (
          <g fill={TONE_STROKE[series[0].tone ?? "coral"]}>
            {series[0].values.map((v, i) => (
              <circle
                key={`dot-${i}`}
                cx={xFor(i, series[0].values.length)}
                cy={yFor(v)}
                r={3.5}
              />
            ))}
          </g>
        )}
      </svg>

      {showLegend && series.length > 0 && (
        <div className="flex flex-wrap gap-6 pl-10">
          {series.map((s) => {
            const stroke = TONE_STROKE[s.tone ?? "coral"];
            return (
              <div key={`legend-${s.id}`} className="flex items-center gap-2">
                <svg
                  width="16"
                  height="2"
                  viewBox="0 0 16 2"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                >
                  <line
                    x1="0"
                    y1="1"
                    x2="16"
                    y2="1"
                    stroke={stroke}
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="font-sans text-[13px] leading-4 text-ink">
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
