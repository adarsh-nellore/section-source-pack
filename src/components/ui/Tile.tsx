import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Featured square card. Source: Paper sheet · Tile (node 60M-0).
 * Hero glyph + label + value + optional body. Companion to Card for grids
 * (dashboards, app launchers, KPI rows). Net-new — extrapolates Card visual
 * into a denser tileable form.
 *
 * Alignment: top-anchored. Hero, label, and value sit at the same vertical
 * position across instances rendered in a row; variable-length bodies extend
 * downward. See docs/SPACING.md ("Top-anchor variable content").
 */

export type TileVariant = "default" | "accent" | "muted";
export type TileSize = "sm" | "md" | "lg";

export interface TileProps {
  hero?: ReactNode;
  label?: ReactNode;
  value?: ReactNode;
  body?: ReactNode;
  trailing?: ReactNode;
  variant?: TileVariant;
  size?: TileSize;
  className?: string;
  onClick?: () => void;
}

const VARIANT: Record<TileVariant, string> = {
  default: "bg-paper border border-hairline-strong",
  accent:  "bg-coral-soft border border-coral",
  muted:   "bg-soft border border-hairline-strong",
};

const SIZE: Record<TileSize, string> = {
  sm: "w-30 h-30 p-3 gap-1.5",
  md: "w-40 h-40 p-4 gap-2.5",
  lg: "w-50 h-50 p-4.5 gap-3",
};

const HERO_SIZE: Record<TileSize, string> = {
  sm: "size-6 rounded-md",
  md: "size-8 rounded-md",
  lg: "size-10 rounded-lg",
};

const VALUE_SIZE: Record<TileSize, string> = {
  sm: "text-[18px] leading-[22px]",
  md: "text-[22px] leading-[26px]",
  lg: "text-[28px] leading-[32px]",
};

export function Tile({
  hero,
  label,
  value,
  body,
  trailing,
  variant = "default",
  size = "md",
  className,
  onClick,
}: TileProps) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={cn(
        "flex flex-col rounded-card text-left",
        VARIANT[variant],
        SIZE[size],
        onClick && "transition-colors hover:bg-soft cursor-pointer",
        className
      )}
    >
      {(hero || trailing) && (
        <div className="flex items-center justify-between">
          {hero && (
            <div
              className={cn(
                "flex items-center justify-center bg-paper",
                HERO_SIZE[size]
              )}
            >
              {hero}
            </div>
          )}
          {trailing && <div className="ml-auto">{trailing}</div>}
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        {label && (
          <div className="font-mono font-bold uppercase tracking-label text-[11px] leading-[14px] text-faint">
            {label}
          </div>
        )}
        {value && (
          <div className={cn("font-sans font-semibold text-ink", VALUE_SIZE[size])}>
            {value}
          </div>
        )}
        {body && (
          <div className="text-[13px] leading-[18px] text-muted">{body}</div>
        )}
      </div>
    </Tag>
  );
}
