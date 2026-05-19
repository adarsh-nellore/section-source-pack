import { cn } from "@/lib/cn";

/**
 * Peer brand mark + wordmark. Source: composition contract — the only way
 * to render the Peer brand. Previously re-typed in every TopNav as raw SVG
 * plus a `text-[17px]` span, which drifted between templates.
 *
 * The mark itself stays inline SVG (it's tiny + theming-neutral), but the
 * wordmark size/weight/color is locked here.
 */

export type PeerBrandSize = "sm" | "md";

export interface PeerBrandProps {
  size?: PeerBrandSize;
  /** Hide the wordmark, show only the rings. */
  markOnly?: boolean;
  className?: string;
}

const SIZE: Record<PeerBrandSize, { svg: number; text: string }> = {
  sm: { svg: 18, text: "text-[15px] leading-[20px]" },
  md: { svg: 22, text: "text-[17px] leading-[22px]" },
};

export function PeerBrand({ size = "md", markOnly = false, className }: PeerBrandProps) {
  const s = SIZE[size];
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        width={s.svg}
        height={s.svg}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        className="text-coral shrink-0"
        aria-hidden={markOnly ? undefined : "true"}
      >
        <circle cx="9"  cy="12" r="4.5" />
        <circle cx="15" cy="12" r="4.5" />
      </svg>
      {!markOnly && (
        <span className={cn("font-sans font-semibold text-coral", s.text)}>Peer</span>
      )}
    </span>
  );
}
