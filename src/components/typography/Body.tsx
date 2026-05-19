import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Closed-enum body paragraph.
 * Source: composition contract (docs/COMPOSITION.md rule 1) — the only way to
 * render a paragraph in this codebase. Renders <p> with max-w-65ch built in
 * for comfortable reading measure. No font-size override via className.
 *
 * Use this instead of `<p className="text-[Npx] …">`.
 */

export type BodySize = "lead" | "body" | "small";
export type BodyTone = "ink" | "muted" | "faint";

export interface BodyProps {
  children: ReactNode;
  size?: BodySize;
  tone?: BodyTone;
  /** Constrain to 65ch reading measure (default true). */
  measured?: boolean;
  /** Structural classes only — no font-size overrides. */
  className?: string;
}

const SIZE: Record<BodySize, string> = {
  lead:  "text-[17px] leading-[28px]",
  body:  "text-[16px] leading-[26px]",
  small: "text-[14px] leading-[22px]",
};

const TONE: Record<BodyTone, string> = {
  ink:   "text-ink",
  muted: "text-muted",
  faint: "text-faint",
};

export function Body({
  children,
  size = "body",
  tone = "ink",
  measured = true,
  className,
}: BodyProps) {
  return (
    <p
      className={cn(
        "font-sans m-0",
        SIZE[size],
        TONE[tone],
        measured && "max-w-[65ch]",
        className
      )}
    >
      {children}
    </p>
  );
}
