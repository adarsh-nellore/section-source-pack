import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Glyph, type GlyphName } from "@/components/ui/Glyph";
import { IconButton } from "@/components/ui/IconButton";

/**
 * Full-bleed status banner.
 * Source: Paper sheet · Banner (node 8EX-0). Four semantic tones (info /
 * success / warning / danger), full-width h-14 bar with leading icon, title,
 * body, optional trailing action, and dismiss IconButton.
 *
 * Tonal palette mirrors Alert.tsx, but Banner is full-width with rounded-lg
 * corners and no left border accent — used at the top of a page or section.
 */

export type BannerTone = "info" | "success" | "warning" | "danger";

export interface BannerProps {
  tone: BannerTone;
  title: ReactNode;
  body?: ReactNode;
  onDismiss?: () => void;
  /** Optional trailing action button (typically <Button variant="secondary" size="sm">). */
  action?: ReactNode;
  className?: string;
}

const BG: Record<BannerTone, string> = {
  info:    "bg-soft",
  success: "bg-green-soft",
  warning: "bg-gold-soft",
  danger:  "bg-coral-soft",
};

const ICON_COLOR: Record<BannerTone, string> = {
  info:    "text-info",
  success: "text-green",
  warning: "text-gold",
  danger:  "text-coral",
};

const ICON_NAME: Record<BannerTone, GlyphName> = {
  info:    "more",
  success: "check",
  warning: "more",
  danger:  "more",
};

export function Banner({
  tone,
  title,
  body,
  onDismiss,
  action,
  className,
}: BannerProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex items-center h-14 px-6 gap-3 rounded-lg w-full",
        BG[tone],
        className
      )}
    >
      <span className={cn("shrink-0 inline-flex", ICON_COLOR[tone])}>
        <Glyph name={ICON_NAME[tone]} size={18} strokeWidth={2.5} />
      </span>
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <div className="font-sans font-semibold text-[14px] leading-[18px] text-ink">
          {title}
        </div>
        {body && (
          <div className="text-[13px] leading-[18px] text-muted truncate">{body}</div>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
      {onDismiss && (
        <IconButton
          variant="ghost"
          size="sm"
          aria-label="Dismiss"
          onClick={onDismiss}
        >
          <Glyph name="x" size={14} strokeWidth={2.5} />
        </IconButton>
      )}
    </div>
  );
}
