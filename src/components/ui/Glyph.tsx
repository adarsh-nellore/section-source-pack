import type { SVGProps } from "react";

/**
 * Hand-coded icon set. Stroke-based, uses currentColor for stroke.
 * Source: Paper sheet · Glyph (node 5EH-0). 14 glyphs, three sizes.
 */
const STROKE_PATHS = {
  check:       <polyline points="5,12 10,17 19,7" />,
  chev:        <polyline points="6,9 12,15 18,9" />,
  "chev-right":<polyline points="9,6 15,12 9,18" />,
  "chev-left": <polyline points="15,6 9,12 15,18" />,
  "chev-up":   <polyline points="6,15 12,9 18,15" />,
  "arrow-right": (
    <>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="13,6 19,12 13,18" />
    </>
  ),
  "arrow-left": (
    <>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="11,6 5,12 11,18" />
    </>
  ),
  x: (
    <>
      <line x1="6"  y1="6"  x2="18" y2="18" />
      <line x1="18" y1="6"  x2="6"  y2="18" />
    </>
  ),
  plus: (
    <>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5"  y1="12" x2="19" y2="12" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <line x1="16" y1="16" x2="21" y2="21" />
    </>
  ),
  menu: (
    <>
      <line x1="4" y1="7"  x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </>
  ),
  more: (
    <>
      <circle cx="6"  cy="12" r="1.4" />
      <circle cx="12" cy="12" r="1.4" />
      <circle cx="18" cy="12" r="1.4" />
    </>
  ),
} as const;

const FILL_PATHS = {
  sparkle: <path d="M12 2 L13.5 9 L21 10.5 L13.5 12 L12 19 L10.5 12 L3 10.5 L10.5 9 Z" />,
  dot:     <circle cx="12" cy="12" r="6" />,
} as const;

export type GlyphName = keyof typeof STROKE_PATHS | keyof typeof FILL_PATHS;

/** Per-glyph stroke-width defaults; matches Paper's actual usage where it diverges from 2. */
const DEFAULT_STROKE: Partial<Record<GlyphName, number>> = {
  check:         2.5,  // Paper used 2.5 in Reasoned chip, 3 in card accept button
  x:             2.5,  // Paper card cancel button
  plus:          2.5,
  "arrow-right": 2.2,
  "arrow-left":  2.2,
};

export interface GlyphProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: GlyphName;
  size?: number;
  strokeWidth?: number;
}

export function Glyph({
  name,
  size = 16,
  strokeWidth,
  className,
  ...rest
}: GlyphProps) {
  const effectiveStroke = strokeWidth ?? DEFAULT_STROKE[name] ?? 2;
  if (name in FILL_PATHS) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className={className}
        {...rest}
      >
        {FILL_PATHS[name as keyof typeof FILL_PATHS]}
      </svg>
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={effectiveStroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      {STROKE_PATHS[name as keyof typeof STROKE_PATHS]}
    </svg>
  );
}
