import { cn } from "@/lib/cn";

/**
 * Grouped bar chart. Source: Paper sheet · BarChart (node 8H7-0).
 * Supports 1 or 2 series in vertical (default) or horizontal orientation,
 * with rounded-top bars and hairline grid lines.
 */

export type BarOrientation = "vertical" | "horizontal";
export type BarTone = "coral" | "muted" | "green" | "info" | "gold";

export interface BarSeries {
  id: string;
  label: string;
  values: number[];
  tone?: BarTone;
}

export interface BarChartProps {
  series: BarSeries[];
  categories: string[];
  orientation?: BarOrientation;
  yMax?: number;
  showLegend?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

const TONE_FILL: Record<BarTone, string> = {
  coral: "var(--color-coral)",
  muted: "var(--color-hairline-strong)",
  green: "var(--color-green)",
  info:  "var(--color-info)",
  gold:  "var(--color-gold)",
};

const MARGIN = { top: 16, right: 16, bottom: 32, left: 40 };
const GRID_LINES = 5;
const RADIUS = 2;

function niceTick(v: number): string {
  if (Math.abs(v) >= 1000) return v.toFixed(0);
  if (Number.isInteger(v)) return v.toString();
  return v.toFixed(1);
}

export function BarChart({
  series,
  categories,
  orientation = "vertical",
  yMax,
  showLegend = true,
  width = 600,
  height = 320,
  className,
}: BarChartProps) {
  const innerW = Math.max(0, width - MARGIN.left - MARGIN.right);
  const innerH = Math.max(0, height - MARGIN.top - MARGIN.bottom);
  const seriesCount = Math.max(1, Math.min(series.length, 2));

  const allValues = series.flatMap((s) => s.values);
  const dataMax = allValues.length ? Math.max(...allValues) : 1;
  const domainMax = yMax ?? dataMax;
  const domainSafe = domainMax === 0 ? 1 : domainMax;

  const ticks = Array.from({ length: GRID_LINES }, (_, i) => {
    const t = i / (GRID_LINES - 1);
    return {
      ratio: t,
      value: domainSafe - t * domainSafe,
    };
  });

  if (orientation === "vertical") {
    const groupWidth = categories.length > 0 ? innerW / categories.length : innerW;
    const innerGap = 4;
    const barW = Math.max(
      4,
      (groupWidth * 0.7 - innerGap * (seriesCount - 1)) / seriesCount,
    );

    return (
      <div className={cn("inline-flex flex-col gap-3", className)}>
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          xmlns="http://www.w3.org/2000/svg"
          className="block"
        >
          {/* Grid */}
          <g stroke="var(--color-hairline)" strokeWidth={0.5}>
            {ticks.map((t, i) => (
              <line
                key={`g-${i}`}
                x1={MARGIN.left}
                x2={width - MARGIN.right}
                y1={MARGIN.top + t.ratio * innerH}
                y2={MARGIN.top + t.ratio * innerH}
              />
            ))}
          </g>
          {/* Y-axis labels */}
          <g
            fontFamily="var(--font-mono)"
            fontSize="11"
            fill="var(--color-muted)"
          >
            {ticks.map((t, i) => (
              <text
                key={`yl-${i}`}
                x={MARGIN.left - 8}
                y={MARGIN.top + t.ratio * innerH + 3}
                textAnchor="end"
              >
                {niceTick(t.value)}
              </text>
            ))}
          </g>

          {/* Bars */}
          <g>
            {categories.map((_, catIdx) => {
              const groupX = MARGIN.left + catIdx * groupWidth;
              const groupCenter = groupX + groupWidth / 2;
              const totalGroupW = barW * seriesCount + innerGap * (seriesCount - 1);
              const startX = groupCenter - totalGroupW / 2;
              return series.slice(0, seriesCount).map((s, sIdx) => {
                const v = s.values[catIdx] ?? 0;
                const h = (v / domainSafe) * innerH;
                const x = startX + sIdx * (barW + innerGap);
                const y = MARGIN.top + innerH - h;
                return (
                  <rect
                    key={`bar-${s.id}-${catIdx}`}
                    x={x}
                    y={y}
                    width={barW}
                    height={Math.max(0, h)}
                    rx={RADIUS}
                    ry={RADIUS}
                    fill={TONE_FILL[s.tone ?? (sIdx === 0 ? "coral" : "muted")]}
                  />
                );
              });
            })}
          </g>

          {/* X-axis category labels */}
          <g
            fontFamily="var(--font-sans)"
            fontSize="11"
            fill="var(--color-faint)"
          >
            {categories.map((cat, catIdx) => {
              const groupX = MARGIN.left + catIdx * groupWidth;
              const groupCenter = groupX + groupWidth / 2;
              return (
                <text
                  key={`xl-${catIdx}`}
                  x={groupCenter}
                  y={height - MARGIN.bottom + 18}
                  textAnchor="middle"
                >
                  {cat}
                </text>
              );
            })}
          </g>
        </svg>

        {showLegend && series.length > 0 && (
          <div className="flex flex-wrap gap-6 pl-10">
            {series.slice(0, seriesCount).map((s, sIdx) => {
              const fill = TONE_FILL[s.tone ?? (sIdx === 0 ? "coral" : "muted")];
              return (
                <div key={`legend-${s.id}`} className="flex items-center gap-2">
                  <span
                    className="rounded-xs shrink-0 size-2.5"
                    style={{ background: fill }}
                  />
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

  // Horizontal orientation: categories on y-axis, bars extend rightward.
  const rowHeight = categories.length > 0 ? innerH / categories.length : innerH;
  const innerGap = 4;
  const barH = Math.max(
    4,
    (rowHeight * 0.7 - innerGap * (seriesCount - 1)) / seriesCount,
  );

  // Reserve label space at the left side of the plot area.
  const labelGutter = 100;

  return (
    <div className={cn("inline-flex flex-col gap-3", className)}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        className="block"
      >
        {/* Vertical grid lines for value reference */}
        <g stroke="var(--color-hairline)" strokeWidth={0.5}>
          {ticks.map((t, i) => {
            const x = MARGIN.left + labelGutter + (1 - t.ratio) * (innerW - labelGutter);
            return (
              <line
                key={`g-${i}`}
                x1={x}
                x2={x}
                y1={MARGIN.top}
                y2={MARGIN.top + innerH}
              />
            );
          })}
        </g>

        {/* Category labels (left) */}
        <g
          fontFamily="var(--font-sans)"
          fontSize="12"
          fill="var(--color-muted)"
        >
          {categories.map((cat, catIdx) => {
            const rowY = MARGIN.top + catIdx * rowHeight + rowHeight / 2;
            return (
              <text
                key={`cat-${catIdx}`}
                x={MARGIN.left + labelGutter - 12}
                y={rowY + 4}
                textAnchor="end"
              >
                {cat}
              </text>
            );
          })}
        </g>

        {/* Bars */}
        <g>
          {categories.map((_, catIdx) => {
            const rowY = MARGIN.top + catIdx * rowHeight;
            const rowCenter = rowY + rowHeight / 2;
            const totalGroupH = barH * seriesCount + innerGap * (seriesCount - 1);
            const startY = rowCenter - totalGroupH / 2;
            return series.slice(0, seriesCount).map((s, sIdx) => {
              const v = s.values[catIdx] ?? 0;
              const w = (v / domainSafe) * (innerW - labelGutter);
              const x = MARGIN.left + labelGutter;
              const y = startY + sIdx * (barH + innerGap);
              return (
                <rect
                  key={`bar-${s.id}-${catIdx}`}
                  x={x}
                  y={y}
                  width={Math.max(0, w)}
                  height={barH}
                  rx={RADIUS}
                  ry={RADIUS}
                  fill={TONE_FILL[s.tone ?? (sIdx === 0 ? "coral" : "muted")]}
                />
              );
            });
          })}
        </g>

        {/* Bottom value scale labels */}
        <g
          fontFamily="var(--font-mono)"
          fontSize="11"
          fill="var(--color-faint)"
        >
          {ticks.map((t, i) => {
            const x = MARGIN.left + labelGutter + (1 - t.ratio) * (innerW - labelGutter);
            return (
              <text
                key={`xl-${i}`}
                x={x}
                y={height - MARGIN.bottom + 18}
                textAnchor="middle"
              >
                {niceTick(t.value)}
              </text>
            );
          })}
        </g>
      </svg>

      {showLegend && series.length > 0 && (
        <div className="flex flex-wrap gap-6 pl-10">
          {series.slice(0, seriesCount).map((s, sIdx) => {
            const fill = TONE_FILL[s.tone ?? (sIdx === 0 ? "coral" : "muted")];
            return (
              <div key={`legend-${s.id}`} className="flex items-center gap-2">
                <span
                  className="rounded-xs shrink-0 size-2.5"
                  style={{ background: fill }}
                />
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
