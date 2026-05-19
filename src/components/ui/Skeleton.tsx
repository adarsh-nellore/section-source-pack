import { cn } from "@/lib/cn";

/**
 * Loading placeholder shape. Source: Paper sheet · Skeleton (node 8DW-0).
 * Soft fill + pulse animation; sized to match the eventual content.
 * Variants: text (N stacked lines), rectangle, circle.
 */

export type SkeletonVariant = "text" | "rectangle" | "circle";

export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: number | string;
  height?: number | string;
  /** Render N stacked text lines for variant="text". */
  lines?: number;
  className?: string;
}

function size(v: number | string | undefined): string | undefined {
  if (v === undefined) return undefined;
  return typeof v === "number" ? `${v}px` : v;
}

export function Skeleton({
  variant = "rectangle",
  width,
  height,
  lines = 3,
  className,
}: SkeletonProps) {
  if (variant === "text") {
    const widths = ["80%", "100%", "60%", "90%", "70%"];
    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-2 rounded-xs bg-soft animate-pulse"
            style={{ width: width !== undefined ? size(width) : widths[i % widths.length] }}
          />
        ))}
      </div>
    );
  }

  if (variant === "circle") {
    const dim = size(width) ?? size(height) ?? "32px";
    return (
      <div
        className={cn("rounded-full bg-soft animate-pulse shrink-0", className)}
        style={{ width: dim, height: dim }}
      />
    );
  }

  return (
    <div
      className={cn("rounded-md bg-soft animate-pulse", className)}
      style={{ width: size(width) ?? "100%", height: size(height) ?? "16px" }}
    />
  );
}
