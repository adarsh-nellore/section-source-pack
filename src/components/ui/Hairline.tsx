import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Divider primitive.
 * Source: Paper sheet · Hairline (node 5KB-0). Horizontal solid + gradient
 * fade (port of peer-prototype .hairline-fade), vertical solid, and
 * with-label variant for sectioning long lists.
 */

export type HairlineOrientation = "horizontal" | "vertical";
export type HairlineStyle = "solid" | "strong" | "fade";

export interface HairlineProps {
  orientation?: HairlineOrientation;
  style?: HairlineStyle;
  label?: ReactNode;
  className?: string;
}

const HORIZONTAL_STYLE: Record<HairlineStyle, string> = {
  solid:  "bg-hairline",
  strong: "bg-hairline-strong",
  fade:   "", // applied via .hairline-fade utility class
};

export function Hairline({
  orientation = "horizontal",
  style = "solid",
  label,
  className,
}: HairlineProps) {
  if (orientation === "vertical") {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "inline-block w-px self-stretch",
          style === "strong" ? "bg-hairline-strong" : "bg-hairline",
          className
        )}
      />
    );
  }

  if (label) {
    return (
      <div
        className={cn("flex items-center gap-3 w-full", className)}
        role="separator"
      >
        <span className={cn("flex-1 h-px", HORIZONTAL_STYLE[style] || "bg-hairline")} />
        <span className="font-mono font-bold uppercase tracking-label text-[11px] leading-[14px] text-faint">
          {label}
        </span>
        <span className={cn("flex-1 h-px", HORIZONTAL_STYLE[style] || "bg-hairline")} />
      </div>
    );
  }

  if (style === "fade") {
    return <div role="separator" className={cn("hairline-fade", className)} />;
  }

  return (
    <div
      role="separator"
      className={cn("h-px w-full", HORIZONTAL_STYLE[style], className)}
    />
  );
}
