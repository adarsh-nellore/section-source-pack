import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Glyph } from "@/components/ui/Glyph";

/**
 * Inline or standalone link. Source: Paper sheet · TextLink (node 8DZ-0).
 * Coral tone: text-coral, underline on hover. Muted tone: text-muted → text-ink.
 * Optional trailing arrow for standalone navigation.
 */

export type TextLinkTone = "coral" | "muted";
export type TextLinkSize = "sm" | "md" | "lg";

export interface TextLinkProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  tone?: TextLinkTone;
  size?: TextLinkSize;
  /** Render with a trailing arrow-right glyph. */
  trailingArrow?: boolean;
  /** Open in new tab (adds target=_blank + rel). */
  external?: boolean;
  className?: string;
}

const TONE: Record<TextLinkTone, string> = {
  coral: "text-coral hover:underline",
  muted: "text-muted hover:text-ink",
};

const SIZE: Record<TextLinkSize, string> = {
  sm: "text-[13px] leading-[16px]",
  md: "text-[14px] leading-[20px]",
  lg: "text-[16px] leading-[22px]",
};

const ARROW_PX: Record<TextLinkSize, number> = {
  sm: 12,
  md: 14,
  lg: 16,
};

export function TextLink({
  children,
  href,
  onClick,
  tone = "coral",
  size = "md",
  trailingArrow = false,
  external = false,
  className,
}: TextLinkProps) {
  const classes = cn(
    "inline-flex items-center gap-1.5 font-medium transition-colors",
    TONE[tone],
    SIZE[size],
    className
  );

  const body = (
    <>
      <span>{children}</span>
      {trailingArrow && <Glyph name="arrow-right" size={ARROW_PX[size]} strokeWidth={2.5} />}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {body}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {body}
    </button>
  );
}
