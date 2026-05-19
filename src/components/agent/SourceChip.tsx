import type { ReactNode, MouseEventHandler } from "react";
import { cn } from "@/lib/cn";
import { Badge, type BadgeTone } from "@/components/ui/Badge";

/**
 * Reference indicator. Source: Paper sheet · SourceChip (node 6WW-0).
 * KindBadge + filename + optional section pointer. Variants:
 * - inline (default): bare layout, sits in flow
 * - bordered: paper-bg pill (clickable chip)
 * - preview: bordered + extra body row
 */

export type SourceKind = "md" | "csv" | "pdf" | "generic";
export type SourceChipVariant = "inline" | "bordered" | "preview";

export interface SourceChipProps {
  kind?: SourceKind;
  file: ReactNode;
  pointer?: ReactNode;
  preview?: ReactNode;
  variant?: SourceChipVariant;
  onClick?: MouseEventHandler<HTMLDivElement>;
  className?: string;
}

const KIND_TONE: Record<SourceKind, BadgeTone> = {
  md:      "neutral",
  csv:     "success",
  pdf:     "danger",
  generic: "neutral",
};

export function SourceChip({
  kind = "md",
  file,
  pointer,
  preview,
  variant = "inline",
  onClick,
  className,
}: SourceChipProps) {
  const isContainerVariant = variant !== "inline";

  return (
    <div
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2.5",
        isContainerVariant &&
          "self-start px-3 py-1.5 bg-paper border border-hairline-strong rounded-lg",
        variant === "preview" && "!items-start py-2.5 flex-col gap-1 bg-stripe",
        onClick && "cursor-pointer",
        className
      )}
    >
      <div className="inline-flex items-center gap-2.5">
        <Badge tone={KIND_TONE[kind]}>{kind}</Badge>
        <span className="font-mono text-[13px] leading-4 text-ink">{file}</span>
        {pointer && (
          <span className="font-mono text-[13px] leading-4 text-faint">{pointer}</span>
        )}
      </div>
      {variant === "preview" && preview && (
        <div className="font-sans text-[13px] leading-[18px] text-muted">{preview}</div>
      )}
    </div>
  );
}
