import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Circular identity disc.
 * Source: Paper sheet · Avatar (node 5K7-0). Walkthrough origin: TopNav AN
 * disc (L-0). Default fill bg-ink with white initials; accent/ring variants
 * for selected/branded states.
 */

export type AvatarSize = "sm" | "md" | "lg";
export type AvatarVariant = "ink" | "coral-soft" | "success" | "muted";

export interface AvatarProps {
  initials?: string;
  src?: string;
  alt?: string;
  size?: AvatarSize;
  variant?: AvatarVariant;
  ring?: boolean;
  children?: ReactNode;
  className?: string;
}

const SIZE: Record<AvatarSize, { box: string; text: string }> = {
  sm: { box: "size-6",  text: "text-[10px] leading-[14px]" },
  md: { box: "size-7",  text: "text-[11px] leading-[14px]" },
  lg: { box: "size-9",  text: "text-[13px] leading-[16px]" },
};

const VARIANT: Record<AvatarVariant, string> = {
  ink:           "bg-ink text-white",
  "coral-soft":  "bg-coral-soft text-coral",
  success:       "bg-green text-white",
  muted:         "bg-soft text-muted",
};

export function Avatar({
  initials,
  src,
  alt,
  size = "md",
  variant = "ink",
  ring = false,
  children,
  className,
}: AvatarProps) {
  const dims = SIZE[size];
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden font-mono font-semibold",
        dims.box,
        dims.text,
        !src && VARIANT[variant],
        ring && "ring-2 ring-coral ring-offset-2 ring-offset-paper",
        className
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt ?? ""} className="w-full h-full object-cover" />
      ) : (
        children ?? initials
      )}
    </span>
  );
}
