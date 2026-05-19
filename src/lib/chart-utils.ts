export type Point = { x: number; y: number };

/**
 * Monotone cubic interpolation SVG path. Smooth without overshooting,
 * which matters when y values can't go negative (counts, rates, currency).
 */
export function monotoneCubicPath(points: Point[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  const n = points.length;
  const dx = new Array(n - 1);
  const dy = new Array(n - 1);
  const m  = new Array(n);

  for (let i = 0; i < n - 1; i++) {
    dx[i] = points[i + 1].x - points[i].x;
    dy[i] = points[i + 1].y - points[i].y;
  }

  m[0] = dy[0] / dx[0];
  for (let i = 1; i < n - 1; i++) {
    const s1 = dy[i - 1] / dx[i - 1];
    const s2 = dy[i] / dx[i];
    m[i] = s1 * s2 <= 0 ? 0 : (2 * (s1 * s2)) / (s1 + s2);
  }
  m[n - 1] = dy[n - 2] / dx[n - 2];

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < n - 1; i++) {
    const x0 = points[i].x;
    const y0 = points[i].y;
    const x1 = points[i + 1].x;
    const y1 = points[i + 1].y;
    const h  = dx[i];
    const cp1x = x0 + h / 3;
    const cp1y = y0 + (m[i] * h) / 3;
    const cp2x = x1 - h / 3;
    const cp2y = y1 - (m[i + 1] * h) / 3;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x1} ${y1}`;
  }
  return d;
}
